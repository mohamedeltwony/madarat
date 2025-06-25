import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import useSite from '@/hooks/use-site';
import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Hero from '@/components/Hero';
import { WebsiteJsonLd } from '@/components/common/JsonLd';
import OfferTrips from '@/components/OfferTrips';
import BentoPosts from '@/components/BentoPosts';
import BentoDestinations from '@/components/BentoDestinations';
import SparkleButton from '@/components/UI/SparkleButton';
import styles from '@/styles/pages/Home.module.scss';
import UIStyles from '@/components/UI/UI.module.scss';
import { getSiteMetadataREST } from '@/lib/rest-api';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import PostCard from '@/components/PostCard';
import MorphPosts from '@/components/MorphPosts';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import Image from 'next/legacy/image';
import SEO from '@/components/SEO';
import { getPaginatedPosts } from '@/lib/posts';
import { getCategories } from '@/lib/categories';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';


// Dynamic imports for heavy components
const GoogleReviewsSection = dynamic(
  () => import('@/components/GoogleReviewsSection'),
  {
    loading: () => (
      <div className={styles.loadingContainer}>جاري تحميل التقييمات...</div>
    ),
    ssr: false, // Client-side render only to reduce initial load
  }
);

export default function Home({
  posts = [],
  pagination,
  destinations = [],
  featuredAuthors = [],
  archives = [],
  offerTrips = [],
  tripsPagination,
}) {
  const { metadata = {} } = useSite();
  const { title = 'مدارات الكون', description = 'موقع مدارات الكون' } =
    metadata;
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

  // Track page view on mount
  useEffect(() => {
    // Facebook Pixel tracking
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: 'Homepage',
        content_category: 'homepage',
        content_type: 'website'
      });
    }

    // GTM tracking
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_title: title,
        page_location: window.location.href,
        page_category: 'homepage'
      });
    }
  }, [title]);

  const breadcrumbs = [
    { name: 'الرئيسية', url: '/' }
  ];

  return (
    <div>
      <Head>
        <title>مدارات الكون - موقع السفر والرحلات الأول في الوطن العربي | أفضل العروض السياحية</title>
        <meta name="description" content="اكتشف معنا أجمل الوجهات السياحية حول العالم مع مدارات الكون. نقدم لك أفضل العروض السياحية والرحلات المميزة إلى البوسنة وتركيا وجورجيا وأذربيجان بأسعار تنافسية وخدمات عالية الجودة." />
        <meta
          property="og:title"
          content="مدارات الكون - موقع السفر والرحلات الأول في الوطن العربي | أفضل العروض السياحية"
        />
        <meta property="og:description" content="اكتشف معنا أجمل الوجهات السياحية حول العالم مع مدارات الكون. نقدم لك أفضل العروض السياحية والرحلات المميزة إلى البوسنة وتركيا وجورجيا وأذربيجان بأسعار تنافسية وخدمات عالية الجودة." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://madaratalkon.com/" />
        <meta property="og:image" content="https://madaratalkon.com/images/homepage-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="مدارات الكون - موقع السفر والرحلات الأول في الوطن العربي" />
        <meta name="twitter:description" content="اكتشف معنا أجمل الوجهات السياحية حول العالم مع مدارات الكون. أفضل العروض السياحية والرحلات المميزة." />
      </Head>

      <SEO
        title="مدارات الكون - موقع السفر والرحلات الأول في الوطن العربي"
        description="اكتشف معنا أجمل الوجهات السياحية حول العالم مع مدارات الكون. نقدم لك أفضل العروض السياحية والرحلات المميزة إلى البوسنة وتركيا وجورجيا وأذربيجان بأسعار تنافسية وخدمات عالية الجودة."
        keywords="سياحة, سفر, رحلات, وجهات سياحية, مدارات الكون, حجز رحلات, عروض سياحية, البوسنة, تركيا, جورجيا, أذربيجان"
        image="/Madarat-logo-768x238.png"
        breadcrumbs={breadcrumbs}
      />

      <Layout>
        <WebsiteJsonLd siteTitle={title} />

        <Hero
          title="مدارات الكون"
          description="اكتشف معنا أجمل الوجهات السياحية حول العالم. نقدم لك دليلاً شاملاً للسفر والسياحة، من التخطيط للرحلة إلى أفضل الأماكن للزيارة والإقامة."
          backgroundImage="/images/hero-background-new.png" // Use correct .png extension
          // backgroundVideo="https://res.cloudinary.com/dn4akr8gq/video/upload/v1744811869/samples/dance-2.mp4" // Remove video prop
          featuredText="اكتشف المزيد"
                        featuredLink="/destination"
        />

        {/* Offer Trips Section */}
        <Section
          style={{
            padding: '2rem 0',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <Container style={{ maxWidth: '1400px', width: '100%' }}>
            <OfferTrips />
          </Container>
        </Section>

        <Section className={styles.destinationsSection}>
          <Container>
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
        {/* Temporarily hidden until Google Places API is provided
        <GoogleReviewsSection />
        */}

        {posts.length > 0 && (
          <>
            <Section>
              <Container>
                <h2 className={styles.sectionTitle}>Latest Stories</h2>
                <BentoPosts posts={posts.slice(3, 9)} />
              </Container>
            </Section>
          </>
        )}

        {/* New Features Section */}
        {/* Removed Explore Our Site features section */}

        {/* Popular Destinations Section - Coming Soon */}
        {/* <Section>
          <Container>
            <PopularDestinations destinations={destinations} />
          </Container>
        </Section> */}
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
    const { posts } = await getPaginatedPosts({
      queryIncludes: 'archive',
    });
    const { categories } = await getCategories();

    // Get site metadata
    const { metadata } = await getSiteMetadata();
    const { menus } = await getAllMenus();

    // Fetch destinations from WordPress API
    let destinations = [];
    try {
      const destinationsResponse = await fetch(
        'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?per_page=100',
        {
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          timeout: 5000, // Reduced to 5 second timeout
        }
      );

      if (destinationsResponse.ok) {
        const destinationsData = await destinationsResponse.json();
        
        // Format destinations data
        destinations = destinationsData.map((dest) => {
          // Get the best image URL from thumbnail sizes
          let imageUrl = null;
          if (dest.thumbnail) {
            // If destination-thumb-size exists, use it
            if (dest.thumbnail.sizes && dest.thumbnail.sizes['destination-thumb-size']) {
              imageUrl = dest.thumbnail.sizes['destination-thumb-size'].source_url;
            } 
            // Fallback to full image
            else if (dest.thumbnail.sizes && dest.thumbnail.sizes.full) {
              imageUrl = dest.thumbnail.sizes.full.source_url;
            }
            // Final fallback if no sizes are available
            else if (dest.thumbnail.source_url) {
              imageUrl = dest.thumbnail.source_url;
            }
          }

          // Parse description from rendered HTML content
          let description = '';
          if (dest.description) {
            description = dest.description;
            // Remove HTML tags if needed
            description = description.replace(/<[^>]*>?/gm, '');
          }

          return {
            id: dest.id,
            title: dest.name || '',
            slug: dest.slug || '',
            description: description,
            image: imageUrl,
            count: dest.count || 0, // Use count field for trip count
          };
        });
      } else {
        console.error('Failed to fetch destinations:', destinationsResponse.status);
      }
    } catch (destinationsError) {
      console.error('Error fetching destinations:', destinationsError);
    }

    return {
      props: {
        posts: posts || [],
        categories: categories || [],
        metadata: metadata || {},
        menus: menus || [],
        destinations: destinations || [],
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        posts: [],
        categories: [],
        metadata: {},
        menus: [],
        destinations: [],
      },
      revalidate: 3600,
    };
  }
} 