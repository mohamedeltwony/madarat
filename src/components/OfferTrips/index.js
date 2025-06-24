import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './OfferTrips.module.scss';
import SparkleEffect from './SparkleEffect';
import { decodeHtmlEntitiesSafe } from '@/lib/util';

// SVG Icons as components
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-12a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export default function OfferTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    const fetchOfferTrips = async () => {
      try {
        setLoading(true);
        // Fetch trips with 'offer' tag (ID 154)
        const response = await fetch('https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?trip_tag=154&per_page=4&orderby=date&order=desc');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched trips data:', data);
        setTrips(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching offer trips:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOfferTrips();
  }, []);

  // Format price with separator
  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Decode HTML entities in titles - use enhanced utility function
  const decodeHTML = (html) => {
    return decodeHtmlEntitiesSafe(html);
  };

  // Handle mouse enter and leave for sparkle effects
  const handleMouseEnter = (id) => {
    setActiveCard(id);
  };

  const handleMouseLeave = () => {
    setActiveCard(null);
  };

  if (loading) {
    return (
      <div className={styles.offerTripsContainer}>
        <div className={styles.offerTripsHeader}>
          <h2 className={styles.offerTripsTitle}>عروض سياحية مميزة</h2>
          <p className={styles.offerTripsSubtitle}>احصل على أفضل العروض للرحلات السياحية من مدارات الكون</p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>جاري تحميل العروض...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.offerTripsContainer}>
        <div className={styles.offerTripsHeader}>
          <h2 className={styles.offerTripsTitle}>عروض سياحية مميزة</h2>
          <p className={styles.offerTripsSubtitle}>احصل على أفضل العروض للرحلات السياحية من مدارات الكون</p>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>عذراً، حدث خطأ أثناء تحميل العروض: {error}</p>
        </div>
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className={styles.offerTripsContainer}>
        <div className={styles.offerTripsHeader}>
          <h2 className={styles.offerTripsTitle}>عروض سياحية مميزة</h2>
          <p className={styles.offerTripsSubtitle}>احصل على أفضل العروض للرحلات السياحية من مدارات الكون</p>
        </div>
        <div className={styles.noTripsContainer}>
          <p className={styles.noTripsMessage}>لا توجد عروض متاحة حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.offerTripsContainer}>
      <div className={styles.offerTripsHeader}>
        <h2 className={styles.offerTripsTitle}>عروض سياحية مميزة</h2>
        <p className={styles.offerTripsSubtitle}>احصل على أفضل العروض للرحلات السياحية من مدارات الكون</p>
      </div>

      <div className={styles.tripsGrid}>
        {trips.map((trip) => (
          <div key={trip.id} className={styles.gridItem}>
            <Link 
              href={`/trip/${trip.slug}`} 
              className={styles.tripCard}
              onMouseEnter={() => handleMouseEnter(trip.id)}
              onMouseLeave={handleMouseLeave}
            >
              {activeCard === trip.id && <SparkleEffect active={true} />}
              <div className={styles.tripImageContainer}>
                {trip.featured_image && (trip.featured_image.sizes?.['destination-thumb-trip-size']?.source_url || 
                  trip.featured_image.sizes?.['trip-thumb-size']?.source_url || 
                  trip.featured_image.full?.source_url) ? (
                  <Image
                    src={trip.featured_image.sizes?.['destination-thumb-trip-size']?.source_url || 
                         trip.featured_image.sizes?.['trip-thumb-size']?.source_url || 
                         trip.featured_image.full?.source_url}
                    alt={trip.title?.rendered ? decodeHTML(trip.title.rendered) : 'رحلة سياحية'}
                    width={400}
                    height={250}
                    className={styles.tripImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>لا توجد صورة</span>
                  </div>
                )}
                <div className={styles.tripBadge}>
                  <span>عرض خاص</span>
                </div>
                <div className={styles.tripDuration}>
                  <span className={styles.durationIcon}><CalendarIcon /></span>
                  <span>{trip.duration?.days || 0} {trip.duration?.days === 1 ? 'يوم' : 'أيام'}</span>
                </div>
              </div>
              <div className={styles.tripContent}>
                <h3 className={styles.tripTitle}>
                  {trip.title?.rendered ? decodeHTML(trip.title.rendered) : 'رحلة بدون عنوان'}
                </h3>
                
                {trip.destination && (
                  <div className={styles.tripDestination}>
                    <span className={styles.destinationIcon}><LocationIcon /></span>
                    <span>{trip.destination.name}</span>
                  </div>
                )}
                
                <div className={styles.tripPrice}>
                  <span className={styles.priceLabel}>ابتداءً من</span>
                  <span className={styles.priceValue}>
                    {formatPrice(trip.price || trip._s_price || '')} <span className={styles.currencyCode}>{trip.currency?.code || 'SAR'}</span>
                  </span>
                </div>
                
                <div className={styles.tripFooter}>
                  <span className={styles.viewDetails}>عرض التفاصيل <ArrowRightIcon /></span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.viewAllContainer}>
        <Link href="/trip" className={styles.viewAllButton}>
          <span>عرض كل الرحلات</span>
          <span className={styles.buttonIcon}><ArrowRightIcon /></span>
        </Link>
      </div>
    </div>
  );
}
