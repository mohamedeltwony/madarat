import { getPaginatedPosts, getYearArchives } from '@/lib/posts'; // Combined post imports
import { WebsiteJsonLd } from '@/lib/json-ld';
import useSite from '@/hooks/use-site';
import { getAllAuthors } from '@/lib/users';
import { getSiteMetadata } from '@/lib/site'; // Import site metadata fetcher
import { getAllMenus } from '@/lib/menus'; // Import menu fetcher

import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
import BentoPosts from '@/components/BentoPosts';
import BentoDestinations from '@/components/BentoDestinations';
import MorphPosts from '@/components/MorphPosts';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import Image from 'next/legacy/image';
import SparkleButton from '@/components/UI/SparkleButton';
import styles from '@/styles/pages/Home.module.scss';
import UIStyles from '@/components/UI/UI.module.scss';
import React, { useState } from 'react';
import Head from 'next/head';

export default function Home({
  posts = [],
  pagination,
  destinations = [],
  featuredAuthors = [],
  archives = [],
}) {
  const { metadata = {} } = useSite();
  const { title } = metadata;
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('شكراً لك! سنتواصل معك قريباً.');
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>مدارات | الصفحة الرئيسية</title>
        <meta
          name="description"
          content="موقع مدارات - منصة للمحتوى العربي المميز"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <WebsiteJsonLd siteTitle={title} />

        <Hero
          title="مدارات الكون"
          description="اكتشف معنا أجمل الوجهات السياحية حول العالم. نقدم لك دليلاً شاملاً للسفر والسياحة، من التخطيط للرحلة إلى أفضل الأماكن للزيارة والإقامة."
          backgroundImage="/images/hero-background-new.png" // Use correct .png extension
          // backgroundVideo="https://res.cloudinary.com/dn4akr8gq/video/upload/v1744811869/samples/dance-2.mp4" // Remove video prop
          featuredText="اكتشف المزيد"
          featuredLink="/destinations"
        />

        <Section className={styles.destinationsSection}>
          <Container>
            <h2 className={styles.sectionTitle}>الوجهات السياحية</h2>
            {!destinations || destinations.length === 0 ? (
              <div className={styles.noDestinations}>
                <p>جاري تحميل الوجهات السياحية...</p>
              </div>
            ) : (
              <BentoDestinations destinations={destinations} />
            )}
          </Container>
        </Section>

        {posts.length > 0 && (
          <>
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
          </>
        )}

        {/* New Features Section */}
        <Section className={styles.featuresSection}>
          <Container>
            <h2 className={styles.sectionTitle}>Explore Our Site</h2>

            <div className={styles.featuresGrid}>
              {/* Archives Feature */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Image
                    src="/images/icons/calendar.svg"
                    alt="Archives Icon"
                    width={48}
                    height={48}
                    layout="fixed"
                  />
                </div>
                <h3>Archives</h3>
                <p>
                  Browse our content by date. Find articles from specific months
                  or years.
                </p>

                <div className={styles.featureTags}>
                  {archives.slice(0, 5).map((year) => (
                    <Link
                      key={year}
                      href={`/archives/${year}`}
                      className={styles.featureTag}
                    >
                      {year}
                    </Link>
                  ))}
                </div>

                <Link href="/archives" className={styles.featureLink}>
                  Browse All Archives
                </Link>
              </div>

              {/* Authors Feature */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Image
                    src="/images/icons/users.svg"
                    alt="Authors Icon"
                    width={48}
                    height={48}
                    layout="fixed"
                  />
                </div>
                <h3>Authors</h3>
                <p>Discover our writers and their unique perspectives.</p>

                <div className={styles.featureAuthors}>
                  {featuredAuthors.slice(0, 3).map((author) => (
                    <Link
                      key={author.slug}
                      href={`/authors/${author.slug}`}
                      className={styles.featureAuthor}
                    >
                      {author.avatar && (
                        <Image
                          src={author.avatar.url}
                          alt={author.name}
                          width={40}
                          height={40}
                          layout="fixed"
                          className={styles.featureAuthorAvatar}
                        />
                      )}
                      <span>{author.name}</span>
                    </Link>
                  ))}
                </div>

                <Link href="/authors" className={styles.featureLink}>
                  View All Authors
                </Link>
              </div>

              {/* Advanced Search Feature */}
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <Image
                    src="/images/icons/search.svg"
                    alt="Search Icon"
                    width={48}
                    height={48}
                    layout="fixed"
                  />
                </div>
                <h3>Advanced Search</h3>
                {/* Replaced ' with &apos; */}
                <p>
                  Find exactly what you&apos;re looking for with our powerful
                  search tools.
                </p>
                <p>Filter content by date, category, author and more.</p>

                <Link href="/advanced-search" className={styles.featureLink}>
                  Try Advanced Search
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </Layout>

      {/* Lead Form Popup */}
      {showForm && (
        <div className={styles.formOverlay}>
          <div className={`${UIStyles.glassCard} ${styles.formContainer}`}>
            <button
              className={styles.closeButton}
              onClick={() => setShowForm(false)}
            >
              ×
            </button>
            <h3>انضم إلينا الآن</h3>
            <p>اترك بياناتك ليصلك كل جديد</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">الاسم الكامل</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">رقم الهاتف</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="أدخل رقم هاتفك"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>

              <div className={styles.formActions}>
                <SparkleButton type="submit" fullWidth>
                  إرسال
                </SparkleButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export async function getStaticProps() {
  // Fetch layout data (metadata, menus) concurrently with page data
  const { metadata } = await getSiteMetadata(); // Fetch metadata needed by Layout
  const { menus = [] } = await getAllMenus(); // Fetch menus needed by Layout

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
        metadata, // Pass metadata to the page
        menus, // Pass menus to the page
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
        metadata, // Still pass metadata even on error if fetched successfully
        menus, // Still pass menus even on error if fetched successfully
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
