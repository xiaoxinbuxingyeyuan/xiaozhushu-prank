# Design QA

- Source visual: `C:/Users/Lenovo/Documents/Codex/2026-07-01/new-chat/work/current-ui-demo-reference.png`
- Implementation screenshot: `C:/Users/Lenovo/Documents/Codex/2026-07-01/new-chat/work/ui-demo-restored-desktop.png`
- Mobile screenshot: `C:/Users/Lenovo/Documents/Codex/2026-07-01/new-chat/work/ui-demo-final-mobile.png`
- Desktop viewport: 1440 × 1024
- Mobile viewport: 390 × 844
- State: 日记胶片风首页、静态只读回退；详情弹窗另行交互检查

## Evidence

源图与实现图在同一比较输入中检查。实现保留了 7 月 5 日版本的超大标题、三风格切换卡、暖色纸张纹理、圆角说明条、侧栏日记卡和瀑布流卡片。新增状态、资料、发布、搜索、日期筛选和离线提示均使用原有圆角、描边与纸张色，不改变既有视觉层级。

## Findings and fixes

1. P1：第一次详情复测时评论输入区超出弹窗底部。为详情 Grid 补充受约束的行轨道和 `min-height: 0`，复测输入区底部为 901.33px，位于弹窗 902px 边界内。
2. P2：390px 下拼贴卡片旋转造成 4px 文档级横向溢出。移动断点为根节点增加横向裁切；复测 `scrollWidth === clientWidth === 375`。
3. P2：搜索清空在浏览器原生搜索取消行为中需要额外事件。为搜索框补充 `search` 与 `change` 监听。
4. P3：静态回退时发布和评论不可用但缺少解释。保留明显的蓝灰提示条、禁用评论提示和 toast，不让页面表现为故障。

## Interaction checks

- 首页加载 12 条，分页数据源共 24 条。
- “Rocky”搜索返回 3 条。
- 三种主题可切换，`data-theme` 正确更新。
- 帖子详情可打开，轮播、点赞、收藏、举报和评论区控件存在。
- 静态模式发布会给出 Supabase 配置提示，不会创建假数据。
- 桌面和手机均无文档级横向溢出。

final result: passed
