import Link from 'next/link';
import styles from './BentoDestinations.module.scss';

const BentoDestinations = ({ destinations }) => {
  if (!destinations || !Array.isArray(destinations)) return null;

  // Ensure we have at least 6 destinations for the layout
  const displayDestinations = destinations.slice(0, 6);

  // Define fallback gradients for destinations without images
  const gradients = [
    'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    'linear-gradient(45deg, #45B7D1, #2C3E50)',
    'linear-gradient(45deg, #FF8C42, #29323C)',
    'linear-gradient(45deg, #6C5B7B, #355C7D)',
    'linear-gradient(45deg, #56AB2F, #A8E063)',
    'linear-gradient(45deg, #614385, #516395)'
  ];

  return (
    <div className={styles.bentoGrid}>
      {displayDestinations.map((destination, index) => {
        const tripCount = destination.tripCount || 0;
        const backgroundImage = destination.image 
          ? `url(${destination.image})`
          : gradients[index % gradients.length];
        
        return (
          <Link 
            key={destination.id} 
            href={`/categories/${destination.slug}`}
            className={`${styles.bentoItem} ${styles[`item${index + 1}`]}`}
            style={{ backgroundImage }}
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