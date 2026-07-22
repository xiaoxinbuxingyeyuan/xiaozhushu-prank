-- Daily records may be text-only, media-only, or have no separate title.
alter table public.posts
  alter column title set default '';

alter table public.posts
  drop constraint if exists posts_title_check;

alter table public.posts
  add constraint posts_title_check
  check (char_length(title) <= 80);
