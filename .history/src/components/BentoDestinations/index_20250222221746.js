import Link from 'next/link';
import styles from './BentoDestinations.module.scss';

const BentoDestinations = ({ categories }) => {
  if (!categories || !Array.isArray(categories)) return null;

  // Get root categories (destinations without parents)
  const rootCategories = categories.filter((category) => !category.parent);

  // Ensure we have at least 6 categories for the layout
  const displayCategories = rootCategories.slice(0, 6);

  // Define gradient backgrounds for variety
  const gradients = [
    'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
    'linear-gradient(45deg, #45B7D1, #2C3E50)',
    'linear-gradient(45deg, #FF8C42, #29323C)',
    'linear-gradient(45deg, #6C5B7B, #355C7D)',
    'linear-gradient(45deg, #56AB2F, #A8E063)',
    'linear-gradient(45deg, #614385, #516395)',
  ];

  return (
    <div className={styles.bentoGrid}>
      {displayCategories.map((category, index) => {
        const childCount = category.children?.edges?.length || 0;

        return (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className={`${styles.bentoItem} ${styles[`item${index + 1}`]}`}
            style={{
              backgroundImage: gradients[index % gradients.length],
            }}
          >
            <div className={styles.glassContent}>
              {childCount > 0 && (
                <span className={styles.glassTag}>
                  {childCount} {childCount === 1 ? 'رحلة' : 'رحلات'}
                </span>
              )}
              <h3>{category.name}</h3>
              {index === 0 && category.description && (
                <p className={styles.excerpt}>
                  {category.description
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
