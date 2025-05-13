/**
 * Client-side script to decode Arabic URLs in the browser address bar
 * This script should be included in _document.js
 */
(function() {
  // Only run in the browser
  if (typeof window === 'undefined') return;

  // Function to decode URL-encoded strings
  function decodeArabicUrl(url) {
    try {
      return decodeURIComponent(url);
    } catch (e) {
      console.error('Error decoding URL:', e);
      return url;
    }
  }

  // Function to update the browser's address bar with decoded URL
  function updateAddressBar() {
    // Get the current URL
    const currentUrl = window.location.href;
    const urlParts = currentUrl.split('/');
    
    // Only process if we're on a trip page
    if (currentUrl.includes('/trips/')) {
      // Find the slug part in the URL (it will be after /trips/)
      const tripsIndex = urlParts.indexOf('trips') + 1;
      if (tripsIndex < urlParts.length) {
        const encodedSlug = urlParts[tripsIndex];
        const decodedSlug = decodeArabicUrl(encodedSlug);
        
        // If the slug was actually encoded and is now different
        if (decodedSlug !== encodedSlug) {
          // Replace the encoded slug with the decoded one
          urlParts[tripsIndex] = decodedSlug;
          const newUrl = urlParts.join('/');
          
          // Update the URL in the browser without reloading the page
          window.history.replaceState({}, document.title, newUrl);
        }
      }
    }
  }

  // Run on page load
  window.addEventListener('load', updateAddressBar);
  
  // Also run on navigation changes
  window.addEventListener('popstate', updateAddressBar);
})(); 