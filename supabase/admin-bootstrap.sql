-- Run only in the Supabase SQL Editor after the administrator has signed in once.
-- Replace the email before executing. Never place a service-role key in this repository.
update public.profiles p
set role = 'admin', updated_at = now()
from auth.users u
where p.id = u.id
  and lower(u.email) = lower('ADMIN_EMAIL_HERE');
