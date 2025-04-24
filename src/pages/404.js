import Link from 'next/link';
import { Helmet } from 'react-helmet';
import { getSiteMetadata } from 'lib/site';
import { getAllMenus } from 'lib/menus';

import Layout from 'components/Layout';
import Section from 'components/Section';
import Container from 'components/Container';

import styles from 'styles/pages/Error.module.scss';

export default function Custom404({ metadata, menus }) {
  return (
    <Layout metadata={metadata} menus={menus}>
      <Helmet>
        <title>404 - Page Not Found</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Section>
        <Container className={styles.center}>
          <h1>Page Not Found</h1>
          <p className={styles.errorCode}>404</p>
          <p className={styles.errorMessage}>
            The page you were looking for could not be found.
          </p>
          <p>
            <Link href="/">Go back home</Link>
          </p>
        </Container>
      </Section>
    </Layout>
  );
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
  // Fetch layout data
  const { metadata } = await getSiteMetadata();
  const { menus } = await getAllMenus();

  // Sanitize data to remove undefined values
  const sanitizedMetadata = JSON.parse(JSON.stringify(metadata || {}));
  const sanitizedMenus = JSON.parse(JSON.stringify(menus || {}));

  return {
    props: {
      metadata: sanitizedMetadata,
      menus: sanitizedMenus
    }
  };
}
