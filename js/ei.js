// This file can be used for any custom JavaScript functionality for the site.

// Load header and footer immediately
(function() {
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
