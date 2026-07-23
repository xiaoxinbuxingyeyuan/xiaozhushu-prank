-- Move the f01-f12 prank friend posts into the community behind this invite.
-- Run this once in Supabase SQL Editor.
-- Invite URL:
-- https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/?invite=d4bddec4e50857190d4176d361758d99

do $$
declare
  target_community uuid;
begin
  select community_id
    into target_community
  from public.community_invites
  where token = 'd4bddec4e50857190d4176d361758d99'
    and enabled = true
  limit 1;

  if target_community is null then
    raise exception 'Invite token not found or disabled: %', 'd4bddec4e50857190d4176d361758d99';
  end if;

  insert into public.posts (
    legacy_key,
    community_id,
    author_id,
    author_name,
    avatar_seed,
    title,
    body,
    tags,
    status,
    created_at,
    updated_at
  )
  values
    ('f01', target_community, null, '今日审猪员', 'friend-1', '审猪积累38.0 小猪也要梳毛吗？', '今天这只意外地很配合，刷了半天只会低头装没看见。越看越像刚洗完澡的小猪崽。', array['审猪积累','朋友混入中'], 'published', now() - interval '23 days', now()),
    ('f02', target_community, null, '低像素猪', 'friend-2', '低质量猪图 2.0', '凌晨两点抓到一只贴脸观察的小猪。请不要靠镜头这么近，鼻子已经占满整个屏幕了。', array['低质量猪图','朋友混入中'], 'published', now() - interval '21 days', now()),
    ('f03', target_community, null, '猪猪配饰研究员', 'friend-3', '猪猪发夹会自己挑主人吗？', '本来只是随手夹上去，回头一看，好像被两只小猪认领了。今日份小猪好心情。', array['日常记录','朋友混入中'], 'published', now() - interval '19 days', now()),
    ('f04', target_community, null, '困困小猪观察所', 'friend-4', '我想念一头在咖啡店睡着的猪', '带小猪出门喝东西，五分钟后直接进入休眠模式。怎么叫都不醒，疑似电量不足。', array['日常记录','朋友混入中'], 'published', now() - interval '17 days', now()),
    ('f05', target_community, null, '诚实小猪鉴定员', 'friend-5', '最老实的小猪！', '举起来的时候一声不吭，问什么都点头。看着确实很老实，但总感觉它还有事情瞒着我。', array['审猪积累','朋友混入中'], 'published', now() - interval '15 days', now()),
    ('f06', target_community, null, '猪猪用餐指南', 'friend-6', '这只小猪会自己找勺子吗？', '刚坐下就把勺子贴到脸上，疑似正在研究猪猪餐具的正确用法。', array['日常记录','朋友混入中'], 'published', now() - interval '13 days', now()),
    ('f07', target_community, null, '小猪情绪观察员', 'friend-7', '玩游戏输了以后的猪 be like', '说好只玩一局，输了以后原地委屈成一团。下一枚游戏币已经在路上了。', array['低质量猪图','朋友混入中'], 'published', now() - interval '11 days', now()),
    ('f08', target_community, null, '猪言猪语记录员', 'friend-8', '请不要捂住我的嘴巴 2.0', '刚准备发表重要意见，就被同伴当场强制静音。小猪明明还有很多话想说。', array['审猪积累','朋友混入中'], 'published', now() - interval '9 days', now()),
    ('f09', target_community, null, '小猪食堂巡查员', 'friend-9', '你这只正在吃饭的猪！', '吃青菜时被当场抓拍，明明只是在认真补充膳食纤维。', array['日常记录','朋友混入中'], 'published', now() - interval '7 days', now()),
    ('f10', target_community, null, '头顶生物研究所', 'friend-10', '审猪积累39.0：头顶长出一只？', '低头玩手机的功夫，头顶突然被不明生物占领。本人毫无察觉。', array['审猪积累','朋友混入中'], 'published', now() - interval '5 days', now()),
    ('f11', target_community, null, '小猪避暑办', 'friend-11', '小猪也会热到变形吗？', '出门五分钟就抱着风扇不撒手，旁边的小猪已经热到只剩粉色背影。', array['日常记录','朋友混入中'], 'published', now() - interval '3 days', now()),
    ('f12', target_community, null, '懂猪帝睡眠中心', 'friend-12', '困困小猪找到专属枕头了', '走到一半自动进入睡眠模式，靠上去三秒就不动了。', array['日常记录','朋友混入中'], 'published', now() - interval '1 day', now())
  on conflict (legacy_key) do update set
    community_id = excluded.community_id,
    author_id = null,
    author_name = excluded.author_name,
    avatar_seed = excluded.avatar_seed,
    title = excluded.title,
    body = excluded.body,
    tags = excluded.tags,
    status = 'published',
    updated_at = now();

  insert into public.post_media (post_id, owner_id, public_url, poster_url, media_kind, mime_type, sort_order)
  select p.id, null, v.public_url, null, 'image'::public.media_kind, 'image/jpeg', 0
  from (
    values
      ('f01', 'assets/friends/friend-1.jpg'),
      ('f02', 'assets/friends/friend-2.jpg'),
      ('f03', 'assets/friends/friend-3.jpg'),
      ('f04', 'assets/friends/friend-4.jpg'),
      ('f05', 'assets/friends/friend-5.jpg'),
      ('f06', 'assets/friends/friend-6.jpg'),
      ('f07', 'assets/friends/friend-7.jpg'),
      ('f08', 'assets/friends/friend-8.jpg'),
      ('f09', 'assets/friends/friend-9.jpg'),
      ('f10', 'assets/friends/friend-10.jpg'),
      ('f11', 'assets/friends/friend-11.jpg'),
      ('f12', 'assets/friends/friend-12.jpg')
  ) as v(legacy_key, public_url)
  join public.posts p on p.legacy_key = v.legacy_key
  on conflict (post_id, sort_order) do update set
    owner_id = excluded.owner_id,
    public_url = excluded.public_url,
    poster_url = excluded.poster_url,
    media_kind = excluded.media_kind,
    mime_type = excluded.mime_type;
end $$;

select
  p.legacy_key,
  p.title,
  p.community_id,
  count(pm.id) as media_count
from public.posts p
left join public.post_media pm on pm.post_id = p.id
where p.legacy_key between 'f01' and 'f12'
group by p.legacy_key, p.title, p.community_id
order by p.legacy_key;
