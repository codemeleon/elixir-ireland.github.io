    displayEvents();
    
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayEvents();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayEvents();
        }
    });
});