import JsonLd from '@/components/JsonLd';

/**
 * WebsiteJsonLd Component
 * Creates JSON-LD structured data for a website entity
 * @param {Object} props Component props
 * @param {string} props.siteTitle Website title
 * @param {string} props.siteUrl Website URL (optional)
 */
export const WebsiteJsonLd = ({ siteTitle, siteUrl }) => {
  const baseUrl = siteUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  };

  return <JsonLd data={data} />;
};

/**
 * TripJsonLd Component
 * Creates JSON-LD structured data for a travel/trip offering
 * @param {Object} props Component props
 * @param {Object} props.trip Trip data
 */
export const TripJsonLd = ({ trip }) => {
  if (!trip) return null;
  
  const data = {
    '@context': 'https://schema.org',
    '@type': 'TravelAction',
    name: trip.title,
    description: trip.description || trip.excerpt,
    image: trip.featuredImage?.sourceUrl || trip.images?.[0],
    url: trip.permalink
  };

  return <JsonLd data={data} />;
};

/**
 * ArticleJsonLd Component
 * Creates JSON-LD structured data for a blog post or article
 * @param {Object} props Component props
 * @param {Object} props.post Post data
 */
export const ArticleJsonLd = ({ post }) => {
  if (!post) return null;
  
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || '',
    image: post.featuredImage?.sourceUrl || '',
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'مدارات الكون'
    }
  };

  return <JsonLd data={data} />;
}; 