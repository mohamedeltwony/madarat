import Head from 'next/head';

/**
 * Professional Open Graph Component for Madarat Al-Kon
 * Provides comprehensive meta tags for optimal social media sharing
 */
const ProfessionalOG = ({
  // Basic Meta
  title,
  description,
  keywords,
  
  // URLs and Images
  url,
  image,
  imageAlt,
  imageWidth = "1200",
  imageHeight = "630",
  imageType = "image/jpeg",
  
  // Page Type
  type = "website", // website, article, product
  
  // Article specific (for blog posts)
  article = {},
  
  // Product specific (for trips/packages)
  product = {},
  
  // Business Info
  siteName = "مدارات الكون",
  author = "مدارات الكون للسياحة والسفر",
  organization = "مدارات الكون للسياحة والسفر",
  
  // Social Media
  twitterHandle = "@madaratalkon",
  
  // Technical
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  language = "ar",
  locale = "ar_SA",
  
  // Custom structured data
  structuredData = null,
  
  // Additional meta tags
  additionalMeta = [],
}) => {
  
  // Default fallbacks
  const siteUrl = 'https://madaratalkon.sa';
  const defaultImage = `${siteUrl}/images/og-default.jpg`;
  const finalUrl = url || siteUrl;
  const finalImage = image || defaultImage;
  const finalImageAlt = imageAlt || title || 'مدارات الكون للسياحة والسفر';
  
  // Generate default structured data based on type
  const generateStructuredData = () => {
    if (structuredData) return structuredData;
    
    const baseData = {
      "@context": "https://schema.org/",
      "name": title,
      "description": description,
      "image": finalImage,
      "url": finalUrl,
    };
    
    switch (type) {
      case 'product':
        return {
          ...baseData,
          "@type": "Product",
          "brand": {
            "@type": "Organization",
            "name": siteName
          },
          "offers": product.price ? {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": product.currency || "SAR",
            "availability": product.availability || "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": organization,
              "url": siteUrl
            }
          } : undefined,
          "aggregateRating": product.rating ? {
            "@type": "AggregateRating",
            "ratingValue": product.rating,
            "reviewCount": product.reviewCount || "100"
          } : undefined,
        };
        
      case 'article':
        return {
          ...baseData,
          "@type": "Article",
          "author": {
            "@type": "Person",
            "name": article.author || author
          },
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "logo": {
              "@type": "ImageObject",
              "url": `${siteUrl}/logo.png`
            }
          },
          "datePublished": article.publishedTime,
          "dateModified": article.modifiedTime || article.publishedTime,
          "headline": title,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": finalUrl
          }
        };
        
      default:
        return {
          ...baseData,
          "@type": "WebPage",
          "publisher": {
            "@type": "Organization",
            "name": siteName,
            "url": siteUrl
          }
        };
    }
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <meta httpEquiv="Content-Language" content={language} />
      <meta name="language" content={language === 'ar' ? 'Arabic' : 'English'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:type" content={imageType} />
      <meta property="og:image:width" content={imageWidth} />
      <meta property="og:image:height" content={imageHeight} />
      <meta property="og:image:alt" content={finalImageAlt} />
      <meta property="og:locale" content={locale} />
      {locale === 'ar_SA' && <meta property="og:locale:alternate" content="en_US" />}
      
      {/* Article specific Open Graph tags */}
      {type === 'article' && article.author && (
        <meta property="article:author" content={article.author} />
      )}
      {type === 'article' && article.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && article.section && (
        <meta property="article:section" content={article.section} />
      )}
      {type === 'article' && article.tags && article.tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Product specific Open Graph tags */}
      {type === 'product' && product.price && (
        <>
          <meta property="product:price:amount" content={product.price} />
          <meta property="product:price:currency" content={product.currency || "SAR"} />
          <meta property="product:availability" content={product.availability || "InStock"} />
          <meta property="product:condition" content={product.condition || "new"} />
          <meta property="product:retailer_title" content={organization} />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={finalImageAlt} />
      
      {/* Geographic and Business Meta */}
      <meta name="geo.region" content="SA" />
      <meta name="geo.placename" content="Saudi Arabia" />
      <meta name="geo.position" content="24.7136;46.6753" />
      <meta name="ICBM" content="24.7136, 46.6753" />
      <meta name="organization" content={organization} />
      <meta name="contact" content="info@madaratalkon.sa" />
      
      {/* Performance Optimization */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//madaratalkon.sa" />
      
      {/* Additional custom meta tags */}
      {additionalMeta.map((meta, index) => (
        meta.property ? (
          <meta key={index} property={meta.property} content={meta.content} />
        ) : (
          <meta key={index} name={meta.name} content={meta.content} />
        )
      ))}
      
      {/* JSON-LD Structured Data */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData())
        }}
      />
    </Head>
  );
};

export default ProfessionalOG; 