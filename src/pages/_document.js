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
          {/* Preload critical font files */}
          {/* NOTE: URLs might change; verify in browser dev tools if possible */}
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXVc1nY6HkvangtZmpQdkhzfH5lkSs2Sg.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="https://fonts.gstatic.com/s/cairo/v28/SLXgc1nY6HkvamImRJqExst1P4wdCTELYDb3pw.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          {/* Add other weights (500, 600) if heavily used above the fold */}

          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

          <link
            href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
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
