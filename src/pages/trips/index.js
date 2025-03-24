import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import styles from '../../styles/pages/Trips.module.scss';

const TRIPS_PER_PAGE = 20;

export default function TripsArchive({ trips = [], totalPages = 1 }) {
  const router = useRouter();
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(parseInt(router.query.page) || 1);

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push({
      pathname: '/trips',
      query: { page }
    }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * TRIPS_PER_PAGE;
  const endIndex = startIndex + TRIPS_PER_PAGE;
  const currentTrips = filteredTrips.slice(startIndex, endIndex);

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

      <Section className={styles.trips}>
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
          ) : currentTrips.length > 0 ? (
            <>
              <div className={styles.tripsGrid}>
                {currentTrips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trips/${trip.slug}`}
                    className={styles.tripCard}
                  >
                    <div className={styles.tripImage}>
                      {trip.featured_image?.sizes?.medium?.source_url ? (
                        <img
                          src={trip.featured_image.sizes.medium.source_url}
                          alt={trip.title}
                          className={styles.image}
                        />
                      ) : trip._embedded?.['wp:featuredmedia']?.[0]?.source_url ? (
                        <img
                          src={trip._embedded['wp:featuredmedia'][0].source_url}
                          alt={trip.title}
                          className={styles.image}
                        />
                      ) : trip.featured_media_url ? (
                        <img
                          src={trip.featured_media_url}
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
                        <span className={styles.duration}>
                          {trip.duration?.days || 0} {trip.duration?.duration_unit || 'يوم'}
                        </span>
                        <span className={styles.price}>
                          {trip.wp_travel_engine_setting_trip_actual_price || trip.price || 'السعر غير متوفر'} {trip.currency?.code || 'SAR'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {Math.ceil(filteredTrips.length / TRIPS_PER_PAGE) > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    السابق
                  </button>
                  {[...Array(Math.ceil(filteredTrips.length / TRIPS_PER_PAGE))].map((_, index) => (
                    <button
                      key={index + 1}
                      className={`${styles.pageButton} ${currentPage === index + 1 ? styles.active : ''}`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    className={styles.pageButton}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(filteredTrips.length / TRIPS_PER_PAGE)}
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
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
      `https://madaratalkon.com/wp-json/wp/v2/trip?per_page=100&_embed`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const trips = await response.json();
    const totalPages = Math.ceil(trips.length / TRIPS_PER_PAGE);

    // Format trips data
    const formattedTrips = trips.map((trip) => {
      // Safely handle destination data
      let destination = null;
      if (trip._embedded?.['wp:term']?.[0]?.taxonomy === 'destination') {
        destination = {
          id: trip._embedded['wp:term'][0].id || null,
          title: trip._embedded['wp:term'][0].name || '',
          slug: trip._embedded['wp:term'][0].slug || '',
        };
      }

      // Safely handle duration data
      let duration = null;
      if (trip.duration) {
        duration = {
          days: trip.duration.days || 0,
          nights: trip.duration.nights || 0,
          duration_unit: trip.duration.duration_unit || 'يوم',
          duration_type: trip.duration.duration_type || 'days'
        };
      }

      return {
        id: trip.id,
        title: trip.title?.rendered || '',
        slug: trip.slug || '',
        description: trip.excerpt?.rendered?.replace(/<[^>]*>/g, '') || '',
        featured_image: trip.featured_image || null,
        duration,
        destination,
        wp_travel_engine_setting_trip_actual_price: trip.wp_travel_engine_setting_trip_actual_price || null,
        price: trip.price || null,
        currency: trip.currency || null,
      };
    });

    return {
      props: {
        trips: formattedTrips,
        totalPages,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return {
      props: {
        trips: [],
        totalPages: 1,
        error: 'Failed to fetch trips'
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
} 