create extension if not exists pgcrypto;

do $$ begin
  create type public.content_status as enum ('draft', 'published', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.media_kind as enum ('image', 'video');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_target as enum ('post', 'comment');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.report_status as enum ('pending', 'resolved', 'dismissed');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '匿名小猪' check (char_length(display_name) between 1 and 24),
  avatar_seed text not null default gen_random_uuid()::text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  legacy_key text unique,
  author_id uuid references public.profiles(id) on delete set null,
  author_name text not null default '懂猪帝档案员',
  avatar_seed text not null default 'archive-pig',
  title text not null check (char_length(title) between 1 and 80),
  body text not null default '' check (char_length(body) <= 3000),
  tags text[] not null default '{}',
  status public.content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (cardinality(tags) <= 3)
);

create table if not exists public.post_media (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  owner_id uuid references public.profiles(id) on delete set null,
  storage_path text,
  public_url text not null,
  poster_url text,
  media_kind public.media_kind not null,
  mime_type text,
  size_bytes bigint check (size_bytes is null or size_bytes between 1 and 52428800),
  duration_seconds numeric check (duration_seconds is null or duration_seconds between 0 and 60),
  sort_order smallint not null default 0 check (sort_order between 0 and 9),
  created_at timestamptz not null default now(),
  unique (post_id, sort_order),
  check (
    mime_type is null or
    mime_type like 'image/%' or
    mime_type in ('video/mp4', 'video/webm', 'video/quicktime')
  )
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 500),
  status public.content_status not null default 'published' check (status <> 'draft'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  target_type public.report_target not null,
  target_id uuid not null,
  reason text not null check (char_length(reason) between 2 and 300),
  status public.report_status not null default 'pending',
  resolved_by uuid references public.profiles(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists posts_feed_idx on public.posts (status, created_at desc);
create index if not exists posts_tags_idx on public.posts using gin (tags);
create index if not exists media_post_idx on public.post_media (post_id, sort_order);
create index if not exists comments_post_idx on public.comments (post_id, status, created_at);
create index if not exists comments_parent_idx on public.comments (parent_id);
create index if not exists reports_status_idx on public.reports (status, created_at desc);

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists posts_touch_updated_at on public.posts;
create trigger posts_touch_updated_at before update on public.posts
for each row execute function public.touch_updated_at();

drop trigger if exists comments_touch_updated_at on public.comments;
create trigger comments_touch_updated_at before update on public.comments
for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_seed)
  values (new.id, '匿名小猪', coalesce(new.raw_user_meta_data ->> 'avatar_seed', new.id::text))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.validate_comment_depth()
returns trigger language plpgsql as $$
declare parent_row public.comments;
begin
  if new.parent_id is null then return new; end if;
  select * into parent_row from public.comments where id = new.parent_id;
  if not found or parent_row.post_id <> new.post_id or parent_row.parent_id is not null then
    raise exception 'Replies are limited to one level and must belong to the same post';
  end if;
  return new;
end $$;

drop trigger if exists comments_validate_depth on public.comments;
create trigger comments_validate_depth before insert or update on public.comments
for each row execute function public.validate_comment_depth();

create or replace function public.enforce_post_rate_limit()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.posts where author_id = new.author_id and created_at > now() - interval '10 minutes') >= 5 then
    raise exception 'Posting too quickly';
  end if;
  return new;
end $$;

drop trigger if exists posts_rate_limit on public.posts;
create trigger posts_rate_limit before insert on public.posts
for each row when (new.author_id is not null) execute function public.enforce_post_rate_limit();

create or replace function public.enforce_comment_rate_limit()
returns trigger language plpgsql as $$
begin
  if (select count(*) from public.comments where author_id = new.author_id and created_at > now() - interval '10 minutes') >= 30 then
    raise exception 'Commenting too quickly';
  end if;
  return new;
end $$;

drop trigger if exists comments_rate_limit on public.comments;
create trigger comments_rate_limit before insert on public.comments
for each row execute function public.enforce_comment_rate_limit();

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_media enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.reports enable row level security;

drop policy if exists profiles_public_read on public.profiles;
create policy profiles_public_read on public.profiles for select using (true);
drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts for select using (status = 'published' or author_id = auth.uid() or public.is_admin());
drop policy if exists posts_insert_own on public.posts;
create policy posts_insert_own on public.posts for insert with check (author_id = auth.uid() and status in ('draft', 'published'));
drop policy if exists posts_update_own on public.posts;
create policy posts_update_own on public.posts for update using (author_id = auth.uid() or public.is_admin()) with check (author_id = auth.uid() or public.is_admin());
drop policy if exists posts_delete_own on public.posts;
create policy posts_delete_own on public.posts for delete using (author_id = auth.uid() or public.is_admin());

drop policy if exists media_public_read on public.post_media;
create policy media_public_read on public.post_media for select using (exists (select 1 from public.posts p where p.id = post_id and (p.status = 'published' or p.author_id = auth.uid() or public.is_admin())));
drop policy if exists media_insert_own on public.post_media;
create policy media_insert_own on public.post_media for insert with check (owner_id = auth.uid() and exists (select 1 from public.posts p where p.id = post_id and p.author_id = auth.uid()));
drop policy if exists media_change_own on public.post_media;
create policy media_change_own on public.post_media for update using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
drop policy if exists media_delete_own on public.post_media;
create policy media_delete_own on public.post_media for delete using (owner_id = auth.uid() or public.is_admin());

drop policy if exists comments_public_read on public.comments;
create policy comments_public_read on public.comments for select using (status = 'published' or author_id = auth.uid() or public.is_admin());
drop policy if exists comments_insert_own on public.comments;
create policy comments_insert_own on public.comments for insert with check (author_id = auth.uid() and status = 'published' and exists (select 1 from public.posts p where p.id = post_id and p.status = 'published'));
drop policy if exists comments_update_own on public.comments;
create policy comments_update_own on public.comments for update using (author_id = auth.uid() or public.is_admin()) with check (author_id = auth.uid() or public.is_admin());
drop policy if exists comments_delete_own on public.comments;
create policy comments_delete_own on public.comments for delete using (author_id = auth.uid() or public.is_admin());

drop policy if exists likes_public_read on public.post_likes;
create policy likes_public_read on public.post_likes for select using (true);
drop policy if exists likes_insert_own on public.post_likes;
create policy likes_insert_own on public.post_likes for insert with check (user_id = auth.uid());
drop policy if exists likes_delete_own on public.post_likes;
create policy likes_delete_own on public.post_likes for delete using (user_id = auth.uid());

drop policy if exists reports_insert_own on public.reports;
create policy reports_insert_own on public.reports for insert with check (reporter_id = auth.uid());
drop policy if exists reports_read_admin on public.reports;
create policy reports_read_admin on public.reports for select using (public.is_admin());
drop policy if exists reports_update_admin on public.reports;
create policy reports_update_admin on public.reports for update using (public.is_admin()) with check (public.is_admin());

revoke update on public.profiles from authenticated;
grant update (display_name, avatar_seed, updated_at) on public.profiles to authenticated;
grant select on public.profiles, public.posts, public.post_media, public.comments, public.post_likes to anon, authenticated;
grant insert, update, delete on public.posts, public.post_media, public.comments, public.post_likes to authenticated;
grant insert on public.reports to authenticated;
grant select, update on public.reports to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-media', 'post-media', true, 52428800, array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists post_media_public_read on storage.objects;
create policy post_media_public_read on storage.objects for select using (bucket_id = 'post-media');
drop policy if exists post_media_insert_own_folder on storage.objects;
create policy post_media_insert_own_folder on storage.objects for insert to authenticated
with check (bucket_id = 'post-media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists post_media_update_own_folder on storage.objects;
create policy post_media_update_own_folder on storage.objects for update to authenticated
using (bucket_id = 'post-media' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()))
with check (bucket_id = 'post-media' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));
drop policy if exists post_media_delete_own_folder on storage.objects;
create policy post_media_delete_own_folder on storage.objects for delete to authenticated
using (bucket_id = 'post-media' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

do $$ begin
  alter publication supabase_realtime add table public.posts;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.comments;
exception when duplicate_object then null; end $$;
do $$ begin
  alter publication supabase_realtime add table public.post_likes;
exception when duplicate_object then null; end $$;
