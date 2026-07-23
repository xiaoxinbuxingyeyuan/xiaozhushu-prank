create or replace function public.create_community(
  community_name text,
  community_description text default ''
)
returns table (
  id uuid,
  name text,
  description text,
  avatar_seed text,
  owner_id uuid,
  role public.community_role,
  created_at timestamptz
) language plpgsql security definer set search_path = public as $$
declare
  created_community public.communities;
begin
  if auth.uid() is null then
    raise exception 'Login required';
  end if;

  if char_length(trim(coalesce(community_name, ''))) < 1 then
    raise exception 'Community name is required';
  end if;

  insert into public.communities (name, description, owner_id, avatar_seed)
  values (
    left(trim(community_name), 48),
    left(trim(coalesce(community_description, '')), 180),
    auth.uid(),
    gen_random_uuid()::text
  )
  returning * into created_community;

  insert into public.community_members (community_id, user_id, role)
  values (created_community.id, auth.uid(), 'owner')
  on conflict (community_id, user_id) do update set role = 'owner';

  return query
    select
      created_community.id,
      created_community.name,
      created_community.description,
      created_community.avatar_seed,
      created_community.owner_id,
      'owner'::public.community_role,
      created_community.created_at;
end $$;

revoke execute on function public.create_community(text, text) from public;
revoke execute on function public.create_community(text, text) from anon;
grant execute on function public.create_community(text, text) to authenticated;
