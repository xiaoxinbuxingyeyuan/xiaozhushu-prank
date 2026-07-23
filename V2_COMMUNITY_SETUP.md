# 懂猪帝 v2：个人帖子社区

v1 已保留：

- 远程分支：`v1-stable-before-v2`
- 远程标签：`v1-stable-before-v2`
- 本地标签：`v1-local-before-v2`

v2 当前在本地分支 `v2-community` 开发，根路径 `/` 是 v2 正式页；`/ui-demos/` 仍保留为原实验页备份。

## 数据库迁移

在 Supabase 项目中执行：

```powershell
supabase db push
```

或在 Supabase SQL Editor 中执行 `supabase/migrations/202607230003_communities.sql`。

新增能力：

- 游客可浏览原生小猪示例帖。
- 邮箱验证码登录后可以创建社区。
- 社区 owner 自动成为成员，并可生成邀请链接。
- 好友通过 `?invite=...` 登录后自动加入社区。
- 社区成员可看、发帖、评论、点赞。
- 社区 owner 可隐藏/删除本社区帖子和评论。
- 示例帖保持公开只读，不归属任何用户社区。

## 注意

- GitHub Pages 仍只负责静态前端；Supabase 负责账号、社区、帖子、评论、点赞和媒体存储。
- v2 不做单篇帖子可见范围；可见性在社区级别控制。
- 清理浏览器记录后，用同一个邮箱登录即可恢复社区身份。
