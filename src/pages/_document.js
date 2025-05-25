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
            type="image/png"
            href="/images/مدارات-2.png"
          />
          <link 
            rel="apple-touch-icon" 
            href="/images/مدارات-2.png" 
          />

          {/* Google Fonts with proper preconnect */}
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

          {/* Microsoft Clarity Code */}
          <script
            type="text/javascript"
            async
            defer
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "r7izccxz4q");
              `,
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
