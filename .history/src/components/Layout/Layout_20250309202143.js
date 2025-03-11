import { useRouter } from 'next/router';
import styles from './Layout.module.scss';

import useSite from '@/hooks/use-site';
import { helmetSettingsFromMetadata } from '@/lib/site';

import Header from '@/components/Header';
import Main from '@/components/Main';
import Footer from '@/components/Footer';
import Meta from '@/components/Meta';

const Layout = ({ children }) => {
  const router = useRouter();
  const { asPath } = router;

  const { homepage, metadata = {} } = useSite();

  if (!metadata.og) {
    metadata.og = {};
  }

  metadata.og.url = `${homepage}${asPath}`;

  const metaSettings = {
    title: metadata.title,
    defaultTitle: metadata.title,
    titleTemplate: process.env.WORDPRESS_PLUGIN_SEO === true ? '%s' : `%s - ${metadata.title}`,
    ...helmetSettingsFromMetadata(metadata, {
      setTitle: false,
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
          rel: 'canonical',
          href: metadata.og.url,
        },
        {
          rel: 'preload',
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700&display=swap',
          as: 'style',
        },
      ],
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
    }),
  };

  return (
    <div className={styles.layoutContainer}>
      <Meta {...metaSettings} />
      <Header />
      <Main>{children}</Main>
      <Footer />
    </div>
  );
};

export default Layout;
