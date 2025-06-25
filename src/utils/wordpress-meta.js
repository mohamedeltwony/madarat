/**
 * WordPress Meta Description Utilities
 * Centralized logic for extracting meta descriptions from WordPress/Yoast data
 */

import { decodeHtmlEntitiesSafe } from '@/lib/util';

/**
 * Extracts meta description from WordPress data with fallback hierarchy
 * @param {Object} wordpressData - WordPress post/trip/page data
 * @param {Object} options - Additional options for fallback generation
 * @returns {string} - Optimized meta description
 */
export function extractWordPressMetaDescription(wordpressData = {}, options = {}) {
  const { maxLength = 155, fallbackTitle = '', fallbackType = 'page' } = options;
  
  // 1. PRIORITY: Yoast SEO meta description (WordPress backend)
  if (wordpressData.yoast_head_json?.description) {
    const yoastDesc = decodeHtmlEntitiesSafe(wordpressData.yoast_head_json.description.trim());
    if (yoastDesc && yoastDesc.length > 20) {
      return truncateDescription(yoastDesc, maxLength);
    }
  }
  
  // 2. SECONDARY: Yoast OG description
  if (wordpressData.yoast_head_json?.og_description) {
    const ogDesc = decodeHtmlEntitiesSafe(wordpressData.yoast_head_json.og_description.trim());
    if (ogDesc && ogDesc.length > 20) {
      return truncateDescription(ogDesc, maxLength);
    }
  }
  
  // 3. TERTIARY: WordPress excerpt (clean HTML)
  if (wordpressData.excerpt?.rendered) {
    const cleanExcerpt = cleanWordPressContent(wordpressData.excerpt.rendered);
    if (cleanExcerpt && cleanExcerpt.length > 20) {
      return truncateDescription(cleanExcerpt, maxLength);
    }
  }
  
  // 4. FALLBACK: Generate from available data
  return generateFallbackDescription(wordpressData, { fallbackTitle, fallbackType, maxLength });
}

/**
 * Cleans WordPress content by removing HTML tags and entities
 * @param {string} content - Raw WordPress content
 * @returns {string} - Cleaned text content
 */
function cleanWordPressContent(content) {
  if (!content || typeof content !== 'string') return '';
  
  return content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .replace(/\[&hellip;\]/g, '') // Remove WordPress ellipsis
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Truncates description to optimal length
 * @param {string} description - Description text
 * @param {number} maxLength - Maximum character length
 * @returns {string} - Truncated description
 */
function truncateDescription(description, maxLength = 155) {
  if (!description || description.length <= maxLength) return description;
  
  // Try to break at word boundary
  const truncated = description.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.8) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

/**
 * Generates fallback meta description when WordPress data is insufficient
 * @param {Object} data - WordPress data object
 * @param {Object} options - Generation options
 * @returns {string} - Generated description
 */
function generateFallbackDescription(data, options = {}) {
  const { fallbackTitle = '', fallbackType = 'page', maxLength = 155 } = options;
  
  // Clean title for use in description
  const cleanTitle = fallbackTitle 
    ? decodeHtmlEntitiesSafe(fallbackTitle.replace(/&[^;]+;/g, '').trim())
    : (data.title?.rendered ? decodeHtmlEntitiesSafe(data.title.rendered) : '');
  
  let description = '';
  
  // Generate based on content type
  switch (fallbackType) {
    case 'trip':
      description = generateTripFallback(data, cleanTitle);
      break;
    case 'post':
      description = generatePostFallback(data, cleanTitle);
      break;
    case 'destination':
      description = generateDestinationFallback(data, cleanTitle);
      break;
    default:
      description = generateGenericFallback(cleanTitle);
  }
  
  return truncateDescription(description, maxLength);
}

/**
 * Generates fallback description for trip pages
 */
function generateTripFallback(tripData, title) {
  const cleanTripTitle = title || 'رحلة سياحية مميزة';
  let desc = `احجز رحلة ${cleanTripTitle}`;
  
  // Add destination if available
  const destination = tripData?.destination?.title || tripData?.destination?.name || tripData?.destination || '';
  if (destination) {
    desc += ` إلى ${destination}`;
  }
  
  // Add duration if available
  const duration = tripData?.duration?.days || tripData?.wp_travel_engine_setting_trip_duration;
  if (duration) {
    desc += ` لمدة ${duration} أيام`;
  }
  
  // Add price if available
  const price = tripData?.wp_travel_engine_setting_trip_actual_price || tripData?.price;
  if (price) {
    desc += ` بسعر ${price.toLocaleString('en-US')} ريال`;
  }
  
  desc += ' مع مدارات الكون. أفضل العروض السياحية والخدمات المتميزة.';
  
  return desc;
}

/**
 * Generates fallback description for blog posts
 */
function generatePostFallback(postData, title) {
  const cleanTitle = title || 'مقال مفيد';
  return `اقرأ المزيد عن ${cleanTitle} في مدارات الكون - دليلك الشامل للسفر والسياحة.`;
}

/**
 * Generates fallback description for destination pages
 */
function generateDestinationFallback(destData, title) {
  const cleanTitle = title || 'وجهة سياحية';
  return `اكتشف رحلات مدارات في ${cleanTitle}. مجموعة مميزة من الرحلات السياحية في ${cleanTitle}.`;
}

/**
 * Generates generic fallback description
 */
function generateGenericFallback(title) {
  const cleanTitle = title || 'صفحة';
  return `${cleanTitle} - مدارات الكون للسياحة والسفر. اكتشف أفضل العروض السياحية والرحلات المميزة.`;
}

/**
 * Extracts WordPress title with Yoast priority
 * @param {Object} wordpressData - WordPress data
 * @param {string} fallbackTitle - Fallback title
 * @returns {string} - Optimized title
 */
export function extractWordPressTitle(wordpressData = {}, fallbackTitle = '') {
  // 1. Yoast SEO title
  if (wordpressData.yoast_head_json?.title) {
    return decodeHtmlEntitiesSafe(wordpressData.yoast_head_json.title);
  }
  
  // 2. Yoast OG title
  if (wordpressData.yoast_head_json?.og_title) {
    return decodeHtmlEntitiesSafe(wordpressData.yoast_head_json.og_title);
  }
  
  // 3. WordPress title
  if (wordpressData.title?.rendered) {
    return decodeHtmlEntitiesSafe(wordpressData.title.rendered);
  }
  
  // 4. Fallback
  return fallbackTitle || 'مدارات الكون';
}

/**
 * Extracts WordPress canonical URL
 * @param {Object} wordpressData - WordPress data
 * @param {string} fallbackUrl - Fallback URL
 * @returns {string} - Canonical URL
 */
export function extractWordPressCanonical(wordpressData = {}, fallbackUrl = '') {
  return wordpressData.yoast_head_json?.canonical || fallbackUrl;
}

/**
 * Extracts WordPress robots meta
 * @param {Object} wordpressData - WordPress data
 * @returns {string} - Robots directive
 */
export function extractWordPressRobots(wordpressData = {}) {
  const robots = wordpressData.yoast_head_json?.robots;
  if (!robots) return 'index, follow';
  
  const directives = [];
  if (robots.index) directives.push(robots.index);
  if (robots.follow) directives.push(robots.follow);
  if (robots['max-snippet']) directives.push(robots['max-snippet']);
  if (robots['max-image-preview']) directives.push(robots['max-image-preview']);
  if (robots['max-video-preview']) directives.push(robots['max-video-preview']);
  
  return directives.length > 0 ? directives.join(', ') : 'index, follow';
} 