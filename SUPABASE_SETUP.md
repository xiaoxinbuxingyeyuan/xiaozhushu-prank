# 懂猪帝多人功能部署

前端在 Supabase 配置为空时会自动进入静态只读模式；现有 24 条帖子仍可浏览。共享发布、评论、点赞和管理功能需要完成以下设置。

## 1. 创建与配置项目

1. 在 Supabase 新建项目。
2. Authentication → Providers：开启 Anonymous Sign-Ins 和 Email。
3. Authentication → URL Configuration：
   - Site URL：`https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/ui-demos/`
   - Redirect URL：添加同一地址。
4. 若启用 Cloudflare Turnstile，在 Authentication → Bot and Abuse Protection 中填写 Turnstile secret key。

## 2. 应用数据库迁移

安装并登录 Supabase CLI 后，在本仓库目录执行：

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npx supabase db push
```

随后在 SQL Editor 运行 `supabase/seed.sql` 导入 24 条只读历史帖子。

## 3. 配置浏览器公开密钥

编辑 `ui-demos/supabase-config.js`：

```js
window.DZD_CONFIG = Object.freeze({
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabasePublishableKey: "sb_publishable_...",
  turnstileSiteKey: "0x4AAAA..."
});
```

Project URL、publishable key 和 Turnstile site key 可以公开。`service_role`、secret key 和 Turnstile secret key 绝不能写入仓库或前端。

## 4. 设置管理员

先访问 `/ui-demos/?admin=1`，用管理员邮箱完成一次魔法链接登录。把邮箱写入 `supabase/admin-bootstrap.sql` 后，仅在 Supabase SQL Editor 中执行。

## 5. 验证

- 两个不同浏览器能看到相同帖子、评论和点赞数。
- 非作者编辑或删除请求被 RLS 拒绝。
- 新媒体存入 `post-media/{auth.uid()}/...`。
- 管理员可在 `?admin=1` 处理举报和隐藏内容。
- 关闭网络或清空公开配置后，页面回到静态只读模式。
