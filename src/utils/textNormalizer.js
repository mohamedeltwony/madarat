/**
 * Normalizes text to prevent hydration errors by standardizing special characters
 * like dashes, quotes, and other characters that might differ between server and client
 * 
 * @param {string} text - The text to normalize
 * @returns {string} - The normalized text
 */
export function normalizeText(text) {
  if (typeof text !== 'string') return text;
  
  return text
    // Normalize different types of dashes
    .replace(/–/g, '-') // en dash to hyphen
    .replace(/—/g, '-') // em dash to hyphen
    
    // Normalize different types of quotes
    .replace(/"/g, '"') // smart double quotes to straight quotes
    .replace(/"/g, '"') // smart double quotes to straight quotes
    .replace(/'/g, "'") // smart single quotes to straight quotes
    .replace(/'/g, "'") // smart single quotes to straight quotes
    
    // Normalize other problematic characters
    .replace(/…/g, '...') // ellipsis to three dots
    .replace(/•/g, '*') // bullet to asterisk
    .replace(/\u200B/g, '') // zero width space
    .replace(/\u200E/g, '') // left-to-right mark
    .replace(/\u200F/g, ''); // right-to-left mark
}

/**
 * Parses HTML content and normalizes the text to prevent hydration errors
 * 
 * @param {string} html - The HTML string to parse
 * @returns {string} - The normalized HTML
 */
export function parseHtml(html) {
  if (typeof html !== 'string') return '';
  
  return html
    .replace(/–/g, '-') // en dash to hyphen
    .replace(/—/g, '-') // em dash to hyphen
    .replace(/"/g, '"') // smart double quotes to straight quotes
    .replace(/"/g, '"') // smart double quotes to straight quotes
    .replace(/'/g, "'") // smart single quotes to straight quotes
    .replace(/'/g, "'") // smart single quotes to straight quotes
    .replace(/…/g, '...') // ellipsis to three dots
    .replace(/•/g, '*') // bullet to asterisk
    .replace(/\u200B/g, '') // zero width space
    .replace(/\u200E/g, '') // left-to-right mark
    .replace(/\u200F/g, ''); // right-to-left mark
} 