// Events page logic with filtering for upcoming vs past events
window.initializeEvents = function() {
    // Check if we are on the events page
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) {
        return; // Exit if the container is not found
    }

    const paginationContainer = document.getElementById('events-pagination-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const itemsPerPage = 6;
    let currentPage = 1;
    let currentFilter = 'all';
    let filteredEvents = [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Categorize and sort events
    function categorizeEvents() {
        const upcoming = [];
        const past = [];

        if (typeof eventsItems === 'undefined') {
            console.warn('eventsItems data is not loaded.');
            return { upcoming: [], past: [] };
        }

        eventsItems.forEach(event => {
            const eventDate = new Date(event.date);
            eventDate.setHours(0, 0, 0, 0);
            
            if (eventDate >= today) {
                upcoming.push(event);
            } else {
                past.push(event);
            }
        });

        // Sort upcoming events: soonest first
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Sort past events: most recent first
        past.sort((a, b) => new Date(b.date) - new Date(a.date));

        return { upcoming, past };
    }

    const { upcoming, past } = categorizeEvents();

    // Filter events based on selected filter
    function filterEvents(filter) {
        currentFilter = filter;
        
        if (filter === 'upcoming') {
            filteredEvents = upcoming;
        } else if (filter === 'past') {
            filteredEvents = past;
        } else {
            filteredEvents = [...upcoming, ...past];
        }
        
        displayEvents(1);
    }

    // Display events with pagination
    function displayEvents(page) {
        eventsContainer.innerHTML = '';
        page = page || 1;
        currentPage = page;

        if (filteredEvents.length === 0) {
            eventsContainer.innerHTML = '<p class="no-events-message">No events to display.</p>';
            paginationContainer.innerHTML = '';
            return;
        }

        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedItems = filteredEvents.slice(startIndex, endIndex);

        for (const item of paginatedItems) {
            const eventCard = document.createElement('div');
            eventCard.className = 'card';

            // Add event status badge
            const eventDate = new Date(item.date);
            eventDate.setHours(0, 0, 0, 0);
            const isUpcoming = eventDate >= today;

            // Add image if available
            if (item.image) {
                const cardImage = document.createElement('img');
                cardImage.className = 'card-image';
                cardImage.src = item.image;
                cardImage.alt = item.title;
                eventCard.appendChild(cardImage);
            }

            const cardContent = document.createElement('div');
            cardContent.className = 'card-content';

            // Add status badge
            const statusBadge = document.createElement('span');
            statusBadge.className = `event-status-badge ${isUpcoming ? 'upcoming' : 'past'}`;
            statusBadge.textContent = isUpcoming ? 'Upcoming' : 'Past Event';
            cardContent.appendChild(statusBadge);

            const title = document.createElement('h3');
            title.className = 'card-title';
            title.textContent = item.title;

            const date = document.createElement('div');
            date.className = 'card-date';
            date.innerHTML = `<strong>📅 ${new Date(item.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>`;

            const location = document.createElement('div');
            location.className = 'card-location';
            location.innerHTML = `<strong>📍 ${item.location}</strong>`;

            const summary = document.createElement('p');
            summary.className = 'card-text';
            summary.textContent = item.summary;

            // Add buttons container
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'card-buttons';

            const readMore = document.createElement('a');
            readMore.href = item.link;
            readMore.className = 'card-link';
            readMore.textContent = 'Learn More →';
            buttonsContainer.appendChild(readMore);

            // Add registration button for upcoming events
            if (isUpcoming && item.registrationLink) {
                const registerBtn = document.createElement('a');
                registerBtn.href = item.registrationLink;
                registerBtn.className = 'card-link register-btn';
                registerBtn.textContent = 'Register →';
                buttonsContainer.appendChild(registerBtn);
            }

            cardContent.appendChild(title);
            cardContent.appendChild(date);
            cardContent.appendChild(location);
            cardContent.appendChild(summary);
            cardContent.appendChild(buttonsContainer);
            eventCard.appendChild(cardContent);
            eventsContainer.appendChild(eventCard);
        }
        setupPagination();
    }

    function setupPagination() {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(filteredEvents.length / itemsPerPage);

        if (pageCount <= 1) return;

        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Prev';
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                displayEvents(currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
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
                displayEvents(i);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(pageButton);
        }

        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.disabled = currentPage === pageCount;
        nextButton.addEventListener('click', () => {
            if (currentPage < pageCount) {
                displayEvents(currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(nextButton);
    }

    // Set up filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            filterEvents(filter);
        });
    });

    // Initial display - show all events
    filterEvents('all');
};

// Initialize on DOMContentLoaded (for direct page load)
document.addEventListener('DOMContentLoaded', window.initializeEvents);
