/**
 * Dynamic Navigation System - Clean Implementation
 * Loads page content without reloading header/footer
 */
(function() {
  'use strict';

  // Configuration
  const contentCache = {};
  let headerFooterLoaded = false;
  let currentNavToken = 0;
  let currentAbortController = null;
  let currentPath = null;

  // Track which scripts are loaded
  const loadedScripts = new Set();

  /**
   * Extract main content from HTML string
   */
  function extractContent(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const headerPlaceholder = doc.querySelector('#header-placeholder');
    const footerPlaceholder = doc.querySelector('#footer-placeholder');
    
    if (headerPlaceholder && footerPlaceholder) {
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
    
    const main = doc.querySelector('main');
    return main ? main.outerHTML : null;
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
    const targetPath = new URL(path, window.location.origin).pathname;

    document.querySelectorAll('nav a').forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      
      if (linkPath === targetPath || 
          (linkPath === '/' && targetPath.startsWith('/index.html')) ||
          (linkPath.endsWith('/home.html') && (targetPath === '/' || targetPath.endsWith('/index.html')))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Load page-specific stylesheets
   */
  function loadPageStyles(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newStyles = doc.querySelectorAll('head link[rel="stylesheet"]');
    
    const loadPromises = [];
    
    newStyles.forEach(styleLink => {
      const href = styleLink.getAttribute('href');
      if (href && !document.querySelector(`link[href="${href}"]`)) {
        const loadPromise = new Promise((resolve, reject) => {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.type = 'text/css';
          newLink.href = href;
          newLink.onload = () => {
            console.log(`✓ Loaded stylesheet: ${href}`);
            resolve();
          };
          newLink.onerror = () => {
            console.error(`✗ Failed to load stylesheet: ${href}`);
            reject();
          };
          document.head.appendChild(newLink);
        });
        loadPromises.push(loadPromise);
      }
    });
    
    if (loadPromises.length === 0) {
      console.log('No new stylesheets to load');
    }
    
    return Promise.all(loadPromises);
  }
  
  /**
   * Load page-specific scripts
   */
  function loadPageScripts(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('body script[src]');
    
    const loadPromises = [];
    
    scripts.forEach(scriptTag => {
      const src = scriptTag.getAttribute('src');
      if (!src) return;
      
      // Skip core scripts that are always loaded
      if (src.includes('ei.js') || src.includes('navigation.js')) {
        return;
      }
      
      // Check if script is already loaded
      const scriptId = `script-${src.replace(/[^a-zA-Z0-9]/g, '-')}`;
      if (document.getElementById(scriptId)) {
        console.log(`Script already loaded: ${src}`);
        return;
      }
      
      const loadPromise = new Promise((resolve, reject) => {
        const newScript = document.createElement('script');
        newScript.id = scriptId;
        newScript.src = src;
        newScript.onload = () => {
          console.log(`✓ Loaded script: ${src}`);
          resolve();
        };
        newScript.onerror = () => {
          console.error(`✗ Failed to load script: ${src}`);
          reject();
        };
        document.body.appendChild(newScript);
      });
      
      loadPromises.push(loadPromise);
    });
    
    if (loadPromises.length === 0) {
      console.log('No new scripts to load');
    }
    
    return Promise.all(loadPromises);
  }

  /**
   * Replace the main content between header and footer
   */
  function replaceMainContent(content) {
    const headerPlaceholder = document.querySelector('#header-placeholder');
    const footerPlaceholder = document.querySelector('#footer-placeholder');
    
    if (headerPlaceholder && footerPlaceholder) {
      let currentNode = headerPlaceholder.nextSibling;
      const nodesToRemove = [];
      
      while (currentNode && currentNode !== footerPlaceholder) {
        nodesToRemove.push(currentNode);
        currentNode = currentNode.nextSibling;
      }
      
      nodesToRemove.forEach(node => node.remove());
      footerPlaceholder.insertAdjacentHTML('beforebegin', content);
    }
  }

  /**
   * Initialize page-specific functionality
   */
  function initializePage(pathname) {
    console.log('Initializing page:', pathname);
    
    // Initialize based on page type
    if (pathname.includes('news.html')) {
      if (typeof window.resetNews === 'function') {
        window.resetNews();
      }
      if (typeof window.initializeNews === 'function') {
        console.log('Calling initializeNews');
        window.initializeNews();
      } else {
        console.warn('initializeNews function not found');
      }
    } else if (pathname.includes('events.html')) {
      if (typeof window.resetEvents === 'function') {
        window.resetEvents();
      }
      if (typeof window.initializeEvents === 'function') {
        console.log('Calling initializeEvents');
        window.initializeEvents();
      } else {
        console.warn('initializeEvents function not found');
      }
    } else if (pathname.includes('home.html') || pathname === '/' || pathname.endsWith('/index.html')) {
      // Home page dynamic content
      if (typeof displayLatestNews === 'function') {
        displayLatestNews();
      }
      if (typeof displayUpcomingEvent === 'function') {
        displayUpcomingEvent();
      }
    }
  }

  /**
   * Load page content via AJAX
   */
  function loadPage(href, addToHistory = true) {
    const url = new URL(href, window.location.origin);
    const cacheKey = url.pathname;
    const fullPath = url.pathname + url.search + url.hash;

    // Prevent redundant navigation
    if (currentPath === fullPath && !addToHistory) {
      return;
    }
    currentPath = fullPath;

    // Increment token and abort any in-flight request
    const myToken = ++currentNavToken;
    if (currentAbortController) {
      try { currentAbortController.abort(); } catch (_) {}
    }
    currentAbortController = new AbortController();

    if (addToHistory) {
      history.pushState({ page: fullPath, cacheKey }, '', fullPath);
    }

    updateActiveNav(cacheKey);

    // Serve from cache
    if (contentCache[cacheKey]) {
      if (myToken !== currentNavToken) return;
      replaceMainContent(contentCache[cacheKey]);
      window.scrollTo(0, 0);
      
      // Even when serving from cache, wait for DOM to settle before initializing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initializePage(cacheKey);
          // Notify that navigation is complete
          window.dispatchEvent(new Event('navigationComplete'));
        });
      });
      return;
    }

    // Show loading indicator
    document.body.classList.add('loading');

    // Fetch with abort support
    fetch(fullPath, { signal: currentAbortController.signal })
      .then(response => {
        if (!response.ok) throw new Error('Page not found');
        return response.text();
      })
      .then(html => {
        document.body.classList.remove('loading');
        if (myToken !== currentNavToken) return;

        // Load styles first, then scripts, then initialize
        return loadPageStyles(html)
          .then(() => loadPageScripts(html))
          .then(() => {
            const content = extractContent(html);
            if (content) {
              contentCache[cacheKey] = content;
              replaceMainContent(content);
              updatePageTitle(html);
              window.scrollTo(0, 0);
              
              // Wait a tick for DOM to settle, then initialize
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  initializePage(cacheKey);
                  // Notify that navigation is complete
                  window.dispatchEvent(new Event('navigationComplete'));
                });
              });
            } else {
              window.location.href = fullPath;
            }
          });
      })
      .catch(err => {
        document.body.classList.remove('loading');
        if (err && err.name === 'AbortError') return;
        console.error('Error loading page:', err);
        window.location.href = fullPath;
      });
  }

  /**
   * Handle click events on internal links
   */
  function handleLinkClick(e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const link = e.target.closest('a');
    if (!link) return;

    const hrefAttr = link.getAttribute('href') || '';
    if (!hrefAttr || hrefAttr.startsWith('#') || link.hasAttribute('download') || link.target === '_blank') return;

    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return;
    if (link.hasAttribute('data-no-ajax')) return;

    e.preventDefault();
    loadPage(url.href, true);
  }

  /**
   * Initialize navigation event listeners
   */
  function initializeNavigation() {
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
   * Wait for header/footer to be loaded, then initialize
   */
  function waitForHeaderFooter() {
    const checkInterval = setInterval(() => {
      const header = document.querySelector('#header-placeholder > *');
      const footer = document.querySelector('#footer-placeholder > *');
      if (header && footer) {
        clearInterval(checkInterval);
        headerFooterLoaded = true;
        initializeNavigation();
        
        // Dispatch event to notify burger menu can initialize
        window.dispatchEvent(new Event('navigationComplete'));
        
        updateActiveNav(window.location.pathname);

        const fullPath = window.location.pathname + window.location.search + window.location.hash;
        currentPath = fullPath;
        history.replaceState({ page: fullPath, cacheKey: window.location.pathname }, '', fullPath);

        // Cache current page content
        const content = extractContent(document.documentElement.outerHTML);
        if (content) {
          contentCache[window.location.pathname] = content;
        }
        
        // Initialize current page
        initializePage(window.location.pathname);
      }
    }, 50);

    setTimeout(() => {
      clearInterval(checkInterval);
      if (!headerFooterLoaded) {
        console.warn('Header/footer not loaded, navigation system may not work properly');
        initializeNavigation();
        const fullPath = window.location.pathname + window.location.search + window.location.hash;
        currentPath = fullPath;
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