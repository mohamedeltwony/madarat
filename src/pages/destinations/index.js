import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import styles from '../../styles/pages/Destinations.module.scss';

export default function Destinations({ destinations }) {
  const [filteredDestinations, setFilteredDestinations] = useState(destinations);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filtered = destinations.filter(destination => {
      const searchLower = searchQuery.toLowerCase();
      return (
        destination.title.toLowerCase().includes(searchLower) ||
        destination.description.toLowerCase().includes(searchLower)
      );
    });
    setFilteredDestinations(filtered);
  }, [searchQuery, destinations]);

  return (
    <Layout>
      <Head>
        <title>الوجهات السياحية | مدارات الكن</title>
        <Meta
          title="الوجهات السياحية | مدارات الكن"
          description="اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل الأماكن حول العالم"
        />
      </Head>

      <Section className={styles.heroSection}>
        <Container>
          <h1 className={styles.pageTitle}>الوجهات السياحية</h1>
          <p className={styles.pageDescription}>
            اكتشف وجهاتنا السياحية المميزة واستمتع برحلات لا تُنسى في أجمل الأماكن حول العالم
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

          {filteredDestinations.length > 0 ? (
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
                    <h2 className={styles.destinationTitle}>{destination.title}</h2>
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
            <div className={styles.noDestinations}>
              لم نجد وجهات تطابق بحثك
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    const destinationsRes = await fetch(
      'https://madaratalkon.com/wp-json/wp/v2/destination?per_page=100'
    );
    const destinations = await destinationsRes.json();

    // Format destinations data
    const formattedDestinations = destinations.map((dest) => ({
      id: dest.id,
      title: dest.title.rendered,
      slug: dest.slug,
      description: dest.excerpt.rendered.replace(/<[^>]*>/g, ''),
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
      },
      revalidate: 3600,
    };
  }
} 