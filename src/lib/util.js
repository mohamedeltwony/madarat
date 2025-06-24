/**
 * decodeHtmlEntities
 * Enhanced version to handle all common HTML entities
 */

export function decodeHtmlEntities(text) {
  if (typeof text !== 'string') {
    throw new Error(
      `Failed to decode HTML entity: invalid type ${typeof text}`
    );
  }

  let decoded = text;

  // Common named entities
  const namedEntities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™'
  };

  // Common numeric entities
  const numericEntities = {
    '&#8211;': '–',  // En dash
    '&#8212;': '—',  // Em dash
    '&#8216;': '\u2018',  // Left single quotation mark
    '&#8217;': '\u2019',  // Right single quotation mark
    '&#8218;': '‚',  // Single low-9 quotation mark
    '&#8220;': '\u201C',  // Left double quotation mark
    '&#8221;': '\u201D',  // Right double quotation mark
    '&#8222;': '„',  // Double low-9 quotation mark
    '&#8226;': '•',  // Bullet
    '&#8230;': '…',  // Horizontal ellipsis
    '&#8364;': '€',  // Euro sign
    '&#8482;': '™',  // Trade mark sign
    '&#169;': '©',   // Copyright sign
    '&#174;': '®',   // Registered sign
    '&#160;': ' ',   // Non-breaking space
    '&#38;': '&',    // Ampersand
    '&#60;': '<',    // Less than
    '&#62;': '>',    // Greater than
    '&#34;': '"',    // Quotation mark
    '&#39;': "'",    // Apostrophe
  };

  // Replace named entities
  Object.keys(namedEntities).forEach(entity => {
    const regex = new RegExp(entity, 'g');
    decoded = decoded.replace(regex, namedEntities[entity]);
  });

  // Replace numeric entities
  Object.keys(numericEntities).forEach(entity => {
    const regex = new RegExp(entity, 'g');
    decoded = decoded.replace(regex, numericEntities[entity]);
  });

  // Handle any remaining numeric entities (decimal)
  decoded = decoded.replace(/&#(\d+);/g, (match, dec) => {
    return String.fromCharCode(dec);
  });

  // Handle hexadecimal entities
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  return decoded;
}

/**
 * Enhanced client-safe HTML entity decoder
 * Works both server-side and client-side
 */
export function decodeHtmlEntitiesSafe(text) {
  if (!text || typeof text !== 'string') return text || '';

  // Try client-side decoding first (more accurate)
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const textarea = document.createElement('textarea');
      textarea.innerHTML = text;
      return textarea.value;
    } catch (e) {
      console.warn('Client-side HTML decoding failed, falling back to manual decoding');
    }
  }

  // Fallback to manual decoding
  return decodeHtmlEntities(text);
}

/**
 * removeLastTrailingSlash
 */

export function removeLastTrailingSlash(url) {
  if (typeof url !== 'string') return url;
  return url.replace(/\/$/, '');
}

export function removeExtraSpaces(text) {
  if (typeof text !== 'string') return;
  return text.replace(/\s+/g, ' ').trim();
}
