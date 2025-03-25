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
        <Container>
          <h1 className={styles.pageTitle}>الوجهات السياحية</h1>
          <p className={styles.pageDescription}>
            اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل
            الأماكن حول العالم
          </p>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className={styles.filters}>
            <div className={styles.searchBox}>
              <input
                type="text"
                className={styles.searchInput}
                placeholder="ابحث عن وجهة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                  </div>
                  <div className={styles.destinationContent}>
                    <h2 className={styles.destinationTitle}>
                      {destination.title}
                    </h2>
                    <p className={styles.destinationDescription}>
                      {destination.description}
                    </p>
                    <div className={styles.destinationMeta}>
                      <span className={styles.tripCount}>
                        {destination.tripCount} رحلات
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
  try {
    const response = await fetch(
      'https://madaratalkon.com/wp-json/wp/v2/destination'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const destinations = await response.json();

    // Format destinations data
    const formattedDestinations = destinations.map((dest) => ({
      id: dest.id,
      title: dest.name || '',
      slug: dest.slug || '',
      description: dest.description || '',
      image: dest.featured_media_url || null,
      tripCount: dest.trip_count || 0,
    }));

    return {
      props: {
        destinations: formattedDestinations,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return {
      props: {
        destinations: [],
        error: 'Failed to fetch destinations',
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
}
