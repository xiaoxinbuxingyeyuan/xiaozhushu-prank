# Supabase 接入状态

更新时间：2026-07-23

## 已接入

- Supabase 项目：`vvombzyqpgmmatgqefgx`
- 线上正式页：`https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/`
- 备份实验页：`https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/ui-demos/`
- 前端公开配置：`supabase-config.js` 与 `ui-demos/supabase-config.js`
- Storage bucket：`post-media`
- 数据表：`profiles`、`posts`、`post_media`、`comments`、`post_likes`、`reports`
- RLS：以上公开表均已开启
- 初始内容：24 条种子帖，79 条种子媒体

## 已验证

- 页面能进入多人同步模式。
- 匿名登录可用。
- 公开帖子和媒体读取可用。
- 纯文字帖子可发布，不要求标题或图片。
- 评论可发布，提交后输入框会清空。
- 点赞可写入，并会更新计数。
- 非作者不能修改或删除他人的帖子。
- 作者可以删除自己的帖子。
- GitHub Pages 已加载最新 `demo.css` / `demo.js` 版本资源。

## 管理员登录

- 管理员登录已改为邮箱 6 位验证码：访问 `/?admin=1`，输入管理员邮箱，收验证码后进入。
- 管理员权限仍由 `public.profiles.role = 'admin'` 控制；第一次用邮箱登录后，需要在 Supabase SQL Editor 执行 `supabase/admin-bootstrap.sql`，把对应邮箱升级为管理员。

## 暂缓项

- Cloudflare Turnstile：如果你准备把链接公开给更多人，建议配置；只是发给朋友试玩，可以暂时不配。
