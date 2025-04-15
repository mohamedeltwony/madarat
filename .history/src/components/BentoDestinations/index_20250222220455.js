import Link from 'next/link';
import styles from './BentoDestinations.module.scss';

const BentoDestinations = ({ destinations }) => {
  if (!destinations || !Array.isArray(destinations)) return null;

  // Ensure we have at least 6 destinations for the layout
  const displayDestinations = destinations.slice(0, 6);

  return (
    <div className={styles.bentoGrid}>
      {displayDestinations.map((destination, index) => {
        const featuredImage = destination.featuredImage?.sourceUrl;

        return (
          <Link
            key={destination.slug}
            href={`/destinations/${destination.slug}`}
            className={`${styles.bentoItem} ${styles[`item${index + 1}`]}`}
            style={{
              backgroundImage: featuredImage
                ? `url(${featuredImage})`
                : 'linear-gradient(45deg, #1a1a1a, #4a4a4a)',
            }}
          >
            <div className={styles.glassContent}>
              {destination.parent && (
                <span className={styles.glassTag}>
                  {destination.parent.name}
                </span>
              )}
              <h3>{destination.name}</h3>
              {index === 0 && destination.description && (
                <p className={styles.excerpt}>
                  {destination.description
                    .replace(/(<([^>]+)>)/gi, '')
                    .slice(0, 120)}
                  ...
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
