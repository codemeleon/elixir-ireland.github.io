// Event filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const eventCards = document.querySelectorAll('.event-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            const filterValue = this.getAttribute('data-filter');

            eventCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        item.addEventListener('click', function() {
            // Toggle active class
            this.classList.toggle('active');
        });
    });
});
