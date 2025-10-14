function displayNews(items) {
  const newsGrid = document.getElementById('newsGrid');
  newsGrid.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="news-image">
      <div class="news-content">
        <span class="news-date">${formatDate(item.date)}</span>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <a href="${item.link}" class="read-more">Read more →</a>
      </div>
    `;
    newsGrid.appendChild(card);
  });
}