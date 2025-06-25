import { useState, useEffect } from 'react';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';
import Head from 'next/head';

import Layout from '../../src/components/Layout';
import Container from '../../src/components/Container';
import Section from '../../src/components/Section';
import Header from '../../src/components/Header';
import Link from 'next/link';
import styles from '../../src/styles/pages/Destinations.module.scss';

export default function Destinations({ metadata, menus, destinations = [], error }) {
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!Array.isArray(destinations)) {
      return;
    }

    try {
      const filtered = destinations.filter((destination) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          destination.title.toLowerCase().includes(searchLower) ||
          destination.description.toLowerCase().includes(searchLower)
        );
      });
      setFilteredDestinations(filtered);
    } catch (err) {
      console.error('Error filtering destinations:', err);
    }
  }, [searchQuery, destinations]);

  if (error) {
    return (
      <Layout metadata={metadata} menus={menus}>
        <Header>
          <Container>
            <h1>الوجهات السياحية</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.error}>
              <h2>عذراً، حدث خطأ</h2>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className={styles.retryButton}
              >
                إعادة المحاولة
              </button>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout metadata={metadata} menus={menus}>
      <Head>
        <title>الوجهات السياحية - مدارات الكون</title>
        <meta
          name="description"
          content="اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل الأماكن حول العالم مع مدارات الكون. وجهات متنوعة في أوروبا وآسيا وأفريقيا بأفضل الأسعار والخدمات السياحية المتميزة."
        />
        <meta property="og:title" content="الوجهات السياحية - مدارات الكون | اكتشف أجمل الوجهات حول العالم" />
        <meta property="og:description" content="اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل الأماكن حول العالم مع مدارات الكون. وجهات متنوعة في أوروبا وآسيا وأفريقيا بأفضل الأسعار والخدمات." />
        <meta property="og:url" content="https://madaratalkon.sa/destination" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://madaratalkon.sa/images/destinations-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="الوجهات السياحية - مدارات الكون" />
        <meta name="twitter:description" content="اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل الأماكن حول العالم." />
      </Head>
      
      {/* Backup H1 for SEO - Hidden visually but accessible to crawlers */}
      <h1 style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        استكشف الوجهات السياحية
      </h1>
      
      <Header>
        <Container>
          <div className={styles.heroContent}>
            <h1 className={styles.pageTitle}>استكشف الوجهات السياحية</h1>
            <p className={styles.pageDescription}>
              اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل
              الأماكن حول العالم مع مدارات الكون
            </p>
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{destinations.length}</span>
                <span className={styles.statLabel}>وجهة سياحية</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>
                  {destinations.reduce((sum, dest) => sum + (dest.tripCount || 0), 0)}
                </span>
                <span className={styles.statLabel}>رحلة متاحة</span>
              </div>
            </div>
          </div>
        </Container>
      </Header>

      <Section className={styles.destinationsSection}>
        <Container>
          <div className={styles.searchContainer}>
            <div className={styles.searchBox}>
              <div className={styles.searchInputWrapper}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="ابحث عن وجهتك المفضلة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className={styles.searchIcon}>
                  <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
                  </svg>
                </div>
                {searchQuery && (
                  <button 
                    className={styles.clearButton}
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16">
                      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
                    </svg>
                  </button>
                )}
              </div>
              
              <div className={styles.popularTags}>
                <span className={styles.tagLabel}>وجهات شائعة:</span>
                {['أوروبا', 'أذربيجان', 'تركيا', 'البانيا'].map((tag) => (
                  <button
                    key={tag}
                    className={styles.tagButton}
                    onClick={() => setSearchQuery(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loading}>جاري التحميل...</div>
          ) : filteredDestinations.length > 0 ? (
            <div className={styles.destinationsGrid}>
              {filteredDestinations.map((destination) => (
                <Link
                  key={destination.id}
                  href={`/destination/${destination.slug}`}
                  className={styles.destinationCard}
                >
                  <div className={styles.destinationImage}>
                    {destination.image ? (
                      <img
                        src={destination.image}
                        alt={destination.title}
                        className={styles.image}
                        loading="lazy"
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        لا توجد صورة
                      </div>
                    )}
                    <div className={styles.imageOverlay}></div>
                  </div>
                  <div className={styles.destinationContent}>
                    <h2 className={styles.destinationTitle}>
                      {destination.title}
                    </h2>
                    <p className={styles.destinationDescription}>
                      {destination.description || 'استكشف رحلاتنا المميزة إلى هذه الوجهة الرائعة'}
                    </p>
                    <div className={styles.destinationMeta}>
                      <span className={styles.tripCount}>
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"></path>
                        </svg>
                        {destination.tripCount || 0} رحلات متاحة
                      </span>
                      <span className={styles.exploreMore}>
                        اكتشف المزيد
                        <svg viewBox="0 0 24 24" width="16" height="16">
                          <path fill="currentColor" d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.noDestinations}>
              <h3>لم نجد وجهات تطابق بحثك</h3>
              <p>جرب البحث بكلمات مختلفة أو تصفح جميع الوجهات المتاحة</p>
              <button 
                onClick={() => setSearchQuery('')}
                className={styles.clearSearchButton}
              >
                عرض جميع الوجهات
              </button>
            </div>
          )}

          {destinations.length === 0 && !error && (
            <div className={styles.emptyState}>
              <h3>لا توجد وجهات متاحة حالياً</h3>
              <p>نعمل على إضافة وجهات جديدة قريباً. تابعونا للحصول على آخر التحديثات.</p>
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const maxRetries = 3;
  let currentTry = 0;

  while (currentTry < maxRetries) {
    try {
      // Fetch metadata, menus, and destinations data
      const [
        { metadata },
        { menus },
        destinationsResponse
      ] = await Promise.all([
        getSiteMetadata(),
        getAllMenus(),
        fetch(
          'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?per_page=100',
          {
            headers: {
              Accept: 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
            timeout: 30000, // 30 second timeout
          }
        )
      ]);

      if (!destinationsResponse.ok) {
        throw new Error(`HTTP error! status: ${destinationsResponse.status}`);
      }

      const destinations = await destinationsResponse.json();

      // Format destinations data
      const formattedDestinations = destinations.map((dest) => {
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
          tripCount: dest.count || 0, // Use count field for trip count
        };
      });

      // Construct page metadata
      const pageMetadata = {
        title: 'الوجهات السياحية - مدارات الكون',
        description: `اكتشف ${formattedDestinations.length} وجهة سياحية مميزة مع مدارات الكون. رحلات لا تُنسى في أجمل الأماكن حول العالم`,
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/destination`,
        robots: 'index, follow',
        og: {
          title: 'الوجهات السياحية - مدارات الكون',
          description: `اكتشف ${formattedDestinations.length} وجهة سياحية مميزة مع مدارات الكون`,
          type: 'website',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/destination`,
          siteName: 'مدارات الكون',
          image: formattedDestinations[0]?.image || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/images/destinations-og.jpg`,
        },
        twitter: {
          card: 'summary_large_image',
          title: 'الوجهات السياحية - مدارات الكون',
          description: `اكتشف ${formattedDestinations.length} وجهة سياحية مميزة مع مدارات الكون`,
          image: formattedDestinations[0]?.image || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/images/destinations-og.jpg`,
        },
      };

      return {
        props: {
          metadata: { ...metadata, ...pageMetadata },
          menus: menus || [],
          destinations: formattedDestinations,
          error: null,
        },
        revalidate: 1800, // Revalidate every 30 minutes as per plan
      };
    } catch (error) {
      console.error(
        `Error fetching destinations (attempt ${currentTry + 1}/${maxRetries}):`,
        error
      );
      currentTry++;

      if (currentTry === maxRetries) {
        // Fetch basic metadata for error state
        const [{ metadata }, { menus }] = await Promise.all([
          getSiteMetadata().catch(() => ({ metadata: {} })),
          getAllMenus().catch(() => ({ menus: [] })),
        ]);

        const pageMetadata = {
          title: 'الوجهات السياحية - مدارات الكون',
          description: 'اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل الأماكن حول العالم',
        };

        return {
          props: {
            metadata: { ...metadata, ...pageMetadata },
            menus: menus || [],
            destinations: [],
            error: 'عذراً، حدث خطأ أثناء تحميل الوجهات. يرجى المحاولة مرة أخرى لاحقاً.',
          },
          revalidate: 60, // Retry more frequently on error
        };
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * currentTry));
    }
  }
}
