const authorNames = {
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

const friendPosts = [
  {
    id: "f01",
    kind: "image",
    title: "审猪积累38.0 小猪也要梳毛吗🐽",
    body: "今天这只意外地很配合，刷了半天只会低头装没看见。越看越像刚洗完澡的小猪崽。\n\n#审猪积累 #小猪日常 #软乎乎",
    author: "今日审猪员",
    avatar: "🪥",
    media: ["assets/friends/friend-1.jpg"]
  },
  {
    id: "f02",
    kind: "image",
    title: "低质量猪图2.0",
    body: "凌晨两点抓到一只贴脸观察的小猪。请不要靠镜头这么近，鼻子已经占满整个屏幕了。\n\n#低质量猪图 #猪鼻特写 #夜间观察",
    author: "低像素猪",
    avatar: "🌙",
    media: ["assets/friends/friend-2.jpg"]
  },
  {
    id: "f03",
    kind: "image",
    title: "猪猪发夹会自己挑主人吗？",
    body: "本来只是随手夹上去，回头一看，好像被两只小猪认领了。今日份小猪好心情。\n\n#猪猪发夹 #小猪好心情 #今日穿搭",
    author: "猪猪配饰研究员",
    avatar: "🎀",
    media: ["assets/friends/friend-3.jpg"]
  },
  {
    id: "f04",
    kind: "image",
    title: "我想念一头在咖啡店睡着的猪",
    body: "带小猪出门喝东西，五分钟后直接进入休眠模式。怎么叫都不醒，疑似电量不足。\n\n#咖啡店偶遇 #困困小猪 #充电中",
    author: "困困小猪观察所",
    avatar: "☕",
    media: ["assets/friends/friend-4.jpg"]
  },
  {
    id: "f05",
    kind: "image",
    title: "最老实的小猪！",
    body: "举起来的时候一声不吭，问什么都点头。看着确实很老实，但总感觉它还有事情瞒着我。\n\n#老实点 #最棒的小猪 #今日审猪",
    author: "诚实小猪鉴定处",
    avatar: "🧸",
    media: ["assets/friends/friend-5.jpg"]
  },
  {
    id: "f06",
    kind: "image",
    title: "这只小猪会自己找勺子吗？",
    body: "刚坐下就把勺子贴到脸上，疑似正在研究猪猪餐具的正确用法。画面里的小猪已经先学会了。\n\n#猪猪吃饭 #餐具研究 #审猪现场",
    author: "猪猪用餐指南",
    avatar: "🥄",
    media: ["assets/friends/friend-6.jpg"]
  },
  {
    id: "f07",
    kind: "image",
    title: "玩游戏输了以后的小猪 be like",
    body: "说好只玩一局，输了以后原地委屈成一团。请不要难过，下一枚游戏币已经在路上了。\n\n#委屈小猪 #电玩城日常 #再来一局",
    author: "小猪情绪观察员",
    avatar: "🎮",
    media: ["assets/friends/friend-7.jpg"]
  },
  {
    id: "f08",
    kind: "image",
    title: "请不要捂住我的嘴巴2.0",
    body: "刚准备发表重要意见，就被同伴当场强制静音。小猪明明还有很多话想说。\n\n#小猪发言中 #强制静音 #低质量猪图",
    author: "猪言猪语记录处",
    avatar: "🤐",
    media: ["assets/friends/friend-8.jpg"]
  },
  {
    id: "f09",
    kind: "image",
    title: "你这只正在吃饭的猪！",
    body: "吃青菜时被当场抓拍，明明只是在认真补充膳食纤维，怎么突然就被懂猪帝识别出来了？\n\n#吃饭的猪 #今日菜谱 #懂猪帝识别成功",
    author: "小猪食堂巡查员",
    avatar: "🥬",
    media: ["assets/friends/friend-9.jpg"]
  },
  {
    id: "f10",
    kind: "image",
    title: "审猪积累39.0 头顶长出一只？",
    body: "低头玩手机的功夫，头顶突然被不明生物占领。本人毫无察觉，仍在专心刷懂猪帝。\n\n#审猪积累 #头顶小猪 #毫无防备",
    author: "头顶生物研究所",
    avatar: "🐾",
    media: ["assets/friends/friend-10.jpg"]
  },
  {
    id: "f11",
    kind: "image",
    title: "小猪也会热到变形吗",
    body: "出门五分钟就抱着风扇不撒手，旁边的小猪已经热到只剩下一个粉色背影。\n\n#夏日小猪 #降温失败 #风扇续命",
    author: "小猪避暑办",
    avatar: "🌀",
    media: ["assets/friends/friend-11.jpg"]
  },
  {
    id: "f12",
    kind: "image",
    title: "困困小猪找到专属枕头了",
    body: "走到一半自动进入睡眠模式，靠上去三秒就不动了。懂猪帝鉴定：这是一只电量不足的小猪。\n\n#困困小猪 #自动休眠 #充电中",
    author: "懂猪帝睡眠中心",
    avatar: "💤",
    media: ["assets/friends/friend-12.jpg"]
  }
];

const themeCopy = {
  diary: {
    icon: "📷",
    title: "日记胶片风",
    heading: "今天也在认真审猪",
    text: "偏温暖、真实、生活记录感；卡片像拍立得贴在日记本里，适合把朋友照片包装成“日常观察档案”。"
  },
  collage: {
    icon: "✂️",
    title: "杂志拼贴风",
    heading: "小猪恶作剧版面施工中",
    text: "更跳、更像手工拼贴和八卦小报；错落卡片、贴纸批注和轻微旋转会让 prank 的味道更明显。"
  },
  dream: {
    icon: "🫧",
    title: "梦核小猪风",
    heading: "软乎乎的梦里全是小猪",
    text: "柔光、毛玻璃、漂浮渐变，氛围更梦幻；适合做成一个看起来很认真但越看越离谱的日常站。"
  }
};

const tagPool = ["审猪积累", "日常记录", "朋友混入中", "低质量猪图", "软乎乎", "今日小猪"];
const datePool = ["刚刚", "2小时前", "昨天", "3天前", "本周", "夏日存档"];

let posts = [];
let activePost = null;
let mediaIndex = 0;

const feed = document.querySelector("#feed");
const styleNote = document.querySelector("#style-note");
const feedHeading = document.querySelector("#feed-heading");
const detailLayer = document.querySelector("#detail-layer");
const mediaStage = document.querySelector("#media-stage");
const mediaPrev = document.querySelector("#media-prev");
const mediaNext = document.querySelector("#media-next");
const mediaCount = document.querySelector("#media-count");

function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function assetUrl(path = "") {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `../${path.replace(/^\/+/, "")}`;
}

function normalizePigPost(post) {
  const title = String(post.title || "今日份小猪").replace(/\s+-\s+小红书$/, "");
  return {
    ...post,
    title,
    body: post.body || "这条小猪记录暂时没有正文，但它看起来已经很会生活了。",
    author: authorNames[post.author] || post.author || "懂猪帝观察员",
    avatar: "🐷",
    media: Array.isArray(post.media) ? post.media : [],
    kind: post.video ? "video" : post.kind || "image"
  };
}

function mixPosts(pigPosts) {
  const mixed = [];
  const max = Math.max(pigPosts.length, friendPosts.length);
  for (let index = 0; index < max; index += 1) {
    if (pigPosts[index]) mixed.push(pigPosts[index]);
    if (friendPosts[index]) mixed.push(friendPosts[index]);
  }
  return mixed;
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.querySelectorAll(".theme-tab").forEach(button => {
    button.classList.toggle("active", button.dataset.theme === theme);
  });
  const copy = themeCopy[theme];
  feedHeading.textContent = copy.heading;
  styleNote.innerHTML = `
    <span>${copy.icon}</span>
    <p><strong>${copy.title}</strong>：${copy.text}</p>
    <small>点击任意卡片查看详情</small>
  `;
}

function cardTemplate(post, index) {
  const cover = assetUrl(post.media?.[0] || "");
  const safeTitle = escapeHTML(post.title);
  const badge = post.kind === "video"
    ? "▶ 视频"
    : post.media.length > 1
      ? `${post.media.length} 张`
      : "图片";
  const delay = Math.min(index * 34, 420);
  const tilt = ((index % 7) - 3) * 0.9;
  const tag = tagPool[index % tagPool.length];
  const date = datePool[index % datePool.length];
  return `
    <article
      class="post-card"
      tabindex="0"
      data-post-id="${escapeHTML(post.id)}"
      style="--delay:${delay}ms; --tilt:${tilt}deg"
      aria-label="打开帖子：${safeTitle}"
    >
      <div class="card-media">
        <img src="${cover}" alt="${safeTitle}" loading="lazy" />
        <span class="media-badge">${badge}</span>
        <span class="pig-sticker">🐽 ${tag}</span>
      </div>
      <div class="card-copy">
        <div class="card-kicker">#${tag}</div>
        <h3 class="card-title">${safeTitle}</h3>
        <footer class="card-footer">
          <span class="card-avatar">${escapeHTML(post.avatar || "🐷")}</span>
          <span class="card-author">${escapeHTML(post.author)}</span>
          <span class="card-date">${date}</span>
        </footer>
      </div>
    </article>
  `;
}

function renderFeed() {
  feed.innerHTML = posts.map(cardTemplate).join("");
}

function getPost(id) {
  return posts.find(post => post.id === id);
}

function renderMedia() {
  if (!activePost) return;
  const isVideo = activePost.kind === "video" && activePost.video;

  if (isVideo) {
    mediaStage.innerHTML = `
      <video
        src="${assetUrl(activePost.video)}"
        poster="${assetUrl(activePost.media[0])}"
        controls
        playsinline
        preload="metadata"
      ></video>
    `;
    mediaPrev.hidden = true;
    mediaNext.hidden = true;
    mediaCount.hidden = false;
    mediaCount.textContent = "视频";
    return;
  }

  const images = activePost.media || [];
  mediaStage.innerHTML = `<img src="${assetUrl(images[mediaIndex])}" alt="${escapeHTML(activePost.title)} 第 ${mediaIndex + 1} 张" />`;
  const multiple = images.length > 1;
  mediaPrev.hidden = !multiple;
  mediaNext.hidden = !multiple;
  mediaCount.hidden = !multiple;
  mediaCount.textContent = `${mediaIndex + 1} / ${images.length}`;
}

function openPost(post) {
  if (!post) return;
  activePost = post;
  mediaIndex = 0;
  document.querySelector("#detail-avatar").textContent = post.avatar || "🐷";
  document.querySelector("#detail-author").textContent = post.author;
  document.querySelector("#detail-title").textContent = post.title;
  document.querySelector("#detail-body").textContent = post.body;
  document.querySelector("#detail-date").textContent = `${datePool[Math.abs(hashCode(post.id)) % datePool.length]} · 懂猪帝日常`;
  renderMedia();
  detailLayer.classList.add("open");
  detailLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelector("#detail-close").focus();
}

function closePost() {
  const video = mediaStage.querySelector("video");
  if (video) video.pause();
  activePost = null;
  mediaStage.innerHTML = "";
  detailLayer.classList.remove("open");
  detailLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function changeMedia(delta) {
  if (!activePost || activePost.kind === "video") return;
  mediaIndex = (mediaIndex + delta + activePost.media.length) % activePost.media.length;
  renderMedia();
}

function hashCode(value) {
  return [...String(value)].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);
}

document.querySelectorAll(".theme-tab").forEach(button => {
  button.addEventListener("click", () => applyTheme(button.dataset.theme));
});

feed.addEventListener("click", event => {
  const card = event.target.closest("[data-post-id]");
  if (card) openPost(getPost(card.dataset.postId));
});

feed.addEventListener("keydown", event => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const card = event.target.closest("[data-post-id]");
  if (!card) return;
  event.preventDefault();
  openPost(getPost(card.dataset.postId));
});

document.querySelector("#detail-close").addEventListener("click", closePost);
detailLayer.addEventListener("click", event => {
  if (event.target === detailLayer) closePost();
});
mediaPrev.addEventListener("click", () => changeMedia(-1));
mediaNext.addEventListener("click", () => changeMedia(1));

document.addEventListener("keydown", event => {
  if (!activePost) return;
  if (event.key === "Escape") closePost();
  if (event.key === "ArrowLeft") changeMedia(-1);
  if (event.key === "ArrowRight") changeMedia(1);
});

async function init() {
  applyTheme("diary");
  try {
    const response = await fetch("../pig-posts.json");
    if (!response.ok) throw new Error("pig-posts.json 加载失败");
    const pigPosts = (await response.json()).map(normalizePigPost);
    posts = mixPosts(pigPosts);
  } catch (error) {
    console.warn(error);
    posts = friendPosts;
  }
  renderFeed();
}

init();
