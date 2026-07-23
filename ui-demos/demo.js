const CONFIG = window.DZD_CONFIG || {};
const PAGE_SIZE = 12;
const IMAGE_LIMIT = 9;
const VIDEO_LIMIT = 1;
const VIDEO_MAX_BYTES = 50 * 1024 * 1024;
const VIDEO_MAX_SECONDS = 60;
const LARGE_UPLOAD_THRESHOLD = 6 * 1024 * 1024;
const BOOKMARK_KEY = "dzd-local-bookmarks-v2";

const THEME_COPY = {
  diary: { icon: "ph-camera", title: "日记胶片风", heading: "今天也在认真审猪", text: "温暖、真实、生活记录感；帖子像拍立得贴在日记本里。" },
  collage: { icon: "ph-scissors", title: "杂志拼贴风", heading: "小猪恶作剧版面施工中", text: "错落卡片和贴纸批注，让朋友彩蛋更像一本手工小报。" },
  dream: { icon: "ph-cloud", title: "梦核小猪风", heading: "软乎乎的梦里全是小猪", text: "柔光、毛玻璃和漂浮色块，保留最有氛围感的那套视觉。" }
};

const AUTHOR_NAMES = {
  author01: "浅草小猪观察员",
  author02: "审猪档案馆",
  author03: "Tom 的饲养员",
  author04: "Yuki 的小日常",
  author05: "低像素猪图",
  author06: "Rocky 观察所",
  author07: "Rocky 观察所",
  author08: "Rocky 大王的随从",
  author09: "请勿随意代入",
  author10: "Soft Pig Club",
  author11: "小猪小猪软乎乎",
  author12: "今天也在审猪"
};

const FRIEND_POSTS = [
  ["f01", "审猪积累38.0 小猪也要梳毛吗？", "今天这只意外地很配合，刷了半天只会低头装没看见。越看越像刚洗完澡的小猪崽。", "今日审猪员", "assets/friends/friend-1.jpg", ["审猪积累", "朋友混入中"]],
  ["f02", "低质量猪图 2.0", "凌晨两点抓到一只贴脸观察的小猪。请不要靠镜头这么近，鼻子已经占满整个屏幕了。", "低像素猪", "assets/friends/friend-2.jpg", ["低质量猪图", "朋友混入中"]],
  ["f03", "猪猪发夹会自己挑主人吗？", "本来只是随手夹上去，回头一看，好像被两只小猪认领了。今日份小猪好心情。", "猪猪配饰研究员", "assets/friends/friend-3.jpg", ["日常记录", "朋友混入中"]],
  ["f04", "我想念一头在咖啡店睡着的猪", "带小猪出门喝东西，五分钟后直接进入休眠模式。怎么叫都不醒，疑似电量不足。", "困困小猪观察所", "assets/friends/friend-4.jpg", ["日常记录", "朋友混入中"]],
  ["f05", "最老实的小猪！", "举起来的时候一声不吭，问什么都点头。看着确实很老实，但总感觉它还有事情瞒着我。", "诚实小猪鉴定处", "assets/friends/friend-5.jpg", ["审猪积累", "朋友混入中"]],
  ["f06", "这只小猪会自己找勺子吗？", "刚坐下就把勺子贴到脸上，疑似正在研究猪猪餐具的正确用法。", "猪猪用餐指南", "assets/friends/friend-6.jpg", ["日常记录", "朋友混入中"]],
  ["f07", "玩游戏输了以后的猪 be like", "说好只玩一局，输了以后原地委屈成一团。下一枚游戏币已经在路上了。", "小猪情绪观察员", "assets/friends/friend-7.jpg", ["低质量猪图", "朋友混入中"]],
  ["f08", "请不要捂住我的嘴巴 2.0", "刚准备发表重要意见，就被同伴当场强制静音。小猪明明还有很多话想说。", "猪言猪语记录处", "assets/friends/friend-8.jpg", ["审猪积累", "朋友混入中"]],
  ["f09", "你这只正在吃饭的猪！", "吃青菜时被当场抓拍，明明只是在认真补充膳食纤维。", "小猪食堂巡查员", "assets/friends/friend-9.jpg", ["日常记录", "朋友混入中"]],
  ["f10", "审猪积累39.0 头顶长出一只？", "低头玩手机的功夫，头顶突然被不明生物占领。本人毫无察觉。", "头顶生物研究所", "assets/friends/friend-10.jpg", ["审猪积累", "朋友混入中"]],
  ["f11", "小猪也会热到变形吗？", "出门五分钟就抱着风扇不撒手，旁边的小猪已经热到只剩粉色背影。", "小猪避暑办", "assets/friends/friend-11.jpg", ["日常记录", "朋友混入中"]],
  ["f12", "困困小猪找到专属枕头了", "走到一半自动进入睡眠模式，靠上去三秒就不动了。", "懂猪帝睡眠中心", "assets/friends/friend-12.jpg", ["日常记录", "朋友混入中"]]
].map((item, index) => ({
  id: item[0],
  legacyKey: item[0],
  title: item[1],
  body: `${item[2]}\n\n#${item[5].join(" #")}`,
  author: item[3],
  avatarSeed: `friend-${index + 1}`,
  tags: item[5],
  media: [{ kind: "image", url: item[4], sortOrder: 0 }],
  createdAt: new Date(Date.now() - (index + 1) * 7_200_000).toISOString(),
  likeCount: 8 + ((index * 13) % 47),
  commentCount: index % 5,
  source: "static"
}));

const state = {
  client: null,
  backend: false,
  user: null,
  profile: null,
  isAdmin: false,
  posts: [],
  staticPosts: [],
  page: 0,
  hasMore: true,
  loading: false,
  query: "",
  tag: "",
  dateRange: "all",
  calendarMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  calendarPosts: [],
  selectedDate: null,
  drawerDate: null,
  activePost: null,
  activeMedia: 0,
  comments: [],
  replyTo: null,
  selectedFiles: [],
  editingPost: null,
  profileResolver: null,
  captchaToken: null,
  captchaWidget: null,
  realtime: null,
  realtimeTimer: null,
  bookmarks: new Set(JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]")),
  likedPostIds: new Set()
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const els = {
  feed: $("#feed"),
  feedEmpty: $("#feed-empty"),
  feedSummary: $("#feed-summary"),
  loadMore: $("#load-more"),
  search: $("#search-input"),
  dateFilter: $("#date-filter"),
  miniCalendarGrid: $("#mini-calendar-grid"),
  memoryCalendarGrid: $("#memory-calendar-grid"),
  memoryDayList: $("#memory-day-list"),
  modePill: $("#mode-pill"),
  offlineBanner: $("#offline-banner"),
  detailLayer: $("#detail-layer"),
  mediaStage: $("#media-stage"),
  mediaPrev: $("#media-prev"),
  mediaNext: $("#media-next"),
  mediaCount: $("#media-count"),
  commentsList: $("#comments-list"),
  commentsEmpty: $("#comments-empty"),
  commentInput: $("#comment-input"),
  publishLayer: $("#publish-layer"),
  publishForm: $("#publish-form"),
  mediaInput: $("#media-input"),
  mediaPreviews: $("#media-previews"),
  uploadProgress: $("#upload-progress"),
  profileLayer: $("#profile-layer"),
  profileForm: $("#profile-form"),
  adminLayer: $("#admin-layer"),
  actionMenu: $("#post-action-menu"),
  toastStack: $("#toast-stack")
};

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function hashCode(value) {
  return [...String(value || "pig")].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

function avatarPalette(seed) {
  const palettes = [
    ["#f7d0ca", "#8f3f3c"], ["#d8e4ed", "#29455f"], ["#f2dfad", "#795d23"],
    ["#e4d8e9", "#5f4468"], ["#d7e8dd", "#35614a"], ["#f0d8c7", "#7b4d36"]
  ];
  const pair = palettes[Math.abs(hashCode(seed)) % palettes.length];
  return `--avatar-bg:${pair[0]};--avatar-ink:${pair[1]}`;
}

function avatarHTML(seed, className = "avatar") {
  return `<span class="${className}" style="${avatarPalette(seed)}" aria-hidden="true"><i class="ph-fill ph-piggy-bank"></i></span>`;
}

function applyTheme(theme) {
  const copy = THEME_COPY[theme] || THEME_COPY.diary;
  document.body.dataset.theme = theme;
  $$(".theme-tab").forEach(button => button.classList.toggle("active", button.dataset.theme === theme));
  const heading = $("#feed-heading");
  if (heading) heading.textContent = copy.heading;
  const note = $("#style-note");
  if (note) note.innerHTML = `<i class="ph ${copy.icon}" aria-hidden="true"></i><p><strong>${copy.title}</strong>：${copy.text}</p><small>点击任意卡片查看详情</small>`;
}

function assetUrl(path = "") {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `../${path.replace(/^\.\.\//, "").replace(/^\/+/, "")}`;
}

function formatDate(value, detailed = false) {
  const date = new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) return "刚刚";
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "刚刚";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`;
  return new Intl.DateTimeFormat("zh-CN", detailed
    ? { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    : { month: "short", day: "numeric" }).format(date);
}

function dateKey(value) {
  const date = value instanceof Date ? value : new Date(value);
  const pad = number => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseDateKey(key) {
  const [year, month, day] = String(key).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function nextDate(date, amount = 1) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

function calendarMonthLabel(date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function calendarCells(month) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const leading = (first.getDay() + 6) % 7;
  const start = nextDate(first, -leading);
  return Array.from({ length: 42 }, (_, index) => nextDate(start, index));
}

function postsByDate() {
  return state.calendarPosts.reduce((map, post) => {
    const key = dateKey(post.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(post);
    return map;
  }, new Map());
}

function dayAriaLabel(date, count) {
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][date.getDay()];
  return `${date.getMonth() + 1}月${date.getDate()}日 ${weekday}${count ? `，${count}条记录` : "，没有记录"}`;
}

function renderMiniCalendar(grouped) {
  const today = dateKey(new Date());
  $("#mini-calendar-title").textContent = calendarMonthLabel(state.calendarMonth);
  els.miniCalendarGrid.innerHTML = calendarCells(state.calendarMonth).map(date => {
    const key = dateKey(date);
    const count = grouped.get(key)?.length || 0;
    const outside = date.getMonth() !== state.calendarMonth.getMonth();
    return `<button class="mini-calendar-day${outside ? " outside" : ""}${key === today ? " today" : ""}${key === state.selectedDate ? " selected" : ""}" type="button" role="gridcell" data-calendar-date="${key}" aria-label="${dayAriaLabel(date, count)}">
      <span>${date.getDate()}</span>${count ? `<i></i><small>${count}</small>` : ""}
    </button>`;
  }).join("");
  $("#calendar-clear").hidden = !state.selectedDate;
}

function memoryThumbnail(post, index) {
  const media = post.media?.[0];
  if (!media || (media.kind === "video" && !media.posterUrl)) return "";
  const url = assetUrl(media.posterUrl || media.url);
  return `<img src="${escapeHTML(url)}" alt="" loading="lazy" style="--thumb-index:${index}" />`;
}

function renderMemoryCalendar(grouped) {
  const today = dateKey(new Date());
  $("#memory-month-title").textContent = calendarMonthLabel(state.calendarMonth);
  els.memoryCalendarGrid.innerHTML = calendarCells(state.calendarMonth).map(date => {
    const key = dateKey(date);
    const posts = grouped.get(key) || [];
    const outside = date.getMonth() !== state.calendarMonth.getMonth();
    const thumbs = posts.slice(0, 2).map(memoryThumbnail).join("");
    return `<button class="memory-calendar-day${outside ? " outside" : ""}${key === today ? " today" : ""}${key === state.drawerDate ? " selected" : ""}" type="button" role="gridcell" data-memory-date="${key}" aria-label="${dayAriaLabel(date, posts.length)}">
      <span class="memory-day-number">${date.getDate()}</span>
      ${thumbs ? `<span class="memory-thumbs">${thumbs}</span>` : ""}
      ${posts.length ? `<small>${posts.length} 项</small>` : ""}
    </button>`;
  }).join("");
}

function previewTemplate(post) {
  const media = post.media?.[0];
  const hasThumb = media && !(media.kind === "video" && !media.posterUrl);
  const thumb = hasThumb ? assetUrl(media.posterUrl || media.url) : "";
  const time = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(post.createdAt));
  return `<article class="memory-preview${thumb ? "" : " text-preview"}" data-memory-post="${escapeHTML(post.id)}">
    <div class="memory-preview-copy">
      <time>${time}</time>
      ${post.title ? `<h4>${escapeHTML(post.title)}</h4>` : ""}
      ${post.body ? `<p>${escapeHTML(postExcerpt(post, 70))}</p>` : ""}
    </div>
    ${thumb ? `<img src="${escapeHTML(thumb)}" alt="${escapeHTML(postLabel(post))}" loading="lazy" />` : `<span class="text-note-icon"><i class="ph ph-note-pencil"></i></span>`}
  </article>`;
}

function renderMemoryDay(grouped) {
  const activeKey = state.drawerDate || dateKey(new Date());
  const activeDate = parseDateKey(activeKey);
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][activeDate.getDay()];
  const posts = grouped.get(activeKey) || [];
  $("#memory-day-title").textContent = `${activeDate.getMonth() + 1}月${activeDate.getDate()}日 · ${weekday}`;
  $("#memory-day-count").textContent = posts.length ? `${posts.length} 项记录` : "这一天还没有留下记录";
  els.memoryDayList.innerHTML = posts.length
    ? posts.slice(0, 6).map(previewTemplate).join("")
    : `<div class="memory-empty"><i class="ph ph-calendar-heart"></i><p>这一天安安静静的，等一条新日常。</p></div>`;
  $("#memory-view-day").disabled = !posts.length;
}

function renderCalendars() {
  const grouped = postsByDate();
  renderMiniCalendar(grouped);
  renderMemoryCalendar(grouped);
  renderMemoryDay(grouped);
}

async function loadCalendarPosts() {
  const start = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth(), 1);
  const end = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + 1, 1);
  try {
    if (state.backend) {
      const { data, error } = await state.client
        .from("posts")
        .select(`id,legacy_key,title,body,tags,author_id,author_name,avatar_seed,created_at,status,
          profile:profiles!posts_author_id_fkey(display_name,avatar_seed,role),
          media:post_media(id,media_kind,public_url,storage_path,poster_url,sort_order)`)
        .eq("status", "published")
        .gte("created_at", start.toISOString())
        .lt("created_at", end.toISOString())
        .order("created_at", { ascending: true })
        .limit(200);
      if (error) throw error;
      state.calendarPosts = (data || []).map(mapDbPost);
    } else {
      if (!state.staticPosts.length) await loadStaticPosts(true);
      state.calendarPosts = state.staticPosts.filter(post => {
        const created = new Date(post.createdAt);
        return created >= start && created < end;
      });
    }
  } catch (error) {
    console.warn("Calendar loading failed", error);
    state.calendarPosts = state.posts.filter(post => {
      const created = new Date(post.createdAt);
      return created >= start && created < end;
    });
  }
  if (!state.drawerDate || parseDateKey(state.drawerDate).getMonth() !== state.calendarMonth.getMonth()) {
    const today = new Date();
    state.drawerDate = today.getMonth() === state.calendarMonth.getMonth() && today.getFullYear() === state.calendarMonth.getFullYear()
      ? dateKey(today)
      : dateKey(start);
  }
  renderCalendars();
}

async function shiftCalendarMonth(amount) {
  state.calendarMonth = new Date(state.calendarMonth.getFullYear(), state.calendarMonth.getMonth() + amount, 1);
  state.drawerDate = null;
  await loadCalendarPosts();
}

async function selectFeedDate(key) {
  state.selectedDate = key;
  state.drawerDate = key;
  const selected = parseDateKey(key);
  state.calendarMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
  els.dateFilter.value = "all";
  state.dateRange = "all";
  renderCalendars();
  await refreshFeed();
}

async function goToToday(applyToFeed = false) {
  const today = new Date();
  state.calendarMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  state.drawerDate = dateKey(today);
  await loadCalendarPosts();
  if (applyToFeed) await selectFeedDate(state.drawerDate);
}

async function clearCalendarSelection() {
  state.selectedDate = null;
  renderCalendars();
  await refreshFeed();
}

function openMemoryCalendar() {
  if (!state.drawerDate) state.drawerDate = state.selectedDate || dateKey(new Date());
  renderCalendars();
  openLayer("memory");
}

async function viewDrawerDay() {
  if (!state.drawerDate) return;
  await selectFeedDate(state.drawerDate);
  closeLayer("memory");
  $(".feed-wrap")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function showToast(message, type = "info", icon = "ph-info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="ph ${icon}" aria-hidden="true"></i><span>${escapeHTML(message)}</span>`;
  els.toastStack.appendChild(toast);
  window.setTimeout(() => toast.remove(), 4200);
}

function openLayer(name) {
  const layer = $(`#${name}-layer`);
  if (!layer) return;
  layer.classList.add("open");
  layer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  window.setTimeout(() => layer.querySelector("button, input, textarea, select")?.focus(), 50);
}

function closeLayer(name) {
  const layer = $(`#${name}-layer`);
  if (!layer) return;
  layer.classList.remove("open");
  layer.setAttribute("aria-hidden", "true");
  if (!$(".dialog-layer.open")) document.body.classList.remove("modal-open");
  if (name === "detail") stopActiveVideo();
  if (name === "profile" && state.profileResolver) {
    state.profileResolver(false);
    state.profileResolver = null;
  }
}

function setBackendMode(online, message = "") {
  state.backend = online;
  els.modePill.classList.toggle("online", online);
  els.modePill.innerHTML = online
    ? `<i class="ph ph-cloud-check"></i><span>多人同步</span>`
    : `<i class="ph ph-cloud-slash"></i><span>静态浏览</span>`;
  els.offlineBanner.hidden = online;
  if (!online && message) els.offlineBanner.querySelector("span").textContent = message;
}

function renderSkeletons() {
  els.feed.innerHTML = Array.from({ length: 8 }, (_, index) =>
    `<div class="skeleton-card" style="--height:${250 + (index % 4) * 70}px"></div>`).join("");
}

function normalizePigPost(post, index) {
  const media = (post.media || []).map((url, sortOrder) => ({ kind: "image", url, sortOrder }));
  if (post.video) media.push({ kind: "video", url: post.video, posterUrl: post.media?.[0], sortOrder: media.length });
  return {
    id: post.id,
    legacyKey: post.id,
    title: String(post.title || "今日份小猪").replace(/\s+-\s+小红书$/, ""),
    body: post.body || "这条小猪记录暂时没有正文，但它看起来已经很会生活了。",
    author: AUTHOR_NAMES[post.author] || post.author || "懂猪帝观察员",
    avatarSeed: post.author || post.id,
    tags: [index % 2 ? "审猪积累" : "低质量猪图", "日常记录"],
    media,
    createdAt: new Date(Date.now() - index * 5_400_000).toISOString(),
    likeCount: 12 + ((index * 17) % 83),
    commentCount: 1 + (index % 7),
    source: "static"
  };
}

function mixPosts(pigPosts, friendPosts) {
  const mixed = [];
  const max = Math.max(pigPosts.length, friendPosts.length);
  for (let index = 0; index < max; index += 1) {
    if (pigPosts[index]) mixed.push(pigPosts[index]);
    if (friendPosts[index]) mixed.push(friendPosts[index]);
  }
  return mixed;
}

function mapDbPost(row) {
  const profile = row.profile || row.profiles || {};
  const mediaRows = row.media || row.post_media || [];
  return {
    id: row.id,
    legacyKey: row.legacy_key,
    title: row.title,
    body: row.body || "",
    authorId: row.author_id,
    author: profile.display_name || row.author_name || "懂猪帝观察员",
    avatarSeed: profile.avatar_seed || row.avatar_seed || row.id,
    tags: row.tags || [],
    media: mediaRows.sort((a, b) => a.sort_order - b.sort_order).map(item => ({
      id: item.id,
      kind: item.media_kind,
      url: item.public_url || item.storage_path,
      storagePath: item.storage_path,
      posterUrl: item.poster_url,
      sortOrder: item.sort_order
    })),
    createdAt: row.created_at,
    likeCount: Number(row.likes?.[0]?.count || row.post_likes?.[0]?.count || 0),
    commentCount: Number(row.comments?.[0]?.count || 0),
    status: row.status,
    source: "db"
  };
}

function postCover(post) {
  return post.media?.[0] || { kind: "image", url: "" };
}

function postLabel(post) {
  const title = String(post.title || "").trim();
  const body = String(post.body || "").trim().replace(/\s+/g, " ");
  return title || body.slice(0, 48) || (post.media?.length ? "一条媒体记录" : "一条日常记录");
}

function postExcerpt(post, length = 150) {
  const body = String(post.body || "").trim();
  return body.length > length ? `${body.slice(0, length).trim()}…` : body;
}

function cardTemplate(post, index) {
  const cover = postCover(post);
  const isVideo = cover.kind === "video";
  const coverUrl = assetUrl(cover.posterUrl || cover.url);
  const saved = state.bookmarks.has(post.id);
  const liked = state.likedPostIds.has(post.id);
  const mediaCount = post.media?.length || 0;
  const label = postLabel(post);
  const excerpt = postExcerpt(post);
  const hasTitle = Boolean(String(post.title || "").trim());
  return `
      <article class="post-card${coverUrl ? "" : " text-only-card"}" tabindex="0" data-post-id="${escapeHTML(post.id)}" style="--delay:${Math.min(index * 35, 350)}ms;--tilt:${((index % 7) - 3) * 0.9}deg" aria-label="打开帖子：${escapeHTML(label)}">
      ${coverUrl ? `<div class="card-media">
        ${isVideo && !cover.posterUrl ? `<video src="${escapeHTML(cover.url)}" muted playsinline preload="metadata"></video>` : `<img src="${escapeHTML(coverUrl)}" alt="${escapeHTML(label)}" loading="lazy" />`}
        <span class="media-badge"><i class="ph ${isVideo ? "ph-play" : mediaCount > 1 ? "ph-stack" : "ph-image"}"></i>${isVideo ? "视频" : mediaCount > 1 ? `${mediaCount} 项` : "照片"}</span>
      </div>` : ""}
      <div class="card-copy">
        <div class="card-tags">${(post.tags || []).slice(0, 2).map(tag => `<span>#${escapeHTML(tag)}</span>`).join("")}</div>
        ${hasTitle ? `<h3 class="card-title">${escapeHTML(post.title)}</h3>` : ""}
        ${excerpt ? `<p class="card-excerpt${hasTitle ? "" : " standalone"}">${escapeHTML(excerpt)}</p>` : ""}
        <footer class="card-footer">
          ${avatarHTML(post.avatarSeed)}
          <span class="card-author">${escapeHTML(post.author)}</span>
          <span class="card-stats">
            <span class="${liked ? "liked" : ""}"><i class="ph${liked ? "-fill" : ""} ph-heart"></i>${post.likeCount || 0}</span>
            <span><i class="ph ph-chat-circle"></i>${post.commentCount || 0}</span>
            ${saved ? `<span class="saved"><i class="ph-fill ph-bookmark-simple"></i></span>` : ""}
          </span>
        </footer>
      </div>
    </article>`;
}

function renderFeed() {
  els.feed.innerHTML = state.posts.map(cardTemplate).join("");
  els.feedEmpty.hidden = state.posts.length > 0;
  els.loadMore.hidden = !state.hasMore || state.posts.length === 0;
  if (state.selectedDate) {
    const selected = parseDateKey(state.selectedDate);
    const count = postsByDate().get(state.selectedDate)?.length || state.posts.length;
    $("#feed-heading").textContent = `${selected.getMonth() + 1}月${selected.getDate()}日 · ${count}条记录`;
  } else {
    $("#feed-heading").textContent = THEME_COPY[document.body.dataset.theme || "diary"].heading;
  }
  els.feedSummary.textContent = state.backend
    ? `已同步 ${state.posts.length} 条记录${state.selectedDate ? " · 正在按日期回看" : ""}${state.query ? ` · 搜索“${state.query}”` : ""}`
    : `静态档案 · 已翻到 ${state.posts.length} 条记录`;
}

function staticMatches(post) {
  const query = state.query.toLowerCase();
  const text = `${post.title} ${post.body} ${post.author} ${(post.tags || []).join(" ")}`.toLowerCase();
  if (query && !text.includes(query)) return false;
  if (state.tag && !(post.tags || []).includes(state.tag)) return false;
  const created = new Date(post.createdAt).getTime();
  if (state.selectedDate && dateKey(post.createdAt) !== state.selectedDate) return false;
  if (state.dateRange === "today" && created < Date.now() - 86_400_000) return false;
  if (state.dateRange === "week" && created < Date.now() - 7 * 86_400_000) return false;
  if (state.dateRange === "month" && created < Date.now() - 31 * 86_400_000) return false;
  return true;
}

async function loadStaticPosts(reset = true) {
  if (!state.staticPosts.length) {
    const response = await fetch("../pig-posts.json");
    if (!response.ok) throw new Error("静态帖子加载失败");
    const pigPosts = (await response.json()).map(normalizePigPost);
    state.staticPosts = mixPosts(pigPosts, FRIEND_POSTS);
  }
  if (reset) {
    state.page = 0;
    state.posts = [];
  }
  const filtered = state.staticPosts.filter(staticMatches);
  const start = state.page * PAGE_SIZE;
  state.posts.push(...filtered.slice(start, start + PAGE_SIZE));
  state.page += 1;
  state.hasMore = start + PAGE_SIZE < filtered.length;
  renderFeed();
}

function applyBackendFilters(query) {
  let result = query.eq("status", "published");
  const cleanSearch = state.query.replace(/[%_,()]/g, " ").trim();
  if (cleanSearch) result = result.or(`title.ilike.%${cleanSearch}%,body.ilike.%${cleanSearch}%,author_name.ilike.%${cleanSearch}%`);
  if (state.tag) result = result.contains("tags", [state.tag]);
  if (state.selectedDate) {
    const start = parseDateKey(state.selectedDate);
    result = result.gte("created_at", start.toISOString()).lt("created_at", nextDate(start).toISOString());
  } else if (state.dateRange !== "all") {
    const days = { today: 1, week: 7, month: 31 }[state.dateRange];
    result = result.gte("created_at", new Date(Date.now() - days * 86_400_000).toISOString());
  }
  return result;
}

async function loadBackendPosts(reset = true) {
  if (reset) {
    state.page = 0;
    state.posts = [];
  }
  const from = state.page * PAGE_SIZE;
  // Fetch one extra row so the button only appears when another page exists.
  const to = from + PAGE_SIZE;
  let query = state.client
    .from("posts")
    .select(`id,legacy_key,title,body,tags,author_id,author_name,avatar_seed,created_at,status,
      profile:profiles!posts_author_id_fkey(display_name,avatar_seed,role),
      media:post_media(id,media_kind,public_url,storage_path,poster_url,sort_order),
      comments(count),likes:post_likes(count)`)
    .order("created_at", { ascending: false })
    .range(from, to);
  query = applyBackendFilters(query);
  const { data, error } = await query;
  if (error) throw error;
  const rows = data || [];
  const mapped = rows.slice(0, PAGE_SIZE).map(mapDbPost);
  state.posts.push(...mapped);
  state.page += 1;
  state.hasMore = rows.length > PAGE_SIZE;
  await loadLikedIds(mapped.map(post => post.id));
  renderFeed();
}

async function loadLikedIds(postIds) {
  if (!state.user || !postIds.length) return;
  const { data } = await state.client.from("post_likes").select("post_id").eq("user_id", state.user.id).in("post_id", postIds);
  for (const item of data || []) state.likedPostIds.add(item.post_id);
}

async function refreshFeed() {
  if (state.loading) return;
  state.loading = true;
  renderSkeletons();
  try {
    if (state.backend) await loadBackendPosts(true);
    else await loadStaticPosts(true);
  } catch (error) {
    console.warn(error);
    setBackendMode(false, "多人数据暂时不可用，已切换到静态档案。");
    await loadStaticPosts(true);
  } finally {
    state.loading = false;
  }
}

async function loadMore() {
  if (state.loading || !state.hasMore) return;
  state.loading = true;
  els.loadMore.disabled = true;
  try {
    if (state.backend) await loadBackendPosts(false);
    else await loadStaticPosts(false);
  } catch (error) {
    showToast(error.message || "加载失败，请再试一次", "error", "ph-warning-circle");
  } finally {
    state.loading = false;
    els.loadMore.disabled = false;
  }
}

function renderMedia() {
  const post = state.activePost;
  if (!post) return;
  const media = post.media || [];
  const current = media[state.activeMedia];
  els.mediaStage.classList.remove("zoomed");
  if (!current) {
    const title = post.title || "今天的文字日记";
    const body = post.body || "这一天安安静静地被记录下来了。";
    els.mediaStage.innerHTML = `
      <article class="text-detail-note" aria-label="纯文字日记预览">
        <span>TEXT ONLY</span>
        <h3>${escapeHTML(title)}</h3>
        <p>${escapeHTML(body)}</p>
      </article>`;
    els.mediaPrev.hidden = true;
    els.mediaNext.hidden = true;
    els.mediaCount.hidden = true;
    $("#media-zoom").hidden = true;
    return;
  }
  const url = assetUrl(current.url);
  const label = postLabel(post);
  els.mediaStage.innerHTML = current.kind === "video"
    ? `<video src="${escapeHTML(url)}" poster="${escapeHTML(assetUrl(current.posterUrl || ""))}" controls playsinline preload="metadata"></video>`
    : `<img src="${escapeHTML(url)}" alt="${escapeHTML(label)} · 第 ${state.activeMedia + 1} 项" title="点击查看原图尺寸" />`;
  const zoomButton = $("#media-zoom");
  zoomButton.hidden = current.kind !== "image";
  zoomButton.innerHTML = `<i class="ph ph-arrows-out"></i><span>原图</span>`;
  const multiple = media.length > 1;
  els.mediaPrev.hidden = !multiple;
  els.mediaNext.hidden = !multiple;
  els.mediaCount.hidden = !multiple;
  els.mediaCount.textContent = `${state.activeMedia + 1} / ${media.length}`;
}

function stopActiveVideo() {
  els.mediaStage.querySelector("video")?.pause();
}

function toggleMediaZoom() {
  const image = els.mediaStage.querySelector("img");
  if (!image) return;
  const zoomed = els.mediaStage.classList.toggle("zoomed");
  const button = $("#media-zoom");
  button.innerHTML = zoomed
    ? `<i class="ph ph-arrows-in"></i><span>适应</span>`
    : `<i class="ph ph-arrows-out"></i><span>原图</span>`;
  image.title = zoomed ? "点击恢复适应窗口" : "点击查看原图尺寸";
}

function changeMedia(delta) {
  if (!state.activePost?.media?.length) return;
  stopActiveVideo();
  state.activeMedia = (state.activeMedia + delta + state.activePost.media.length) % state.activePost.media.length;
  renderMedia();
}

function renderDetail(post) {
  state.activePost = post;
  state.activeMedia = 0;
  $("#detail-avatar").setAttribute("style", avatarPalette(post.avatarSeed));
  $("#detail-avatar").innerHTML = `<i class="ph-fill ph-piggy-bank"></i>`;
  $("#detail-author").textContent = post.author;
  $("#detail-date").textContent = `${formatDate(post.createdAt, true)} · 懂猪帝日记`;
  const hasMedia = Boolean(post.media?.length);
  const detailTitle = $("#detail-title");
  const detailBody = $("#detail-body");
  $("#detail-layer").classList.toggle("text-only", !hasMedia);
  $(".detail-media").hidden = false;
  detailTitle.textContent = post.title || "";
  detailTitle.hidden = !String(post.title || "").trim();
  detailBody.textContent = post.body || "";
  detailBody.hidden = !String(post.body || "").trim();
  $("#detail-tags").innerHTML = (post.tags || []).map(tag => `<span>#${escapeHTML(tag)}</span>`).join("");
  updateDetailActions();
  renderMedia();
}

function updateDetailActions() {
  const post = state.activePost;
  if (!post) return;
  const liked = state.likedPostIds.has(post.id);
  const saved = state.bookmarks.has(post.id);
  $("#detail-like").classList.toggle("active", liked);
  $("#detail-like").innerHTML = `<i class="ph${liked ? "-fill" : ""} ph-heart"></i><span>${post.likeCount || 0} 赞</span>`;
  $("#detail-save").classList.toggle("active", saved);
  $("#detail-save").innerHTML = `<i class="ph${saved ? "-fill" : ""} ph-bookmark-simple"></i><span>${saved ? "已收藏" : "收藏"}</span>`;
}

async function openPost(post) {
  if (!post) return;
  renderDetail(post);
  state.comments = [];
  renderComments();
  openLayer("detail");
  await loadComments(post.id);
}

async function loadComments(postId) {
  if (!state.backend || state.activePost?.source !== "db") {
    state.comments = [];
    renderComments(true);
    return;
  }
  const { data, error } = await state.client
    .from("comments")
    .select(`id,post_id,author_id,parent_id,body,status,created_at,updated_at,
      profile:profiles!comments_author_id_fkey(display_name,avatar_seed,role)`)
    .eq("post_id", postId)
    .eq("status", "published")
    .order("created_at", { ascending: true });
  if (error) {
    showToast("评论加载失败", "error", "ph-warning-circle");
    return;
  }
  state.comments = data || [];
  renderComments();
}

function commentTemplate(comment, replies = []) {
  const profile = comment.profile || {};
  const canEdit = state.user?.id === comment.author_id;
  const canDelete = canEdit || state.isAdmin;
  return `
    <article class="comment-item" data-comment-id="${escapeHTML(comment.id)}">
      ${avatarHTML(profile.avatar_seed || comment.author_id)}
      <div class="comment-main">
        <div class="comment-meta"><strong>${escapeHTML(profile.display_name || "匿名小猪")}</strong><time>${formatDate(comment.created_at)}</time></div>
        <p>${escapeHTML(comment.body)}</p>
        <div class="comment-actions">
          ${comment.parent_id ? "" : `<button type="button" data-comment-action="reply">回复</button>`}
          ${canEdit ? `<button type="button" data-comment-action="edit">编辑</button>` : ""}
          ${canDelete ? `<button type="button" data-comment-action="delete">删除</button>` : `<button type="button" data-comment-action="report">举报</button>`}
        </div>
        ${replies.length ? `<div class="comment-replies">${replies.map(reply => commentTemplate(reply)).join("")}</div>` : ""}
      </div>
    </article>`;
}

function renderComments(readOnly = false) {
  const roots = state.comments.filter(comment => !comment.parent_id);
  els.commentsList.innerHTML = roots.map(root => commentTemplate(root, state.comments.filter(comment => comment.parent_id === root.id))).join("");
  els.commentsEmpty.hidden = state.comments.length > 0;
  if (readOnly) els.commentsEmpty.innerHTML = `<i class="ph ph-cloud-slash"></i><p>静态浏览模式暂不读取评论。</p>`;
  else els.commentsEmpty.innerHTML = `<i class="ph ph-chat-circle-dots"></i><p>还没有评论，来当第一只说话的小猪。</p>`;
  $("#comment-count").textContent = `${state.comments.length} 条`;
  els.commentInput.disabled = readOnly;
  els.commentInput.placeholder = readOnly ? "配置 Supabase 后即可评论" : "说点软乎乎的话……";
  updateCommentSubmitState();
}

function updateCommentSubmitState() {
  $(".comment-submit").disabled = els.commentInput.disabled || !els.commentInput.value.trim();
}

async function submitComment(event) {
  event.preventDefault();
  const body = els.commentInput.value.trim();
  if (!body) return;
  if (!(await ensureIdentity())) return;
  const payload = {
    post_id: state.activePost.id,
    author_id: state.user.id,
    parent_id: state.replyTo?.id || null,
    body,
    status: "published"
  };
  const button = event.submitter || event.target.querySelector("button[type=submit]");
  button.disabled = true;
  const { error } = await state.client.from("comments").insert(payload);
  button.disabled = false;
  if (error) {
    showToast(error.message || "评论发送失败", "error", "ph-warning-circle");
    return;
  }
  els.commentInput.value = "";
  updateCommentSubmitState();
  clearReply();
  await loadComments(state.activePost.id);
  state.activePost.commentCount = state.comments.length;
  renderFeed();
}

function startReply(comment) {
  const name = comment.profile?.display_name || "匿名小猪";
  state.replyTo = comment.parent_id ? state.comments.find(item => item.id === comment.parent_id) : comment;
  $("#replying-bar").hidden = false;
  $("#replying-text").textContent = `回复 ${name}`;
  els.commentInput.focus();
}

function clearReply() {
  state.replyTo = null;
  $("#replying-bar").hidden = true;
}

function startCommentEdit(comment, item) {
  const main = item.querySelector(".comment-main");
  if (main.querySelector(".comment-edit-form")) return;
  const form = document.createElement("form");
  form.className = "comment-edit-form";
  form.innerHTML = `<textarea maxlength="500">${escapeHTML(comment.body)}</textarea><div><button type="submit">保存</button><button type="button" data-cancel-edit>取消</button></div>`;
  main.appendChild(form);
  form.querySelector("textarea").focus();
  form.querySelector("[data-cancel-edit]").addEventListener("click", () => form.remove());
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const body = form.querySelector("textarea").value.trim();
    if (!body) return;
    const { error } = await state.client.from("comments").update({ body }).eq("id", comment.id);
    if (error) showToast("评论修改失败", "error", "ph-warning-circle");
    else await loadComments(state.activePost.id);
  });
}

async function deleteComment(comment) {
  if (!window.confirm("确定删除这条评论吗？")) return;
  const action = state.isAdmin && comment.author_id !== state.user?.id
    ? state.client.from("comments").update({ status: "hidden" }).eq("id", comment.id)
    : state.client.from("comments").delete().eq("id", comment.id);
  const { error } = await action;
  if (error) showToast("评论删除失败", "error", "ph-warning-circle");
  else await loadComments(state.activePost.id);
}

async function createReport(targetType, targetId) {
  if (!(await ensureIdentity())) return;
  const { error } = await state.client.from("reports").insert({
    reporter_id: state.user.id,
    target_type: targetType,
    target_id: targetId,
    reason: "用户举报"
  });
  showToast(error ? "举报提交失败" : "已提交给管理员处理", error ? "error" : "success", error ? "ph-warning-circle" : "ph-check-circle");
}

async function toggleLike() {
  const post = state.activePost;
  if (!post || !(await ensureIdentity())) return;
  const liked = state.likedPostIds.has(post.id);
  const query = liked
    ? state.client.from("post_likes").delete().eq("post_id", post.id).eq("user_id", state.user.id)
    : state.client.from("post_likes").insert({ post_id: post.id, user_id: state.user.id });
  const { error } = await query;
  if (error) {
    showToast("点赞没有成功，请再试一次", "error", "ph-warning-circle");
    return;
  }
  if (liked) {
    state.likedPostIds.delete(post.id);
    post.likeCount = Math.max(0, post.likeCount - 1);
  } else {
    state.likedPostIds.add(post.id);
    post.likeCount += 1;
  }
  updateDetailActions();
  renderFeed();
}

function toggleBookmark() {
  const id = state.activePost?.id;
  if (!id) return;
  if (state.bookmarks.has(id)) state.bookmarks.delete(id);
  else state.bookmarks.add(id);
  localStorage.setItem(BOOKMARK_KEY, JSON.stringify([...state.bookmarks]));
  updateDetailActions();
  renderFeed();
}

function backendConfigured() {
  return Boolean(window.supabase?.createClient && /^https:\/\/.+\.supabase\.co$/.test(CONFIG.supabaseUrl || "") && CONFIG.supabasePublishableKey);
}

async function loadCurrentProfile() {
  if (!state.user) return null;
  const { data } = await state.client.from("profiles").select("id,display_name,avatar_seed,role").eq("id", state.user.id).maybeSingle();
  state.profile = data || null;
  state.isAdmin = data?.role === "admin";
  updateProfileButton();
  return data;
}

function updateProfileButton() {
  const button = $("#profile-button");
  if (state.profile?.display_name) {
    button.innerHTML = `<span class="avatar" style="${avatarPalette(state.profile.avatar_seed)}"><i class="ph-fill ph-piggy-bank"></i></span>`;
    button.title = state.profile.display_name;
  } else {
    button.innerHTML = `<i class="ph ph-user-circle"></i>`;
    button.title = "个人资料";
  }
}

async function openProfileDialog(required = false) {
  if (!state.backend) {
    showToast("配置 Supabase 后才能创建匿名身份", "error", "ph-cloud-slash");
    return false;
  }
  $("#profile-name").value = state.profile?.display_name || "";
  const seed = state.profile?.avatar_seed || crypto.randomUUID();
  $("#profile-avatar-preview").dataset.seed = seed;
  $("#profile-avatar-preview").setAttribute("style", avatarPalette(seed));
  $("#profile-avatar-preview").innerHTML = `<i class="ph-fill ph-piggy-bank"></i>`;
  renderTurnstile();
  openLayer("profile");
  if (!required) return true;
  return new Promise(resolve => { state.profileResolver = resolve; });
}

function renderTurnstile() {
  const slot = $("#turnstile-slot");
  slot.innerHTML = "";
  state.captchaToken = null;
  if (!CONFIG.turnstileSiteKey || !window.turnstile) return;
  state.captchaWidget = window.turnstile.render(slot, {
    sitekey: CONFIG.turnstileSiteKey,
    theme: "light",
    callback: token => { state.captchaToken = token; }
  });
}

async function saveProfile(event) {
  event.preventDefault();
  const name = $("#profile-name").value.trim();
  if (!name) return;
  if (CONFIG.turnstileSiteKey && !state.captchaToken && !state.user) {
    showToast("请先完成人机验证", "error", "ph-shield-warning");
    return;
  }
  const submit = event.submitter;
  submit.disabled = true;
  try {
    if (!state.user) {
      const options = state.captchaToken ? { captchaToken: state.captchaToken } : undefined;
      const { data, error } = await state.client.auth.signInAnonymously({ options });
      if (error) throw error;
      state.user = data.user;
    }
    const avatarSeed = $("#profile-avatar-preview").dataset.seed || crypto.randomUUID();
    const { data, error } = await state.client.from("profiles").update({
      display_name: name,
      avatar_seed: avatarSeed
    }).eq("id", state.user.id).select("id,display_name,avatar_seed,role").single();
    if (error) throw error;
    state.profile = data;
    state.isAdmin = data.role === "admin";
    updateProfileButton();
    const resolver = state.profileResolver;
    state.profileResolver = null;
    closeLayer("profile");
    resolver?.(true);
    showToast("匿名身份已保存", "success", "ph-check-circle");
  } catch (error) {
    showToast(error.message || "身份保存失败", "error", "ph-warning-circle");
  } finally {
    submit.disabled = false;
  }
}

async function ensureIdentity() {
  if (!state.backend) {
    showToast("当前是静态浏览模式，配置 Supabase 后即可互动", "error", "ph-cloud-slash");
    return false;
  }
  if (state.user && state.profile?.display_name && state.profile.display_name !== "匿名小猪") return true;
  return openProfileDialog(true);
}

function cleanupSelectedFiles() {
  for (const item of state.selectedFiles) URL.revokeObjectURL(item.previewUrl);
  state.selectedFiles = [];
  els.mediaInput.value = "";
  renderFilePreviews();
}

async function videoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("无法读取视频"));
    };
    video.src = url;
  });
}

async function addFiles(files) {
  const next = [...files];
  const existingImages = state.selectedFiles.filter(item => item.kind === "image").length;
  const existingVideos = state.selectedFiles.filter(item => item.kind === "video").length;
  const imageFiles = next.filter(file => file.type.startsWith("image/"));
  const videoFiles = next.filter(file => file.type.startsWith("video/"));
  if (existingImages + imageFiles.length > IMAGE_LIMIT) return showToast("最多选择 9 张图片", "error", "ph-warning-circle");
  if (existingVideos + videoFiles.length > VIDEO_LIMIT) return showToast("每条帖子最多 1 个视频", "error", "ph-warning-circle");
  for (const file of next) {
    if (!/^(image\/(jpeg|png|webp)|video\/(mp4|webm))$/.test(file.type)) {
      showToast(`${file.name} 的格式暂不支持`, "error", "ph-warning-circle");
      continue;
    }
    const kind = file.type.startsWith("video/") ? "video" : "image";
    if (kind === "video") {
      if (file.size > VIDEO_MAX_BYTES) {
        showToast(`${file.name} 超过 50MB`, "error", "ph-warning-circle");
        continue;
      }
      try {
        if (await videoDuration(file) > VIDEO_MAX_SECONDS) {
          showToast(`${file.name} 超过 60 秒`, "error", "ph-warning-circle");
          continue;
        }
      } catch (error) {
        showToast(error.message, "error", "ph-warning-circle");
        continue;
      }
    }
    state.selectedFiles.push({ file, kind, previewUrl: URL.createObjectURL(file) });
  }
  renderFilePreviews();
}

function renderFilePreviews() {
  els.mediaPreviews.innerHTML = state.selectedFiles.map((item, index) => `
    <div class="media-preview" data-file-index="${index}">
      ${item.kind === "video" ? `<video src="${item.previewUrl}" muted></video>` : `<img src="${item.previewUrl}" alt="待上传图片 ${index + 1}" />`}
      <button type="button" data-remove-file="${index}" aria-label="移除 ${escapeHTML(item.file.name)}"><i class="ph ph-x"></i></button>
    </div>`).join("");
}

async function compressImage(file) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 2200 / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d", { alpha: false }).drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise(resolve => canvas.toBlob(resolve, "image/webp", 0.84));
  if (!blob || blob.size >= file.size) return file;
  return new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), { type: "image/webp" });
}

function safeFileName(name) {
  const extension = (name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${crypto.randomUUID()}.${extension || "bin"}`;
}

function setProgress(label, percent) {
  els.uploadProgress.hidden = false;
  $("#progress-label").textContent = label;
  $("#progress-percent").textContent = `${Math.round(percent)}%`;
  $("#progress-bar").value = percent;
}

async function uploadStandard(path, file) {
  const { error } = await state.client.storage.from("post-media").upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000",
    upsert: false
  });
  if (error) throw error;
}

async function uploadTus(path, file, progressCallback) {
  if (!window.tus?.Upload) throw new Error("可恢复上传组件没有加载");
  const { data: { session } } = await state.client.auth.getSession();
  if (!session?.access_token) throw new Error("匿名会话已失效");
  const projectId = new URL(CONFIG.supabaseUrl).hostname.split(".")[0];
  await new Promise((resolve, reject) => {
    const upload = new window.tus.Upload(file, {
      endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: { authorization: `Bearer ${session.access_token}` },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: "post-media",
        objectName: path,
        contentType: file.type,
        cacheControl: "31536000"
      },
      onError: reject,
      onProgress: (uploaded, total) => progressCallback((uploaded / total) * 100),
      onSuccess: resolve
    });
    upload.findPreviousUploads().then(previous => {
      if (previous[0]) upload.resumeFromPreviousUpload(previous[0]);
      upload.start();
    }).catch(reject);
  });
}

async function uploadMedia(postId) {
  const uploadedPaths = [];
  const rows = [];
  for (let index = 0; index < state.selectedFiles.length; index += 1) {
    const selected = state.selectedFiles[index];
    const file = selected.kind === "image" ? await compressImage(selected.file) : selected.file;
    const path = `${state.user.id}/${postId}/${safeFileName(file.name)}`;
    const base = (index / state.selectedFiles.length) * 100;
    const share = 100 / state.selectedFiles.length;
    setProgress(`正在上传 ${index + 1} / ${state.selectedFiles.length}`, base);
    if (file.size > LARGE_UPLOAD_THRESHOLD) {
      await uploadTus(path, file, current => setProgress(`正在上传 ${index + 1} / ${state.selectedFiles.length}`, base + (current / 100) * share));
    } else {
      await uploadStandard(path, file);
      setProgress(`已上传 ${index + 1} / ${state.selectedFiles.length}`, base + share);
    }
    uploadedPaths.push(path);
    const { data } = state.client.storage.from("post-media").getPublicUrl(path);
    rows.push({
      post_id: postId,
      owner_id: state.user.id,
      storage_path: path,
      public_url: data.publicUrl,
      media_kind: selected.kind,
      mime_type: file.type,
      size_bytes: file.size,
      sort_order: index
    });
  }
  return { rows, uploadedPaths };
}

async function submitPost(event) {
  event.preventDefault();
  if (!(await ensureIdentity())) return;
  const title = $("#post-title").value.trim();
  const body = $("#post-body").value.trim();
  const tags = $$('input[name="tags"]:checked').map(input => input.value).slice(0, 3);
  const hasExistingMedia = Boolean(state.editingPost?.media?.length);
  if (!title && !body && !state.selectedFiles.length && !hasExistingMedia) {
    showToast("写点文字或选择一张图片再发布吧", "error", "ph-warning-circle");
    return;
  }
  const submit = $("#publish-submit");
  submit.disabled = true;
  let postId = state.editingPost?.id || null;
  let uploadedPaths = [];
  try {
    if (state.editingPost) {
      const { error } = await state.client.from("posts").update({ title, body, tags }).eq("id", postId);
      if (error) throw error;
      showToast("日记已经更新", "success", "ph-check-circle");
    } else {
      const { data: post, error } = await state.client.from("posts").insert({
        author_id: state.user.id,
        author_name: state.profile.display_name,
        avatar_seed: state.profile.avatar_seed,
        title,
        body,
        tags,
        status: "draft"
      }).select("id").single();
      if (error) throw error;
      postId = post.id;
      if (state.selectedFiles.length) {
        const uploaded = await uploadMedia(postId);
        uploadedPaths = uploaded.uploadedPaths;
        const { error: mediaError } = await state.client.from("post_media").insert(uploaded.rows);
        if (mediaError) throw mediaError;
      }
      const { error: publishError } = await state.client.from("posts").update({ status: "published" }).eq("id", postId);
      if (publishError) throw publishError;
      showToast("这条日记已经发布", "success", "ph-check-circle");
    }
    closeLayer("publish");
    resetPublishForm();
    await refreshFeed();
    await loadCalendarPosts();
  } catch (error) {
    if (uploadedPaths.length) await state.client.storage.from("post-media").remove(uploadedPaths);
    if (postId && !state.editingPost) await state.client.from("posts").delete().eq("id", postId);
    showToast(error.message || "发布失败，请重试", "error", "ph-warning-circle");
    setProgress("上传失败，可以重新发布", 0);
  } finally {
    submit.disabled = false;
  }
}

function resetPublishForm() {
  els.publishForm.reset();
  cleanupSelectedFiles();
  state.editingPost = null;
  $("#publish-title").textContent = "记录今天";
  $("#publish-submit").textContent = "发布这条日记";
  $(".media-upload").hidden = false;
  els.uploadProgress.hidden = true;
}

async function openPublish(post = null) {
  if (!(await ensureIdentity())) return;
  resetPublishForm();
  state.editingPost = post;
  if (post) {
    $("#publish-title").textContent = "修改这条日记";
    $("#publish-submit").textContent = "保存修改";
    $("#post-title").value = post.title;
    $("#post-body").value = post.body;
    for (const input of $$('input[name="tags"]')) input.checked = post.tags.includes(input.value);
    $(".media-upload").hidden = true;
  }
  openLayer("publish");
}

async function deletePost(post) {
  if (!window.confirm(state.isAdmin && post.authorId !== state.user?.id ? "确定隐藏这条帖子吗？" : "确定删除这条帖子及媒体吗？")) return;
  let error;
  if (state.isAdmin && post.authorId !== state.user?.id) {
    ({ error } = await state.client.from("posts").update({ status: "hidden" }).eq("id", post.id));
  } else {
    const paths = post.media.map(item => item.storagePath).filter(Boolean);
    if (paths.length) await state.client.storage.from("post-media").remove(paths);
    ({ error } = await state.client.from("posts").delete().eq("id", post.id));
  }
  if (error) showToast("帖子删除失败", "error", "ph-warning-circle");
  else {
    closeLayer("detail");
    showToast("帖子已移出日记", "success", "ph-check-circle");
    await refreshFeed();
    await loadCalendarPosts();
  }
}

function showPostMenu(button) {
  const post = state.activePost;
  if (!post) return;
  const owner = state.user?.id === post.authorId;
  const canModerate = state.isAdmin;
  const actions = [];
  if (owner) actions.push(["edit-post", "ph-pencil-simple", "编辑帖子", ""]);
  if (owner || canModerate) actions.push(["delete-post", "ph-trash", owner ? "删除帖子" : "隐藏帖子", "danger"]);
  if (!owner) actions.push(["report-post", "ph-flag", "举报帖子", ""]);
  els.actionMenu.innerHTML = actions.map(action => `<button type="button" data-menu-action="${action[0]}" class="${action[3]}"><i class="ph ${action[1]}"></i>${action[2]}</button>`).join("");
  const rect = button.getBoundingClientRect();
  els.actionMenu.style.top = `${Math.min(window.innerHeight - 170, rect.bottom + 6)}px`;
  els.actionMenu.style.left = `${Math.max(10, rect.right - 150)}px`;
  els.actionMenu.hidden = false;
}

async function openAdmin() {
  if (!state.backend) {
    showToast("请先配置 Supabase", "error", "ph-cloud-slash");
    return;
  }
  openLayer("admin");
  $("#admin-login-view").hidden = state.isAdmin;
  $("#admin-content-view").hidden = !state.isAdmin;
  if (state.isAdmin) await loadAdminReports();
}

async function sendAdminLink(event) {
  event.preventDefault();
  const email = $("#admin-email").value.trim();
  const redirect = `${location.origin}${location.pathname}?admin=1`;
  const button = $("#admin-send-button");
  button.disabled = true;
  button.textContent = "发送中";
  const { error } = await state.client.auth.signInWithOtp({ email, options: { emailRedirectTo: redirect, shouldCreateUser: true } });
  button.disabled = false;
  button.textContent = "重新发送";
  const message = error?.message?.toLowerCase().includes("rate")
    ? "邮件发送太频繁了，请等几分钟后再试"
    : error?.message || "验证码已发送，请检查邮箱";
  if (!error) {
    $("#admin-verify-form").hidden = false;
    $("#admin-token").focus();
  }
  showToast(error ? message : "验证码已发送，请检查邮箱", error ? "error" : "success", error ? "ph-warning-circle" : "ph-envelope-simple");
}

async function verifyAdminCode(event) {
  event.preventDefault();
  const email = $("#admin-email").value.trim();
  const token = $("#admin-token").value.trim().replace(/\s+/g, "");
  if (!/^\d{6}$/.test(token)) {
    showToast("请输入邮件里的 6 位验证码", "error", "ph-warning-circle");
    return;
  }
  const submit = event.submitter || $("#admin-verify-form button[type='submit']");
  submit.disabled = true;
  submit.textContent = "验证中";
  const { data, error } = await state.client.auth.verifyOtp({ email, token, type: "email" });
  submit.disabled = false;
  submit.textContent = "验证进入";
  if (error) {
    const message = error.message?.toLowerCase().includes("expired") ? "验证码已过期，请重新发送" : error.message || "验证码验证失败";
    showToast(message, "error", "ph-warning-circle");
    return;
  }
  state.user = data.user || null;
  if (state.user) await loadCurrentProfile();
  if (!state.isAdmin) {
    showToast("邮箱已登录，但还没有管理员权限。请先在 Supabase 将这个邮箱设为 admin。", "error", "ph-shield-warning");
    return;
  }
  $("#admin-login-view").hidden = true;
  $("#admin-content-view").hidden = false;
  showToast("管理员登录成功", "success", "ph-shield-check");
  await loadAdminReports();
}

async function loadAdminReports() {
  const { data, error } = await state.client.from("reports").select("id,target_type,target_id,reason,status,created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(50);
  if (error) return showToast("举报列表加载失败", "error", "ph-warning-circle");
  $("#admin-summary").innerHTML = `
    <div><strong>${data.length}</strong><span>待处理举报</span></div>
    <div><strong>${state.posts.length}</strong><span>当前页帖子</span></div>
    <div><strong>在线</strong><span>管理员权限</span></div>`;
  $("#admin-list").innerHTML = data.length ? data.map(item => `
    <div class="admin-list-item" data-report-id="${item.id}">
      <div><strong>${item.target_type === "post" ? "帖子举报" : "评论举报"}</strong><p>${escapeHTML(item.reason)} · ${formatDate(item.created_at)}</p></div>
      <button type="button" data-resolve-report="${item.id}">标记已处理</button>
    </div>`).join("") : `<div class="comments-empty"><i class="ph ph-check-circle"></i><p>暂时没有待处理举报</p></div>`;
}

async function resolveReport(id) {
  const { error } = await state.client.from("reports").update({ status: "resolved", resolved_at: new Date().toISOString(), resolved_by: state.user.id }).eq("id", id);
  if (error) showToast("处理失败", "error", "ph-warning-circle");
  else await loadAdminReports();
}

async function loadAdminPosts() {
  $("#admin-summary").innerHTML = `<div><strong>加载中</strong><span>正在整理所有帖子</span></div>`;
  $("#admin-list").innerHTML = `<div class="comments-empty"><i class="ph ph-spinner-gap"></i><p>正在翻管理员账本……</p></div>`;
  const { data, error } = await state.client
    .from("posts")
    .select(`id,legacy_key,title,body,tags,author_id,author_name,avatar_seed,created_at,status,
      profile:profiles!posts_author_id_fkey(display_name,avatar_seed,role),
      media:post_media(id,media_kind,public_url,storage_path,poster_url,sort_order),
      comments(count),likes:post_likes(count)`)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) return showToast("帖子管理列表加载失败", "error", "ph-warning-circle");
  const posts = (data || []).map(mapDbPost);
  const hidden = posts.filter(post => post.status === "hidden").length;
  const published = posts.length - hidden;
  $("#admin-summary").innerHTML = `
    <div><strong>${posts.length}</strong><span>最近帖子</span></div>
    <div><strong>${published}</strong><span>公开显示</span></div>
    <div><strong>${hidden}</strong><span>已隐藏</span></div>`;
  $("#admin-list").innerHTML = posts.length ? posts.map(adminPostTemplate).join("") : `<div class="comments-empty"><i class="ph ph-tray"></i><p>还没有数据库帖子</p></div>`;
}

function adminPostTemplate(post) {
  const cover = post.media?.find(item => item.kind === "image" || item.posterUrl);
  const thumb = cover ? assetUrl(cover.posterUrl || cover.url) : "";
  const statusLabel = post.status === "hidden" ? "已隐藏" : "公开中";
  const statusIcon = post.status === "hidden" ? "ph-eye-slash" : "ph-eye";
  return `<article class="admin-post-item${post.status === "hidden" ? " hidden-post" : ""}" data-admin-post="${escapeHTML(post.id)}">
    ${thumb ? `<img class="admin-post-thumb" src="${escapeHTML(thumb)}" alt="" loading="lazy" />` : `<div class="admin-post-thumb text"><i class="ph ph-note-pencil"></i></div>`}
    <div class="admin-post-main">
      <div class="admin-post-meta"><span><i class="ph ${statusIcon}"></i>${statusLabel}</span><span>${formatDate(post.createdAt, true)}</span><span>${escapeHTML(post.author)}</span></div>
      <h3>${escapeHTML(postLabel(post))}</h3>
      <p>${escapeHTML(postExcerpt(post, 90))}</p>
      <small><i class="ph ph-heart"></i>${post.likeCount || 0}　<i class="ph ph-chat-circle"></i>${post.commentCount || 0}　${(post.tags || []).slice(0, 3).map(tag => `#${escapeHTML(tag)}`).join(" ")}</small>
    </div>
    <div class="admin-post-actions">
      <button type="button" data-admin-open-post="${escapeHTML(post.id)}">打开</button>
      <button type="button" data-admin-toggle-post="${escapeHTML(post.id)}" data-next-status="${post.status === "hidden" ? "published" : "hidden"}">${post.status === "hidden" ? "恢复" : "隐藏"}</button>
      <button class="danger" type="button" data-admin-delete-post="${escapeHTML(post.id)}">删除</button>
    </div>
  </article>`;
}

async function setAdminTab(tab) {
  $$(".admin-tabs button").forEach(button => button.classList.toggle("active", button.dataset.adminTab === tab));
  if (tab === "posts") await loadAdminPosts();
  else await loadAdminReports();
}

async function getAdminPost(id) {
  const { data, error } = await state.client
    .from("posts")
    .select(`id,legacy_key,title,body,tags,author_id,author_name,avatar_seed,created_at,status,
      profile:profiles!posts_author_id_fkey(display_name,avatar_seed,role),
      media:post_media(id,media_kind,public_url,storage_path,poster_url,sort_order),
      comments(count),likes:post_likes(count)`)
    .eq("id", id)
    .single();
  if (error) {
    showToast("帖子读取失败", "error", "ph-warning-circle");
    return null;
  }
  return mapDbPost(data);
}

async function toggleAdminPost(id, status) {
  const confirmText = status === "hidden" ? "确定隐藏这条帖子吗？普通访客将看不到它。" : "确定恢复这条帖子为公开吗？";
  if (!window.confirm(confirmText)) return;
  const { error } = await state.client.from("posts").update({ status }).eq("id", id);
  if (error) return showToast("帖子状态更新失败", "error", "ph-warning-circle");
  showToast(status === "hidden" ? "帖子已隐藏" : "帖子已恢复公开", "success", "ph-check-circle");
  await loadAdminPosts();
  await refreshFeed();
  await loadCalendarPosts();
}

async function hardDeleteAdminPost(id) {
  if (!window.confirm("确定永久删除这条帖子吗？这会同时删除数据库记录，无法撤销。")) return;
  const post = await getAdminPost(id);
  if (!post) return;
  const paths = post.media.map(item => item.storagePath).filter(Boolean);
  if (paths.length) await state.client.storage.from("post-media").remove(paths);
  const { error } = await state.client.from("posts").delete().eq("id", id);
  if (error) return showToast("永久删除失败", "error", "ph-warning-circle");
  showToast("帖子已永久删除", "success", "ph-check-circle");
  await loadAdminPosts();
  await refreshFeed();
  await loadCalendarPosts();
}

function subscribeRealtime() {
  if (!state.backend) return;
  state.realtime?.unsubscribe();
  state.realtime = state.client.channel("dzd-live")
    .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, scheduleRealtimeRefresh)
    .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, scheduleRealtimeRefresh)
    .on("postgres_changes", { event: "*", schema: "public", table: "comments" }, payload => {
      if (state.activePost && (!payload.new?.post_id || payload.new.post_id === state.activePost.id || payload.old?.post_id === state.activePost.id)) {
        loadComments(state.activePost.id);
      }
      scheduleRealtimeRefresh();
    })
    .subscribe();
}

function scheduleRealtimeRefresh() {
  window.clearTimeout(state.realtimeTimer);
  state.realtimeTimer = window.setTimeout(() => {
    refreshFeed();
    loadCalendarPosts();
  }, 550);
}

async function initializeBackend() {
  if (!backendConfigured()) return false;
  try {
    const params = new URLSearchParams(location.search);
    const adminMode = params.has("admin");
    state.client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabasePublishableKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    if (adminMode && params.has("code")) {
      const { error } = await state.client.auth.exchangeCodeForSession(location.href);
      if (error) throw error;
      history.replaceState(null, "", `${location.origin}${location.pathname}?admin=1`);
    }
    let { data: { session } } = await state.client.auth.getSession();
    if (!session && !CONFIG.turnstileSiteKey && !adminMode) {
      const { data, error } = await state.client.auth.signInAnonymously();
      if (error) throw error;
      session = data.session;
    }
    state.user = session?.user || null;
    if (state.user) await loadCurrentProfile();
    state.client.auth.onAuthStateChange((_event, nextSession) => {
      state.user = nextSession?.user || null;
      if (state.user) window.setTimeout(() => loadCurrentProfile(), 0);
    });
    setBackendMode(true);
    subscribeRealtime();
    return true;
  } catch (error) {
    console.warn(error);
    return false;
  }
}

function bindEvents() {
  let searchTimer;
  $$(".theme-tab").forEach(button => button.addEventListener("click", () => applyTheme(button.dataset.theme)));
  const scheduleSearch = () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      state.query = els.search.value.trim();
      refreshFeed();
    }, 280);
  };
  els.search.addEventListener("input", scheduleSearch);
  els.search.addEventListener("search", scheduleSearch);
  els.search.addEventListener("change", scheduleSearch);
  els.dateFilter.addEventListener("change", () => {
    state.selectedDate = null;
    state.dateRange = els.dateFilter.value;
    renderCalendars();
    refreshFeed();
  });
  $$(".tag-chip").forEach(button => button.addEventListener("click", () => {
    $$(".tag-chip").forEach(item => item.classList.toggle("active", item === button));
    state.tag = button.dataset.tag;
    refreshFeed();
  }));
  els.loadMore.addEventListener("click", loadMore);
  $("#offline-close").addEventListener("click", () => { els.offlineBanner.hidden = true; });
  $("#publish-button").addEventListener("click", () => openPublish());
  $("#calendar-open").addEventListener("click", openMemoryCalendar);
  $$("[data-calendar-shift]").forEach(button => button.addEventListener("click", () => shiftCalendarMonth(Number(button.dataset.calendarShift))));
  $("#calendar-today").addEventListener("click", () => goToToday(true));
  $("#memory-today").addEventListener("click", () => goToToday(false));
  $("#calendar-clear").addEventListener("click", clearCalendarSelection);
  $("#memory-view-day").addEventListener("click", viewDrawerDay);
  els.miniCalendarGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-calendar-date]");
    if (button) selectFeedDate(button.dataset.calendarDate);
  });
  els.memoryCalendarGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-memory-date]");
    if (!button) return;
    state.drawerDate = button.dataset.memoryDate;
    const selected = parseDateKey(state.drawerDate);
    if (selected.getMonth() !== state.calendarMonth.getMonth()) {
      state.calendarMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
      loadCalendarPosts();
    } else {
      renderCalendars();
    }
  });
  els.memoryDayList.addEventListener("click", event => {
    const item = event.target.closest("[data-memory-post]");
    if (!item) return;
    const post = state.calendarPosts.find(value => value.id === item.dataset.memoryPost);
    if (post) openPost(post);
  });
  $("#profile-button").addEventListener("click", () => state.backend ? openProfileDialog(false) : showToast("配置 Supabase 后即可创建匿名身份", "error", "ph-cloud-slash"));
  $("#admin-entry").addEventListener("click", openAdmin);
  $("#admin-login-form").addEventListener("submit", sendAdminLink);
  $("#admin-verify-form").addEventListener("submit", verifyAdminCode);
  els.publishForm.addEventListener("submit", submitPost);
  els.profileForm.addEventListener("submit", saveProfile);
  $("#comment-form").addEventListener("submit", submitComment);
  els.commentInput.addEventListener("input", updateCommentSubmitState);
  $("#reply-cancel").addEventListener("click", clearReply);
  els.mediaPrev.addEventListener("click", () => changeMedia(-1));
  els.mediaNext.addEventListener("click", () => changeMedia(1));
  $("#media-zoom").addEventListener("click", toggleMediaZoom);
  els.mediaStage.addEventListener("click", event => {
    if (event.target.matches("img")) toggleMediaZoom();
  });
  $("#detail-like").addEventListener("click", toggleLike);
  $("#detail-save").addEventListener("click", toggleBookmark);
  $("#detail-report").addEventListener("click", () => state.activePost && createReport("post", state.activePost.id));
  $("#post-menu-button").addEventListener("click", event => showPostMenu(event.currentTarget));
  els.mediaInput.addEventListener("change", event => addFiles(event.target.files));
  const drop = $("#upload-drop");
  drop.addEventListener("dragover", event => { event.preventDefault(); drop.classList.add("dragging"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("dragging"));
  drop.addEventListener("drop", event => { event.preventDefault(); drop.classList.remove("dragging"); addFiles(event.dataTransfer.files); });
  els.mediaPreviews.addEventListener("click", event => {
    const button = event.target.closest("[data-remove-file]");
    if (!button) return;
    const [removed] = state.selectedFiles.splice(Number(button.dataset.removeFile), 1);
    if (removed) URL.revokeObjectURL(removed.previewUrl);
    renderFilePreviews();
  });
  els.feed.addEventListener("click", event => {
    const card = event.target.closest("[data-post-id]");
    if (card) openPost(state.posts.find(post => post.id === card.dataset.postId));
  });
  els.feed.addEventListener("keydown", event => {
    if (!["Enter", " "].includes(event.key)) return;
    const card = event.target.closest("[data-post-id]");
    if (!card) return;
    event.preventDefault();
    openPost(state.posts.find(post => post.id === card.dataset.postId));
  });
  els.commentsList.addEventListener("click", event => {
    const button = event.target.closest("[data-comment-action]");
    const item = event.target.closest("[data-comment-id]");
    if (!button || !item) return;
    const comment = state.comments.find(value => value.id === item.dataset.commentId);
    if (!comment) return;
    const action = button.dataset.commentAction;
    if (action === "reply") startReply(comment);
    if (action === "edit") startCommentEdit(comment, item);
    if (action === "delete") deleteComment(comment);
    if (action === "report") createReport("comment", comment.id);
  });
  els.actionMenu.addEventListener("click", event => {
    const action = event.target.closest("[data-menu-action]")?.dataset.menuAction;
    els.actionMenu.hidden = true;
    if (action === "edit-post") { closeLayer("detail"); openPublish(state.activePost); }
    if (action === "delete-post") deletePost(state.activePost);
    if (action === "report-post") createReport("post", state.activePost.id);
  });
  $("#admin-list").addEventListener("click", event => {
    const id = event.target.closest("[data-resolve-report]")?.dataset.resolveReport;
    if (id) resolveReport(id);
    const openId = event.target.closest("[data-admin-open-post]")?.dataset.adminOpenPost;
    if (openId) getAdminPost(openId).then(post => post && openPost(post));
    const toggleButton = event.target.closest("[data-admin-toggle-post]");
    if (toggleButton) toggleAdminPost(toggleButton.dataset.adminTogglePost, toggleButton.dataset.nextStatus);
    const deleteId = event.target.closest("[data-admin-delete-post]")?.dataset.adminDeletePost;
    if (deleteId) hardDeleteAdminPost(deleteId);
  });
  $(".admin-tabs")?.addEventListener("click", event => {
    const tab = event.target.closest("[data-admin-tab]")?.dataset.adminTab;
    if (tab) setAdminTab(tab);
  });
  $$('[data-close]').forEach(button => button.addEventListener("click", () => closeLayer(button.dataset.close)));
  document.addEventListener("click", event => {
    if (!event.target.closest("#post-action-menu") && !event.target.closest("#post-menu-button")) els.actionMenu.hidden = true;
  });
  document.addEventListener("keydown", event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      els.search.focus();
    }
    if (event.key === "Escape") {
      const open = $(".dialog-layer.open");
      if (open) closeLayer(open.id.replace("-layer", ""));
    }
    if (state.activePost && event.key === "ArrowLeft") changeMedia(-1);
    if (state.activePost && event.key === "ArrowRight") changeMedia(1);
  });
  $$('input[name="tags"]').forEach(input => input.addEventListener("change", () => {
    const checked = $$('input[name="tags"]:checked');
    if (checked.length > 3) {
      input.checked = false;
      showToast("最多选择 3 个标签", "error", "ph-warning-circle");
    }
  }));
}

async function init() {
  applyTheme("diary");
  const now = new Date();
  const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][now.getDay()];
  $("#today-date").dateTime = now.toISOString();
  $("#today-date").textContent = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月 ${now.getDate()} 日 · ${weekday}`;
  $("#admin-entry").hidden = !new URLSearchParams(location.search).has("admin");
  bindEvents();
  renderSkeletons();
  const online = await initializeBackend();
  if (!online) setBackendMode(false);
  await refreshFeed();
  await loadCalendarPosts();
  if (online && new URLSearchParams(location.search).has("admin")) openAdmin();
}

init();
