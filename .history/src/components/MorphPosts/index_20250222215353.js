import Link from 'next/link';
import { postPathBySlug } from 'lib/posts';
import styles from './MorphPosts.module.scss';

const MorphPosts = ({ posts }) => {
  if (!posts || !Array.isArray(posts)) return null;

  const displayPosts = posts.slice(0, 3); // We'll show 3 posts with different morphism styles

  return (
    <div className={styles.morphGrid}>
      {/* Glassmorphism Post */}
      <Link 
        href={postPathBySlug(displayPosts[0]?.slug)}
        className={`${styles.morphItem} ${styles.glassItem}`}
        style={{
          backgroundImage: `url(${displayPosts[0]?.featuredImage?.sourceUrl})`
        }}
      >
        <div className={styles.glassContent}>
          <span className={styles.glassTag}>
            {displayPosts[0]?.categories?.[0]?.name || 'Travel'}
          </span>
          <h3>{displayPosts[0]?.title}</h3>
        </div>
      </Link>

      {/* Skeuomorphism Post */}
      <Link 
        href={postPathBySlug(displayPosts[1]?.slug)}
        className={`${styles.morphItem} ${styles.skeuItem}`}
      >
        <div className={styles.notepad}>
          <div className={styles.notepadHeader}>
            <div className={styles.spiral} />
            <div className={styles.spiral} />
            <div className={styles.spiral} />
          </div>
          <div className={styles.notepadContent}>
            <span className={styles.date}>
              {new Date(displayPosts[1]?.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </span>
            <h3>{displayPosts[1]?.title}</h3>
            {displayPosts[1]?.featuredImage?.sourceUrl && (
              <div 
                className={styles.polaroid}
                style={{
                  backgroundImage: `url(${displayPosts[1].featuredImage.sourceUrl})`
                }}
              />
            )}
          </div>
        </div>
      </Link>

      {/* Claymorphism Post */}
      <Link 
        href={postPathBySlug(displayPosts[2]?.slug)}
        className={`${styles.morphItem} ${styles.clayItem}`}
      >
        <div className={styles.clayContent}>
          {displayPosts[2]?.featuredImage?.sourceUrl && (
            <div 
              className={styles.clayImage}
              style={{
                backgroundImage: `url(${displayPosts[2].featuredImage.sourceUrl})`
              }}
            />
          )}
          <div className={styles.clayText}>
            <span className={styles.clayTag}>
              {displayPosts[2]?.categories?.[0]?.name || 'Travel'}
            </span>
            <h3>{displayPosts[2]?.title}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MorphPosts; 