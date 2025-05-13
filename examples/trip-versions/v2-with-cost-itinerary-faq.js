import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import styles from '../../styles/pages/SingleTrip.module.scss';

export default function SingleTrip({ trip }) {
  if (!trip) {
    return (
      <Layout>
        <Section>
          <Container>
            <div className={styles.error}>
              <h2>عذراً، لم نجد الرحلة</h2>
              <p>الرحلة التي تبحث عنها غير موجودة</p>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{trip.title} | مدارات الكون</title>
        <Meta
          title={trip.title}
          description={trip.description}
        />
      </Head>

      <Section className={styles.heroSection}>
        <Container>
          <div className={styles.heroContent}>
            <h1 className={styles.tripTitle}>{trip.title}</h1>
            <div className={styles.tripMeta}>
              <span className={styles.duration}>
                {trip.duration?.days || 0} {trip.duration?.duration_unit || 'يوم'}
              </span>
              <span className={styles.price}>
                {trip.wp_travel_engine_setting_trip_actual_price || trip.price || 'السعر غير متوفر'} {trip.currency?.code || 'SAR'}
              </span>
            </div>
          </div>
        </Container>
      </Section>

      <Section className={styles.tripContent}>
        <Container>
          <div className={styles.tripImage}>
            {trip.featured_image?.sizes?.large?.source_url ? (
              <img
                src={trip.featured_image.sizes.large.source_url}
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

          <div className={styles.tripDetails}>
            <div className={styles.description}>
              <h2>وصف الرحلة</h2>
              <div dangerouslySetInnerHTML={{ __html: trip.description }} />
            </div>

            <div className={styles.tripInfo}>
              <div className={styles.infoCard}>
                <h3>معلومات الرحلة</h3>
                <ul>
                  <li>
                    <strong>المدة:</strong>
                    <span>{trip.duration?.days || 0} {trip.duration?.duration_unit || 'يوم'}</span>
                  </li>
                  <li>
                    <strong>السعر:</strong>
                    <span>{trip.wp_travel_engine_setting_trip_actual_price || trip.price || 'غير متوفر'} {trip.currency?.code || 'SAR'}</span>
                  </li>
                  {trip.destination && (
                    <li>
                      <strong>الوجهة:</strong>
                      <span>{trip.destination.title}</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className={styles.costInfo}>
                <div className={styles.costSection}>
                  <h3>يشمل السعر</h3>
                  <div dangerouslySetInnerHTML={{ __html: trip.cost_includes.replace(/\r\n/g, '<br>') }} />
                </div>
                <div className={styles.costSection}>
                  <h3>لا يشمل السعر</h3>
                  <div dangerouslySetInnerHTML={{ __html: trip.cost_excludes.replace(/\r\n/g, '<br>') }} />
                </div>
              </div>
            </div>
          </div>

          {trip.itineraries && trip.itineraries.length > 0 && (
            <div className={styles.itinerarySection}>
              <h2>برنامج الرحلة</h2>
              <div className={styles.itineraryList}>
                {trip.itineraries.map((day, index) => (
                  <div key={index} className={styles.itineraryDay}>
                    <h3>اليوم {index + 1}: {day.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: day.content }} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {trip.faqs && trip.faqs.length > 0 && (
            <div className={styles.faqSection}>
              <h2>الأسئلة الشائعة</h2>
              <div className={styles.faqList}>
                {trip.faqs.map((faq, index) => (
                  <div key={index} className={styles.faqItem}>
                    <h3>{faq.title}</h3>
                    <div dangerouslySetInnerHTML={{ __html: faq.content }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    const response = await fetch(
      `https://madaratalkon.com/wp-json/wp/v2/trip?slug=${params.slug}&_embed`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const trips = await response.json();
    const trip = trips[0];

    if (!trip) {
      return {
        props: {
          trip: null
        },
        revalidate: 60
      };
    }

    // Format trip data
    const formattedTrip = {
      id: trip.id,
      title: trip.title?.rendered || '',
      slug: trip.slug || '',
      description: trip.content?.rendered || '',
      featured_image: trip.featured_image || null,
      duration: trip.duration || null,
      destination: trip._embedded?.['wp:term']?.[0]?.taxonomy === 'destination' ? {
        id: trip._embedded['wp:term'][0].id || null,
        title: trip._embedded['wp:term'][0].name || '',
        slug: trip._embedded['wp:term'][0].slug || '',
      } : null,
      wp_travel_engine_setting_trip_actual_price: trip.wp_travel_engine_setting_trip_actual_price || null,
      price: trip.price || null,
      currency: trip.currency || null,
      _embedded: trip._embedded || null,
      cost_includes: trip.cost_includes || '',
      cost_excludes: trip.cost_excludes || '',
      itineraries: trip.itineraries || [],
      faqs: trip.faqs || []
    };

    return {
      props: {
        trip: formattedTrip
      },
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching trip:', error);
    return {
      props: {
        trip: null
      },
      revalidate: 60
    };
  }
}

export async function getStaticPaths() {
  // We'll generate paths on-demand
  return {
    paths: [],
    fallback: 'blocking'
  };
} 