/**
 * Fixes WordPress links to work with our local navigation
 * This script should be run on the client-side to modify links that might point to WordPress
 */
export function fixInternalLinks() {
  if (typeof document === 'undefined') return;
  
  // Get the current page slug
  const currentPath = window.location.pathname;
  const slug = currentPath.split('/').pop();
  
  // Get all links in the page content
  const contentLinks = document.querySelectorAll('.content a');
  
  // Process each link
  contentLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Skip if no href
    if (!href) return;
    
    // Check if it's a WordPress link pointing to a section on the current page
    if (href.includes('madaratalkon.com') && href.includes('#')) {
      // Extract the fragment/hash
      const hashIndex = href.indexOf('#');
      if (hashIndex !== -1) {
        const fragment = href.substring(hashIndex);
        
        // Change it to point to the local page with the same fragment
        link.setAttribute('href', fragment);
        
        // Add click handler for smooth scrolling
        link.addEventListener('click', (e) => {
          e.preventDefault();
          
          const targetId = fragment.substring(1); // Remove the # character
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Scroll to the element
            targetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
            
            // Update URL without reloading
            history.pushState(null, null, fragment);
          }
        });
      }
    }
  });
}

/**
 * Process all heading links that might come from WordPress
 * This helps create proper anchors for headings
 */
export function processHeadingAnchors() {
  if (typeof document === 'undefined') return;
  
  // Get all headings in the content
  const headings = document.querySelectorAll('.content h1, .content h2, .content h3, .content h4, .content h5, .content h6');
  
  // Process each heading
  headings.forEach(heading => {
    // Skip if already has an ID
    if (heading.id) return;
    
    // Create an ID from the heading text
    const headingText = heading.textContent.trim();
    const id = headingText
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/-+/g, '_'); // Replace multiple dashes with a single underscore
    
    // Set the ID
    heading.id = id;
  });
} 