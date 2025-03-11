import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import styles from './BentoDestinations.module.scss';

const BentoDestinations = ({ destinations }) => {
  if (!destinations || !Array.isArray(destinations)) return null;

  // Define different box sizes for visual hierarchy
  const boxSizes = {
    large: 'large',
    medium: 'medium',
    small: 'small'
  };

  // Assign box sizes based on trip count
  const getBoxSize = (tripCount) => {
    if (tripCount >= 10) return boxSizes.large;
    if (tripCount >= 5) return boxSizes.medium;
    return boxSizes.small;
  };

  return (
    <div className={styles.bentoGrid}>
      {destinations.map((destination, index) => {
        const tripCount = destination.tripCount || 0;
        const boxSize = getBoxSize(tripCount);
        
        return (
          <Link 
            key={destination.id} 
            href={`/destination/${destination.slug}`}
            className={`${styles.bentoItem} ${styles[boxSize]} ${styles[`item${index + 1}`]}`}
          >
            <div className={styles.imageWrapper}>
              {destination.image && (
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.image}
                  priority={index < 6}
                />
              )}
              <div className={styles.overlay} />
            </div>
            
            <div className={styles.content}>
              <div className={styles.header}>
                <FaMapMarkerAlt className={styles.icon} />
                <h3 className={styles.title}>{destination.name}</h3>
              </div>
              
              {tripCount > 0 && (
                <div className={styles.tripCount}>
                  <span className={styles.count}>{tripCount}</span>
                  <span className={styles.label}>
                    {tripCount === 1 ? 'رحلة' : 'رحلات'}
                  </span>
                </div>
              )}
              
              {destination.description && (
                <p className={styles.description}>
                  {destination.description.slice(0, 120)}...
                </p>
              )}
              
              <div className={styles.footer}>
                <span className={styles.explore}>استكشف الوجهة</span>
                <FaArrowLeft className={styles.arrow} />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BentoDestinations; 