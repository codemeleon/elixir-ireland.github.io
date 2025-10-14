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

  // Track current navigation to prevent race conditions
  let currentNavToken = 0;
  let currentAbortController = null;
  
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
   * Get relative path from a full URL
   */
  function getRelativePath(url) {
    return new URL(url).pathname;
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
  function updateActiveNav(path) {
    // Use the provided path, or default to the current window's location if none is given
    const targetPath = new URL(path, window.location.origin).pathname;

    document.querySelectorAll('nav a').forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;

      // Check if the link's path matches the target path.
      // A special check for the homepage (path === '/') ensures it matches correctly.
      if (linkPath === targetPath || (linkPath === '/' && targetPath.startsWith('/index.html'))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
  
  /**
   * Load page content via AJAX
   */
  function loadPage(href, addToHistory = true) {
    const url = new URL(href, window.location.origin);
    const cacheKey = url.pathname; // cache by pathname only
    const fullPath = url.pathname + url.search + url.hash; // push full path

    // Increment token and abort any in-flight request
    const myToken = ++currentNavToken;
    if (currentAbortController) {
      try { currentAbortController.abort(); } catch (_) {}
    }
    currentAbortController = new AbortController();

    if (addToHistory) {
      history.pushState({ page: fullPath, cacheKey }, '', fullPath);
    }

    // Update active nav using pathname only
    updateActiveNav(cacheKey);

    // Serve from cache
    if (contentCache[cacheKey]) {
      if (myToken !== currentNavToken) return; // stale
      replaceMainContent(contentCache[cacheKey]);
      window.scrollTo(0, 0);
      // Still reinitialize scripts even when loading from cache
      reinitializeScripts(cacheKey);
      return;
    }

    // Show loading indicator
    document.body.classList.add('loading');

    // Fetch with abort support and ignore stale responses
    fetch(fullPath, { signal: currentAbortController.signal })
      .then(response => {
        if (!response.ok) throw new Error('Page not found');
        return response.text();
      })
      .then(html => {
        document.body.classList.remove('loading');
        if (myToken !== currentNavToken) return; // stale response, ignore
        const content = extractContent(html);
        if (content) {
          contentCache[cacheKey] = content;
          replaceMainContent(content);
          updatePageTitle(html);
          window.scrollTo(0, 0);
          reinitializeScripts(cacheKey);
        } else {
          window.location.href = fullPath;
        }
      })
      .catch(err => {
        document.body.classList.remove('loading');
        if (err && err.name === 'AbortError') return; // aborted, ignore
        console.error('Error loading page:', err);
        window.location.href = fullPath;
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
  function reinitializeScripts(path) {
    path = path || window.location.pathname;

    // Helper to load a script and return a promise
    function loadScript(src) {
        // If script already exists, remove it to force re-execution
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (existingScript) {
            existingScript.remove();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = false; // Ensure scripts execute in order
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    }

    // Load page-specific scripts based on pathname
    if (path.includes('news.html')) {
        // Load data first, then the script, then call the initializer
        loadScript('js/news_items.js')
            .then(() => loadScript('js/event_and_news.js'))
            .then(() => {
                if (window.initializeNews) {
                    console.log("Calling initializeNews");
                    window.initializeNews();
                } else {
                    console.warn("initializeNews function not found");
                }
            })
            .catch(err => console.error('Error loading news scripts:', err));
    } 
    else if (path.includes('events.html')) {
        // Load data first, then the script, then call the initializer
        loadScript('js/events_items.js')
            .then(() => loadScript('js/events.js'))
            .then(() => {
                if (window.initializeEvents) {
                    console.log("Calling initializeEvents");
                    window.initializeEvents();
                } else {
                    console.warn("initializeEvents function not found");
                }
            })
            .catch(err => console.error('Error loading events scripts:', err));
    }
    // Handle home page dynamic content
    else if (path.includes('home.html') || path === '/' || path.endsWith('/')) {
        Promise.all([
            loadScript('js/news_items.js'),
            loadScript('js/events_items.js')
        ])
        .then(() => {
            // Call the home page functions if they exist
            if (typeof displayLatestNews === 'function') {
                console.log("Calling displayLatestNews");
                displayLatestNews();
            }
            if (typeof displayUpcomingEvent === 'function') {
                console.log("Calling displayUpcomingEvent");
                displayUpcomingEvent();
            }
        })
        .catch(err => console.error('Error loading home page scripts:', err));
    }
  }
  
  /**
   * Handle click events on internal links
   */
  function handleLinkClick(e) {
    // Only left-click without modifier keys
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a');
    if (!link) return;

    const hrefAttr = link.getAttribute('href') || '';
    if (!hrefAttr || hrefAttr.startsWith('#') || link.hasAttribute('download') || link.target === '_blank') return;

    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return; // external
    if (link.hasAttribute('data-no-ajax')) return; // opt-out

    e.preventDefault();
    loadPage(url.href, true); // use full href to retain search/hash
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
      loadPage(window.location.pathname + window.location.search + window.location.hash, false);
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
        initializeNavigation();
        
        // This new line fixes the active state on the initial page load.
        updateActiveNav(window.location.pathname);

        // Align history state with current full URL
        const fullPath = window.location.pathname + window.location.search + window.location.hash;
        history.replaceState({ page: fullPath, cacheKey: window.location.pathname }, '', fullPath);

        // Cache current page content by pathname
        const content = extractContent(document.documentElement.outerHTML);
        if (content) {
          contentCache[window.location.pathname] = content;
        }
        
        // Initialize scripts on first load
        reinitializeScripts();
      }
    }, 50);

    setTimeout(() => {
      clearInterval(checkInterval);
      if (!headerFooterLoaded) {
        console.warn('Header/footer not loaded, navigation system may not work properly');
        initializeNavigation();
        const fullPath = window.location.pathname + window.location.search + window.location.hash;
        history.replaceState({ page: fullPath, cacheKey: window.location.pathname }, '', fullPath);
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