/**
 * Decodes URL-encoded Arabic characters to display them properly in the browser
 * @param {string} url - The URL to decode
 * @returns {string} The decoded URL
 */
export const decodeArabicUrl = (url) => {
  if (!url) return '';
  
  try {
    // Decode URL-encoded Arabic characters
    return decodeURIComponent(url);
  } catch (e) {
    console.error('Error decoding URL:', e);
    return url;
  }
};

/**
 * Checks if a string contains Arabic characters
 * @param {string} text - The text to check
 * @returns {boolean} Whether the text contains Arabic characters
 */
export const containsArabic = (text) => {
  if (!text) return false;
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

/**
 * Normalizes URLs for use in Next.js router
 * @param {string} url - The URL to normalize
 * @returns {string} The normalized URL
 */
export const normalizeUrl = (url) => {
  if (!url) return '';
  
  // If URL already contains Arabic characters, don't encode it
  if (containsArabic(url)) {
    return url;
  }
  
  // Otherwise, try to decode it in case it's already encoded
  return decodeArabicUrl(url);
}; 