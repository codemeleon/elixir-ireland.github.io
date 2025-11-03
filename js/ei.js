// This file can be used for any custom JavaScript functionality for the site.

// Load header and footer efficiently with caching
(function () {
  // Immediately inject header to prevent flash
  const headerHTML = `
    <header>
      <nav class="navbar">
        <div class="container">
          <div class="nav-brand">
            <a href="home.html">
              <img src="https://elixir-europe.org/sites/default/files/images/elixir-ireland-logo.png" alt="ELIXIR Ireland Logo" class="logo">
              <span class="brand-text">ELIXIR Ireland</span>
            </a>
          </div>
          <div class="nav-links">
            <a href="home.html" class="nav-link">Home</a>
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
      setActiveNavLink();
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
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "home.html";
  const navLinks = document.querySelectorAll(".nav-link");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage || (currentPage === "" && linkPage === "home.html") || (currentPage === "home.html" && linkPage === "home.html")) {
      link.classList.add("active");
    }
  });
}

function loadHeader() {
  const header = `
    <header>
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <a href="home.html">
              <img src="images/ELIXIR_IRELAND_white_background.png" alt="ELIXIR Ireland Logo" />
            </a>
          </div>
          <nav>
            <ul class="nav-menu">
              <li><a href="home.html" class="nav-link" data-page="home">Home</a></li>
              <li><a href="about.html" class="nav-link" data-page="about">About</a></li>
              <li><a href="what-we-do.html" class="nav-link" data-page="what-we-do">What We Do</a></li>
              <li><a href="people.html" class="nav-link" data-page="people">People</a></li>
              <li><a href="participate.html" class="nav-link" data-page="participate">Participate</a></li>
              <li><a href="events.html" class="nav-link" data-page="events">Events</a></li>
              <li><a href="news.html" class="nav-link" data-page="news">News</a></li>
              <li><a href="contact.html" class="nav-link" data-page="contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `;
  document.getElementById("header-placeholder").innerHTML = header;
  setActiveNavLink();
}

// Auto-load content when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on the home page (index.html or root)
  const isHomePage = window.location.pathname === '/' || 
                     window.location.pathname === '/index.html' || 
                     window.location.pathname.endsWith('/index.html');
  
  // Check if we're on the events page
  const isEventsPage = window.location.pathname.includes('events.html');
  
  if (isHomePage) {
    // Load news and events for home page
    if (typeof loadNews === 'function') {
      loadNews();
    }
    if (typeof loadHomeEvents === 'function') {
      loadHomeEvents();
    }
  }
  
  if (isEventsPage) {
    // Load events for events page
    if (typeof loadEvents === 'function') {
      loadEvents();
    }
  }
});
