# 懂猪帝

懂不懂小猪都用懂猪帝。一个可部署的日常记录/小猪恶作剧网站，包含小猪图文、朋友彩蛋、日历回看、多人发布、评论和点赞。

## 本地预览

在本目录运行：

```powershell
python -m http.server 4173
```

然后访问 `http://localhost:4173`。

## 部署

整个 `xiaozhushu` 文件夹可直接部署到任意静态托管服务，无需构建步骤。

当前功能版地址：

https://xiaoxinbuxingyeyuan.github.io/xiaozhushu-prank/ui-demos/

## 上线前重点

- 普通访客通过 Supabase Anonymous Sign-In 自动获得匿名身份，不需要邮箱。
- 发帖支持纯文字、标题可选、图片/视频可选。
- 管理员邮箱登录暂缓，不影响普通访客浏览、发帖、评论和点赞。
- 如果要公开给更多人，建议后续再补 Cloudflare Turnstile 作为防刷保护。
