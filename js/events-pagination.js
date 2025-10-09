// Events Pagination and Filter Functionality

const ITEMS_PER_PAGE = 6; // Number of event items per page
let currentPage = 1;
let totalPages = 1;
let currentFilter = 'all';

function initEventsPagination() {
  const eventsGrid = document.getElementById('eventsGrid');
  const eventCards = eventsGrid.querySelectorAll('.event-card');
  
  // Initialize filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // Update active filter button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      
      // Get filter value and apply
      currentFilter = e.target.getAttribute('data-filter');
      applyFilter();
    });
  });
  
  // Calculate total pages and show first page
  updatePagination();
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

function applyFilter() {
  const eventsGrid = document.getElementById('eventsGrid');
  const eventCards = Array.from(eventsGrid.querySelectorAll('.event-card'));
  
  // Show/hide cards based on filter
  eventCards.forEach(card => {
    const category = card.getAttribute('data-category');
    if (currentFilter === 'all' || category === currentFilter) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }
  });
  
  // Recalculate pagination after filtering
  updatePagination();
  showPage(1);
}

function updatePagination() {
  const eventsGrid = document.getElementById('eventsGrid');
  const visibleCards = eventsGrid.querySelectorAll('.event-card:not(.hidden)');
  
  // Calculate total pages based on visible cards
  totalPages = Math.ceil(visibleCards.length / ITEMS_PER_PAGE);
  
  // Hide pagination if only one page or no items
  const paginationElement = document.getElementById('pagination');
  if (totalPages <= 1) {
    paginationElement.style.display = 'none';
  } else {
    paginationElement.style.display = 'flex';
    renderPagination();
  }
}

function showPage(pageNum) {
  const eventsGrid = document.getElementById('eventsGrid');
  const allCards = Array.from(eventsGrid.querySelectorAll('.event-card'));
  const visibleCards = allCards.filter(card => !card.classList.contains('hidden'));
  
  currentPage = pageNum;
  
  // Hide all visible cards
  visibleCards.forEach(card => card.style.display = 'none');
  
  // Show cards for current page
  const startIndex = (pageNum - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const cardsToShow = visibleCards.slice(startIndex, endIndex);
  
  cardsToShow.forEach(card => card.style.display = 'block');
  
  // Update pagination controls
  updatePaginationControls();
  
  // Scroll to top of events section
  eventsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderPagination() {
  const eventsGrid = document.getElementById('eventsGrid');
  const visibleCards = eventsGrid.querySelectorAll('.event-card:not(.hidden)');
  const totalPages = Math.ceil(visibleCards.length / ITEMS_PER_PAGE);
  const paginationContainer = document.getElementById('pagination');
  
  // Hide pagination if not needed
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }
  
  paginationContainer.style.display = 'flex';
  
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

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEventsPagination);
} else {
  initEventsPagination();
}