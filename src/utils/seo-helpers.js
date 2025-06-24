/**
 * SEO Helper Functions for Madarat Al-Kon
 * Comprehensive title and meta description generation
 */

import { decodeHtmlEntitiesSafe } from '@/lib/util';

const DEFAULT_SITE_NAME = 'مدارات الكون';
const DEFAULT_DESCRIPTION = 'موقع السفر والرحلات الأول في الوطن العربي - اكتشف أجمل الوجهات السياحية حول العالم';

/**
 * Clean text from HTML entities and extra spaces
 * @param {string} text 
 * @returns {string}
 */
export const cleanText = (text) => {
  if (!text) return '';
  const decoded = decodeHtmlEntitiesSafe(text);
  return decoded.replace(/\s+/g, ' ').trim();
};

/**
 * Generate optimized page title
 * @param {Object} options - Title generation options
 * @param {string} options.title - Main title
 * @param {string} options.category - Category/section name
 * @param {string} options.siteName - Site name (default: مدارات الكون)
 * @param {number} options.maxLength - Maximum title length (default: 60)
 * @param {boolean} options.includeCategory - Whether to include category in title
 * @returns {string}
 */
export const generateSEOTitle = ({
  title = '',
  category = '',
  siteName = DEFAULT_SITE_NAME,
  maxLength = 60,
  includeCategory = false
}) => {
  let cleanTitle = cleanText(title);
  
  if (!cleanTitle) {
    cleanTitle = 'صفحة';
  }
  
  let seoTitle = cleanTitle;
  
  // Add category if requested and available
  if (includeCategory && category) {
    const cleanCategory = cleanText(category);
    if (!seoTitle.includes(cleanCategory)) {
      seoTitle = `${seoTitle} - ${cleanCategory}`;
    }
  }
  
  // Add site name if not already included
  if (!seoTitle.includes(siteName)) {
    seoTitle = `${seoTitle} | ${siteName}`;
  }
  
  // Trim to max length if needed
  if (seoTitle.length > maxLength) {
    const parts = seoTitle.split(' | ');
    if (parts[0].length > maxLength - siteName.length - 3) {
      parts[0] = parts[0].substring(0, maxLength - siteName.length - 6) + '...';
    }
    seoTitle = parts.join(' | ');
  }
  
  return seoTitle;
};

/**
 * Generate optimized meta description
 * @param {Object} options - Description generation options
 * @param {string} options.description - Original description
 * @param {string} options.title - Page title
 * @param {string} options.category - Category name
 * @param {string} options.type - Page type (post, trip, category, etc.)
 * @param {number} options.maxLength - Maximum description length (default: 155)
 * @param {Object} options.extras - Additional context
 * @returns {string}
 */
export const generateSEODescription = ({
  description = '',
  title = '',
  category = '',
  type = 'page',
  maxLength = 155,
  extras = {}
}) => {
  // Clean and use existing description if available
  const cleanDesc = cleanText(description);
  if (cleanDesc && cleanDesc.length >= 100) {
    return cleanDesc.length > maxLength ? cleanDesc.substring(0, maxLength - 3) + '...' : cleanDesc;
  }
  
  // Generate description based on title and type
  const cleanTitle = cleanText(title) || 'صفحة';
  let generatedDesc = '';
  
  switch (type) {
    case 'post':
      generatedDesc = `اقرأ عن ${cleanTitle}`;
      if (category) generatedDesc += ` في قسم ${cleanText(category)}`;
      generatedDesc += ' - دليلك الشامل للسفر والسياحة مع مدارات الكون';
      break;
      
    case 'trip':
      generatedDesc = `احجز رحلة ${cleanTitle}`;
      if (extras.destination) generatedDesc += ` إلى ${extras.destination}`;
      if (extras.duration) generatedDesc += ` لمدة ${extras.duration}`;
      if (extras.price) generatedDesc += ` بسعر ${extras.price} ريال`;
      generatedDesc += ' - أفضل العروض السياحية مع مدارات الكون';
      break;
      
    case 'category':
      const postsCount = extras.postsCount || 0;
      generatedDesc = `استكشف ${postsCount} مقال في ${cleanTitle}`;
      generatedDesc += ' - اكتشف أفضل النصائح والمعلومات مع مدارات الكون';
      break;
      
    case 'destination':
      generatedDesc = `اكتشف ${cleanTitle} مع مدارات الكون`;
      if (extras.tripsCount) generatedDesc += ` - ${extras.tripsCount} رحلة متاحة`;
      generatedDesc += ' - أفضل الوجهات السياحية والعروض المميزة';
      break;
      
    default:
      generatedDesc = `${cleanTitle} - ${DEFAULT_DESCRIPTION}`;
  }
  
  return generatedDesc.length > maxLength ? generatedDesc.substring(0, maxLength - 3) + '...' : generatedDesc;
};

/**
 * Generate keywords for SEO
 * @param {Object} options - Keywords generation options
 * @param {string} options.title - Page title
 * @param {string} options.category - Category/section name
 * @param {string} options.type - Page type
 * @param {Array} options.customKeywords - Additional custom keywords
 * @param {Object} options.extras - Additional context
 * @returns {string}
 */
export const generateSEOKeywords = ({
  title = '',
  category = '',
  type = 'page',
  customKeywords = [],
  extras = {}
}) => {
  const baseKeywords = ['مدارات الكون', 'سياحة', 'سفر', 'رحلات'];
  
  // Add title-based keywords
  if (title) {
    const cleanTitle = cleanText(title);
    baseKeywords.push(cleanTitle);
    
    // Extract individual words from title
    const titleWords = cleanTitle.split(' ').filter(word => word.length > 2);
    baseKeywords.push(...titleWords);
  }
  
  // Add category-based keywords
  if (category) {
    baseKeywords.push(category);
  }
  
  // Add type-specific keywords
  switch (type) {
    case 'post':
      baseKeywords.push('مقالات', 'نصائح السفر', 'دليل السياحة');
      break;
    case 'trip':
      baseKeywords.push('حجز رحلة', 'عروض سفر', 'باقات سياحية');
      if (extras.destination) {
        baseKeywords.push(extras.destination, `رحلات ${extras.destination}`);
      }
      break;
    case 'category':
      baseKeywords.push('أخبار السياحة', 'معلومات السفر');
      break;
    case 'destination':
      baseKeywords.push('وجهات سياحية', 'أماكن سياحية');
      break;
  }
  
  // Add custom keywords
  baseKeywords.push(...customKeywords);
  
  // Remove duplicates and clean
  const uniqueKeywords = [...new Set(baseKeywords)]
    .filter(keyword => keyword && keyword.length > 1)
    .map(keyword => cleanText(keyword))
    .filter(keyword => keyword);
  
  return uniqueKeywords.join(', ');
};

/**
 * Generate complete SEO metadata object
 * @param {Object} options - SEO metadata options
 * @returns {Object}
 */
export const generateSEOMetadata = ({
  title = '',
  description = '',
  category = '',
  type = 'page',
  url = '',
  image = '',
  extras = {},
  customKeywords = []
}) => {
  const seoTitle = generateSEOTitle({ title, category, includeCategory: !!category });
  const seoDescription = generateSEODescription({ description, title, category, type, extras });
  const seoKeywords = generateSEOKeywords({ title, category, type, customKeywords, extras });
  
  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords,
    url: url,
    image: image || '/images/default-og-image.jpg',
    type: type === 'post' ? 'article' : 'website',
    siteName: DEFAULT_SITE_NAME
  };
};

/**
 * Validate SEO metadata
 * @param {Object} metadata - SEO metadata to validate
 * @returns {Object} - Validation results
 */
export const validateSEOMetadata = (metadata) => {
  const issues = [];
  const warnings = [];
  
  // Title validation
  if (!metadata.title || metadata.title.trim().length === 0) {
    issues.push('Title is missing or empty');
  } else if (metadata.title.length > 60) {
    warnings.push('Title is longer than 60 characters');
  } else if (metadata.title.length < 30) {
    warnings.push('Title is shorter than 30 characters');
  }
  
  // Description validation
  if (!metadata.description || metadata.description.trim().length === 0) {
    issues.push('Description is missing or empty');
  } else if (metadata.description.length > 160) {
    warnings.push('Description is longer than 160 characters');
  } else if (metadata.description.length < 120) {
    warnings.push('Description is shorter than 120 characters');
  }
  
  // Keywords validation
  if (!metadata.keywords || metadata.keywords.trim().length === 0) {
    warnings.push('Keywords are missing');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    warnings
  };
};

export default {
  generateSEOTitle,
  generateSEODescription,
  generateSEOKeywords,
  generateSEOMetadata,
  validateSEOMetadata,
  cleanText
};