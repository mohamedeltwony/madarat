# 🚀 Lead Magnet Website Development Guide

## 📋 Overview

This guide contains all the necessary code and configurations to create a lead magnet website using the proven structure from Madarat Al-Kon. The template includes complete pixel integrations (Facebook, Snapchat, TikTok, Google), DataLayer setup, and conversion tracking.

## 🏗️ Project Structure

```
your-leadmagnet/
├── public/
│   ├── images/
│   │   ├── icons/
│   │   └── favicon.png
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics/
│   │   │   ├── TripForm/
│   │   │   ├── UI/
│   │   │   └── SEO/
│   │   │   
│   │   ├── lib/
│   │   │   ├── gtm.js
│   │   │   └── pixelTracking.js
│   │   │   
│   │   ├── pages/
│   │   │   ├── _app.js
│   │   │   ├── _document.js
│   │   │   ├── index.js
│   │   │   ├── thank-you.js
│   │   │   └── api/
│   │   │   
│   │   ├── styles/
│   │   │   
│   │   ├── utils/
│   │   │   
│   │   └── hooks/
│   │   
│   ├── .env.local
│   │   
│   ├── next.config.js
│   │   
│   └── package.json
```

## 🔧 Environment Variables Setup

### `.env.local` Template

```bash
# =============================================================================
# LEAD MAGNET WEBSITE CONFIGURATION
# Replace BRAND_NAME and IDs with your actual values
# =============================================================================

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-brand.com
NEXT_PUBLIC_BRAND_NAME=YOUR_BRAND_NAME

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Facebook Pixel & CAPI
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=123456789012345
FB_PIXEL_ID=123456789012345
FB_ACCESS_TOKEN=your-facebook-conversion-api-token

# Snapchat Pixel & CAPI
SNAPCHAT_PIXEL_ID=your-snapchat-pixel-id
SNAPCHAT_ACCESS_TOKEN=your-snapchat-access-token

# TikTok Pixel
TIKTOK_PIXEL_ID=your-tiktok-pixel-id
TIKTOK_ACCESS_TOKEN=your-tiktok-access-token

# Google Ads
GOOGLE_ADS_ID=AW-123456789

# Zapier Webhook (for form submissions)
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/your-hook

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@yourbrand.com
EMAIL_PASS=your-app-password

# Debug Mode (set to false in production)
DEBUG_MODE=false
```

## 📦 Package.json Dependencies

```json
{
  "name": "leadmagnet-website",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@next/third-parties": "^15.4.0",
    "@vercel/analytics": "^1.5.0",
    "@vercel/speed-insights": "^1.2.0",
    "next": "^15.3.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "sass": "^1.62.1",
    "crypto": "^1.0.1",
    "he": "^1.2.0"
  },
  "devDependencies": {
    "eslint": "^8.57.0",
    "eslint-config-next": "^15.4.0",
    "prettier": "^3.5.3"
  }
}
```

## ⚙️ Next.js Configuration

### `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Image optimization
  images: {
    domains: ['your-cdn.com', 'placeholder.com'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp']
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif|woff2|woff|ttf|js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Environment variables for client-side
  env: {
    BRAND_NAME: process.env.NEXT_PUBLIC_BRAND_NAME
  }
};

module.exports = nextConfig;
```

## 📄 Core Document Structure

### `src/pages/_document.js`

```javascript
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    // Replace with your brand's language and direction
    const lang = process.env.NEXT_PUBLIC_SITE_LANG || 'en';
    const dir = process.env.NEXT_PUBLIC_SITE_DIR || 'ltr';

    return (
      <Html lang={lang} dir={dir}>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />

          {/* DNS Prefetch for performance */}
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          <link rel="dns-prefetch" href="//connect.facebook.net" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//analytics.tiktok.com" />

          {/* Google Tag Manager - Initialize dataLayer first */}
          <script dangerouslySetInnerHTML={{
            __html: \`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            \`
          }} />

          {/* Google Tag Manager */}
          <script dangerouslySetInnerHTML={{
            __html: \`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','\${process.env.NEXT_PUBLIC_GTM_ID}');\`
          }} />

          {/* Facebook Pixel */}
          <script dangerouslySetInnerHTML={{
            __html: \`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '\${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
              fbq('track', 'PageView');
            \`
          }} />

          {/* Snapchat Pixel */}
          <script dangerouslySetInnerHTML={{
            __html: \`
              (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
              {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
              a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
              r.src=n;var u=t.getElementsByTagName(s)[0];
              u.parentNode.insertBefore(r,u);})(window,document,
              'https://sc-static.net/scevent.min.js');
              snaptr('init', '\${process.env.SNAPCHAT_PIXEL_ID}');
              snaptr('track', 'PAGE_VIEW');
            \`
          }} />

          {/* TikTok Pixel */}
          <script dangerouslySetInnerHTML={{
            __html: \`
              !function (w, d, t) {
                w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
                ttq.load('\${process.env.TIKTOK_PIXEL_ID}');
                ttq.page();
              }(window, document, 'ttq');
            \`
          }} />

          {/* Basic SEO Tags */}
          <meta name="robots" content="index, follow" />
          <meta name="theme-color" content="#1a365d" />
          
          {/* Favicon */}
          <link rel="icon" href="/favicon.png" />
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src={\`https://www.googletagmanager.com/ns.html?id=\${process.env.NEXT_PUBLIC_GTM_ID}\`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
```

---

*This is Part 1 of the comprehensive guide. Continue to the next sections for complete implementation details.* 