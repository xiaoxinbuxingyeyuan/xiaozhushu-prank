# 懂猪帝管理员邮箱配置

目标：管理员不再依赖浏览器匿名身份，而是使用邮箱 6 位验证码登录。

## 1. Supabase 开启 Email 登录

在 Supabase Dashboard 打开项目：

`https://supabase.com/dashboard/project/vvombzyqpgmmatgqefgx`

进入：

`Authentication` → `Providers` → `Email`

确认 Email Provider 已开启。

## 2. 邮件模板加入验证码

进入：

`Authentication` → `Emails` → `Magic Link`

邮件正文里需要包含：

```txt
验证码：{{ .Token }}
```

可以同时保留 `{{ .ConfirmationURL }}` 登录链接，但管理员页现在优先使用 6 位验证码。

## 3. 允许正式站点回调

进入：

`Authentication` → `URL Configuration`

建议配置：

- Site URL：`https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/`
- Redirect URLs：
  - `https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/`
  - `https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/?admin=1`
  - `https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/ui-demos/`
  - `https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/ui-demos/?admin=1`

## 4. 第一次用邮箱登录

打开：

`https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/?admin=1`

输入你的管理员邮箱，点击“发送验证码”，再输入邮件里的 6 位验证码。

第一次登录后可能会提示“邮箱已登录，但还没有管理员权限”，这是正常的。

## 5. 把邮箱升级为管理员

进入 Supabase：

`SQL Editor` → `New query`

复制 `supabase/admin-bootstrap.sql` 内容，把：

```sql
ADMIN_EMAIL_HERE
```

替换为你的管理员邮箱，例如：

```sql
860923530@qq.com
```

执行后确认结果里出现：

```txt
role = admin
```

## 6. 再次登录管理台

重新打开：

`https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/?admin=1`

再次用邮箱验证码登录，即可进入“待处理举报 / 全部帖子”管理台。

## 注意

- 普通朋友仍然使用匿名身份，不需要邮箱。
- 管理员邮箱可以跨浏览器、跨设备重新登录。
- 不要把 Supabase service-role key 放进 GitHub 或网页代码。
