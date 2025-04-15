import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import dynamic from 'next/dynamic';
import styles from './Layout.module.scss';

import useSite from '@/hooks/use-site';
import { helmetSettingsFromMetadata } from '@/lib/site';

// Dynamically import components that are not needed for initial render
const Header = dynamic(() => import('@/components/Header'), {
  ssr: true,
});

const Main = dynamic(() => import('@/components/Main'), {
  ssr: true,
});

const Footer = dynamic(() => import('@/components/Footer'), {
  ssr: true,
});

const Layout = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const { homepage, metadata = {} } = useSite();

  if (!metadata.og) {
    metadata.og = {};
  }

  metadata.og.url = `${homepage}${asPath}`;

  const helmetSettings = {
    defaultTitle: metadata.title,
    titleTemplate:
      process.env.WORDPRESS_PLUGIN_SEO === true
        ? '%s'
        : `%s - ${metadata.title}`,
    ...helmetSettingsFromMetadata(metadata, {
      setTitle: false,
      link: [
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          href: '/feed.xml',
        },

        // Favicon sizes and manifest generated via https://favicon.io/

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
      ],
    }),
  };

  return (
    <div className={styles.layoutContainer}>
      <Helmet {...helmetSettings}>
        {/* Additional SEO Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="ar_SA" />
        <link rel="canonical" href={metadata.og.url} />

        {/* Preload Fonts */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap"
          as="style"
        />

        {/* Performance Optimization */}
        <meta httpEquiv="Accept-CH" content="DPR, Width, Viewport-Width" />
        <meta httpEquiv="Content-Language" content="ar" />
      </Helmet>

      <Header />

      <Main>{children}</Main>

      <Footer />
    </div>
  );
};

export default Layout;
