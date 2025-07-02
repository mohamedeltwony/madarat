/**
 * Open Graph Helper Utilities for Madarat Al-Kon
 * Provides consistent OG data generation across all pages
 */

export const OG_DEFAULTS = {
  siteName: 'مدارات الكون',
  siteUrl: 'https://madaratalkon.sa',
  defaultImage: 'https://madaratalkon.sa/images/og-default.jpg',
  twitterHandle: '@madaratalkon',
  businessPhone: '+966123456789',
  businessEmail: 'info@madaratalkon.sa',
  businessAddress: 'المملكة العربية السعودية، الرياض',
  locale: 'ar_SA',
  themeColor: '#D4B068',
};

/**
 * Generate homepage Open Graph data
 */
export const generateHomepageOG = () => ({
  title: 'مدارات الكون - موقع السفر والرحلات الأول في الوطن العربي | أفضل العروض السياحية',
  description: 'اكتشف معنا أجمل الوجهات السياحية حول العالم مع مدارات الكون. نقدم لك أفضل العروض السياحية والرحلات المميزة إلى البوسنة وتركيا وجورجيا وأذربيجان بأسعار تنافسية وخدمات عالية الجودة.',
  keywords: 'سياحة, سفر, رحلات, وجهات سياحية, مدارات الكون, حجز رحلات, عروض سياحية, البوسنة, تركيا, جورجيا, أذربيجان, إيطاليا, سويسرا',
  url: OG_DEFAULTS.siteUrl,
  image: `${OG_DEFAULTS.siteUrl}/images/homepage-og-image.jpg`,
  imageAlt: 'مدارات الكون - أفضل العروض السياحية والرحلات المميزة',
  type: 'website',
});

/**
 * Generate trip/product page Open Graph data
 */
export const generateTripOG = ({
  tripName,
  destination,
  price,
  currency = 'SAR',
  duration,
  description,
  image,
  slug,
  features = [],
  rating = '4.8',
  reviewCount = '100'
}) => ({
  title: `رحلة ${tripName} ${duration ? `${duration} أيام` : ''} | مدارات الكون - ${price} ${currency}`,
  description: description || `اكتشف ${destination} في رحلة فاخرة مع مدارات الكون. ${features.join(', ')}. احجز الآن بسعر ${price} ${currency}.`,
  keywords: `${destination}, ${tripName}, رحلات, سياحة, مدارات الكون, ${features.join(', ')}, حجز رحلات, عروض سفر`,
  url: `${OG_DEFAULTS.siteUrl}/${slug}`,
  image: image || `${OG_DEFAULTS.siteUrl}/images/trips/${slug}-og.jpg`,
  imageAlt: `رحلة ${tripName} مع مدارات الكون`,
  type: 'product',
  product: {
    price: price,
    currency: currency,
    availability: 'InStock',
    condition: 'new',
    rating: rating,
    reviewCount: reviewCount,
  },
});

/**
 * Generate blog post Open Graph data
 */
export const generatePostOG = ({
  title,
  excerpt,
  featuredImage,
  slug,
  author,
  publishedTime,
  modifiedTime,
  categories = [],
  tags = [],
}) => ({
  title: `${title} | مدارات الكون`,
  description: excerpt || 'اكتشف أحدث المقالات والنصائح حول السفر والسياحة مع مدارات الكون.',
  keywords: `${title}, ${categories.join(', ')}, ${tags.join(', ')}, مدارات الكون, سياحة, سفر`,
  url: `${OG_DEFAULTS.siteUrl}/posts/${slug}`,
  image: featuredImage || `${OG_DEFAULTS.siteUrl}/images/posts/${slug}-og.jpg`,
  imageAlt: title,
  type: 'article',
  article: {
    author: author || 'فريق مدارات الكون',
    publishedTime: publishedTime,
    modifiedTime: modifiedTime || publishedTime,
    section: categories[0] || 'سياحة وسفر',
    tags: tags,
  },
});

/**
 * Generate destination page Open Graph data
 */
export const generateDestinationOG = ({
  destinationName,
  description,
  image,
  slug,
  tripsCount = 0,
  popularTrips = [],
}) => ({
  title: `وجهة ${destinationName} | أفضل الرحلات السياحية مع مدارات الكون`,
  description: description || `اكتشف ${destinationName} مع مجموعة رائعة من الرحلات السياحية المميزة. ${tripsCount} رحلة متاحة بأفضل الأسعار مع مدارات الكون.`,
  keywords: `${destinationName}, رحلات ${destinationName}, سياحة ${destinationName}, مدارات الكون, حجز رحلات, عروض سفر`,
  url: `${OG_DEFAULTS.siteUrl}/destination/${slug}`,
  image: image || `${OG_DEFAULTS.siteUrl}/images/destinations/${slug}-og.jpg`,
  imageAlt: `وجهة ${destinationName} - رحلات سياحية مع مدارات الكون`,
  type: 'website',
});

/**
 * Generate legal page Open Graph data
 */
export const generateLegalOG = ({
  pageTitle,
  pageDescription,
  slug,
}) => ({
  title: `${pageTitle} | مدارات الكون`,
  description: pageDescription || `${pageTitle} الخاصة بشركة مدارات الكون للسياحة والسفر.`,
  keywords: `${pageTitle}, مدارات الكون, شروط وأحكام, سياسة الخصوصية, شركة سياحة`,
  url: `${OG_DEFAULTS.siteUrl}/${slug}`,
  image: `${OG_DEFAULTS.siteUrl}/images/legal-og.jpg`,
  imageAlt: `${pageTitle} - مدارات الكون`,
  type: 'website',
  robots: 'index, follow',
});

/**
 * Generate contact page Open Graph data
 */
export const generateContactOG = () => ({
  title: 'تواصل معنا | مدارات الكون - خدمة عملاء متميزة',
  description: 'تواصل مع فريق مدارات الكون للسياحة والسفر. نحن هنا لمساعدتك في تخطيط رحلتك القادمة وتقديم أفضل الخدمات السياحية. اتصل بنا الآن للحصول على استشارة مجانية.',
  keywords: 'تواصل معنا, مدارات الكون, خدمة عملاء, استشارة سياحية, حجز رحلات, رقم هاتف, عنوان',
  url: `${OG_DEFAULTS.siteUrl}/contact`,
  image: `${OG_DEFAULTS.siteUrl}/images/contact-og.jpg`,
  imageAlt: 'تواصل معنا - مدارات الكون',
  type: 'website',
});

/**
 * Generate common additional meta tags for business
 */
export const generateBusinessMeta = () => [
  { name: 'generator', content: 'Next.js' },
  { name: 'application-name', content: OG_DEFAULTS.siteName },
  { name: 'theme-color', content: OG_DEFAULTS.themeColor },
  { name: 'format-detection', content: 'telephone=yes' },
  { property: 'business:contact_data:street_address', content: OG_DEFAULTS.businessAddress },
  { property: 'business:contact_data:locality', content: 'الرياض' },
  { property: 'business:contact_data:region', content: 'الرياض' },
  { property: 'business:contact_data:country_name', content: 'السعودية' },
  { property: 'business:contact_data:phone_number', content: OG_DEFAULTS.businessPhone },
  { property: 'business:contact_data:email', content: OG_DEFAULTS.businessEmail },
];

/**
 * Validate Open Graph image URL
 */
export const validateOGImage = (imageUrl) => {
  if (!imageUrl) return OG_DEFAULTS.defaultImage;
  
  // Check if it's already a full URL
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // If it's a relative URL, make it absolute
  if (imageUrl.startsWith('/')) {
    return `${OG_DEFAULTS.siteUrl}${imageUrl}`;
  }
  
  // Default fallback
  return OG_DEFAULTS.defaultImage;
};

/**
 * Generate SEO-friendly title with proper length limits
 */
export const generateSEOTitle = (title, maxLength = 60) => {
  if (!title) return OG_DEFAULTS.siteName;
  
  const suffix = ` | ${OG_DEFAULTS.siteName}`;
  const maxTitleLength = maxLength - suffix.length;
  
  if (title.length <= maxTitleLength) {
    return `${title}${suffix}`;
  }
  
  return `${title.substring(0, maxTitleLength - 3)}...${suffix}`;
};

/**
 * Generate SEO-friendly description with proper length limits
 */
export const generateSEODescription = (description, maxLength = 160) => {
  if (!description) return 'اكتشف أجمل الوجهات السياحية مع مدارات الكون للسياحة والسفر.';
  
  if (description.length <= maxLength) return description;
  
  return `${description.substring(0, maxLength - 3)}...`;
};

export default {
  OG_DEFAULTS,
  generateHomepageOG,
  generateTripOG,
  generatePostOG,
  generateDestinationOG,
  generateLegalOG,
  generateContactOG,
  generateBusinessMeta,
  validateOGImage,
  generateSEOTitle,
  generateSEODescription,
}; 