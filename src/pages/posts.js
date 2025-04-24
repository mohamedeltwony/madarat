import { getPaginatedPosts } from 'lib/posts';
import usePageMetadata from 'hooks/use-page-metadata';
import { getSiteMetadata } from 'lib/site';
import { getAllMenus } from 'lib/menus';

import Layout from 'components/Layout';
import Container from 'components/Container';
import BentoPosts from 'components/BentoPosts';
import { Helmet } from 'react-helmet';

export default function Posts({ posts, metadata: siteMetadata, menus }) {
  const { metadata } = usePageMetadata({
    metadata: {
      title: 'Posts',
      description: 'Latest travel stories and adventures',
    },
  });

  return (
    <Layout metadata={siteMetadata} menus={menus}>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
      </Helmet>

      <Container>
        <BentoPosts posts={posts} />
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  // Fetch layout data
  const { metadata } = await getSiteMetadata();
  const { menus } = await getAllMenus();

  // Fetch page-specific data
  const { posts } = await getPaginatedPosts({
    queryIncludes: 'archive',
  });

  // Sanitize data to remove undefined values
  const sanitizedMetadata = JSON.parse(JSON.stringify(metadata || {}));
  const sanitizedMenus = JSON.parse(JSON.stringify(menus || {}));
  const sanitizedPosts = JSON.parse(JSON.stringify(posts || []));

  return {
    props: {
      posts: sanitizedPosts,
      metadata: sanitizedMetadata,
      menus: sanitizedMenus,
    },
    // Add ISR with a reasonable revalidation period
    revalidate: 600, // Revalidate every 10 minutes
  };
}
