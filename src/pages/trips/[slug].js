import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/pages/SingleTrip.module.scss';

export default function SingleTrip({ trip }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const metadata = {
    title: trip.title,
    description: trip.description,
  };

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      <div className={styles.tripContainer}>
        <div className={styles.tripHeader}>
          <h1 className={styles.tripTitle}>{trip.title}</h1>
          <div className={styles.tripMeta}>
            <span className={styles.price}>
              {trip.wp_travel_engine_setting_trip_actual_price ||
                trip.price ||
                'السعر غير متوفر'}{' '}
              {trip.currency?.code || 'SAR'}
            </span>
          </div>
        </div>

        <div className={styles.tripContent}>
          <div className={styles.mainContent}>
            {trip.featured_media ? (
              <div className={styles.featuredImage}>
                <Image
                  src={trip.featured_media}
                  alt={trip.title}
                  width={800}
                  height={500}
                  layout="responsive"
                />
              </div>
            ) : (
              <div className={styles.noImage}>لا توجد صورة</div>
            )}

            <div className={styles.tripDetails}>
              <div className={styles.detailsGrid}>
                <div className={styles.detailItem}>
                  <h3>المدة</h3>
                  <p>
                    {trip.duration?.days || 0} {trip.duration?.duration_unit || 'يوم'}
                  </p>
                </div>
                <div className={styles.detailItem}>
                  <h3>السعر</h3>
                  <p>
                    {trip.wp_travel_engine_setting_trip_actual_price ||
                      trip.price ||
                      'غير متوفر'}{' '}
                    {trip.currency?.code || 'SAR'}
                  </p>
                </div>
              </div>
            </div>

            {trip.description && (
              <div className={styles.description}>
                <h2>وصف الرحلة</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: trip.description.replace(/\r\n/g, '<br>'),
                  }}
                />
              </div>
            )}

            {trip.cost_includes && (
              <div className={styles.includes}>
                <h2>السعر يشمل</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: trip.cost_includes.replace(/\r\n/g, '<br>'),
                  }}
                />
              </div>
            )}

            {trip.cost_excludes && (
              <div className={styles.excludes}>
                <h2>السعر لا يشمل</h2>
                <div
                  dangerouslySetInnerHTML={{
                    __html: trip.cost_excludes.replace(/\r\n/g, '<br>'),
                  }}
                />
              </div>
            )}

            {trip.itinerary && trip.itinerary.length > 0 && (
              <div className={styles.itinerary}>
                <h2>البرنامج اليومي</h2>
                <div className={styles.itineraryDays}>
                  {trip.itinerary.map((day, index) => (
                    <div key={index} className={styles.itineraryDay}>
                      <h3>
                        اليوم {index + 1}: {day.title}
                      </h3>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: day.description.replace(/\r\n/g, '<br>'),
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
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
          trip: null,
        },
        revalidate: 60,
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
      destination:
        trip._embedded?.['wp:term']?.[0]?.taxonomy === 'destination'
          ? {
              id: trip._embedded['wp:term'][0].id || null,
              title: trip._embedded['wp:term'][0].name || '',
              slug: trip._embedded['wp:term'][0].slug || '',
            }
          : null,
      wp_travel_engine_setting_trip_actual_price:
        trip.wp_travel_engine_setting_trip_actual_price || null,
      price: trip.price || null,
      currency: trip.currency || null,
      _embedded: trip._embedded || null,
      cost_includes: trip.cost_includes || '',
      cost_excludes: trip.cost_excludes || '',
      itineraries: trip.itineraries || [],
      faqs: trip.faqs || [],
    };

    return {
      props: {
        trip: formattedTrip,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching trip:', error);
    return {
      props: {
        trip: null,
      },
      revalidate: 60,
    };
  }
}

export async function getStaticPaths() {
  // We'll generate paths on-demand
  return {
    paths: [],
    fallback: 'blocking',
  };
}
