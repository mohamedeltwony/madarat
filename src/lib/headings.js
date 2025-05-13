/**
 * Extract headings from HTML content with their IDs and levels
 * @param {string} html - HTML content
 * @returns {Array} - Array of heading objects with id, text, and level
 */
export function extractHeadings(html) {
  if (!html) return [];
  
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all heading elements (h1, h2, h3, h4, h5, h6)
    const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    // Extract heading information
    return headingElements.map(heading => {
      const level = parseInt(heading.tagName.substring(1));
      const text = heading.textContent.trim();
      
      // Get existing ID or generate a new one
      let id = heading.id || '';
      if (!id) {
        // Generate an ID from the text (slugify)
        id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .replace(/-+/g, '_'); // Replace multiple dashes with a single underscore
      }
      
      return { id, text, level };
    });
  } catch (error) {
    console.error('Error extracting headings:', error);
    return [];
  }
}

/**
 * Adds IDs to heading elements in HTML content
 * @param {string} html - HTML content
 * @returns {string} - HTML content with heading IDs
 */
export function addHeadingIds(html) {
  if (!html) return '';
  
  try {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all heading elements (h1, h2, h3, h4, h5, h6)
    const headingElements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    
    // Add IDs to headings that don't have them
    headingElements.forEach(heading => {
      if (!heading.id) {
        const text = heading.textContent.trim();
        // Generate an ID from the text (slugify)
        const id = text
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '_') // Replace spaces with underscores
          .replace(/-+/g, '_'); // Replace multiple dashes with a single underscore
        
        heading.id = id;
      }
    });
    
    // Return the modified HTML
    return doc.body.innerHTML;
  } catch (error) {
    console.error('Error adding heading IDs:', error);
    return html;
  }
} 