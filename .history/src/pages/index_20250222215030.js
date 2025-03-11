import { getPaginatedPosts } from '@/lib/posts';
import { WebsiteJsonLd } from '@/lib/json-ld';
import useSite from '@/hooks/use-site';

import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
import BentoPosts from '@/components/BentoPosts';
import Pagination from '@/components/Pagination';

import styles from '@/styles/pages/Home.module.scss';

export default function Home({ posts, pagination }) {
  const { metadata = {} } = useSite();
  const { title } = metadata;

  return (
    <Layout>
      <WebsiteJsonLd siteTitle={title} />
      
      <Hero
        title="مدارات الكون"
        description="اكتشف معنا أجمل الوجهات السياحية حول العالم. نقدم لك دليلاً شاملاً للسفر والسياحة، من التخطيط للرحلة إلى أفضل الأماكن للزيارة والإقامة."
        backgroundImage="/images/hero-background.jpg"
        featuredText="اكتشف المزيد"
        featuredLink="/destinations"
      />

      <Section>
        <Container>
          <h2 className={styles.sectionTitle}>Featured Stories</h2>
          <BentoPosts posts={posts.slice(0, 6)} />
        </Container>
      </Section>

      <Section className={styles.latestPosts}>
        <Container>
          <h2 className={styles.sectionTitle}>Latest Posts</h2>
          <ul className={styles.posts}>
            {posts.slice(6).map((post) => {
              return (
                <li key={post.slug}>
                  <PostCard post={post} />
                </li>
              );
            })}
          </ul>
          {pagination && (
            <Pagination
              currentPage={pagination?.currentPage}
              pagesCount={pagination?.pagesCount}
              basePath="/posts"
            />
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const { posts, pagination } = await getPaginatedPosts({
    queryIncludes: 'archive',
  });
  return {
    props: {
      posts,
      pagination: {
        ...pagination,
        basePath: '/posts',
      },
    },
  };
}
