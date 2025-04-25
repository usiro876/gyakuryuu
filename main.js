const STORAGE_KEY = 'zatta_posts';
const TTL = 72 * 60 * 60 * 1000; // 72時間 in ms

function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY) || '[]';
  return JSON.parse(raw);
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function renderPosts() {
  const now = Date.now();
  let posts = loadPosts()
    .map(p => ({
      ...p,
      age: now - p.timestamp,
      remaining: TTL - (now - p.timestamp)
    }))
    .filter(p => p.remaining > 0)
    .sort((a, b) => a.timestamp - b.timestamp); // 時系列（古→新）

  savePosts(posts);

  const ul = document.getElementById('posts');
  ul.innerHTML = '';

  posts.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.text;
    const span = document.createElement('div');
    span.className = 'remaining';
    const h = Math.ceil(p.remaining / (60 * 60 * 1000));
    span.textContent = `残り ${h} 時間`;
    li.appendChild(span);
    ul.appendChild(li);
  });
}

document.getElementById('post-btn').addEventListener('click', () => {
  const input = document.getElementById('post-input');
  const text = input.value.trim();
  if (!text) return;

  const posts = loadPosts();
  posts.push({ text, timestamp: Date.now() });
  savePosts(posts);
  input.value = '';
  renderPosts();
});

// 起動時レンダリング
renderPosts();
