import { getPaginatedPosts } from '@/lib/posts';
import { getCategories } from '@/lib/categories';
import { WebsiteJsonLd } from '@/lib/json-ld';
import useSite from '@/hooks/use-site';

import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
import BentoPosts from '@/components/BentoPosts';
import MorphPosts from '@/components/MorphPosts';
import BentoDestinations from '@/components/BentoDestinations';
import Pagination from '@/components/Pagination';

import styles from '@/styles/pages/Home.module.scss';

export default function Home({ posts, categories, pagination }) {
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

      <Section className={styles.destinationsSection}>
        <Container>
          <h2 className={styles.sectionTitle}>الوجهات السياحية</h2>
          <BentoDestinations categories={categories} />
        </Container>
      </Section>

      <Section className={styles.morphSection}>
        <Container>
          <h2 className={styles.sectionTitle}>Featured Stories</h2>
          <MorphPosts posts={posts.slice(0, 3)} />
        </Container>
      </Section>

      <Section>
        <Container>
          <h2 className={styles.sectionTitle}>Latest Stories</h2>
          <BentoPosts posts={posts.slice(3, 9)} />
        </Container>
      </Section>

      <Section className={styles.latestPosts}>
        <Container>
          <h2 className={styles.sectionTitle}>More Adventures</h2>
          <ul className={styles.posts}>
            {posts.slice(9).map((post) => {
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

  const { categories } = await getCategories({
    queryIncludes: 'all'
  });

  return {
    props: {
      posts,
      categories,
      pagination: {
        ...pagination,
        basePath: '/posts',
      },
    },
  };
}
