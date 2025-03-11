import Link from 'next/link';
import { formatDate } from 'lib/datetime';
import { postPathBySlug } from 'lib/posts';
import styles from './BentoPosts.module.scss';

const BentoPosts = ({ posts }) => {
  if (!posts || !Array.isArray(posts)) return null;

  // Ensure we have at least 5 posts for the layout
  const displayPosts = posts.slice(0, 6);

  return (
    <div className={styles.bentoGrid}>
      {displayPosts.map((post, index) => {
        const featuredImage = post.featuredImage?.sourceUrl;
        
        return (
          <Link 
            key={post.slug} 
            href={postPathBySlug(post.slug)}
            className={`${styles.bentoItem} ${styles[`item${index + 1}`]}`}
          >
            <div className={styles.bentoContent}>
              {featuredImage && (
                <div 
                  className={styles.imageWrapper}
                  style={{ backgroundImage: `url(${featuredImage})` }}
                />
              )}
              <div className={styles.textContent}>
                {post.categories && post.categories[0] && (
                  <span className={styles.category}>
                    {post.categories[0].name}
                  </span>
                )}
                <h3 className={styles.title}>{post.title}</h3>
                <div className={styles.meta}>
                  {post.author && (
                    <span className={styles.author}>
                      By {post.author.name}
                    </span>
                  )}
                  <time className={styles.date}>
                    {formatDate(post.date)}
                  </time>
                </div>
                {index === 0 && post.excerpt && (
                  <p className={styles.excerpt}>
                    {post.excerpt.replace(/(<([^>]+)>)/gi, '').slice(0, 150)}...
                  </p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default BentoPosts; 