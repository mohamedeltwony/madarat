import Link from 'next/link';
import styles from './BentoDestinations.module.scss';

const BentoDestinations = ({ destinations }) => {
  if (!destinations || !Array.isArray(destinations)) return null;

  // Ensure we have at least 6 destinations for the layout
  const displayDestinations = destinations.slice(0, 6);

  return (
    <div className={styles.bentoGrid}>
      {displayDestinations.map((destination, index) => {
        const tripCount = destination.tripCount || 0;
        
        return (
          <Link 
            key={destination.id} 
            href={`/destination/${destination.slug}`}
            className={`${styles.bentoItem} ${styles[`item${index + 1}`]}`}
            style={{ 
              backgroundImage: `url(${destination.image})`
            }}
          >
            <div className={styles.glassContent}>
              {tripCount > 0 && (
                <span className={styles.glassTag}>
                  {tripCount} {tripCount === 1 ? 'رحلة' : 'رحلات'}
                </span>
              )}
              <h3>{destination.name}</h3>
              {index === 0 && destination.description && (
                <p className={styles.excerpt}>
                  {destination.description.replace(/(<([^>]+)>)/gi, '').slice(0, 120)}...
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BentoDestinations; 