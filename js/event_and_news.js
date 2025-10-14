// This file contains shared logic for the News page.

// Make the initialization function globally accessible so navigation.js can call it
window.initializeNews = function() {
    // Check if we are on a page that needs this functionality
    const newsContainer = document.getElementById('news-container');
    if (!newsContainer) {
        return; // Exit if the container is not found
    }

    const paginationContainer = document.getElementById('pagination-container');
    const itemsPerPage = 6;
    let currentPage = 1;

    // Sort news items by date, newest first, if newsItems exists
    const sortedNewsItems = typeof newsItems !== 'undefined' 
        ? newsItems.sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
        
    console.log("News initialized with items:", sortedNewsItems.length);

    function displayNews(page) {
        newsContainer.innerHTML = '';
        page = page || 1;
        currentPage = page;

        if (sortedNewsItems.length === 0) {
            newsContainer.innerHTML = '<p class="no-news-message">No news items to display.</p>';
            paginationContainer.innerHTML = '';
            return;
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = sortedNewsItems.slice(startIndex, endIndex);

        for (const item of paginatedItems) {
            const newsCard = document.createElement('div');
            newsCard.className = 'card';

            // Add image if available
            if (item.image) {
                const cardImage = document.createElement('img');
                cardImage.className = 'card-image';
                cardImage.src = item.image;
                cardImage.alt = item.title;
                newsCard.appendChild(cardImage);
            }

            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';

            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = item.title;

            const date = document.createElement('div');
            date.className = 'card-date';
            date.textContent = new Date(item.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' });

            const summary = document.createElement('p');
            summary.className = 'card-text';
            summary.textContent = item.summary;

            const readMore = document.createElement('a');
            readMore.href = item.link;
            readMore.className = 'card-link';
            readMore.textContent = 'Read More →';

            cardContent.appendChild(title);
            cardContent.appendChild(date);
            cardContent.appendChild(summary);
            cardContent.appendChild(readMore);
            newsCard.appendChild(cardContent);
            newsContainer.appendChild(newsCard);
        }
        setupPagination();
    }

    function setupPagination() {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(sortedNewsItems.length / itemsPerPage);

        if (pageCount <= 1) return;

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Prev';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                displayNews(currentPage - 1);
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        });
        paginationContainer.appendChild(prevButton);

        // Page numbers
        for (let i = 1; i <= pageCount; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            if (i === currentPage) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                displayNews(i);
                window.scrollTo({top: 0, behavior: 'smooth'});
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === pageCount;
        nextButton.addEventListener('click', () => {
            if (currentPage < pageCount) {
                displayNews(currentPage + 1);
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Initial display
    displayNews(1);
};

// Initialize on both DOMContentLoaded and the custom contentLoaded event
document.addEventListener('DOMContentLoaded', window.initializeNews);
document.addEventListener('contentLoaded', window.initializeNews);
