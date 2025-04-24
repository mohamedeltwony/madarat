/* eslint-disable @next/next/no-document-import-in-page */
import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          {/* Main Google Font Stylesheet - Using font-display: swap for better CLS */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
          />

          {/* Preload critical font files used above the fold (Hero Title/Desc) */}
          {/* Preloading Bold 700 (Used for hero title) - most critical font */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXbc1nY6HkvamqM9ZqKjIMqpxz1uLd4pQ.woff2" /* Bold 700 */
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
            fetchpriority="high"
          />
          {/* Preloading Regular 400 */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lkSs2Sg.woff2" /* Regular 400 */
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Only preload fonts that are used in above-the-fold content */}

          {/* Add inline font-face definitions as fallback to prevent layout shifts */}
          <style dangerouslySetInnerHTML={{
            __html: `
              /* Fallback font metrics */
              @font-face {
                font-family: 'Cairo Fallback';
                size-adjust: 105%;
                ascent-override: 90%;
                src: local('Arial');
              }
              
              /* Apply fallback first in the stack */
              .preventCLS {
                font-family: 'Cairo Fallback', 'Cairo', sans-serif;
              }
            `
          }} />

          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          {/* Facebook Pixel Code */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
