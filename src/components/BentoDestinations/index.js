import React from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import styles from './BentoDestinations.module.scss';

const BentoDestinations = ({ destinations = [], error = null }) => {
  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <div className={styles.noDestinations}>
        <p>لا توجد وجهات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className={styles.bentoGrid}>
      <div className={styles.gridContainer}>
        {destinations.map((destination) => {
          if (!destination || !destination.id) {
            console.error('Invalid destination data:', destination);
            return null;
          }

          return (
            <Link 
              key={destination.id} 
              href={`/destinations/${destination.slug}/trips`}
              className={styles.destinationCard}
            >
              <div className={styles.tripCount}>
                <span className={styles.countNumber}>{destination.tripCount || 0}</span>
                <span className={styles.countLabel}>رحلات</span>
              </div>
              <div className={styles.imageWrapper}>
                {destination.image ? (
                  <Image
                    src={destination.image}
                    alt={destination.title}
                    layout="fill"
                    objectFit="cover"
                    className={styles.image}
                    priority={true}
                    onError={(e) => {
                      console.error('Image loading error:', e);
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <span>لا توجد صورة</span>
                  </div>
                )}
              </div>
              <div className={styles.content}>
                <h3 className={styles.title}>{destination.title || 'وجهة غير معروفة'}</h3>
                {destination.description && (
                  <p className={styles.description}>{destination.description}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BentoDestinations; 