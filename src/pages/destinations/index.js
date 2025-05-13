import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import styles from '../../styles/pages/Destinations.module.scss';

export default function Destinations({ destinations = [] }) {
  const [filteredDestinations, setFilteredDestinations] =
    useState(destinations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(destinations)) {
      setError('Invalid destinations data');
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
      setError(null);
    } catch (err) {
      setError('Error filtering destinations');
      console.error('Error filtering destinations:', err);
    }
  }, [searchQuery, destinations]);

  if (error) {
    return (
      <Layout>
        <Section>
          <Container>
            <div className={styles.error}>
              <h2>عذراً، حدث خطأ</h2>
              <p>{error}</p>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>الوجهات السياحية | مدارات الكون</title>
        <Meta
          title="الوجهات السياحية | مدارات الكون"
          description="اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل الأماكن حول العالم"
        />
      </Head>

      <Section className={styles.heroSection}>
        <div className={styles.worldMap}>
          <img src="/images/world-map.png" alt="World Map" />
        </div>
        <Container>
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
                {destinations.reduce((sum, dest) => sum + dest.tripCount, 0)}
              </span>
              <span className={styles.statLabel}>رحلة متاحة</span>
            </div>
          </div>
        </Container>
      </Section>

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
                  href={`/destinations/${destination.slug}/trips`}
                  className={styles.destinationCard}
                >
                  <div className={styles.destinationImage}>
                    {destination.image ? (
                      <img
                        src={destination.image}
                        alt={destination.title}
                        className={styles.image}
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
                        {destination.tripCount} رحلات متاحة
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
            <div className={styles.noDestinations}>لم نجد وجهات تطابق بحثك</div>
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
      const response = await fetch(
        'https://madaratalkon.com/wp-json/wp/v2/destination?per_page=100',
        {
          headers: {
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const destinations = await response.json();

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

      return {
        props: {
          destinations: formattedDestinations,
          error: null,
        },
        revalidate: 3600, // Revalidate every hour
      };
    } catch (error) {
      console.error(
        `Error fetching destinations (attempt ${currentTry + 1}/${maxRetries}):`,
        error
      );
      currentTry++;

      if (currentTry === maxRetries) {
        return {
          props: {
            destinations: [],
            error:
              'عذراً، حدث خطأ أثناء تحميل الوجهات. يرجى المحاولة مرة أخرى لاحقاً.',
          },
          revalidate: 60, // Retry more frequently on error
        };
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000 * currentTry));
    }
  }
}
