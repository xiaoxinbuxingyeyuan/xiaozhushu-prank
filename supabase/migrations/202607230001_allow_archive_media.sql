-- Repository-backed archive posts may contain more media than new user posts.
-- The frontend still enforces the product limit of 9 images plus 1 video.
alter table public.post_media
  drop constraint if exists post_media_sort_order_check;

alter table public.post_media
  add constraint post_media_sort_order_check
  check (sort_order between 0 and 31);
