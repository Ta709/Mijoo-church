const mediaSources = {
  praise: 'audio/praise',
  sermons: 'audio/sermons'
};

let mediaData = [];
let queue = [];
let currentIndex = -1;

const audioPlayer = document.getElementById('audio-player');
const playerTitle = document.getElementById('player-title');
const playerCover = document.getElementById('player-cover');

// Load media dynamically
function loadCategory(category, gridId) {
  fetch(`${mediaSources[category]}/index.json`)
    .then(res => res.json())
    .then(data => {
      data.forEach(item => item.category = category); // tag category
      mediaData = mediaData.concat(data);
      renderCards(data, gridId, category);
    });
}

// Render cards
function renderCards(data, gridId, category) {
  const grid = document.getElementById(gridId);
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.cover || 'covers/default.png'}">
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;
    card.addEventListener('click', () => addToQueueAndPlay(item));
    grid.appendChild(card);
  });
}

// Queue system
function addToQueueAndPlay(item) {
  queue.push(item);
  if (currentIndex === -1) {
    currentIndex = 0;
    playItem(queue[currentIndex]);
  }
}

function playItem(item) {
  playerTitle.textContent = item.title;
  playerCover.src = item.cover || 'covers/default.png';
  audioPlayer.src = `${mediaSources[item.category]}/${item.file}`;
  audioPlayer.play();
}

// Next/Prev controls
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentIndex < queue.length - 1) {
    currentIndex++;
    playItem(queue[currentIndex]);
  }
});
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    playItem(queue[currentIndex]);
  }
});
document.getElementById('play-btn').addEventListener('click', () => {
  if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();
});

// Global Search
document.getElementById('global-search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(query) ? 'block' : 'none';
  });
});

// Init load
window.addEventListener('DOMContentLoaded', () => {
  loadCategory('praise', 'praise-grid');
  loadCategory('sermons', 'sermon-grid');
});
