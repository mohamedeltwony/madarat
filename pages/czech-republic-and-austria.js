import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import dynamic from 'next/dynamic'; // Import dynamic
import { getCsrfToken } from '@/utils/csrf'; // Import CSRF utilities
const SparkleButton = dynamic(() => import('@/components/UI/SparkleButton'), {
  ssr: false,
});
// import Chatbot from '@/components/Chatbot'; // Removed
// import ExitPopup from '@/components/ExitPopup'; // Removed
import styles from '@/styles/pages/LondonScotland.module.scss'; // Keep using the same styles for cloning
// Removed getSiteMetadata import as it's no longer fetched here
import { getAllMenus } from '@/lib/menus'; // Keep menu import for now, though unused in getStaticProps
import TripForm from '@/components/TripForm';

// Removed SVG Icon imports

// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Background image path
// public/images/01000.jpg

// --- SVG Icons ---

// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components - Removed
// const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });
// const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
//   ssr: false,
// });
export default function CzechRepublicAustriaTrip() {
  // Changed component name
  const router = useRouter(); // Get router instance

  // Remove all form-related state and handlers except for the redirect logic
  const handleFormSuccess = ({ processedPhone, externalId, leadEventId, nationality }) => {
    // Determine redirect path based on nationality
    const redirectPath =
      (nationality === 'مواطن' || nationality === 'Saudi Arabia' || nationality === 'العربية السعودية')
        ? '/thank-you-citizen'
        : '/thank-you-resident';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (processedPhone) queryParams.set('phone', processedPhone);
    if (externalId) queryParams.set('external_id', externalId);
    if (leadEventId) queryParams.set('eventId', leadEventId);
    
    // Construct the full redirect URL
    const redirectUrl = `${redirectPath}?${queryParams.toString()}`;
    
    console.log(`Redirecting to: ${redirectUrl}`);
    
    // Use window.location.href for reliable redirect
    window.location.href = redirectUrl;
  };

  // Helper function to get browser and device information
  const getBrowserAndDeviceInfo = (userAgent) => {
    const info = {
      browser: 'Unknown',
      os: 'Unknown',
      device: 'Unknown',
    };
    
    // Browser detection
    if (/Firefox/i.test(userAgent)) info.browser = 'Firefox';
    else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent) && !/OPR/i.test(userAgent)) info.browser = 'Chrome';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) info.browser = 'Safari';
    else if (/Edg/i.test(userAgent)) info.browser = 'Edge';
    else if (/OPR/i.test(userAgent)) info.browser = 'Opera';
    else if (/MSIE|Trident/i.test(userAgent)) info.browser = 'Internet Explorer';
    
    // OS detection
    if (/Windows/i.test(userAgent)) info.os = 'Windows';
    else if (/Macintosh|Mac OS X/i.test(userAgent)) info.os = 'macOS';
    else if (/Android/i.test(userAgent)) info.os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(userAgent)) info.os = 'iOS';
    else if (/Linux/i.test(userAgent)) info.os = 'Linux';
    
    // Device vendor detection (simplified)
    if (/iPhone|iPad|iPod/i.test(userAgent)) info.device = 'Apple';
    else if (/Android.*Samsung/i.test(userAgent)) info.device = 'Samsung';
    else if (/Android.*Pixel/i.test(userAgent)) info.device = 'Google';
    else if (/Android.*Huawei/i.test(userAgent)) info.device = 'Huawei';
    else if (/Macintosh|Mac OS X/i.test(userAgent)) info.device = 'Apple';
    else if (/Windows/i.test(userAgent)) info.device = 'PC';
    
    return info;
  };

  // Saudi cities (Keep original if needed by form logic, though not displayed)
  const cities = [
    'الرياض',
    'جدة',
    'القصيم – حائل',
    'مكة - الطائف',
    'المدينة المنورة',
    'المنطقة الشرقية',
    'المنطقة الشمالية',
    'المنطقة الجنوبية',
    'أخرى',
  ];

  // Features data - Updated for Czech Republic and Austria
  const features = [
    {
      text: 'استقبال بسيارة خاصة',
      iconPath: '/icons/gorgia/استقبال-وتوديع.webp',
    },
    {
      text: 'الفنادق مع الافطار',
      iconPath: '/icons/gorgia/5-نجوم.webp',
    },
    {
      text: 'جولات سياحية جماعيه',
      iconPath: '/icons/gorgia/--جولات-سياحية-بسيارة-خاصة.webp',
    },
    {
      text: 'التنقلات بين المدن',
      iconPath: '/icons/gorgia/التنقلات-بين-المدن.webp',
    },
    {
      text: 'خدمة عملاء 24/7',
      iconPath: '/icons/gorgia/خدمة-عملاء.webp',
    },
    {
      text: 'تذكر دخول الاماكن السياحية',
      iconPath: '/icons/gorgia/5-نجوم.webp',
    },
    {
      text: 'جولات مائية',
      iconPath: '/icons/gorgia/شريحة-انترنت.webp',
    },
  ];

  // SEO and OG data
  const pageUrl = 'https://madaratalkon.sa/czech-republic-and-austria';
  const pageTitle = 'رحلة التشيك والنمسا 7 أيام | مدارات الكون - 3999 ريال';
  const pageDescription = 'اكتشف جمال التشيك والنمسا في رحلة فاخرة 7 أيام مع مدارات الكون. تشمل الرحلة الاستقبال، الفنادق مع الإفطار، الجولات السياحية، التنقلات، تذاكر الدخول والجولات المائية. احجز الآن بسعر 3999 ريال للشخص في الغرفة المزدوجة.';
  const ogImage = 'https://madaratalkon.sa/images/01000.jpg';

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        {/* Primary Meta Tags */}
        <title>استكشف التشيك والنمسا مع مدارات الكون | رحلة فاخرة 7 أيام</title>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="التشيك، النمسا، رحلات، سياحة، مدارات الكون، رحلة أوروبا، جولات سياحية، فنادق، تذاكر طيران، عروض سفر، رحلات فاخرة، جولات مائية، السعودية" />
        <meta name="author" content="مدارات الكون للسياحة والسفر" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta httpEquiv="Content-Language" content="ar" />
        <meta name="language" content="Arabic" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="مدارات الكون" />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="رحلة التشيك والنمسا 7 أيام مع مدارات الكون" />
        <meta property="og:locale" content="ar_SA" />
        <meta property="og:locale:alternate" content="en_US" />
        
        {/* Product specific Open Graph */}
        <meta property="product:price:amount" content="3999" />
        <meta property="product:price:currency" content="SAR" />
        <meta property="product:availability" content="InStock" />
        <meta property="product:condition" content="new" />
        <meta property="product:retailer_title" content="مدارات الكون للسياحة والسفر" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@madaratalkon" />
        <meta name="twitter:creator" content="@madaratalkon" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:image:alt" content="رحلة التشيك والنمسا 7 أيام مع مدارات الكون" />
        
        {/* Additional Meta Tags for Rich Snippets */}
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Saudi Arabia" />
        <meta name="geo.position" content="24.7136;46.6753" />
        <meta name="ICBM" content="24.7136, 46.6753" />
        
        {/* Business/Organization Meta */}
        <meta name="organization" content="مدارات الكون للسياحة والسفر" />
        <meta name="contact" content="info@madaratalkon.sa" />
        <meta name="phone" content="+966123456789" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//madaratalkon.sa" />
        
        {/* JSON-LD Structured Data */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": "رحلة التشيك والنمسا 7 أيام",
              "description": pageDescription,
              "image": ogImage,
              "brand": {
                "@type": "Organization",
                "name": "مدارات الكون"
              },
              "offers": {
                "@type": "Offer",
                "price": "3999",
                "priceCurrency": "SAR",
                "availability": "https://schema.org/InStock",
                "seller": {
                  "@type": "Organization",
                  "name": "مدارات الكون للسياحة والسفر",
                  "url": "https://madaratalkon.sa"
                }
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
              },
              "category": "Travel Package"
            })
          }}
        />
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          {/* Background Image using next/image */}
          <Image
            src="/images/01000.jpg" // Using custom background image for Czech Republic and Austria
            alt="Beautiful landscape of Czech Republic and Austria" // Changed alt text
            fill // Use fill prop instead of layout="fill"
            // objectFit="cover" // Remove prop, handle with CSS
            quality={75} // Adjust quality as needed
            priority // Prioritize loading for LCP
            className={styles.heroBackgroundImage} // Ensure this class handles object-fit: cover
          />
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.logoContainer}>
              <Image
                src="/logo.png"
                alt="مدارات الكون للسياحة والسفر"
                width={240}
                height={75}
                priority
                sizes="(max-width: 768px) 150px, 240px" // Refined sizes prop for responsiveness
                // Removed unoptimized prop
              />
            </div>
            <h1 className={styles.title}>
              <span className={styles.highlight}>التشيك والنمسا</span>
              <div
                className={styles.subtitle}
                style={{ fontSize: '0.6em', marginTop: '5px' }}
              >
                رحلة أوروبية ساحرة
              </div>
            </h1>
            <p className={styles.description}>
              7 أيام - 6 ليالي
              <br />
              رحلة فاخرة تشمل أجمل المدن الأوروبية
              <br />
              السعر للشخص في الغرفة المزدوجة
              <br />
              <span className={styles.highlight}>3999</span> ر.س
              <br />
              <span style={{ 
                fontSize: '0.9em', 
                color: '#cc9c64', 
                fontWeight: '600',
                backgroundColor: 'rgba(204, 156, 100, 0.15)',
                padding: '6px 12px',
                borderRadius: '6px',
                marginTop: '10px',
                display: 'inline-block',
                border: '1px solid rgba(204, 156, 100, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                ⚠️ السعر لا يشمل تذاكر الطيران
              </span>
            </p>

            {/* Features Section - Moved Inside Hero & Made Marquee */}
            <div className={styles.featuresSection}>
              <div className={styles.featuresGrid}>
                {/* Render features twice for infinite scroll effect */}
                {[...features, ...features].map((feature, index) => (
                  <div
                    key={`${feature.iconPath || feature.text}-${index}`} // Use iconPath or text for key
                    className={styles.featureItem}
                  >
                    {' '}
                    {/* Added index to key for uniqueness */}
                    {feature.iconPath && ( // Conditionally render icon div
                      <div className={styles.featureIcon}>
                        {/* Render using Next.js Image component */}
                        <Image
                          src={feature.iconPath}
                          alt={feature.text} // Use feature text as alt text
                          width={60} // Updated width
                          height={60} // Updated height
                          // unoptimized // Removed to allow Next.js optimization
                        />
                      </div>
                    )}
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* End Features Section */}

            {/* Contact Form - Using London/Scotland structure */}
            <TripForm
              fields={[
                {
                  name: 'phone',
                  label: 'الجوال',
                  type: 'tel',
                  required: true,
                  autoComplete: 'tel',
                  floatingLabel: true,
                  showCountryCode: true, // Custom prop for UI
                },
                {
                  name: 'name',
                  label: 'الاسم الكامل (اختياري)',
                  type: 'text',
                  required: false,
                  autoComplete: 'name',
                  floatingLabel: true,
                },
                {
                  name: 'email',
                  label: 'البريد الإلكتروني (اختياري)',
                  type: 'email',
                  required: false,
                  autoComplete: 'email',
                  floatingLabel: true,
                },
              ]}
              zapierConfig={{
                endpoint: '/api/zapier-proxy',
                extraPayload: {
                  destination: 'التشيك والنمسا',
                  tripName: 'Czech Republic and Austria',
                  price: 3999,
                },
              }}
              onSuccess={handleFormSuccess}
            />
            {/* End Contact Form */}
          </div>
        </section>
        {/* End Hero Section */}

        {/* WhatsApp Button */}
        {/* Removed WhatsAppButton component */}
      </main>

      {/* Removed Chatbot and ExitPopup */}
    </div>
  );
}

export async function getStaticProps() {
  // No longer fetching getSiteMetadata here to improve build/revalidation speed.
  // Ensure necessary <Head> tags (title, meta description, OG tags)
  // are added directly within the component's JSX.

  return {
    props: {}, // Return empty props
    revalidate: 600, // Revalidate every 10 minutes (keeps ISR active)
  };
}
