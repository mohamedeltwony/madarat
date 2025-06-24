import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../OfferTrips/OfferTrips.module.scss';
import SparkleEffect from '../OfferTrips/SparkleEffect';

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

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    width="20"
    height="20"
    className="rotate-180"
  >
    <path
      fillRule="evenodd"
      d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

export default function AllTrips({ trips, pagination, onPageChange }) {
  const [activeCard, setActiveCard] = useState(null);

  // Format price with separator
  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Decode HTML entities in titles - consistent server/client implementation
  const decodeHTML = (html) => {
    if (!html) return '';
    // Use consistent regex replacement for both server and client
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/')
      .replace(/&#x3A;/g, ':')
      .replace(/&#x2D;/g, '-');
  };

  // Handle mouse enter and leave for sparkle effects
  const handleMouseEnter = (id) => {
    setActiveCard(id);
  };

  const handleMouseLeave = () => {
    setActiveCard(null);
  };

  if (!trips || trips.length === 0) {
    return (
      <div className={styles.noTripsContainer}>
        <p className={styles.noTripsMessage}>لا توجد رحلات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className={styles.offerTripsContainer}>
      <div className={styles.offerTripsHeader}>
        <h2 className={styles.offerTripsTitle}>الرحلات المتاحة</h2>
      </div>

      <div className={styles.tripsGrid}>
        {trips.map((trip) => (
          <div key={trip.id} className={styles.gridItem}>
            <Link
              href={`/trips/${trip.slug}`}
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
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.tripImage}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>لا توجد صورة</span>
                  </div>
                )}
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
                  {trip.title || 'رحلة بدون عنوان'}
                </h3>

                <div className={styles.tripDestination}>
                  <span className={styles.destinationIcon}>
                    <LocationIcon />
                  </span>
                  <span>{trip.destination?.name || ''}</span>
                </div>

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

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div
          className={styles.viewAllContainer}
          style={{ marginBottom: '40px' }}
        >
          <div className={styles.pagination}>
            {/* Previous Page */}
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`${styles.paginationButton} ${pagination.currentPage === 1 ? styles.disabled : ''}`}
              style={{ marginRight: '10px' }}
            >
              <ArrowLeftIcon /> السابق
            </button>

            {/* Page Numbers */}
            <div
              className={styles.pageNumbers}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {Array.from({ length: pagination.totalPages })
                .map((_, index) => index + 1)
                .filter((pageNum) => {
                  // Show first page, last page, current page and pages around current page
                  return (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    (pageNum >= pagination.currentPage - 1 &&
                      pageNum <= pagination.currentPage + 1)
                  );
                })
                .map((pageNum, index, array) => (
                  <span key={pageNum}>
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span style={{ margin: '0 5px' }}>...</span>
                    )}
                    <button
                      onClick={() => onPageChange(pageNum)}
                      className={`${styles.pageNumber} ${pagination.currentPage === pageNum ? styles.active : ''}`}
                      style={{
                        width: '40px',
                        height: '40px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor:
                          pagination.currentPage === pageNum
                            ? '#0c4c44'
                            : '#e5e7eb',
                        color:
                          pagination.currentPage === pageNum
                            ? 'white'
                            : '#374151',
                        border: 'none',
                        cursor: 'pointer',
                        margin: '0 3px',
                      }}
                    >
                      {pageNum}
                    </button>
                  </span>
                ))}
            </div>

            {/* Next Page */}
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`${styles.paginationButton} ${pagination.currentPage === pagination.totalPages ? styles.disabled : ''}`}
              style={{ marginLeft: '10px' }}
            >
              التالي <ArrowRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
