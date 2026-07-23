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

## 暂缓项

- 管理员邮箱：当前邮箱验证码/魔法链接流程暂缓，不作为正式上线阻塞项。普通访客不需要邮箱即可使用。
- Cloudflare Turnstile：如果你准备把链接公开给更多人，建议配置；只是发给朋友试玩，可以暂时不配。
