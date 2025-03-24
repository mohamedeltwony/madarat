import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import styles from '../../styles/pages/Trips.module.scss';

export default function TripsArchive({ trips = [] }) {
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!Array.isArray(trips)) {
      setError('Invalid trips data');
      return;
    }

    try {
      const filtered = trips.filter(trip => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          trip.title.toLowerCase().includes(searchLower) ||
          trip.description.toLowerCase().includes(searchLower);
        
        const matchesDestination = !selectedDestination || 
          trip.destination?.slug === selectedDestination;

        return matchesSearch && matchesDestination;
      });
      setFilteredTrips(filtered);
      setError(null);
    } catch (err) {
      setError('Error filtering trips');
      console.error('Error filtering trips:', err);
    }
  }, [searchQuery, selectedDestination, trips]);

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
        <title>الرحلات السياحية | مدارات الكون</title>
        <Meta
          title="الرحلات السياحية | مدارات الكون"
          description="اكتشف رحلاتنا السياحية المميزة واستمتع بتجربة لا تُنسى في أجمل الأماكن حول العالم"
        />
      </Head>

      <Section className={styles.heroSection}>
        <Container>
          <h1 className={styles.pageTitle}>الرحلات السياحية</h1>
          <p className={styles.pageDescription}>
            اكتشف رحلاتنا السياحية المميزة واستمتع بتجربة لا تُنسى في أجمل الأماكن حول العالم
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
                placeholder="ابحث عن رحلة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className={styles.destinationFilter}>
              <select
                className={styles.destinationSelect}
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
              >
                <option value="">جميع الوجهات</option>
                {trips
                  .filter((trip, index, self) => 
                    trip.destination && 
                    index === self.findIndex(t => t.destination?.slug === trip.destination?.slug)
                  )
                  .map(trip => (
                    <option key={trip.destination?.slug} value={trip.destination?.slug}>
                      {trip.destination?.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className={styles.loading}>جاري التحميل...</div>
          ) : filteredTrips.length > 0 ? (
            <div className={styles.tripsGrid}>
              {filteredTrips.map((trip) => (
                <Link
                  key={trip.id}
                  href={`/trips/${trip.slug}`}
                  className={styles.tripCard}
                >
                  <div className={styles.tripImage}>
                    {trip.image ? (
                      <img
                        src={trip.image}
                        alt={trip.title}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.placeholderImage}>
                        لا توجد صورة
                      </div>
                    )}
                  </div>
                  <div className={styles.tripContent}>
                    <h2 className={styles.tripTitle}>{trip.title}</h2>
                    <p className={styles.tripDescription}>
                      {trip.description}
                    </p>
                    <div className={styles.tripMeta}>
                      <span className={styles.destination}>
                        {trip.destination?.title}
                      </span>
                      <span className={styles.duration}>
                        {trip.duration} أيام
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.noTrips}>
              لم نجد رحلات تطابق بحثك
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const response = await fetch(
      'https://madaratalkon.com/wp-json/wp/v2/trip'
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const trips = await response.json();

    // Format trips data
    const formattedTrips = trips.map((trip) => ({
      id: trip.id,
      title: trip.title?.rendered || '',
      slug: trip.slug || '',
      description: trip.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
      image: trip.featured_media_url || null,
      duration: trip.duration || 0,
      destination: trip.destination ? {
        id: trip.destination.id,
        title: trip.destination.name,
        slug: trip.destination.slug,
      } : null,
    }));

    return {
      props: {
        trips: formattedTrips,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return {
      props: {
        trips: [],
        error: 'Failed to fetch trips'
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
} 