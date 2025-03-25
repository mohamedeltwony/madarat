import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PostCard from '@/components/PostCard';
import Pagination from '@/components/Pagination';
import styles from '@/styles/pages/Home.module.scss';
import { formatDate } from '@/lib/datetime';
import StickyLeadForm from '@/components/StickyLeadForm';
import BentoPosts from '@/components/BentoPosts';
import BentoDestinations from '@/components/BentoDestinations';

export default function Home({
  posts = [],
  pagination,
  destinations = [],
  featuredAuthors = [],
  archives = [],
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const metadata = {
    title: 'مدارات - رحلات سياحية مميزة',
    description: 'اكتشف أجمل الوجهات السياحية مع مدارات. نقدم رحلات مميزة وتجارب فريدة.',
  };

  return (
    <Layout>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <Container>
        <Section>
          <div className={styles.hero}>
            <h1>اكتشف العالم مع مدارات</h1>
            <p>رحلات مميزة وتجارب لا تنسى</p>
          </div>
        </Section>

        <Section>
          <h2>وجهات مميزة</h2>
          <BentoDestinations />
        </Section>

        <Section>
          <h2>آخر المقالات</h2>
          <BentoPosts />
        </Section>

        <Section>
          <div className={styles.cta}>
            <h2>ابدأ رحلتك معنا</h2>
            <p>اشترك في نشرتنا البريدية للحصول على أحدث العروض والوجهات</p>
            <button onClick={() => setShowForm(true)}>اشترك الآن</button>
          </div>
        </Section>
      </Container>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    console.log('Starting to fetch destinations...');

    const response = await fetch(
      'https://madaratalkon.com/wp-json/wp/v2/destination?per_page=100',
      {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch destinations:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const destinations = await response.json();
    console.log('Raw destinations data:', destinations);

    if (!Array.isArray(destinations)) {
      console.error('Destinations data is not an array:', destinations);
      throw new Error('Invalid destinations data format');
    }

    const formattedDestinations = destinations.map((dest) => ({
      id: dest.id,
      title: dest.name,
      description: dest.description || '',
      image: dest.thumbnail?.file
        ? `https://madaratalkon.com/wp-content/uploads/${dest.thumbnail.file}`
        : null,
      link: dest.link,
      slug: dest.slug,
      tripCount: dest.trip_count || 0,
    }));

    console.log('Formatted destinations:', formattedDestinations);

    // Fetch posts data with error handling
    let posts = [];
    let pagination = null;
    try {
      const postsData = await getPaginatedPosts({
        queryIncludes: 'archive',
      });
      posts = postsData?.posts || [];
      pagination = postsData?.pagination || null;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

    // Get featured authors with error handling
    let featuredAuthors = [];
    try {
      const { authors } = await getAllAuthors();
      featuredAuthors = authors?.slice(0, 5) || [];
    } catch (error) {
      console.error('Error fetching authors:', error);
    }

    // Get archive years with error handling
    let archives = [];
    try {
      const { years } = await getYearArchives();
      archives = years || [];
    } catch (error) {
      console.error('Error fetching archives:', error);
    }

    return {
      props: {
        destinations: formattedDestinations,
        posts,
        pagination,
        featuredAuthors,
        archives,
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        destinations: [],
        posts: [],
        pagination: null,
        featuredAuthors: [],
        archives: [],
        error: error.message,
      },
      revalidate: 60,
    };
  }
}
