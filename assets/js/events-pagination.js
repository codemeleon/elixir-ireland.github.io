const itemsPerPage = 10; // Number of items per page
let totalItems = 0; // Total number of items
const paginationContainer = document.getElementById('pagination-container');

// Function to update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Hide pagination if there's only one page or no items
    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    } else {
        paginationContainer.style.display = 'flex';
    }
    
    // Logic to update pagination controls goes here
}

// Example function to set total items and update pagination
function setTotalItems(count) {
    totalItems = count;
    updatePagination();
}

// Function to display items for a specific page
function displayItems(page) {
    // Logic to display items for the given page goes here
    
    // Hide pagination if total items don't exceed items per page
    const paginationContainer = document.querySelector('.pagination');
    if (paginationContainer) {
        if (totalItems <= itemsPerPage) {
            paginationContainer.style.display = 'none';
        } else {
            paginationContainer.style.display = 'flex';
        }
    }
}

// Example usage
setTotalItems(25); // Set total items and update pagination