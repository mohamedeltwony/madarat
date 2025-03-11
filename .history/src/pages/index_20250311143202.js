import { getPaginatedPosts } from '@/lib/posts';
import { WebsiteJsonLd } from '@/lib/json-ld';
import useSite from '@/hooks/use-site';
import { getAllAuthors } from '@/lib/users';
import { getYearArchives } from '@/lib/posts';

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

export default function Home({ posts, pagination, destinations, featuredAuthors, archives }) {
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
            <BentoDestinations destinations={destinations} />
          </Container>
        </Section>

        <Section className={styles.morphSection}>
          <Container>
            <h2 className={styles.sectionTitle}>Featured Stories</h2>
            <MorphPosts posts={posts.slice(0, 3)} />
          </Container>
        </Section>

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
                    <Link key={author.slug} href={`/authors/${author.slug}`} className={styles.featureAuthor}>
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
                <p>Find exactly what you're looking for with our powerful search tools.</p>
                <p>Filter content by date, category, author and more.</p>
                
                <Link href="/advanced-search" className={styles.featureLink}>
                  Try Advanced Search
                </Link>
              </div>
            </div>
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
    const { posts, pagination } = await getPaginatedPosts({
      queryIncludes: 'archive',
    });

    // Fetch destinations from the REST API with per_page set to 100
    const destinationsResponse = await fetch(
      `${process.env.WORDPRESS_API_URL || 'https://madaratalkon.com'}/wp-json/wp/v2/destination?per_page=100`
    );

    if (!destinationsResponse.ok) {
      throw new Error(`Failed to fetch destinations: ${destinationsResponse.status}`);
    }

    const destinationsData = await destinationsResponse.json();

    // Format destinations data from the REST API response
    const destinations = destinationsData.map(destination => {
      // Get the best available image URL from thumbnail sizes
      let imageUrl = null;
      if (destination.thumbnail?.sizes) {
        const sizes = destination.thumbnail.sizes;
        // Try to get the destination-thumb-size first, then fall back to other sizes
        imageUrl = sizes['destination-thumb-size']?.source_url ||
                  sizes['large']?.source_url ||
                  sizes['medium_large']?.source_url ||
                  sizes['medium']?.source_url ||
                  destination.thumbnail?.full?.source_url;
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
    
    // Get featured authors
    const { authors } = await getAllAuthors();
    const featuredAuthors = authors.slice(0, 5);
    
    // Get archive years
    const { years } = await getYearArchives();

    return {
      props: {
        posts,
        destinations,
        featuredAuthors,
        archives: years || [],
        pagination: {
          ...pagination,
          basePath: '/posts',
        },
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    
    // Return empty arrays if there's an error
    return {
      props: {
        posts: [],
        destinations: [],
        featuredAuthors: [],
        archives: [],
        pagination: {
          currentPage: 1,
          pagesCount: 1,
          basePath: '/posts',
        },
      },
      // Reduce revalidation time if there was an error
      revalidate: 60,
    };
  }
}
