import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/pages/Trips.module.scss';

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

export default function TripCard({ trip }) {
  const { title, slug, excerpt, featuredImage, tripSettings } = trip;

  // Update the image URL extraction to match the new data structure
  const imageUrl = featuredImage?.sourceUrl || '/images/placeholder.jpg';

  // Get trip duration and price from the trip settings
  const duration = tripSettings?.duration?.days || 0;
  const price = tripSettings?.price?.amount;
  const currency = tripSettings?.price?.currency || 'SAR';

  // Helper function to strip HTML from excerpt
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Format price with separator
  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  return (
    <div className={styles.gridItem}>
      <Link href={`/trips/${slug}`} className={styles.tripCard}>
        <div className={styles.tripImageContainer}>
          <Image
            src={imageUrl}
            alt={title || 'رحلة سياحية'}
            width={400}
            height={250}
            className={styles.tripImage}
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
            }}
          />
          <div className={styles.tripDuration}>
            <span className={styles.durationIcon}>
              <CalendarIcon />
            </span>
            <span>
              {duration} {duration === 1 ? 'يوم' : 'أيام'}
            </span>
          </div>
        </div>
        <div className={styles.tripContent}>
          <h3 className={styles.tripTitle}>{title}</h3>

          <div className={styles.tripDestination}>
            <span className={styles.destinationIcon}>
              <LocationIcon />
            </span>
            <span>{trip.destination?.name || ''}</span>
          </div>

          <div className={styles.tripPrice}>
            <span className={styles.priceLabel}>ابتداءً من</span>
            <span className={styles.priceValue}>
              {formatPrice(price || '')}{' '}
              <span className={styles.currencyCode}>{currency}</span>
            </span>
          </div>

          <div className={styles.tripFooter}>
            <span className={styles.viewDetails}>
              عرض التفاصيل <ArrowRightIcon />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
