/**
 * Dynamic Navigation System
 * Loads page content without reloading header/footer to prevent flash
 */

(function() {
  'use strict';

  // Cache for loaded content
  const contentCache = {};
  
  // Check if header/footer are already loaded
  let headerFooterLoaded = false;
  
  /**
   * Extract main content from HTML string
   */
  function extractContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find the main content (everything between header and footer placeholders)
    const headerPlaceholder = doc.querySelector('#header-placeholder');
    const footerPlaceholder = doc.querySelector('#footer-placeholder');
    
    if (headerPlaceholder && footerPlaceholder) {
      // Get everything between header and footer
      let content = '';
      let currentNode = headerPlaceholder.nextSibling;
      
      while (currentNode && currentNode !== footerPlaceholder) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          content += currentNode.outerHTML;
        } else if (currentNode.nodeType === Node.TEXT_NODE && currentNode.textContent.trim()) {
          content += currentNode.textContent;
        }
        currentNode = currentNode.nextSibling;
      }
      
      return content;
    }
    
    // Fallback: try to find main content area
    const main = doc.querySelector('main');
    if (main) {
      return main.outerHTML;
    }
    
    return null;
  }
  
  /**
   * Update page title from loaded content
   */
  function updatePageTitle(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const title = doc.querySelector('title');
    if (title) {
      document.title = title.textContent;
    }
  }
  
  /**
   * Update active navigation state
   */
  function updateActiveNav(href) {
    // Remove all active classes
    document.querySelectorAll('nav a').forEach(link => {
      link.classList.remove('active');
      if (link.parentElement) {
        link.parentElement.classList.remove('active');
      }
    });
    
    // Add active class to matching link
    const normalizedHref = href.split('/').pop() || 'home.html';
    document.querySelectorAll('nav a').forEach(link => {
      const linkHref = link.getAttribute('href');
      if (linkHref === normalizedHref || linkHref === href || 
          (normalizedHref === 'home.html' && linkHref === 'home.html')) {
        link.classList.add('active');
        if (link.parentElement) {
          link.parentElement.classList.add('active');
        }
      }
    });
  }
  
  /**
   * Load page content via AJAX
   */
  function loadPage(href, addToHistory = true) {
    // Normalize the href
    const normalizedHref = href.split('#')[0];
    
    // Check cache first
    if (contentCache[normalizedHref]) {
      replaceMainContent(contentCache[normalizedHref]);
      updateActiveNav(normalizedHref);
      window.scrollTo(0, 0);
      return;
    }
    
    // Load content via fetch
    fetch(normalizedHref)
      .then(response => {
        if (!response.ok) {
          throw new Error('Page not found');
        }
        return response.text();
      })
      .then(html => {
        const content = extractContent(html);
        if (content) {
          // Cache the content
          contentCache[normalizedHref] = content;
          
          // Update the page
          replaceMainContent(content);
          updatePageTitle(html);
          updateActiveNav(normalizedHref);
          
          // Update browser history
          if (addToHistory) {
            history.pushState({ page: normalizedHref }, '', normalizedHref);
          }
          
          // Scroll to top
          window.scrollTo(0, 0);
          
          // Re-initialize any scripts for new content
          reinitializeScripts();
        } else {
          // If we can't extract content, fall back to full page load
          window.location.href = href;
        }
      })
      .catch(error => {
        console.error('Error loading page:', error);
        // Fallback to normal navigation
        window.location.href = href;
      });
  }
  
  /**
   * Replace the main content between header and footer
   */
  function replaceMainContent(content) {
    const headerPlaceholder = document.querySelector('#header-placeholder');
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    
    if (headerPlaceholder && footerPlaceholder) {
      // Remove everything between header and footer
      let currentNode = headerPlaceholder.nextSibling;
      const nodesToRemove = [];
      
      while (currentNode && currentNode !== footerPlaceholder) {
        nodesToRemove.push(currentNode);
        currentNode = currentNode.nextSibling;
      }
      
      nodesToRemove.forEach(node => node.remove());
      
      // Insert new content
      footerPlaceholder.insertAdjacentHTML('beforebegin', content);
    }
  }
  
  /**
   * Reinitialize scripts for dynamically loaded content
   */
  function reinitializeScripts() {
    // Dispatch a custom event that other scripts can listen to
    document.dispatchEvent(new CustomEvent('contentLoaded'));
  }
  
  /**
   * Handle click events on internal links
   */
  function handleLinkClick(e) {
    const link = e.target.closest('a');
    
    // Only handle internal navigation links
    if (link && link.href && 
        link.hostname === window.location.hostname &&
        !link.hasAttribute('data-no-ajax') &&
        !link.hasAttribute('download') &&
        link.href.endsWith('.html') &&
        !link.href.includes('#')) {
      
      // Prevent default navigation
      e.preventDefault();
      
      // Load the page dynamically
      loadPage(link.href);
    }
  }
  
  /**
   * Initialize navigation event listeners
   */
  function initializeNavigation() {
    // Add click listener to document (event delegation)
    document.addEventListener('click', handleLinkClick);
  }
  
  /**
   * Handle browser back/forward buttons
   */
  window.addEventListener('popstate', (e) => {
    if (e.state && e.state.page) {
      loadPage(e.state.page, false);
    } else {
      loadPage(window.location.pathname, false);
    }
  });
  
  /**
   * Wait for header/footer to be loaded by ei.js, then initialize
   */
  function waitForHeaderFooter() {
    const checkInterval = setInterval(() => {
      const header = document.querySelector('#header-placeholder > *');
      const footer = document.querySelector('#footer-placeholder > *');
      
      if (header && footer) {
        clearInterval(checkInterval);
        headerFooterLoaded = true;
        
        // Initialize navigation
        initializeNavigation();
        
        // Store initial state
        const currentPath = window.location.pathname;
        history.replaceState({ page: currentPath }, '', currentPath);
        
        // Cache current page content
        const headerPlaceholder = document.querySelector('#header-placeholder');
        const footerPlaceholder = document.querySelector('#footer-placeholder');
        if (headerPlaceholder && footerPlaceholder) {
          const content = extractContent(document.documentElement.outerHTML);
          if (content) {
            contentCache[currentPath] = content;
          }
        }
      }
    }, 50);
    
    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      if (!headerFooterLoaded) {
        console.warn('Header/footer not loaded, navigation system may not work properly');
        // Initialize anyway
        initializeNavigation();
      }
    }, 5000);
  }
  
  /**
   * Initialize on page load
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForHeaderFooter);
  } else {
    waitForHeaderFooter();
  }
})();
