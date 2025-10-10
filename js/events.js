document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    // Exit if the necessary elements for event filtering aren't on the page
    if (!filterButtons.length || !eventCards.length) {
        return;
    }

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filter cards based on the selected category
            eventCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filter === 'all' || filter === cardCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});
