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
 * Encodes Arabic characters and special characters to ASCII-safe format
 * @param {string} url - The URL to encode
 * @returns {string} The ASCII-safe encoded URL
 */
export const encodeArabicUrl = (url) => {
  if (!url) return '';

  try {
    // Encode Arabic characters and special characters to ASCII format
    return encodeURIComponent(url);
  } catch (e) {
    console.error('Error encoding URL:', e);
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
  const arabicPattern =
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

/**
 * Checks if a string contains non-ASCII characters
 * @param {string} text - The text to check
 * @returns {boolean} Whether the text contains non-ASCII characters
 */
export const containsNonASCII = (text) => {
  if (!text) return false;
  // ASCII characters are in the range 0-127
  // eslint-disable-next-line no-control-regex
  return /[^\x00-\x7F]/.test(text);
};

/**
 * Converts a URL to ASCII-safe format for SEO compliance
 * @param {string} url - The URL to convert
 * @returns {string} The ASCII-safe URL
 */
export const toASCIISafeUrl = (url) => {
  if (!url) return '';

  try {
    // If URL contains non-ASCII characters, encode them
    if (containsNonASCII(url)) {
      return encodeURIComponent(url);
    }
    return url;
  } catch (e) {
    console.error('Error converting to ASCII-safe URL:', e);
    return url;
  }
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

/**
 * Creates both encoded and decoded versions of a URL for compatibility
 * @param {string} url - The original URL
 * @returns {Object} Object containing both versions
 */
export const createUrlVersions = (url) => {
  if (!url) return { original: '', encoded: '', decoded: '' };

  const original = url;
  const encoded = toASCIISafeUrl(url);
  const decoded = decodeArabicUrl(url);

  return {
    original,
    encoded,
    decoded,
    hasNonASCII: containsNonASCII(url),
    hasArabic: containsArabic(url)
  };
};

/**
 * Generates canonical URL with proper encoding
 * @param {string} baseUrl - The base URL (e.g., https://madaratalkon.sa)
 * @param {string} path - The path part of the URL
 * @returns {string} The properly encoded canonical URL
 */
export const generateCanonicalUrl = (baseUrl, path) => {
  if (!baseUrl || !path) return '';

  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Encode the path if it contains non-ASCII characters
  const encodedPath = toASCIISafeUrl(cleanPath);
  
  return `${baseUrl}/${encodedPath}`;
};

/**
 * Validates if a URL is ASCII-compliant
 * @param {string} url - The URL to validate
 * @returns {Object} Validation result with details
 */
export const validateUrlASCII = (url) => {
  if (!url) return { isValid: false, issues: ['Empty URL'] };

  const issues = [];
  const isASCII = !containsNonASCII(url);
  
  if (!isASCII) {
    issues.push('Contains non-ASCII characters');
  }

  if (containsArabic(url)) {
    issues.push('Contains Arabic characters');
  }

  // Check for other problematic characters
  const problematicChars = /[<>"\s{}|\\^`[\]]/;
  if (problematicChars.test(url)) {
    issues.push('Contains problematic characters for URLs');
  }

  return {
    isValid: issues.length === 0,
    isASCII,
    hasArabic: containsArabic(url),
    issues,
    suggestion: issues.length > 0 ? toASCIISafeUrl(url) : url
  };
};
