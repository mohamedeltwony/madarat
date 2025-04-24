import Link from 'next/link';
import { Helmet } from 'react-helmet';
import { useEffect } from 'react'; // Import useEffect
import { useRouter } from 'next/router'; // Import useRouter

import { getPageByUri, getAllPages } from 'lib/pages'; // Added getAllPages back
import { WebpageJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Header from 'components/Header';
import Content from 'components/Content';
import Section from 'components/Section';
import Container from 'components/Container';
import FeaturedImage from 'components/FeaturedImage';
import Breadcrumbs from 'components/Breadcrumbs';

import styles from 'styles/pages/Page.module.scss';

export default function Page({ page, breadcrumbs }) {
  const {
    title,
    metaTitle,
    description,
    slug,
    content,
    featuredImage,
    children,
    // Note: page.ancestors is available but not directly used in the component render
  } = page;

  const { metadata: siteMetadata = {} } = useSite();
  const router = useRouter(); // Get router instance

  const { metadata } = usePageMetadata({
    metadata: {
      ...page,
      title: metaTitle,
      description:
        description || page.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const hasChildren = Array.isArray(children) && children.length > 0;
  // Use the passed breadcrumbs prop which is derived from page.ancestors in getStaticProps
  const hasBreadcrumbs = Array.isArray(breadcrumbs) && breadcrumbs.length > 0;

  const helmetSettings = helmetSettingsFromMetadata(metadata);

  // EFFECT TO FIX Z-INDEX
  useEffect(() => {
    const applyZIndexFix = () => {
      const element = document.getElementById('secondary');
      if (!element) return; // Exit if element not found

      // Match '/shop-2' or '/shop-2/' path
      const isShopPage = /^\/shop-2\/?$/.test(router.asPath);
      const isMobile = window.innerWidth <= 768;

      if (isShopPage && isMobile) {
        // Apply fix only on mobile shop page
        if (element.style.zIndex !== '999999') {
           console.log('[Z-Index Fix] Applying z-index 999999 to #secondary');
           element.style.zIndex = '999999';
        }
      } else {
        // Remove inline style if not mobile shop page OR if screen becomes wider
        // Only remove if this script potentially set it
        if (element.style.zIndex === '999999') {
           console.log('[Z-Index Fix] Removing inline z-index from #secondary');
           element.style.zIndex = ''; // Remove inline style
        }
      }
    };

    // Apply on mount and route change completion (better timing than just asPath change)
    applyZIndexFix();
    router.events.on('routeChangeComplete', applyZIndexFix);


    // Apply on resize
    window.addEventListener('resize', applyZIndexFix);

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('resize', applyZIndexFix);
      router.events.off('routeChangeComplete', applyZIndexFix);
      // Optional: Reset style on unmount if needed
      // const element = document.getElementById('secondary');
      // if (element && element.style.zIndex === '999999') {
      //   element.style.zIndex = '';
      // }
    };
  }, [router.asPath, router.events]); // Re-run when path changes or events object changes


  return (
    <Layout>
      <Helmet {...helmetSettings} />

      <WebpageJsonLd
        title={metadata.title}
        description={metadata.description}
        siteTitle={siteMetadata.title}
        slug={slug}
      />

      <Header>
        {hasBreadcrumbs && <Breadcrumbs breadcrumbs={breadcrumbs} />}
        {featuredImage && (
          <FeaturedImage
            {...featuredImage}
            src={featuredImage.sourceUrl}
            dangerouslySetInnerHTML={featuredImage.caption}
          />
        )}
        <h1 className={styles.title}>{title}</h1>
      </Header>

      <Content>
        <Section>
          <Container>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{
                __html: content,
              }}
            />
          </Container>
        </Section>

        {hasChildren && (
          <Section className={styles.sectionChildren}>
            <Container>
              <aside>
                <p className={styles.childrenHeader}>
                  <strong>{title}</strong>
                </p>
                <ul>
                  {children.map((child) => {
                    return (
                      <li key={child.id}>
                        <Link href={child.uri}>{child.title}</Link>
                      </li>
                    );
                  })}
                </ul>
              </aside>
            </Container>
          </Section>
        )}
      </Content>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { slugParent, slugChild } = params;

  // We can use the URI to look up our page and subsequently its ID, so
  // we can first contruct our URI from the page params

  let pageUri = `/${slugParent}/`;

  // We only want to apply deeper paths to the URI if we actually have
  // existing children

  if (Array.isArray(slugChild) && slugChild.length > 0) {
    pageUri = `${pageUri}${slugChild.join('/')}/`;
  }

  const { page } = await getPageByUri(pageUri);

  if (!page) {
    return {
      props: {},
      notFound: true,
    };
  }

  // Breadcrumbs are now fetched within getPageByUri via the 'ancestors' field in the GraphQL query
  // and processed in mapPageData in lib/pages.js
  const breadcrumbs = page.ancestors || []; // Use ancestors directly, default to empty array

  return {
    props: {
      page, // page object now includes the processed 'ancestors' array
      breadcrumbs,
    },
  };
}

export async function getStaticPaths() {
  // We still need getAllPages here to know which paths to generate.
  // This call remains, but it's only run once at build time for path generation.
  const { pages } = await getAllPages({
    queryIncludes: 'index', // Use the minimal query for paths
  });

  // Filter out problematic pages and the homepage
  const paths = pages
    .filter(({ uri }) => {
      // Filter out undefined URIs
      if (typeof uri !== 'string') {
        console.log(`[getStaticPaths] Skipping page with undefined URI`);
        return false;
      }

      // Filter out homepage
      if (uri === '/') {
        console.log(`[getStaticPaths] Skipping homepage`);
        return false;
      }

      // Filter out problematic pages
      if (uri.includes('home-04') || uri.includes('home-05')) {
        console.log(`[getStaticPaths] Skipping problematic page: ${uri}`);
        return false;
      }

      // Filter out destinations page
      if (uri === '/destinations/') {
        console.log(`[getStaticPaths] Skipping destinations page`);
        return false;
      }

      return true;
    })
    .map(({ uri }) => {
      const segments = uri.split('/').filter((seg) => seg !== '');

      return {
        params: {
          slugParent: segments.shift(),
          slugChild: segments,
        },
      };
    });

  return {
    paths,
    fallback: 'blocking',
  };
}
