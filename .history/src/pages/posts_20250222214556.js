import { getPaginatedPosts } from 'lib/posts';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Container from 'components/Container';
import BentoPosts from 'components/BentoPosts';
import { Helmet } from 'react-helmet';

export default function Posts({ posts }) {
  const { metadata } = usePageMetadata({
    metadata: {
      title: 'Posts',
      description: 'Latest travel stories and adventures',
    },
  });

  return (
    <Layout>
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
  const { posts } = await getPaginatedPosts({
    queryIncludes: 'archive',
  });

  return {
    props: {
      posts,
    },
  };
}
