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

          <link
            rel="icon"
            type="image/x-icon"
            href="/images/icons/favicon.ico"
          />

          {/* Google Fonts with proper preconnect */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Single combined font request for Tajawal with all weights */}
          <link
            href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
            rel="stylesheet"
          />

          {/* Arabic Font */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap"
            rel="stylesheet"
          />

          {/* Main Google Font Stylesheet - Reverting to display=swap */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />

          {/* Preload critical font files used above the fold (Hero Title/Desc) */}
          {/* NOTE: Verify exact URLs/weights in browser dev tools */}
          {/* Preloading Regular 400 */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lkSs2Sg.woff2" /* Guess for Regular 400 */
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Preloading Bold 700 (Assuming hero title uses bold) */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXbc1nY6HkvamqM9ZqKjIMqpxz1uLd4pQ.woff2" /* Guess for Bold 700 */
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Remove preloads for weights not critical for initial hero render if known */}

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

export default MyDocument;
