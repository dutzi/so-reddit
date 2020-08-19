import md5 from "./md5.js";

const BASE_URL = "https://www.reddit.com/";
const BASE_SO_REDDIT_URL =
  location.hostname === "localhost" ? "" : "/so-reddit";

let templatePost = document.querySelector("#question-summary-51026357");

function parseHtml(html) {
  return (html || "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function spawnPost(data) {
  const post = templatePost.cloneNode(true);
  post.style.display = "flex";
  post.id = "";
  post.querySelector(".excerpt").innerHTML = parseHtml(data.body_html);
  post.querySelector("h3 a").innerText = data.title;
  post.querySelector("h3 a").href =
    `${BASE_SO_REDDIT_URL}/comment.html#` + data.permalink;
  post.querySelector(".user-details a").innerText = data.author;
  post.querySelector(".vote-count-post strong").innerText = data.score;
  post.querySelector(
    ".gravatar-wrapper-32 img"
  ).src = `https://www.gravatar.com/avatar/${md5(
    data.author
  )}?s=32&d=identicon&r=PG`;

  const posts = document.querySelector("#questions");
  posts.appendChild(post);
}

function clearPosts() {
  const post = templatePost.cloneNode(true);
  const posts = document.querySelector("#questions");
  posts.innerHTML = "";
  posts.appendChild(post);
}

const searchParams = new URLSearchParams(location.search);

window.addEventListener("hashchange", () => {
  clearPosts();
  fetchPosts();
  updateSortMenu();
});

function getSortMethod() {
  const lastComponent = location.hash.substr(1).split("/").pop();

  if (["hot", "top", "new"].indexOf(lastComponent) !== -1) {
    return lastComponent;
  } else {
    return "hot";
  }
}

function getSubreddit() {
  const subreddit = location.hash.split("/")[2];
  if (subreddit) {
    return "r/" + subreddit;
  } else {
    return "";
  }
}

function updateSortMenu() {
  Array.from(document.querySelectorAll('[id^="sort"]')).forEach((node) =>
    node.classList.remove("is-selected")
  );

  document
    .querySelector(`#sort-${getSortMethod()}`)
    ?.classList.add("is-selected");
}

function fetchPosts() {
  fetch(
    `${BASE_URL}/${getSubreddit()}/${getSortMethod()}.json`.replace(
      /\/\//g,
      "/"
    )
  )
    .then((res) => res.json())
    .then((res) => {
      res.data.children.forEach((post) => {
        spawnPost(post.data);
      });
    });
}

window.handleSortMenuClick = (e) => {
  const sortMethod = e.currentTarget.href.split("#").pop();
  e.preventDefault();
  if (location.hash.startsWith("#/r")) {
    const subreddit = location.hash.split("/")[2];
    location.hash = `#/r/${subreddit}/${sortMethod}`;
  } else {
    location.hash = `#/${sortMethod}`;
  }
};

fetchPosts();
updateSortMenu();
