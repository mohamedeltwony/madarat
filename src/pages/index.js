import { getPaginatedPosts } from '@/lib/posts';
import { WebsiteJsonLd } from '@/lib/json-ld';
import useSite from '@/hooks/use-site';
import { getYearArchives } from '@/lib/posts';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
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
import Hero from '@/components/Hero';
import PostCard from '@/components/PostCard';

export default function Home({ posts = [], pagination, destinations = [], archives = [] }) {
  const site = useSite();
  const { metadata = { title: 'مدارات' } } = site || {};
  const { title = 'مدارات' } = metadata;
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('شكراً لك! سنتواصل معك قريباً.');
    setShowForm(false);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | الصفحة الرئيسية</title>
        <meta name="description" content="موقع مدارات - منصة للمحتوى العربي المميز" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

        {/* Features Section */}
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
                <p>Browse our content by date. Find articles from specific months or years.</p>
                
                <div className={styles.featureTags}>
                  {archives.slice(0, 5).map((year) => (
                    <Link key={year} href={`/archives/${year}`} className={styles.featureTag}>
                      {year}
                    </Link>
                  ))}
                </div>
                
                <Link href="/archives" className={styles.featureLink}>
                  Browse All Archives
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
                <p>Find exactly what you're looking for with our powerful search tools.</p>
                <p>Filter content by date, category and more.</p>
                
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
            <button className={styles.closeButton} onClick={() => setShowForm(false)}>
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
  try {
    console.log('Starting to fetch destinations...');
    
    const response = await fetch('https://madaratalkon.com/wp-json/wp/v2/destination?per_page=100', {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

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

    const formattedDestinations = destinations.map(dest => ({
      id: dest.id,
      title: dest.name,
      description: dest.description || '',
      image: dest.thumbnail?.file ? `https://madaratalkon.com/wp-content/uploads/${dest.thumbnail.file}` : null,
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
        archives,
        site: {
          metadata: {
            title: 'مدارات',
            description: 'موقع مدارات - منصة للمحتوى العربي المميز',
          }
        }
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        destinations: [],
        posts: [],
        pagination: null,
        archives: [],
        error: error.message,
        site: {
          metadata: {
            title: 'مدارات',
            description: 'موقع مدارات - منصة للمحتوى العربي المميز',
          }
        }
      },
      revalidate: 60,
    };
  }
}
