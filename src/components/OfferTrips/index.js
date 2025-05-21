import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './OfferTrips.module.scss';
import SparkleEffect from './SparkleEffect';
import { fetchOfferTrips } from '@/lib/wordpress-api';

// SVG Icons as components
const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="18"
    height="18"
  >
    <path
      fillRule="evenodd"
      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
      clipRule="evenodd"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="18"
    height="18"
  >
    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    <path
      fillRule="evenodd"
      d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-12a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
      clipRule="evenodd"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20"
    height="20"
  >
    <path
      fillRule="evenodd"
      d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// Fallback mock data for when API fails
const fallbackOffers = [
  {
    id: 1,
    title: { rendered: 'رحلة تركيا المميزة' },
    slug: 'turkey-trip',
    featured_image: {
      full: { source_url: '/images/destinations/turkey.jpg' }
    },
    price: 2999,
    currency: { code: 'SAR' },
    duration: { days: 7, nights: 6 },
    destination: { name: 'تركيا' }
  },
  {
    id: 2,
    title: { rendered: 'جورجيا السياحية' },
    slug: 'georgia-trip',
    featured_image: {
      full: { source_url: '/images/destinations/georgia.jpg' }
    },
    price: 3499,
    currency: { code: 'SAR' },
    duration: { days: 8, nights: 7 },
    destination: { name: 'جورجيا' }
  },
  {
    id: 3,
    title: { rendered: 'أذربيجان الرائعة' },
    slug: 'azerbaijan-trip',
    featured_image: {
      full: { source_url: '/images/destinations/azerbaijan.jpg' }
    },
    price: 2799,
    currency: { code: 'SAR' },
    duration: { days: 6, nights: 5 },
    destination: { name: 'أذربيجان' }
  },
  {
    id: 4,
    title: { rendered: 'البوسنة الساحرة' },
    slug: 'bosnia-trip',
    featured_image: {
      full: { source_url: '/images/destinations/bosnia.jpg' }
    },
    price: 3899,
    currency: { code: 'SAR' },
    duration: { days: 9, nights: 8 },
    destination: { name: 'البوسنة' }
  }
];

export default function OfferTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Move fetchTrips outside of useEffect
  const fetchTrips = async () => {
    try {
      setLoading(true);
      
      // Use our WordPress API function
      const { trips: offerTrips } = await fetchOfferTrips({ perPage: 4 });
      
      if (offerTrips && offerTrips.length > 0) {
        console.log('Fetched trips data:', offerTrips);
        setTrips(offerTrips);
      } else {
        throw new Error('No trips found');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching offer trips:', err);
      
      // Use fallback data when API fails
      console.log('Using fallback offer data');
      setTrips(fallbackOffers);
      setUsingFallback(true);
      
      // Still set the error for notification
      setError(err.toString()); // Convert to string to handle all error types
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  // Format price with separator
  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Decode HTML entities in titles
  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Handle mouse enter and leave for sparkle effects
  const handleMouseEnter = (id) => {
    setActiveCard(id);
  };

  const handleMouseLeave = () => {
    setActiveCard(null);
  };

  // Handle retry action
  const handleRetry = () => {
    setLoading(true);
    setError(null);
    setUsingFallback(false);
    
    setTimeout(() => {
      // Refetch from the API
      fetchTrips();
    }, 500);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>جاري تحميل العروض...</p>
      </div>
    );
  }

  if (error && !usingFallback) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>
          عذراً، حدث خطأ أثناء تحميل العروض: {error}
        </p>
        <button className={styles.retryButton} onClick={handleRetry}>
          إعادة المحاولة
        </button>
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>عروض سياحية مميزة</h2>
        <p className={styles.subtitle}>
          تمتع برحلات مصممة بعناية لتلبية احتياجاتك وتفضيلاتك بأسعار تنافسية
        </p>
        {usingFallback && (
          <div className={styles.warningBanner}>
            <p>
              نحن نعرض بيانات محلية مؤقتة. 
              <button className={styles.retryButton} onClick={handleRetry}>
                إعادة المحاولة
              </button>
            </p>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {trips.map((trip) => (
          <div
            key={trip.id}
            className={styles.tripCard}
            onMouseEnter={() => handleMouseEnter(trip.id)}
            onMouseLeave={handleMouseLeave}
          >
            <div className={styles.imageContainer}>
              <Image
                src={trip.featuredImage || '/images/placeholder.jpg'}
                alt={typeof trip.title === 'string' ? trip.title : trip.title?.rendered || ''}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image}
              />
              <div className={styles.priceTag}>
                <span className={styles.price}>
                  {trip.price ? formatPrice(trip.price) : 'اتصل بنا'}
                </span>
                <span className={styles.currency}>
                  {trip.price ? (trip.currency?.code || 'ريال') : ''}
                </span>
              </div>
            </div>

            <div className={styles.content}>
              <h3 className={styles.tripTitle}>
                {typeof trip.title === 'string' 
                  ? decodeHTML(trip.title) 
                  : decodeHTML(trip.title?.rendered || 'رحلة سياحية')}
              </h3>

              <div className={styles.details}>
                <div className={styles.detail}>
                  <LocationIcon />
                  <span>
                    {trip.location || trip.destination?.name || 'وجهة سياحية'}
                  </span>
                </div>
                <div className={styles.detail}>
                  <CalendarIcon />
                  <span>
                    {trip.duration
                      ? `${trip.duration.days || trip.duration} أيام / ${
                          trip.duration.nights || trip.duration - 1
                        } ليالي`
                      : '7 أيام / 6 ليالي'}
                  </span>
                </div>
              </div>

              <Link
                href={trip.permalink || `/trips/${trip.slug || trip.id}`}
                className={styles.viewDetails}
              >
                <span>عرض التفاصيل</span>
                <ArrowRightIcon />
                {activeCard === trip.id && (
                  <SparkleEffect isActive={activeCard === trip.id} />
                )}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.viewAllContainer}>
        <Link href="/trips" className={styles.viewAllLink}>
          <span>عرض جميع الرحلات</span>
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
}
