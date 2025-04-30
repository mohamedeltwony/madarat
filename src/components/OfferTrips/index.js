import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './OfferTrips.module.scss';

// Import Splide library for the slider
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';

export default function OfferTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOfferTrips = async () => {
      try {
        setLoading(true);
        // Fetch trips with 'offer' tag (ID 154)
        const response = await fetch('https://madaratalkon.com/wp-json/wp/v2/trip?trip_tag=154&per_page=10&orderby=date&order=desc');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched trips data:', data); // Log data for debugging
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

  // Splide options
  const splideOptions = {
    type: 'slide',
    perPage: 4,
    perMove: 1,
    gap: '1.5rem',
    pagination: false,
    arrows: true,
    autoplay: true,
    interval: 4000,
    pauseOnHover: true,
    breakpoints: {
      1024: {
        perPage: 3,
      },
      768: {
        perPage: 2,
      },
      640: {
        perPage: 1,
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>عذراً، حدث خطأ أثناء تحميل العروض: {error}</p>
      </div>
    );
  }

  if (!trips || trips.length === 0) {
    return (
      <div className={styles.noTripsContainer}>
        <p className={styles.noTripsMessage}>لا توجد عروض متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className={styles.offerTripsContainer}>
      <div className={styles.offerTripsHeader}>
        <h2 className={styles.offerTripsTitle}>عروض وحملات مميزة</h2>
        <p className={styles.offerTripsSubtitle}>احصل على أفضل العروض للرحلات السياحية</p>
      </div>

      <Splide options={splideOptions} className={styles.splideContainer}>
        {trips.map((trip) => (
          <SplideSlide key={trip.id} className={styles.slideItem}>
            <Link href={`/trips/${trip.slug}`} className={styles.tripCard}>
              <div className={styles.tripImageContainer}>
                {trip.featured_image && (trip.featured_image.sizes?.['destination-thumb-trip-size']?.source_url || 
                  trip.featured_image.sizes?.['trip-thumb-size']?.source_url || 
                  trip.featured_image.full?.source_url) ? (
                  <Image
                    src={trip.featured_image.sizes?.['destination-thumb-trip-size']?.source_url || 
                         trip.featured_image.sizes?.['trip-thumb-size']?.source_url || 
                         trip.featured_image.full?.source_url}
                    alt={trip.title?.rendered || 'Trip Image'}
                    width={400}
                    height={250}
                    className={styles.tripImage}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>لا توجد صورة</span>
                  </div>
                )}
                <div className={styles.tripDuration}>
                  <span>{trip.duration?.days || 0} {trip.duration?.days === 1 ? 'يوم' : 'أيام'}</span>
                </div>
              </div>
              <div className={styles.tripContent}>
                <h3 className={styles.tripTitle}>{trip.title?.rendered || 'رحلة بدون عنوان'}</h3>
                <div className={styles.tripPrice}>
                  <span className={styles.priceLabel}>ابتداءً من</span>
                  <span className={styles.priceValue}>
                    {trip.price || trip._s_price || ''} {trip.currency?.code || 'SAR'}
                  </span>
                </div>
              </div>
            </Link>
          </SplideSlide>
        ))}
      </Splide>

      <div className={styles.viewAllContainer}>
        <Link href="/trips" className={styles.viewAllButton}>
          عرض كل الرحلات
        </Link>
      </div>
    </div>
  );
} 