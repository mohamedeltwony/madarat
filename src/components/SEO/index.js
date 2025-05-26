import Head from 'next/head';
import { useRouter } from 'next/router';

/**
 * Comprehensive SEO Component for Madarat Al-Kon
 * Handles meta tags, Open Graph, Twitter Cards, and structured data
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  article = false,
  author,
  publishedTime,
  modifiedTime,
  category,
  tags = [],
  price,
  currency = 'SAR',
  availability = 'InStock',
  breadcrumbs = [],
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  const router = useRouter();
  const siteUrl = 'https://madaratalkon.com';
  const currentUrl = `${siteUrl}${router.asPath}`;
  
  // Default values
  const siteName = 'مدارات الكون';
  const defaultTitle = 'مدارات الكون - موقع السفر والرحلات الأول في الوطن العربي';
  const defaultDescription = 'اكتشف معنا أجمل الوجهات السياحية حول العالم. نقدم لك دليلاً شاملاً للسفر والسياحة، من التخطيط للرحلة إلى أفضل الأماكن للزيارة والإقامة.';
  const defaultImage = `${siteUrl}/Madarat-logo-768x238.png`;
  const defaultKeywords = 'سياحة, سفر, رحلات, وجهات سياحية, مدارات الكون, حجز رحلات, عروض سياحية';

  // Processed values
  const pageTitle = title ? `${title} - ${siteName}` : defaultTitle;
  const pageDescription = description || defaultDescription;
  const pageImage = image || defaultImage;
  const pageKeywords = keywords || defaultKeywords;
  const canonicalUrl = canonical || currentUrl;

  // Robots meta content
  const robotsContent = `${noindex ? 'noindex' : 'index'},${nofollow ? 'nofollow' : 'follow'}`;

  // Generate structured data
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': article ? 'Article' : 'WebPage',
      name: title || defaultTitle,
      description: pageDescription,
      url: currentUrl,
      image: pageImage,
      publisher: {
        '@type': 'Organization',
        name: siteName,
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: defaultImage,
        },
      },
    };

    if (article) {
      baseData['@type'] = 'Article';
      baseData.headline = title;
      baseData.author = {
        '@type': 'Person',
        name: author || 'مدارات الكون',
      };
      baseData.datePublished = publishedTime;
      baseData.dateModified = modifiedTime || publishedTime;
      baseData.articleSection = category;
      baseData.keywords = tags.join(', ');
    }

    // Add breadcrumb structured data if provided
    const structuredDataArray = [baseData];

    if (breadcrumbs.length > 0) {
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${siteUrl}${crumb.url}`,
        })),
      };
      structuredDataArray.push(breadcrumbData);
    }

    // Add product structured data for trip pages
    if (price) {
      const productData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description: pageDescription,
        image: pageImage,
        offers: {
          '@type': 'Offer',
          price: price,
          priceCurrency: currency,
          availability: `https://schema.org/${availability}`,
          seller: {
            '@type': 'Organization',
            name: siteName,
          },
        },
      };
      structuredDataArray.push(productData);
    }

    return structuredDataArray;
  };

  const structuredData = generateStructuredData();

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="robots" content={robotsContent} />
      <meta name="author" content={author || siteName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="ar" />
      <meta name="language" content="Arabic" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={article ? 'article' : 'website'} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="ar_SA" />
      
      {/* Article specific Open Graph tags */}
      {article && (
        <>
          <meta property="article:author" content={author || siteName} />
          <meta property="article:published_time" content={publishedTime} />
          <meta property="article:modified_time" content={modifiedTime || publishedTime} />
          <meta property="article:section" content={category} />
          {tags.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      <meta name="twitter:site" content="@madaratalkon" />
      <meta name="twitter:creator" content="@madaratalkon" />
      
      {/* Additional Meta Tags for Arabic Content */}
      <meta name="geo.region" content="SA" />
      <meta name="geo.country" content="Saudi Arabia" />
      <meta name="geo.placename" content="Riyadh" />
      
      {/* Structured Data */}
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
      
      {/* Preconnect to external domains for performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://en4ha1dlwxxhwad.madaratalkon.com" />
      
      {/* DNS Prefetch for better performance */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
    </Head>
  );
};

export default SEO; 