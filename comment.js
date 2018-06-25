import md5 from './md5.js';

const BASE_URL = 'https://www.reddit.com/';

function parseHtml(html) {
  return (html || '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function populateQuestion(data) {
  document.querySelector('h1 .question-hyperlink').innerText = data.children[0].data.title;
  document.querySelector('.postcell .post-text').innerHTML = parseHtml(data.children[0].data.selftext_html)
  document.querySelector('.postcell .user-details a').innerHTML = parseHtml(data.children[0].data.author);
  document.querySelector('.question .vote-count-post').innerText = data.children[0].data.score;
}

function spawnAnswer(data) {
  let answer = document.querySelector('#answer-2052150');
  answer = answer.cloneNode(true);
  answer.style.display = 'block';
  answer.id = '';

  answer.querySelector('.post-text').innerHTML = parseHtml(data.body_html);
  answer.querySelector('.user-details a').innerText = data.author;
  answer.querySelector('.vote-count-post').innerText = data.score;
  answer.querySelector('.gravatar-wrapper-32 img').src = `https://www.gravatar.com/avatar/${md5(data.author)}?s=32&d=identicon&r=PG`;

  const answers = document.querySelector('.actualAnswers');
  answers.appendChild(answer);

  (((data.replies || {}).data || {}).children || []).forEach(reply => {
    spawnComment(reply.data, answer);
  })
}

function spawnComment(data, element) {
  let reply = element.querySelector('#comment-1979460');
  reply = reply.cloneNode(true);
  reply.id = '';
  reply.style.display = 'contents';

  reply.querySelector('.comment-copy').innerHTML = parseHtml(data.body_html || '');
  reply.querySelector('.comment-user').innerText = data.author;
  // reply.querySelector('.vote-count-post').innerText = data.score;
  // reply.querySelector('.gravatar-wrapper-32 img').src = `https://www.gravatar.com/avatar/${md5(data.author)}?s=32&d=identicon&r=PG`;

  const replies = element.querySelector('.comments-list.js-comments-list');
  replies.appendChild(reply);
}

fetch(`${BASE_URL}${location.hash.substr(1)}.json`).then(res => res.json()).then(res => {
  populateQuestion(res[0].data);

  res[1].data.children.forEach(answer => {
    spawnAnswer(answer.data);
  })
})
