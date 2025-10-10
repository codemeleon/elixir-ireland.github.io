document.addEventListener('DOMContentLoaded', () => {
    const newsGrid = document.getElementById('news-grid');
    const paginationContainer = document.getElementById('pagination');

    let currentPage = 1;
    const itemsPerPage = 6;
    const allData = [...newsData];

    function renderNewsCards(data, page) {
        newsGrid.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedData = data.slice(start, end);

        if (paginatedData.length === 0) {
            newsGrid.innerHTML = '<p>No articles found.</p>';
            return;
        }

        paginatedData.forEach(item => {
            const card = `
                <a href="${item.url}" class="news-card">
                    <img src="${item.image}" alt="${item.title}" class="news-card-image">
                    <div class="news-card-content">
                        <span class="news-card-category">${item.category}</span>
                        <h3 class="news-card-title">${item.title}</h3>
                        <p class="news-card-excerpt">${item.excerpt}</p>
                        <time class="news-card-date" datetime="${item.date}">${new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</time>
                    </div>
                </a>
            `;
            newsGrid.innerHTML += card;
        });
    }

    function renderPagination(data) {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(data.length / itemsPerPage);

        if (totalPages <= 1) return;

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = '«';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderNewsCards(allData, currentPage);
                renderPagination(allData);
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderNewsCards(allData, currentPage);
                renderPagination(allData);
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = '»';
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderNewsCards(allData, currentPage);
                renderPagination(allData);
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    function init() {
        renderNewsCards(allData, currentPage);
        renderPagination(allData);
    }

    init();
});
