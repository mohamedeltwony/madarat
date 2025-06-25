import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Meta from '@/components/Meta';
import styles from '@/styles/pages/DestinationTrips.module.scss';
import { decodeHtmlEntitiesSafe } from '@/lib/util';

// Function to decode HTML entities and clean HTML
function parseHtml(htmlString) {
  if (!htmlString) return '';
  
  // Remove HTML tags first
  const textWithEntities = htmlString.replace(/<[^>]*>?/gm, '');
  
  // Use enhanced HTML entity decoding
  return decodeHtmlEntitiesSafe(textWithEntities);
}

export default function DestinationPage({ destination, trips = [] }) {
  const router = useRouter();
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    // Initialize with properly parsed trips
    if (Array.isArray(trips)) {
      setFilteredTrips(trips);
    }
  }, [trips]);
  
  useEffect(() => {
    let filtered = [...trips];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (trip) =>
          (trip.title || '').toLowerCase().includes(query) ||
          (trip.description || '').toLowerCase().includes(query)
      );
    }

    setFilteredTrips(filtered);
  }, [trips, searchQuery]);

  if (!destination) {
    return (
      <Layout>
        <Container>
          <div className={styles.error}>
            <h1>الوجهة غير موجودة</h1>
            <p>عذراً، لم نتمكن من العثور على الوجهة المطلوبة.</p>
            <Link href="/destination" className={styles.backLink}>
              العودة إلى جميع الوجهات
            </Link>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{destination.title} | رحلات مدارات</title>
        <meta
          name="description"
          content={`اكتشف رحلات مدارات في ${destination.title}. مجموعة مميزة من الرحلات السياحية في ${destination.title}.`}
        />
      </Head>

      <Meta
        title={`${destination.title} | رحلات مدارات`}
        description={`اكتشف رحلات مدارات في ${destination.title}. مجموعة مميزة من الرحلات السياحية في ${destination.title}.`}
      />

      <div className={styles.destinationTrips}>
        <Section className={styles.heroSection}>
          <Container>
            <div className={styles.breadcrumbs}>
              <Link href="/destination">الوجهات</Link>
              <span className={styles.separator}>/</span>
              <span>{destination.title}</span>
            </div>
            <h1 className={styles.pageTitle}>رحلات {destination.title}</h1>
            <p className={styles.pageDescription}>
              اكتشف مجموعتنا المميزة من الرحلات السياحية في {destination.title}.
              من رحلات شهر العسل إلى الرحلات العائلية والمغامرات.
            </p>
          </Container>
        </Section>

        <Section>
          <Container>
            <div className={styles.filters}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="ابحث عن رحلة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
            </div>

            {filteredTrips.length > 0 ? (
              <div className={styles.tripsGrid}>
                {filteredTrips.map((trip) => (
                  <Link
                    key={trip.id}
                    href={`/trip/${trip.slug}`}
                    className={styles.tripCard}
                  >
                    <div className={styles.tripImage}>
                      {trip.image ? (
                        <img
                          src={trip.image}
                          alt={parseHtml(trip.title)}
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles.placeholderImage}>
                          <span>No image available</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.tripContent}>
                      <h2 className={styles.tripTitle}>{parseHtml(trip.title)}</h2>
                      <div className={styles.tripDescription}>
                        {parseHtml(trip.description)}
                      </div>
                      <div className={styles.tripMeta}>
                        <span className={styles.tripDuration}>
                          {trip.duration}
                        </span>
                        <span className={styles.tripPrice}>
                          من {trip.price} ريال
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className={styles.noTrips}>
                <p>لم يتم العثور على رحلات تطابق معايير البحث</p>
              </div>
            )}
          </Container>
        </Section>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  try {
    // Fetch all destinations to generate paths
    const response = await fetch(
              'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?per_page=100',
      {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const destinations = await response.json();

    // Generate paths for each destination
    const paths = destinations.map((destination) => ({
      params: { slug: destination.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error in getStaticPaths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    // Fetch destination data
    const destinationResponse = await fetch(
      `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?slug=${params.slug}&_embed`,
      {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    if (!destinationResponse.ok) {
      throw new Error(`HTTP error! status: ${destinationResponse.status}`);
    }

    const destinations = await destinationResponse.json();
    const destination = destinations[0];

    if (!destination) {
      return {
        props: {
          destination: null,
          trips: [],
        },
        revalidate: 60,
      };
    }

    // Fetch trips for this destination using the correct endpoint
    const tripsResponse = await fetch(
      `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?destination=${destination.id}&per_page=100&_embed`,
      {
        headers: {
          Accept: 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

    if (!tripsResponse.ok) {
      throw new Error(`HTTP error! status: ${tripsResponse.status}`);
    }

    const tripsData = await tripsResponse.json();
    const trips = Array.isArray(tripsData) ? tripsData : [];

    // Format destination data
    let destinationImageUrl = null;
    if (destination._embedded && 
        destination._embedded['wp:featuredmedia'] && 
        destination._embedded['wp:featuredmedia'][0] && 
        destination._embedded['wp:featuredmedia'][0].source_url) {
      destinationImageUrl = destination._embedded['wp:featuredmedia'][0].source_url;
    }

    const formattedDestination = {
      id: destination.id || 0,
      title: destination.name || '',
      slug: destination.slug || '',
      description: (destination.description && destination.description.rendered) 
        ? destination.description.rendered 
        : '',
      image: destinationImageUrl,
    };

    // Format trips data
    const formattedTrips = trips.map((trip) => {
      // Format duration
      let durationText = 'غير محدد';
      if (trip.duration && typeof trip.duration === 'object') {
        // Safely destructure duration with defaults to prevent errors
        const duration = trip.duration || {};
        const days = duration.days || 0;
        const nights = duration.nights || 0;
        const duration_type = duration.duration_type || 'days';
        
        if (duration_type === 'days' && days > 0) {
          durationText = `${days} أيام`;
        } else if (duration_type === 'nights' && nights > 0) {
          durationText = `${nights} ليالٍ`;
        } else if (duration_type === 'both' && (days > 0 || nights > 0)) {
          durationText = `${days} أيام ${nights} ليالٍ`;
        }
      }

      // Safely extract image URL
      let imageUrl = null;
      if (trip._embedded && 
          trip._embedded['wp:featuredmedia'] && 
          trip._embedded['wp:featuredmedia'][0] && 
          trip._embedded['wp:featuredmedia'][0].source_url) {
        imageUrl = trip._embedded['wp:featuredmedia'][0].source_url;
      }

      return {
        id: trip.id || 0,
        title: (trip.title && trip.title.rendered) ? trip.title.rendered : '',
        description: (trip.excerpt && trip.excerpt.rendered) ? trip.excerpt.rendered : '',
        slug: trip.slug || '',
        image: imageUrl,
        duration: durationText,
        price: trip.wp_travel_engine_setting_trip_actual_price || trip.price || 'غير محدد',
        currency: (trip.currency && trip.currency.code) ? trip.currency.code : 'SAR',
      };
    });

    return {
      props: {
        destination: formattedDestination,
        trips: formattedTrips,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        destination: null,
        trips: [],
      },
      revalidate: 60,
    };
  }
} 