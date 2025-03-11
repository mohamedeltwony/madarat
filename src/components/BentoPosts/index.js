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
            style={{ 
              backgroundImage: featuredImage ? `url(${featuredImage})` : 'linear-gradient(45deg, #1a1a1a, #4a4a4a)'
            }}
          >
            {post.categories && post.categories[0] && (
              <span className={styles.category}>
                {post.categories[0].name}
              </span>
            )}
            <h3 className={styles.title}>{post.title}</h3>
          </Link>
        );
      })}
    </div>
  );
};

export default BentoPosts; 