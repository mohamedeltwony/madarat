/* eslint-disable @next/next/no-document-import-in-page */
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />

          {/* Favicon and App Icons */}
          <link
            rel="icon"
            type="image/png"
            href="/favicon.png"
          />
          <link 
            rel="apple-touch-icon" 
            href="/images/icons/apple-touch-icon.png" 
          />
          <link 
            rel="apple-touch-icon" 
            sizes="180x180" 
            href="/images/icons/apple-touch-icon.png" 
          />
          <link 
            rel="icon" 
            type="image/png" 
            sizes="32x32" 
            href="/favicon.png" 
          />
          <link 
            rel="icon" 
            type="image/png" 
            sizes="16x16" 
            href="/favicon.png" 
          />

          {/* Web App Manifest */}
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#1a365d" />
          <meta name="msapplication-TileColor" content="#1a365d" />

          {/* Google Fonts with proper preconnect and optimization */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />

          {/* Combined font loading for both Cairo and Tajawal - optimized with preload and media */}
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Tajawal:wght@400;500;700&display=swap"
            rel="stylesheet"
          />

          {/* Preload critical Cairo font files directly */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvangtZmpQdkhzfH5lkSs2SgRjCAGMQ1z0hGA-W1ToLQ-HqUvBHw.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          {/* Bootstrap Icons - deferred loading */}
          <link 
            rel="stylesheet" 
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            media="print"
            onLoad="this.media='all'"
          />

          {/* Preload critical assets - logo for LCP */}
          <link 
            rel="preload" 
            href="/logo.png" 
            as="image" 
            fetchPriority="high"
          />

          {/* DNS Prefetch for external domains */}
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//connect.facebook.net" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          <link rel="dns-prefetch" href="//en4ha1dlwxxhwad.madaratalkon.com" />

          {/* Preconnect to WordPress API */}
          <link rel="preconnect" href="https://en4ha1dlwxxhwad.madaratalkon.com" />

          {/* SEO Meta Tags */}
          <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow" />
          <meta name="bingbot" content="index, follow" />
          
          {/* Geographic Meta Tags */}
          <meta name="geo.region" content="SA" />
          <meta name="geo.country" content="Saudi Arabia" />
          <meta name="geo.placename" content="Riyadh" />
          
          {/* Language and Locale */}
          <meta httpEquiv="Content-Language" content="ar" />
          <meta name="language" content="Arabic" />
          
          {/* Security Headers */}
          <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
          <meta httpEquiv="X-Frame-Options" content="DENY" />
          <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
          
          {/* Performance Hints */}
          <meta httpEquiv="Accept-CH" content="DPR, Width, Viewport-Width" />



          {/* Structured Data for Organization */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "مدارات الكون",
                "url": "https://madaratalkon.com",
                "logo": "https://madaratalkon.com/Madarat-logo-768x238.png",
                "description": "شركة مدارات الكون للسياحة والسفر - اكتشف معنا أجمل الوجهات السياحية حول العالم",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "SA",
                  "addressLocality": "الرياض",
                  "addressRegion": "الرياض"
                },
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+966920034019",
                  "contactType": "customer service",
                  "availableLanguage": ["Arabic", "English"]
                },
                "sameAs": [
                  "https://www.facebook.com/madaratalkon",
                  "https://www.instagram.com/madaratalkon",
                  "https://twitter.com/madaratalkon"
                ]
              })
            }}
          />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe 
              src="https://www.googletagmanager.com/ns.html?id=GTM-5PQ58CMB"
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
