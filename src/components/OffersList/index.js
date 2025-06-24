import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../OfferTrips/OfferTrips.module.scss';
import SparkleEffect from '../OfferTrips/SparkleEffect';
import { decodeHtmlEntitiesSafe } from '@/lib/util';

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

const ChevronRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="18"
    height="18"
  >
    <path
      fillRule="evenodd"
      d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default function OffersList({ trips, pagination, onPageChange }) {
  const [activeCard, setActiveCard] = useState(null);

  // Format price with separator
  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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

  const renderPagination = () => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;

    // Generate page numbers to show
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range if at boundaries
      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, 4);
      } else if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return (
      <div className={styles.pagination}>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${styles.paginationArrow} ${currentPage === 1 ? styles.disabled : ''}`}
          aria-label="الصفحة السابقة"
        >
          <ChevronRightIcon />
        </button>

        <div className={styles.paginationPages}>
          {pages.map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className={styles.paginationEllipsis}
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${page}`}
                onClick={() => onPageChange(page)}
                className={`${styles.paginationPage} ${currentPage === page ? styles.active : ''}`}
                aria-current={currentPage === page ? 'page' : undefined}
                aria-label={`صفحة ${page}`}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${styles.paginationArrow} ${styles.next} ${currentPage === totalPages ? styles.disabled : ''}`}
          aria-label="الصفحة التالية"
        >
          <ChevronRightIcon />
        </button>
      </div>
    );
  };

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
        <h2 className={styles.offerTripsTitle}>العروض المتاحة</h2>
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
                {trip.featuredImage?.sourceUrl ? (
                  <Image
                    src={trip.featuredImage.sourceUrl}
                    alt={trip.title || 'رحلة سياحية'}
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
                  <span className={styles.durationIcon}>
                    <CalendarIcon />
                  </span>
                  <span>
                    {trip.tripSettings?.duration?.days || 0}{' '}
                    {trip.tripSettings?.duration?.days === 1 ? 'يوم' : 'أيام'}
                  </span>
                </div>
              </div>
              <div className={styles.tripContent}>
                <h3 className={styles.tripTitle}>
                  {trip.title ? decodeHTML(trip.title) : 'رحلة بدون عنوان'}
                </h3>

                <div className={styles.tripPrice}>
                  <span className={styles.priceLabel}>ابتداءً من</span>
                  <span className={styles.priceValue}>
                    {formatPrice(trip.tripSettings?.price?.amount || '')}{' '}
                    <span className={styles.currencyCode}>
                      {trip.tripSettings?.price?.currency || 'SAR'}
                    </span>
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
        ))}
      </div>

      {renderPagination()}
    </div>
  );
}
