import md5 from './md5.js';

const BASE_URL = 'https://www.reddit.com/';

function parseHtml(html) {
  return (html || '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function spawnPost(data) {
  let post = document.querySelector('#question-summary-51026357');
  post = post.cloneNode(true);
  post.style.display = 'flex';
  post.id = '';
  // debugger;
  post.querySelector('.excerpt').innerHTML = parseHtml(data.body_html);
  post.querySelector('h3 a').innerText = data.title;
  debugger;
  post.querySelector('h3 a').href = '/comment.html#' + data.permalink;
  post.querySelector('.user-details a').innerText = data.author;
  post.querySelector('.vote-count-post strong').innerText = data.score;
  post.querySelector('.gravatar-wrapper-32 img').src = `https://www.gravatar.com/avatar/${md5(data.author)}?s=32&d=identicon&r=PG`;

  const posts = document.querySelector('#questions');
  posts.appendChild(post);
}

fetch(`${BASE_URL}.json`)
  .then(res => res.json())
  .then(res => {
    res.data.children.forEach(post => {
      spawnPost(post.data);
    });
  });
