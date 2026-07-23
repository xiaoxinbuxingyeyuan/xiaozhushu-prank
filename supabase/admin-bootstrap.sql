-- Run in the Supabase SQL Editor after the administrator has signed in once by email OTP.
-- Replace ADMIN_EMAIL_HERE before executing. Never place a service-role key in this repository.
--
-- This promotes the email account to administrator. The front end still uses RLS:
-- admin power is granted only when auth.uid() maps to profiles.role = 'admin'.

insert into public.profiles (id, display_name, avatar_seed, role, updated_at)
select
  u.id,
  coalesce(nullif(u.raw_user_meta_data ->> 'display_name', ''), '管理员小猪'),
  coalesce(u.raw_user_meta_data ->> 'avatar_seed', u.id::text),
  'admin',
  now()
from auth.users u
where lower(u.email) = lower('ADMIN_EMAIL_HERE')
on conflict (id) do update
set role = 'admin',
    updated_at = now();

select p.id, p.display_name, p.role, u.email
from public.profiles p
join auth.users u on u.id = p.id
where p.role = 'admin'
order by p.updated_at desc;
