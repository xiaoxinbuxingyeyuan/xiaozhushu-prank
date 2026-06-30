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
    id: "f01", kind: "image", title: "审猪积累38.0 小猪也要梳毛吗🐽",
    body: "今天这只意外地很配合，刷了半天只会低头装没看见。越看越像刚洗完澡的小猪崽🥰\n\n#审猪积累 #小猪日常 #软乎乎",
    author: "今日审猪员", avatar: "🪮", media: ["assets/friends/friend-1.jpg"]
  },
  {
    id: "f02", kind: "image", title: "低质量猪图2.0",
    body: "凌晨两点抓到一只贴脸观察的小猪。请不要靠镜头这么近，鼻子已经占满整个屏幕了！\n\n#低质量猪图 #猪鼻特写 #夜间观察",
    author: "低像素猪", avatar: "🌙", media: ["assets/friends/friend-2.jpg"]
  },
  {
    id: "f03", kind: "image", title: "猪猪发夹会自己挑主人吗？",
    body: "本来只是随手夹上去，回头一看，好像被两只小猪认领了。今日份小猪好心情🐷\n\n#猪猪发夹 #小猪好心情 #今日穿搭",
    author: "猪猪配饰研究员", avatar: "🎀", media: ["assets/friends/friend-3.jpg"]
  },
  {
    id: "f04", kind: "image", title: "我想念一头在咖啡店睡着的猪",
    body: "带小猪出门喝东西，五分钟后直接进入休眠模式。怎么叫都不醒，疑似电量不足。\n\n#咖啡店偶遇 #困困小猪 #充电中",
    author: "困困小猪观察所", avatar: "☕", media: ["assets/friends/friend-4.jpg"]
  },
  {
    id: "f05", kind: "image", title: "最老实的小猪！",
    body: "举起来的时候一声不吭，问什么都点头。看着确实很老实，但总感觉它还有事情瞒着我🐽\n\n#老实点 #最棒的小猪 #今日审猪",
    author: "诚实小猪鉴定处", avatar: "🧸", media: ["assets/friends/friend-5.jpg"]
  }
];

const insertPositions = [2, 5, 8, 12, 15];
let posts = [];
let activePost = null;
let mediaIndex = 0;
let openedFromFeed = false;
let visiblePosts = [];
const liked = new Set(JSON.parse(localStorage.getItem("pig-liked") || "[]"));

const feed = document.querySelector("#feed");
const empty = document.querySelector("#empty");
const detailLayer = document.querySelector("#detail-layer");
const mediaStage = document.querySelector("#media-stage");
const mediaPrev = document.querySelector("#media-prev");
const mediaNext = document.querySelector("#media-next");
const mediaCount = document.querySelector("#media-count");
const detailLike = document.querySelector("#detail-like");

function hashNumber(value) {
  return [...value].reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 7);
}

function likeCount(post) {
  return 88 + Math.abs(hashNumber(post.id)) % 4880 + (liked.has(post.id) ? 1 : 0);
}

function normalizePigPost(post) {
  return {
    ...post,
    title: post.title.replace(/\s+-\s+小红书$/, ""),
    author: authorNames[post.author] || post.author,
    avatar: "🐷"
  };
}

function mixPosts(pigPosts) {
  const mixed = [...pigPosts];
  friendPosts.forEach((friend, index) => mixed.splice(insertPositions[index], 0, friend));
  return mixed;
}

function cardTemplate(post) {
  const cover = post.media[0];
  const badge = post.kind === "video"
    ? '<span class="video-badge">▶</span>'
    : post.media.length > 1
      ? `<span class="album-badge">${post.media.length}张</span>`
      : "";
  const isLiked = liked.has(post.id);
  return `
    <article class="card" tabindex="0" data-post-id="${post.id}" aria-label="打开帖子：${post.title}">
      <div class="cover">
        <img src="${cover}" alt="${post.title}" loading="lazy" />
        ${badge}
      </div>
      <h2 class="card-title">${post.title}</h2>
      <div class="card-footer">
        <span class="card-avatar">${post.avatar}</span>
        <span class="card-author">${post.author}</span>
        <button class="card-like ${isLiked ? "liked" : ""}" data-like-id="${post.id}" aria-label="点赞">
          <span>${isLiked ? "♥" : "♡"}</span><span>${likeCount(post)}</span>
        </button>
      </div>
    </article>`;
}

function currentColumnCount() {
  if (window.innerWidth <= 820) return 2;
  if (window.innerWidth <= 1180) return 3;
  if (window.innerWidth <= 1500) return 4;
  return 5;
}

function renderFeed(list = posts) {
  visiblePosts = list;
  const columnCount = currentColumnCount();
  const columns = Array.from({ length: columnCount }, () => []);
  list.forEach((post, index) => columns[index % columnCount].push(cardTemplate(post)));
  feed.innerHTML = columns.map(column => `<div class="feed-column">${column.join("")}</div>`).join("");
  empty.hidden = list.length > 0;
}

function getPost(id) {
  return posts.find(post => post.id === id);
}

function openPost(post, pushHistory = true) {
  if (!post) return;
  activePost = post;
  mediaIndex = 0;
  document.querySelector("#detail-avatar").textContent = post.avatar;
  document.querySelector("#detail-author").textContent = post.author;
  document.querySelector("#detail-title").textContent = post.title;
  document.querySelector("#detail-body").textContent = post.body;
  document.querySelector("#detail-date").textContent = `${7 + Math.abs(hashNumber(post.id)) % 20}天前 · 东京`;
  document.querySelector("#follow-btn").classList.remove("following");
  document.querySelector("#follow-btn").textContent = "关注";
  renderMedia();
  syncDetailLike();
  detailLayer.classList.add("open");
  detailLayer.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  document.querySelector("#detail-close").focus();
  if (pushHistory) {
    openedFromFeed = true;
    history.pushState({ postId: post.id }, "", `#/post/${post.id}`);
  }
}

function renderMedia() {
  if (!activePost) return;
  const isVideo = activePost.kind === "video";
  if (isVideo) {
    mediaStage.innerHTML = `<video src="${activePost.video}" poster="${activePost.media[0]}" controls playsinline preload="metadata"></video>`;
    mediaPrev.hidden = true;
    mediaNext.hidden = true;
    mediaCount.textContent = "视频";
  } else {
    const images = activePost.media;
    mediaStage.innerHTML = `<img src="${images[mediaIndex]}" alt="${activePost.title} 第 ${mediaIndex + 1} 张" />`;
    const multiple = images.length > 1;
    mediaPrev.hidden = !multiple;
    mediaNext.hidden = !multiple;
    mediaCount.hidden = !multiple;
    mediaCount.textContent = `${mediaIndex + 1} / ${images.length}`;
  }
}

function changeMedia(delta) {
  if (!activePost || activePost.kind === "video") return;
  mediaIndex = (mediaIndex + delta + activePost.media.length) % activePost.media.length;
  renderMedia();
}

function closePost(useHistory = true) {
  if (!activePost) return;
  const video = mediaStage.querySelector("video");
  if (video) video.pause();
  detailLayer.classList.remove("open");
  detailLayer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activePost = null;
  mediaStage.innerHTML = "";
  if (useHistory && openedFromFeed && location.hash.startsWith("#/post/")) {
    openedFromFeed = false;
    history.back();
  }
}

function toggleLike(id) {
  liked.has(id) ? liked.delete(id) : liked.add(id);
  localStorage.setItem("pig-liked", JSON.stringify([...liked]));
  renderFeed(currentFilteredPosts());
  if (activePost?.id === id) syncDetailLike();
}

function syncDetailLike() {
  if (!activePost) return;
  const isLiked = liked.has(activePost.id);
  detailLike.classList.toggle("liked", isLiked);
  detailLike.innerHTML = `${isLiked ? "♥" : "♡"} <span>${likeCount(activePost)}</span>`;
}

function currentFilteredPosts() {
  const query = document.querySelector("#search-input").value.trim().toLowerCase();
  if (!query) return posts;
  return posts.filter(post => `${post.title} ${post.body} ${post.author}`.toLowerCase().includes(query));
}

feed.addEventListener("click", event => {
  const likeButton = event.target.closest("[data-like-id]");
  if (likeButton) {
    event.stopPropagation();
    toggleLike(likeButton.dataset.likeId);
    return;
  }
  const card = event.target.closest("[data-post-id]");
  if (card) openPost(getPost(card.dataset.postId));
});

feed.addEventListener("keydown", event => {
  if ((event.key === "Enter" || event.key === " ") && !event.target.closest("[data-like-id]")) {
    event.preventDefault();
    const card = event.target.closest("[data-post-id]");
    if (card) openPost(getPost(card.dataset.postId));
  }
});

document.querySelector("#detail-close").addEventListener("click", () => closePost());
detailLayer.addEventListener("click", event => { if (event.target === detailLayer) closePost(); });
mediaPrev.addEventListener("click", () => changeMedia(-1));
mediaNext.addEventListener("click", () => changeMedia(1));
detailLike.addEventListener("click", () => activePost && toggleLike(activePost.id));

document.querySelector("#follow-btn").addEventListener("click", event => {
  event.currentTarget.classList.toggle("following");
  event.currentTarget.textContent = event.currentTarget.classList.contains("following") ? "已关注" : "关注";
});

document.querySelector("#search-form").addEventListener("submit", event => {
  event.preventDefault();
  renderFeed(currentFilteredPosts());
});
document.querySelector("#search-input").addEventListener("input", () => renderFeed(currentFilteredPosts()));

document.querySelector("#categories").addEventListener("click", event => {
  const category = event.target.closest(".category");
  if (!category) return;
  document.querySelectorAll(".category").forEach(item => item.classList.remove("active"));
  category.classList.add("active");
  const term = category.textContent === "推荐" ? "" : category.textContent === "视频" ? "__video__" : category.textContent;
  const filtered = term === "__video__" ? posts.filter(post => post.kind === "video") : term ? posts.filter(post => `${post.title}${post.body}`.includes(term) || post.id.startsWith("f")) : posts;
  renderFeed(filtered);
});

document.querySelector("#to-top").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.addEventListener("keydown", event => {
  if (!activePost) return;
  if (event.key === "Escape") closePost();
  if (event.key === "ArrowLeft") changeMedia(-1);
  if (event.key === "ArrowRight") changeMedia(1);
});

window.addEventListener("popstate", () => {
  const match = location.hash.match(/^#\/post\/(.+)$/);
  if (match) openPost(getPost(match[1]), false);
  else closePost(false);
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => renderFeed(visiblePosts), 120);
});

async function init() {
  try {
    const response = await fetch("pig-posts.json");
    if (!response.ok) throw new Error("数据加载失败");
    const pigPosts = (await response.json()).map(normalizePigPost);
    posts = mixPosts(pigPosts);
    renderFeed();
    const match = location.hash.match(/^#\/post\/(.+)$/);
    if (match) openPost(getPost(match[1]), false);
  } catch (error) {
    feed.innerHTML = `<div class="empty"><div>🐷</div><p>小猪们加载失败了，请通过本地服务器打开网站。</p></div>`;
    console.error(error);
  }
}

init();
