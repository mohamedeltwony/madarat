import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import Meta from '@/components/Meta';
import styles from '@/styles/pages/Trips.module.scss';

export default function TripsArchive({ trips = [], destinations = [] }) {
  const [filteredTrips, setFilteredTrips] = useState(trips);
  const [selectedDestination, setSelectedDestination] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let filtered = [...trips];
    
    // Filter by destination
    if (selectedDestination !== 'all') {
      filtered = filtered.filter(trip => trip.destination?.slug === selectedDestination);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(trip => 
        trip.title.toLowerCase().includes(query) ||
        trip.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredTrips(filtered);
  }, [trips, selectedDestination, searchQuery]);

  return (
    <Layout>
      <Head>
        <title>رحلات مدارات | جميع الرحلات</title>
        <meta name="description" content="اكتشف جميع الرحلات السياحية المتاحة في مدارات. رحلات متنوعة لجميع الوجهات حول العالم." />
      </Head>

      <Meta
        title="رحلات مدارات | جميع الرحلات"
        description="اكتشف جميع الرحلات السياحية المتاحة في مدارات. رحلات متنوعة لجميع الوجهات حول العالم."
      />

      <Section className={styles.heroSection}>
        <Container>
          <h1 className={styles.pageTitle}>رحلات مدارات</h1>
          <p className={styles.pageDescription}>
            اكتشف مجموعتنا المميزة من الرحلات السياحية حول العالم. من رحلات شهر العسل إلى الرحلات العائلية والمغامرات.
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
            
            <div className={styles.destinationFilter}>
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">جميع الوجهات</option>
                {destinations.map(dest => (
                  <option key={dest.slug} value={dest.slug}>
                    {dest.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredTrips.length > 0 ? (
            <div className={styles.tripsGrid}>
              {filteredTrips.map(trip => (
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
                        <span>No image available</span>
                      </div>
                    )}
                  </div>
                  <div className={styles.tripContent}>
                    <h2 className={styles.tripTitle}>{trip.title}</h2>
                    {trip.destination && (
                      <div className={styles.tripDestination}>
                        {trip.destination.title}
                      </div>
                    )}
                    <p className={styles.tripDescription}>
                      {trip.description}
                    </p>
                    <div className={styles.tripMeta}>
                      <span className={styles.tripDuration}>
                        {trip.duration} أيام
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
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Fetch trips data
    const tripsResponse = await fetch('https://madaratalkon.com/wp-json/wp/v2/trip?per_page=100', {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      next: { revalidate: 60 },
    });

    if (!tripsResponse.ok) {
      throw new Error(`HTTP error! status: ${tripsResponse.status}`);
    }

    const trips = await tripsResponse.json();

    // Fetch destinations data
    const destinationsResponse = await fetch('https://madaratalkon.com/wp-json/wp/v2/destination?per_page=100', {
      headers: {
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      next: { revalidate: 60 },
    });

    if (!destinationsResponse.ok) {
      throw new Error(`HTTP error! status: ${destinationsResponse.status}`);
    }

    const destinations = await destinationsResponse.json();

    // Format trips data
    const formattedTrips = trips.map(trip => ({
      id: trip.id,
      title: trip.title.rendered,
      description: trip.excerpt.rendered,
      slug: trip.slug,
      image: trip.featured_media_url,
      duration: trip.duration || 'غير محدد',
      price: trip.price || 'غير محدد',
      destination: destinations.find(dest => dest.id === trip.destination_id) || null,
    }));

    // Format destinations data
    const formattedDestinations = destinations.map(dest => ({
      id: dest.id,
      title: dest.name,
      slug: dest.slug,
    }));

    return {
      props: {
        trips: formattedTrips,
        destinations: formattedDestinations,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        trips: [],
        destinations: [],
        error: error.message,
      },
      revalidate: 60,
    };
  }
} 