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

          {/* Critical Resource Hints - Load First */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link rel="preconnect" href="https://en4ha1dlwxxhwad.madaratalkon.com" />
          
          {/* DNS Prefetch for external domains */}
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//connect.facebook.net" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />

          {/* Google Tag Manager - Initialize dataLayer first */}
          <script dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
            `
          }} />

          {/* Google Tag Manager */}
          <script dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5PQ58CMB');`
          }} />

          {/* Snap Pixel Code */}
          <script dangerouslySetInnerHTML={{
            __html: `
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');

              snaptr('init', 'a9d0612f-6ca4-4b9a-a9a8-74310e3a4462', {
                'user_email': '__INSERT_USER_EMAIL__'
              });

              // Enhanced PAGE_VIEW tracking with user data detection
              function trackEnhancedPageView() {
                try {
                  // Get user data from localStorage or URL params
                  let userData = {};
                  let hasUserData = false;
                  
                  // Try to get data from localStorage
                  if (typeof localStorage !== 'undefined') {
                    try {
                      const profile = localStorage.getItem('userProfile');
                      if (profile) {
                        const parsedProfile = JSON.parse(profile);
                        if (parsedProfile.email) {
                          userData.user_email = parsedProfile.email;
                          hasUserData = true;
                        }
                        if (parsedProfile.phone) {
                          userData.user_phone_number = parsedProfile.phone;
                          hasUserData = true;
                        }
                        if (parsedProfile.firstName) {
                          userData.firstname = parsedProfile.firstName;
                        }
                        if (parsedProfile.external_id) {
                          userData.uuid_c1 = parsedProfile.external_id;
                          hasUserData = true;
                        }
                      }
                    } catch (e) {
                      console.warn('Error reading user profile for Snapchat PAGE_VIEW');
                    }
                  }
                  
                  // Get URL params for additional context
                  const urlParams = new URLSearchParams(window.location.search);
                  if (urlParams.get('email')) {
                    userData.user_email = urlParams.get('email');
                    hasUserData = true;
                  }
                  if (urlParams.get('phone')) {
                    userData.user_phone_number = urlParams.get('phone');
                    hasUserData = true;
                  }
                  if (urlParams.get('firstName')) {
                    userData.firstname = urlParams.get('firstName');
                  }
                  if (urlParams.get('external_id')) {
                    userData.uuid_c1 = urlParams.get('external_id');
                    hasUserData = true;
                  }
                  
                  // Add geographic data for Saudi Arabia (only if we have user data)
                  if (hasUserData) {
                    userData.geo_country = 'SA';
                    userData.geo_region = 'Riyadh';
                    userData.geo_city = 'Riyadh';
                  }
                  
                  // Determine page category based on URL path
                  const path = window.location.pathname;
                  let item_category = 'website';
                  if (path.includes('trip') || path.includes('destination')) {
                    item_category = 'travel_packages';
                  } else if (path.includes('blog') || path.includes('post')) {
                    item_category = 'content';
                  } else if (path.includes('thank-you')) {
                    item_category = 'conversion';
                  }
                  
                  userData.item_category = item_category;
                  
                  // Only track enhanced PAGE_VIEW if we have user data, otherwise basic
                  if (hasUserData) {
                    snaptr('track', 'PAGE_VIEW', userData);
                    console.log('Enhanced Snapchat PAGE_VIEW tracked:', {
                      page_path: path,
                      item_category: item_category,
                      has_user_data: true
                    });
                  } else {
                    // Basic PAGE_VIEW without user data
                    snaptr('track', 'PAGE_VIEW', { item_category: item_category });
                    console.log('Basic Snapchat PAGE_VIEW tracked:', {
                      page_path: path,
                      item_category: item_category,
                      has_user_data: false
                    });
                  }
                  
                } catch (error) {
                  // Fallback to basic PAGE_VIEW
                  snaptr('track', 'PAGE_VIEW');
                  console.warn('Fallback to basic PAGE_VIEW due to error:', error);
                }
              }
              
              // Track on page load
              trackEnhancedPageView();
            `
          }} />

          {/* Preload Critical Assets for LCP */}
          <link 
            rel="preload" 
            href="/logo.png" 
            as="image" 
            fetchPriority="high"
          />
          
          {/* Optimized Font Loading with font-display: swap */}
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&family=Tajawal:wght@400;500;700&display=swap"
            rel="stylesheet"
          />

          {/* Favicon and App Icons */}
          <link rel="icon" type="image/png" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />

          {/* Web App Manifest for PWA */}
          <link rel="manifest" href="/site.webmanifest" />
          <meta name="theme-color" content="#1a365d" />
          <meta name="msapplication-TileColor" content="#1a365d" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="مدارات الكون" />

          {/* Bootstrap Icons - Deferred Loading */}
          <link 
            rel="preload"
            href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            as="style"
            onLoad="this.onload=null;this.rel='stylesheet'"
            media="print"
          />
          <noscript>
            <link 
              rel="stylesheet" 
              href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"
            />
          </noscript>

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
          {/* X-Frame-Options should be set as HTTP header, not meta tag */}
          <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
          
          {/* Performance Hints */}
          <meta httpEquiv="Accept-CH" content="DPR, Width, Viewport-Width" />
          <meta name="format-detection" content="telephone=no" />

          {/* Critical CSS Inline - Add this for above-the-fold content */}
          <style dangerouslySetInnerHTML={{
            __html: `
              /* Critical CSS for faster rendering */
              * {
                font-family: 'Cairo', 'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif;
              }
              body { 
                font-family: 'Cairo', 'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif;
                margin: 0;
                padding: 0;
                direction: rtl;
                text-align: right;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              html {
                scroll-behavior: smooth;
                -webkit-overflow-scrolling: touch;
              }
              .loading-spinner {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
              }
              /* Prevent layout shift */
              img { max-width: 100%; height: auto; }
              .hero-section { min-height: 60vh; }
              @keyframes spin { 
                0% { transform: rotate(0deg); } 
                100% { transform: rotate(360deg); } 
              }
            `
          }} />

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
          {/* Loading Spinner for Better UX */}
          <div id="loading-spinner" className="loading-spinner" style={{ display: 'none' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #1a365d',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </div>

          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe 
              src="https://www.googletagmanager.com/ns.html?id=GTM-5PQ58CMB"
              height="0" 
              width="0" 
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          
          <Main />
          <NextScript />

          {/* Inline script for loading optimization */}
          <script dangerouslySetInnerHTML={{
            __html: `
              // Show loading spinner during navigation
              window.addEventListener('beforeunload', function() {
                var spinner = document.getElementById('loading-spinner');
                if (spinner) spinner.style.display = 'block';
              });
              
              // Hide loading spinner when page loads
              window.addEventListener('load', function() {
                var spinner = document.getElementById('loading-spinner');
                if (spinner) spinner.style.display = 'none';
                
                // Defer third-party scripts after page load
                setTimeout(function() {
                  // Load additional analytics after page load if needed
                  if (typeof gtag === 'undefined' && window.location.hostname !== 'localhost') {
                    var script = document.createElement('script');
                    script.async = true;
                    script.src = 'https://www.googletagmanager.com/gtag/js?id=AW-16669734019';
                    document.head.appendChild(script);
                  }
                }, 2000);
              });
              
              // Optimize font loading
              if ('fonts' in document) {
                document.fonts.ready.then(function() {
                  document.body.classList.add('fonts-loaded');
                });
              }
              
              // Initialize GTM dataLayer if not already done
              window.dataLayer = window.dataLayer || [];
            `
          }} />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
