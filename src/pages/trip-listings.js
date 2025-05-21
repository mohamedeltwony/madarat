import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { getTripsREST } from '@/lib/rest-api';
import { getSiteMetadataREST, getAllMenusREST } from '@/lib/rest-api';
import styles from '@/styles/pages/TripListings.module.scss';

export default function TripListingsPage({ 
  staticTrips, 
  dynamicTrips, 
  metadata, 
  menus 
}) {
  return (
    <Layout metadata={metadata} menus={menus}>
      <Head>
        <title>قائمة الرحلات السياحية | مدارات الكون</title>
        <meta 
          name="description" 
          content="قائمة بجميع الرحلات السياحية والوجهات المتاحة من مدارات الكون للسياحة والسفر"
        />
      </Head>

      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>قائمة الرحلات السياحية</h1>
            <p className={styles.heroDescription}>
              جميع الرحلات والوجهات السياحية المتاحة من مدارات الكون
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4">
        <div className={styles.listingsContainer}>
          {/* Static Trip Pages */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>الرحلات الثابتة</h2>
            <div className={styles.tripGrid}>
              {staticTrips.map((trip) => (
                <div key={trip.path} className={styles.tripCard}>
                  <Link 
                    href={trip.path} 
                    className={styles.tripLink}
                  >
                    <div className={styles.tripContent}>
                      <h3 className={styles.tripTitle}>{trip.title}</h3>
                      {trip.subtitle && (
                        <p className={styles.tripSubtitle}>{trip.subtitle}</p>
                      )}
                      <span className={styles.tripPath}>{trip.path}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Trip Pages */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>الرحلات الديناميكية</h2>
            <div className={styles.tripGrid}>
              {dynamicTrips.map((trip) => (
                <div key={trip.id} className={styles.tripCard}>
                  <Link 
                    href={`/trips/${trip.slug}`} 
                    className={styles.tripLink}
                  >
                    <div className={styles.tripContent}>
                      <h3 className={styles.tripTitle}>{trip.title}</h3>
                      <div className={styles.tripDetails}>
                        {trip.tripSettings?.price?.amount > 0 && (
                          <span className={styles.tripPrice}>
                            {trip.tripSettings.price.amount} {trip.tripSettings.price.currency}
                          </span>
                        )}
                        {trip.tripSettings?.duration?.days > 0 && (
                          <span className={styles.tripDuration}>
                            {trip.tripSettings.duration.days} أيام / {trip.tripSettings.duration.nights} ليال
                          </span>
                        )}
                      </div>
                      <span className={styles.tripPath}>/trips/{trip.slug}</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    // Define static trip pages manually from the file system
    const staticTrips = [
      { 
        title: 'رحلة تركيا',
        subtitle: 'طربزون وايدر',
        path: '/turkey-trip' 
      },
      { 
        title: 'رحلة طربزون ووايدر شمال تركيا',
        path: '/trabzon-wider-north-turkey' 
      },
      { 
        title: 'رحلة لندن واسكتلندا',
        path: '/london-scotland-trip' 
      },
      {
        title: 'رحلة كروز إيطاليا وإسبانيا وفرنسا',
        path: '/cruise-italy-spain-france'
      },
      { 
        title: 'رحلة تأشيرة شنغن',
        path: '/schengen-visa-trip' 
      },
      { 
        title: 'رحلة الرخصة الدولية',
        path: '/international-licence-trip' 
      },
      { 
        title: 'رحلة جورجيا',
        path: '/georgia-trip' 
      },
      { 
        title: 'رحلة أذربيجان',
        path: '/azerbaijan-trip' 
      },
      { 
        title: 'رحلة البوسنة',
        path: '/bosnia-trip' 
      },
      { 
        title: 'رحلة بولندا',
        path: '/poland-trip' 
      },
      { 
        title: 'رحلة إيطاليا',
        path: '/italy-trip' 
      },
      { 
        title: 'رحلة روسيا',
        path: '/russia-trip' 
      }
    ];

    // Fetch dynamic trips from WordPress API
    const { trips: dynamicTrips } = await getTripsREST({ perPage: 100 });

    // Fetch layout data
    const metadata = await getSiteMetadataREST();
    const { menus = [] } = await getAllMenusREST();

    return {
      props: {
        staticTrips,
        dynamicTrips,
        metadata: metadata || {}, // Ensure metadata is never undefined
        menus: menus || [],
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        staticTrips: [],
        dynamicTrips: [],
        metadata: {
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع السفر والرحلات الأول في الوطن العربي',
        },
        menus: [],
      },
    };
  }
} 