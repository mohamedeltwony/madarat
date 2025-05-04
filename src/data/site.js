// This file provides local site metadata to replace WordPress API calls

// Define a dummy QUERY_SITE_DATA constant for compatibility
export const QUERY_SITE_DATA = "DUMMY_QUERY";

// Define a dummy QUERY_SEO_DATA constant for compatibility
export const QUERY_SEO_DATA = "DUMMY_QUERY";

// Site metadata that replaces the WordPress API call
export const siteMetadata = {
  title: 'مدارات الكون',
  siteTitle: 'مدارات الكون',
  description: 'موقع السفر والرحلات الأول في الوطن العربي',
  language: 'ar',
  social: {
    facebook: 'https://facebook.com/madaratalkon',
    instagram: 'https://instagram.com/madaratalkon',
    twitter: 'https://twitter.com/madaratalkon',
    youtube: 'https://youtube.com/madaratalkon'
  }
};

// Function to get site metadata (replacement for getSiteMetadataREST)
export function getSiteMetadata() {
  return siteMetadata;
}
