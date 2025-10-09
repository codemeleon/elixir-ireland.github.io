// News Pagination Functionality
// This manages the display of news items across multiple pages

const ITEMS_PER_PAGE = 6; // Number of news items per page
let currentPage = 1;
let totalPages = 1;

// Sample news data - this would typically come from a backend/CMS
const allNewsItems = [
  // Add more news items here as needed
];

function initPagination() {
  const newsGrid = document.getElementById('newsGrid');
  const newsCards = newsGrid.querySelectorAll('.news-card');
  
  // Calculate total pages based on number of news items
  totalPages = Math.ceil(newsCards.length / ITEMS_PER_PAGE);
  
  // Only show pagination if there are multiple pages
  if (totalPages <= 1) {
    document.getElementById('pagination').style.display = 'none';
    return;
  }
  
  renderPagination();
  showPage(1);
  
  // Add event listeners to pagination buttons
  document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
      showPage(currentPage - 1);
    }
  });
  
  document.getElementById('nextBtn').addEventListener('click', () => {
    if (currentPage < totalPages) {
      showPage(currentPage + 1);
    }
  });
}

function showPage(pageNum) {
  const newsGrid = document.getElementById('newsGrid');
  const newsCards = Array.from(newsGrid.querySelectorAll('.news-card'));
  
  currentPage = pageNum;
  
  // Hide all cards
  newsCards.forEach(card => card.style.display = 'none');
  
  // Show cards for current page
  const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const cardsToShow = newsCards.slice(startIndex, endIndex);
  
  cardsToShow.forEach(card => card.style.display = 'block');
  
  // Update pagination controls
  updatePaginationControls();
  
  // Scroll to top of news section
  newsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderPagination() {
  const paginationNumbers = document.getElementById('paginationNumbers');
  paginationNumbers.innerHTML = '';
  
  for (let i = 1; i <= totalPages; i++) {
    const button = document.createElement('button');
    button.className = 'pagination-number';
    button.textContent = i;
    button.addEventListener('click', () => showPage(i));
    paginationNumbers.appendChild(button);
  }
}

function updatePaginationControls() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageButtons = document.querySelectorAll('.pagination-number');
  
  // Update prev/next button states
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
  
  // Update page number buttons
  pageButtons.forEach((button, index) => {
    if (index + 1 === currentPage) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// Initialize pagination when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPagination);
} else {
  initPagination();
}