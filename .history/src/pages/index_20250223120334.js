import { getPaginatedPosts } from '@/lib/posts';
import { WebsiteJsonLd } from '@/lib/json-ld';
import useSite from '@/hooks/use-site';

import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
import BentoPosts from '@/components/BentoPosts';
import BentoDestinations from '@/components/BentoDestinations';
import MorphPosts from '@/components/MorphPosts';
import Pagination from '@/components/Pagination';

import styles from '@/styles/pages/Home.module.scss';

export default function Home({ posts, pagination, destinations }) {
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
          <BentoDestinations destinations={destinations} />
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

  // Fetch destinations from the REST API
  const destinationsResponse = await fetch('https://madaratalkon.com/wp-json/wp/v2/destination');
  const destinationsData = await destinationsResponse.json();

  // Format destinations data from the REST API response
  const destinations = destinationsData.map(destination => {
    // Get the best available image URL from thumbnail sizes
    let imageUrl = '/images/destinations/default.jpg';
    if (destination.thumbnail?.sizes) {
      // Try to get the largest available image in this order
      const sizes = destination.thumbnail.sizes;
      imageUrl = sizes['2048x2048']?.source_url || 
                sizes['1536x1536']?.source_url || 
                sizes.large?.source_url || 
                sizes.medium_large?.source_url || 
                sizes.medium?.source_url || 
                destination.thumbnail.full?.source_url ||
                imageUrl;
    }

    return {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      description: destination.description,
      image: imageUrl,
      tripCount: destination.count || 0,
    };
  });

  return {
    props: {
      posts,
      destinations,
      pagination: {
        ...pagination,
        basePath: '/posts',
      },
    },
    // Revalidate every hour
    revalidate: 3600,
  };
}
