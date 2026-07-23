create extension if not exists pgcrypto;

do $$ begin
  create type public.community_role as enum ('owner', 'member');
exception when duplicate_object then null; end $$;

create table if not exists public.communities (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 48),
  description text not null default '' check (char_length(description) <= 180),
  avatar_seed text not null default gen_random_uuid()::text,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.community_members (
  community_id uuid not null references public.communities(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.community_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (community_id, user_id)
);

create table if not exists public.community_invites (
  id uuid primary key default gen_random_uuid(),
  community_id uuid not null references public.communities(id) on delete cascade,
  token text not null unique default encode(gen_random_bytes(16), 'hex'),
  created_by uuid references public.profiles(id) on delete set null,
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.posts add column if not exists community_id uuid references public.communities(id) on delete cascade;
alter table public.posts alter column title set default '';
alter table public.posts drop constraint if exists posts_title_check;
alter table public.posts add constraint posts_title_length check (char_length(title) <= 80);

create index if not exists communities_owner_idx on public.communities (owner_id, created_at desc);
create index if not exists community_members_user_idx on public.community_members (user_id, created_at desc);
create index if not exists community_invites_token_idx on public.community_invites (token) where enabled;
create index if not exists posts_community_feed_idx on public.posts (community_id, status, created_at desc);

drop trigger if exists communities_touch_updated_at on public.communities;
create trigger communities_touch_updated_at before update on public.communities
for each row execute function public.touch_updated_at();

create or replace function public.is_community_member(target_community uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select target_community is not null and exists (
    select 1 from public.community_members
    where community_id = target_community and user_id = auth.uid()
  );
$$;

create or replace function public.is_community_owner(target_community uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select target_community is not null and exists (
    select 1 from public.community_members
    where community_id = target_community and user_id = auth.uid() and role = 'owner'
  );
$$;

create or replace function public.add_community_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.community_members (community_id, user_id, role)
  values (new.id, new.owner_id, 'owner')
  on conflict (community_id, user_id) do update set role = 'owner';
  return new;
end $$;

drop trigger if exists communities_add_owner on public.communities;
create trigger communities_add_owner after insert on public.communities
for each row execute function public.add_community_owner();

create or replace function public.join_community_by_token(invite_token text)
returns table (
  id uuid,
  name text,
  description text,
  avatar_seed text,
  owner_id uuid,
  role public.community_role,
  created_at timestamptz
) language plpgsql security definer set search_path = public as $$
declare invite_row public.community_invites;
begin
  if auth.uid() is null then
    raise exception 'Login required';
  end if;

  select * into invite_row
  from public.community_invites
  where token = invite_token and enabled = true;

  if not found then
    raise exception 'Invite link is invalid or disabled';
  end if;

  insert into public.community_members (community_id, user_id, role)
  values (invite_row.community_id, auth.uid(), 'member')
  on conflict (community_id, user_id) do nothing;

  return query
    select c.id, c.name, c.description, c.avatar_seed, c.owner_id, m.role, c.created_at
    from public.communities c
    join public.community_members m on m.community_id = c.id and m.user_id = auth.uid()
    where c.id = invite_row.community_id;
end $$;

alter table public.communities enable row level security;
alter table public.community_members enable row level security;
alter table public.community_invites enable row level security;

drop policy if exists communities_read_member on public.communities;
create policy communities_read_member on public.communities for select
using (public.is_admin() or public.is_community_member(id));

drop policy if exists communities_insert_own on public.communities;
create policy communities_insert_own on public.communities for insert
with check (owner_id = auth.uid());

drop policy if exists communities_update_owner on public.communities;
create policy communities_update_owner on public.communities for update
using (public.is_admin() or public.is_community_owner(id))
with check (public.is_admin() or public.is_community_owner(id));

drop policy if exists communities_delete_owner on public.communities;
create policy communities_delete_owner on public.communities for delete
using (public.is_admin() or public.is_community_owner(id));

drop policy if exists members_read_member on public.community_members;
create policy members_read_member on public.community_members for select
using (public.is_admin() or public.is_community_member(community_id));

drop policy if exists members_owner_manage on public.community_members;
create policy members_owner_manage on public.community_members for all
using (public.is_admin() or public.is_community_owner(community_id))
with check (public.is_admin() or public.is_community_owner(community_id));

drop policy if exists invites_read_owner on public.community_invites;
create policy invites_read_owner on public.community_invites for select
using (public.is_admin() or public.is_community_owner(community_id));

drop policy if exists invites_insert_owner on public.community_invites;
create policy invites_insert_owner on public.community_invites for insert
with check (created_by = auth.uid() and (public.is_admin() or public.is_community_owner(community_id)));

drop policy if exists invites_update_owner on public.community_invites;
create policy invites_update_owner on public.community_invites for update
using (public.is_admin() or public.is_community_owner(community_id))
with check (public.is_admin() or public.is_community_owner(community_id));

drop policy if exists invites_delete_owner on public.community_invites;
create policy invites_delete_owner on public.community_invites for delete
using (public.is_admin() or public.is_community_owner(community_id));

drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts for select using (
  public.is_admin()
  or author_id = auth.uid()
  or (status = 'published' and community_id is null)
  or (status = 'published' and public.is_community_member(community_id))
);

drop policy if exists posts_insert_own on public.posts;
create policy posts_insert_own on public.posts for insert with check (
  author_id = auth.uid()
  and status in ('draft', 'published')
  and community_id is not null
  and public.is_community_member(community_id)
);

drop policy if exists posts_update_own on public.posts;
create policy posts_update_own on public.posts for update using (
  author_id = auth.uid() or public.is_admin() or public.is_community_owner(community_id)
) with check (
  author_id = auth.uid() or public.is_admin() or public.is_community_owner(community_id)
);

drop policy if exists posts_delete_own on public.posts;
create policy posts_delete_own on public.posts for delete using (
  author_id = auth.uid() or public.is_admin() or public.is_community_owner(community_id)
);

drop policy if exists media_public_read on public.post_media;
create policy media_public_read on public.post_media for select using (
  exists (
    select 1 from public.posts p
    where p.id = post_id and (
      public.is_admin()
      or p.author_id = auth.uid()
      or (p.status = 'published' and p.community_id is null)
      or (p.status = 'published' and public.is_community_member(p.community_id))
    )
  )
);

drop policy if exists comments_public_read on public.comments;
create policy comments_public_read on public.comments for select using (
  public.is_admin()
  or author_id = auth.uid()
  or exists (
    select 1 from public.posts p
    where p.id = post_id and (
      (p.status = 'published' and p.community_id is null)
      or (p.status = 'published' and public.is_community_member(p.community_id))
    )
  )
);

drop policy if exists comments_insert_own on public.comments;
create policy comments_insert_own on public.comments for insert with check (
  author_id = auth.uid()
  and status = 'published'
  and exists (
    select 1 from public.posts p
    where p.id = post_id
      and p.status = 'published'
      and p.community_id is not null
      and public.is_community_member(p.community_id)
  )
);

drop policy if exists comments_update_own on public.comments;
create policy comments_update_own on public.comments for update using (
  author_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.posts p where p.id = post_id and public.is_community_owner(p.community_id))
) with check (
  author_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.posts p where p.id = post_id and public.is_community_owner(p.community_id))
);

drop policy if exists comments_delete_own on public.comments;
create policy comments_delete_own on public.comments for delete using (
  author_id = auth.uid() or public.is_admin()
  or exists (select 1 from public.posts p where p.id = post_id and public.is_community_owner(p.community_id))
);

drop policy if exists likes_public_read on public.post_likes;
create policy likes_public_read on public.post_likes for select using (
  exists (
    select 1 from public.posts p
    where p.id = post_id and (
      (p.status = 'published' and p.community_id is null)
      or (p.status = 'published' and public.is_community_member(p.community_id))
      or public.is_admin()
    )
  )
);

drop policy if exists likes_insert_own on public.post_likes;
create policy likes_insert_own on public.post_likes for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.posts p
    where p.id = post_id
      and p.status = 'published'
      and p.community_id is not null
      and public.is_community_member(p.community_id)
  )
);

grant select, insert, update, delete on public.communities, public.community_members, public.community_invites to authenticated;
grant execute on function public.join_community_by_token(text) to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.communities;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.community_members;
exception when duplicate_object then null; end $$;
