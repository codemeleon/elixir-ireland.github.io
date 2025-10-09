function displayEvents() {
    const eventCards = document.querySelectorAll('.event-card');
    const totalEvents = eventCards.length;
    const itemsPerPage = 10; // Assuming itemsPerPage is defined elsewhere
    const totalPages = Math.ceil(totalEvents / itemsPerPage);
    
    // Hide pagination controls if events don't exceed items per page
    const paginationControls = document.querySelector('.pagination-controls');
    if (totalEvents <= itemsPerPage) {
        if (paginationControls) {
            paginationControls.style.display = 'none';
        }
        // Show all events
        eventCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    } else {
        if (paginationControls) {
            paginationControls.style.display = 'flex';
        }
    }
    
    // Logic for displaying events based on pagination
    // ...existing code...
}