import { useRouter } from 'next/router';
import styles from './Layout.module.scss';

import useSite from '@/hooks/use-site';

import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import Meta from '@/components/Meta';
import WhatsAppButton from '@/components/WhatsAppButton/WhatsAppButton'; // Import the new component
import Analytics from '@/components/Analytics';
import JoinMission from '@/components/JoinMission';
import PageIndicator from '@/components/PageIndicator';

const Layout = ({ children, metadata: propsMetadata, menus: propsMenus }) => {
  const router = useRouter();
  const { asPath } = router;

  const { homepage, metadata: siteMetadata = {} } = useSite();
  
  // Use props metadata if provided, otherwise fallback to site metadata
  const metadata = propsMetadata || siteMetadata;

  if (!metadata.og) {
    metadata.og = {};
  }

  metadata.og.url = `${homepage}${asPath}`;

  // Check if current page is a trip landing page or thank you page
  const isTripPage = router.pathname.includes('-trip') || 
                     router.pathname.startsWith('/trip/') ||
                     router.pathname === '/generic-trip' ||
                     router.pathname === '/international-licence-trip' ||
                     router.pathname === '/schengen-visa-trip' ||
                     router.pathname === '/bosnia-trip' ||
                     router.pathname === '/georgia-trip' ||
                     router.pathname === '/azerbaijan-trip' ||
                     router.pathname === '/poland-trip' ||
                     router.pathname === '/italy-trip' ||
                     router.pathname === '/russia-trip' ||
                     router.pathname === '/turkey-trip' ||
                     router.pathname === '/trabzon-wider-north-turkey' ||
                     router.pathname === '/cruise-italy-spain-france' ||
                     router.pathname === '/london-scotland-trip';

  // Check if current page is a thank you page
  const isThankYouPage = router.pathname.includes('thank-you');

  // Basic meta settings without description duplication
  const metaSettings = {
    // Only pass essential link tags - no meta descriptions
    link: [
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        href: '/feed.xml',
      },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap',
        as: 'style',
      },
    ],
    // Basic meta tags without descriptions
    meta: [
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:locale',
        content: 'ar_SA',
      },
      {
        httpEquiv: 'Accept-CH',
        content: 'DPR, Width, Viewport-Width',
      },
      {
        httpEquiv: 'Content-Language',
        content: 'ar',
      },
    ],
  };

  return (
    <div className={styles.layoutContainer}>
      <Meta {...metaSettings} />
      <Analytics />
      <Header menus={propsMenus} />
      <Main>{children}</Main>
      {!isTripPage && <JoinMission />}
      {!isTripPage && <Footer />}
      {/* Conditionally render WhatsApp button - hide on trip pages and thank you pages */}
      {!isTripPage && !isThankYouPage && <WhatsAppButton />}
      {/* Page scroll indicator - shows on all pages on desktop */}
      <PageIndicator />
    </div>
  );
};

export default Layout;
