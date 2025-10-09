// This file can be used for any custom JavaScript functionality for the site.

// Load header and footer efficiently with caching
(function() {
  // Immediately inject header to prevent flash
  const headerHTML = `
    <header>
      <nav class="navbar">
        <div class="container">
          <div class="nav-brand">
            <a href="index.html">
              <img src="https://elixir-europe.org/sites/default/files/images/elixir-ireland-logo.png" alt="ELIXIR Ireland Logo" class="logo">
              <span class="brand-text">ELIXIR Ireland</span>
            </a>
          </div>
          <div class="nav-links">
            <a href="index.html" class="nav-link">Home</a>
            <a href="about.html" class="nav-link">About</a>
            <a href="participate.html" class="nav-link">Participate</a>
            <a href="news.html" class="nav-link">News</a>
            <a href="events.html" class="nav-link">Events</a>
            <a href="contact.html" class="nav-link">Contact</a>
          </div>
        </div>
      </nav>
    </header>
  `;

  // Load header
  fetch('includes/header.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('header-placeholder').innerHTML = data;
      setActiveNavItem();
    })
    .catch(error => console.error('Error loading header:', error));

  // Load footer
  fetch('includes/footer.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('footer-placeholder').innerHTML = data;
    })
    .catch(error => console.error('Error loading footer:', error));
})();

// Set active navigation item based on current page
function setActiveNavItem() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.header-nav a');
  
  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    const parentLi = link.parentElement;
    
    // Remove active class from all items first
    parentLi.classList.remove('active');
    
    // Add active class to current page
    if (linkPage === currentPage || 
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')) {
      parentLi.classList.add('active');
    }
  });
}

function loadHeader() {
  const headerHTML = `
    <header class="main-header">
      <div class="header-container">
        <div class="header-logo">
          <a href="index.html">
            <img src="images/logo/ELIXIR_IRELAND_white_background.png" alt="ELIXIR Ireland Logo" />
          </a>
        </div>
        <nav class="header-nav">
          <ul>
            <li class="nav-item"><a href="index.html">Home</a></li>
            <li class="nav-item"><a href="about.html">About</a></li>
            <li class="nav-item"><a href="participate.html">Participate</a></li>
            <li class="nav-item"><a href="news.html">News</a></li>
            <li class="nav-item"><a href="events.html">Events</a></li>
            <li class="nav-item"><a href="contact.html">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  `;
  
  document.getElementById('header-placeholder').innerHTML = headerHTML;
  setActiveNavItem();
}
