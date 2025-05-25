import { WebsiteJsonLd } from '@/lib/json-ld';
import { getSiteMetadataREST } from '@/lib/rest-api';
import dynamic from 'next/dynamic';

import Layout from '@/components/Layout';
import Section from '@/components/Section';
import Container from '@/components/Container';
import PostCard from '@/components/PostCard';
import BentoPosts from '@/components/BentoPosts';
import MorphPosts from '@/components/MorphPosts';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import Image from 'next/legacy/image';
import { SparkleButton, Button } from '@/components/UI';
import styles from '@/styles/pages/Home.module.scss';
import UIStyles from '@/components/UI/UI.module.scss';
import React, { useState, Suspense, useEffect } from 'react';
import Head from 'next/head';

// Dynamic imports for heavy components
const BentoDestinations = dynamic(
  () => import('@/components/BentoDestinations'),
  {
    loading: () => (
      <div className={styles.loadingContainer}>جاري تحميل الوجهات...</div>
    ),
    ssr: true,
  }
);

const OfferTrips = dynamic(() => import('@/components/OfferTrips'), {
  loading: () => (
    <div className={styles.loadingContainer}>جاري تحميل الرحلات...</div>
  ),
  ssr: true,
});

const GoogleReviewsSection = dynamic(
  () => import('@/components/GoogleReviewsSection'),
  {
    loading: () => (
      <div className={styles.loadingContainer}>جاري تحميل التقييمات...</div>
    ),
    ssr: false, // Client-side render only to reduce initial load
  }
);

// Featured destinations for the trending carousel
const trendingDestinations = [
  {
    id: 1,
    name: 'البوسنة',
    image: '/images/bosnia-background.webp',
  },
  {
    id: 2,
    name: 'ايطاليا',
    image: '/images/italy-background.webp',
  },
  {
    id: 3,
    name: 'أذربيجان',
    image: '/images/azerbaijan-background.webp',
  },
  {
    id: 4,
    name: 'شنغن',
    image: '/images/schengen-background.webp',
  },
];

export default function HomeVariation({
  posts = [],
  pagination,
  destinations = [],
  featuredAuthors = [],
  archives = [],
  metadata = { title: 'مدارات الكون', description: 'موقع مدارات الكون' },
}) {
  const { title = 'مدارات الكون', description = 'موقع مدارات الكون' } =
    metadata;
  const [showForm, setShowForm] = useState(false);

  // For carousel slide control
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto advance the carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % trendingDestinations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setActiveIndex((current) => (current + 1) % trendingDestinations.length);
  };

  const prevSlide = () => {
    setActiveIndex(
      (current) =>
        (current - 1 + trendingDestinations.length) %
        trendingDestinations.length
    );
  };

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

        {/* New Hero Section inspired by Page-1-2.tsx */}
        <section className="relative pt-24 pb-16 overflow-hidden" dir="rtl">
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero-background-new.png"
              alt="مدارات الكون للسفر والسياحة"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="block">اكتشف</span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  رحلتك الساحرة
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                اكتشف معنا أجمل الوجهات السياحية حول العالم. نقدم لك دليلاً
                شاملاً للسفر والسياحة، من التخطيط للرحلة إلى أفضل الأماكن
                للزيارة والإقامة.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/destinations">
                  <SparkleButton className="px-8 py-6 text-lg !rounded-button whitespace-nowrap cursor-pointer">
                    استكشف الرحلات
                  </SparkleButton>
                </Link>
                <a
                  href="#contact-form"
                  className="bg-transparent hover:bg-gray-800 text-white border border-gray-400 font-bold py-6 px-8 rounded-md transition duration-300"
                >
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>

          {/* Trending Destinations Carousel */}
          <div className="container mx-auto px-6 pb-16 relative z-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">الوجهات الرائجة</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition duration-300"
                >
                  <span className="sr-only">السابق</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-transparent hover:bg-gray-800 text-gray-400 hover:text-white border border-gray-700 rounded-full w-10 h-10 flex items-center justify-center transition duration-300"
                >
                  <span className="sr-only">التالي</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(${activeIndex * 100}%)` }}
              >
                {trendingDestinations.map((destination, index) => (
                  <div
                    key={destination.id}
                    className="min-w-[200px] md:min-w-[250px] lg:min-w-[300px] mx-3 flex-shrink-0 cursor-pointer group"
                  >
                    <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                      <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-90"></div>
                      <div className="absolute bottom-0 left-0 p-6">
                        <h4 className="text-2xl font-bold text-white mb-2">
                          {destination.name}
                        </h4>
                        <div className="flex items-center text-gray-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <span>استكشف الوجهة</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

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
          </>
        )}

        {/* Contact Form Section */}
        <Section
          id="contact-form"
          className={styles.contactSection}
          style={{ backgroundColor: '#1a1a2e' }}
        >
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  دعنا نساعدك في تخطيط رحلتك
                </h2>
                <p className="text-gray-300 mb-6">
                  فريقنا المتخصص جاهز لمساعدتك في تصميم رحلة فريدة تناسب
                  احتياجاتك وميزانيتك. املأ النموذج وسنتواصل معك في أقرب وقت
                  ممكن.
                </p>
                <div className="flex items-center text-gray-300 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span dir="ltr">+966 123 456 789</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>info@madaratalkon.com</span>
                </div>
              </div>
              <div className="bg-gray-800 p-8 rounded-lg shadow-xl">
                <form className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      رقم الجوال
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="destination"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      الوجهة المفضلة
                    </label>
                    <select
                      id="destination"
                      name="destination"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      <option value="">اختر وجهة</option>
                      <option value="europe">أوروبا</option>
                      <option value="asia">آسيا</option>
                      <option value="africa">أفريقيا</option>
                      <option value="americas">الأمريكتين</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-md transition duration-300"
                    >
                      أرسل طلبك
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </Container>
        </Section>
      </Layout>
    </div>
  );
}

export async function getStaticProps() {
  try {
    // Fetch site metadata
    const metadata = (await getSiteMetadataREST()) || {
      title: 'مدارات الكون',
      siteTitle: 'مدارات الكون',
      description: 'موقع مدارات الكون',
    };

    // Fetch posts with REST API
    let posts = [];
    let pagination = null;
    try {
      const postsResponse = await fetch(
        'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/posts?_embed&per_page=20',
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent':
              'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
          },
        }
      );

      if (!postsResponse.ok) {
        throw new Error(`Failed to fetch posts: ${postsResponse.status}`);
      }

      const postsData = await postsResponse.json();
      const totalPages = parseInt(
        postsResponse.headers.get('x-wp-totalpages') || '1'
      );

      posts = postsData.map((post) => ({
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        date: post.date,
        excerpt: post.excerpt.rendered,
        author: post._embedded?.author?.[0]
          ? {
              name: post._embedded.author[0].name,
              avatar: { url: post._embedded.author[0].avatar_urls?.[96] || '' },
            }
          : null,
        categories: post._embedded?.['wp:term']?.[0] || [],
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
          ? {
              sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
            }
          : null,
      }));

      pagination = {
        currentPage: 1,
        pagesCount: totalPages,
      };
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

    return {
      props: {
        metadata,
        posts,
        pagination,
        destinations: [],
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        metadata: {
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع مدارات الكون',
        },
        posts: [],
        pagination: null,
        destinations: [],
      },
      revalidate: 10,
    };
  }
}
