const mediaCategories = {
  praise: 'audio/praise',
  sermons: 'audio/sermons'
};

function loadMedia(category, elementId) {
  fetch(`${mediaCategories[category]}/index.json`)
    .then(r => r.json())
    .then(list => {
      const container = document.getElementById(elementId);
      list.forEach(item => {
        const div = document.createElement('div');
        div.className = 'audio-item';
        div.innerHTML = `<h3>${item.title}</h3>` +
          (item.type.startsWith('video') ?
            `<video controls width="100%" src="${mediaCategories[category]}/${item.file}"></video>` :
            `<audio controls src="${mediaCategories[category]}/${item.file}"></audio>`) +
          `<p>${item.date}</p>`;
        container.appendChild(div);
      });
    })
    .catch(e => console.error('Failed to load ' + category, e));
}

window.addEventListener('DOMContentLoaded', () => {
  loadMedia('praise', 'praise-list');
  loadMedia('sermons', 'sermon-list');
});