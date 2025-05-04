import { WebsiteJsonLd } from '@/lib/json-ld';
import useSite from '@/hooks/use-site';
import { getSiteMetadataREST } from '@/lib/rest-api';

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
import OfferTrips from '@/components/OfferTrips';
import GoogleReviewsSection from '@/components/GoogleReviewsSection';

export default function Home({
  posts = [],
  pagination,
  destinations = [],
  featuredAuthors = [],
  archives = [],
}) {
  const { metadata = {} } = useSite();
  const { title = 'مدارات الكون', description = 'موقع مدارات الكون' } = metadata;
  const [showForm, setShowForm] = useState(false);

  const handleShowForm = () => {
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
    };

    console.log('Form data submitted:', data);
    // Here you'd typically send this data to your backend
    // For now, we'll just close the form
    setShowForm(false);
    alert('شكراً لك! سنتواصل معك قريباً');
  };

  return (
    <div>
      <Head>
        <title>{title} - موقع السفر والرحلات الأول في الوطن العربي</title>
        <meta name="description" content={description} />
        <meta
          property="og:title"
          content={`${title} - موقع السفر والرحلات الأول في الوطن العربي`}
        />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/Madarat-logo-768x238.png" />
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

        {/* Offer Trips Section */}
        <Section style={{ 
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%)',
          padding: '2rem 0', 
          width: '100%',
          maxWidth: '100%' 
        }}>
          <Container style={{ maxWidth: '1400px', width: '100%' }}>
            <OfferTrips />
          </Container>
        </Section>

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

        {/* Google Reviews Section */}
        <GoogleReviewsSection />

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
  try {
    // Fetch site metadata
    const metadata = await getSiteMetadataREST() || { 
      title: 'مدارات الكون',
      siteTitle: 'مدارات الكون',
      description: 'موقع مدارات الكون'
    }; 

    // Fetch destinations with REST API
    console.log('Starting to fetch destinations...');
    const response = await fetch(
      'https://madaratalkon.com/wp-json/wp/v2/destination?per_page=100&_embed',
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch destinations:', {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const destinations = await response.json();

    if (!Array.isArray(destinations)) {
      console.error('Destinations data is not an array:', destinations);
      throw new Error('Invalid destinations data format');
    }

    const formattedDestinations = destinations.map((dest) => ({
      id: dest.id,
      title: dest.name,
      description: dest.description || '',
      image: dest.thumbnail?.sizes?.full?.source_url || 
             dest.thumbnail?.source_url || 
             dest._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
             '/images/placeholder.jpg',
      link: dest.link,
      slug: dest.slug,
      tripCount: dest.count || 0,
    }));

    // Fetch posts with REST API
    let posts = [];
    let pagination = null;
    try {
      const postsResponse = await fetch(
        'https://madaratalkon.com/wp-json/wp/v2/posts?_embed&per_page=20',
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
          },
        }
      );
      
      if (!postsResponse.ok) {
        throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
      }
      
      const postsData = await postsResponse.json();
      const totalPages = parseInt(postsResponse.headers.get('x-wp-totalpages') || '1');
      
      posts = postsData.map(post => ({
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        date: post.date,
        excerpt: post.excerpt.rendered,
        author: post._embedded?.author?.[0] ? {
          name: post._embedded.author[0].name,
          avatar: { url: post._embedded.author[0].avatar_urls?.[96] || '' }
        } : null,
        categories: post._embedded?.['wp:term']?.[0] || [],
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0] ? {
          sourceUrl: post._embedded['wp:featuredmedia'][0].source_url
        } : null
      }));
      
      pagination = {
        currentPage: 1,
        pagesCount: totalPages
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

    // Get featured authors
    let featuredAuthors = [];
    try {
      const authorsResponse = await fetch(
        'https://madaratalkon.com/wp-json/wp/v2/users?per_page=5',
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
          },
        }
      );
      
      if (!authorsResponse.ok) {
        throw new Error(`Failed to fetch authors: ${authorsResponse.status}`);
      }
      
      const authorsData = await authorsResponse.json();
      
      featuredAuthors = authorsData.map(author => ({
        id: author.id,
        name: author.name,
        slug: author.slug,
        avatar: { url: author.avatar_urls?.[96] || '' }
      }));
    } catch (error) {
      console.error('Error fetching authors:', error);
    }

    // Get archive years
    let archives = [];
    try {
      // This endpoint might need a custom REST API endpoint in WordPress
      // For now, we'll use the years from the current date
      const currentYear = new Date().getFullYear();
      archives = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());
    } catch (error) {
      console.error('Error generating archives:', error);
    }

    return {
      props: {
        metadata,
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
        metadata: { 
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع مدارات الكون'
        },
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
