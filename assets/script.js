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
const queueList = document.getElementById('queue-list');
const queuePopup = document.getElementById('queue-popup');

// Load categories
function loadCategory(category, gridId) {
  fetch(`${mediaSources[category]}/index.json`)
    .then(res => res.json())
    .then(data => {
      data.forEach(item => item.category = category);
      mediaData = mediaData.concat(data);
      renderCards(data, gridId);
    });
}

// Render cards
function renderCards(data, gridId) {
  const grid = document.getElementById(gridId);
  data.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${item.cover || 'covers/default.png'}">
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;
    card.addEventListener('click', () => addToQueue(item));
    grid.appendChild(card);
  });
}

// Add to Queue
function addToQueue(item) {
  queue.push(item);
  updateQueuePopup();
  if (currentIndex === -1) {
    currentIndex = 0;
    playItem(queue[currentIndex]);
  }
}

// Play Item
function playItem(item) {
  playerTitle.textContent = item.title;
  playerCover.src = item.cover || 'covers/default.png';
  audioPlayer.src = `${mediaSources[item.category]}/${item.file}`;
  audioPlayer.play();
}

// Update Queue List UI
function updateQueuePopup() {
  queueList.innerHTML = '';
  queue.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = (index === currentIndex ? '▶ ' : '') + track.title;
    li.addEventListener('click', () => {
      currentIndex = index;
      playItem(queue[currentIndex]);
      updateQueuePopup();
    });
    queueList.appendChild(li);
  });
}

// Auto-play next track when current ends
audioPlayer.addEventListener('ended', () => {
  if (currentIndex < queue.length - 1) {
    currentIndex++;
    playItem(queue[currentIndex]);
    updateQueuePopup();
  }
});

// Controls
document.getElementById('next-btn').addEventListener('click', () => {
  if (currentIndex < queue.length - 1) {
    currentIndex++;
    playItem(queue[currentIndex]);
    updateQueuePopup();
  }
});
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    playItem(queue[currentIndex]);
    updateQueuePopup();
  }
});
document.getElementById('play-btn').addEventListener('click', () => {
  if (audioPlayer.paused) audioPlayer.play();
  else audioPlayer.pause();
});

// Queue Popup toggle
document.getElementById('queue-btn').addEventListener('click', () => {
  queuePopup.style.display = 'block';
});
document.getElementById('close-queue').addEventListener('click', () => {
  queuePopup.style.display = 'none';
});

// Global search
document.getElementById('global-search').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(query) ? 'block' : 'none';
  });
});

// Init
window.addEventListener('DOMContentLoaded', () => {
  loadCategory('praise', 'praise-grid');
  loadCategory('sermons', 'sermon-grid');
});
