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
          {/* Main Google Font Stylesheet - Reverting to display=swap */}
          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />

          {/* Preload critical font files used above the fold (Hero Title/Desc) */}
          {/* NOTE: Verify exact URLs/weights in browser dev tools */}
          {/* Preloading Regular 400 */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lkSs2Sg.woff2" /* Guess for Regular 400 */
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Preloading Bold 700 (Assuming hero title uses bold) */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXbc1nY6HkvamqM9ZqKjIMqpxz1uLd4pQ.woff2" /* Guess for Bold 700 */
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Remove preloads for weights not critical for initial hero render if known */}

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
