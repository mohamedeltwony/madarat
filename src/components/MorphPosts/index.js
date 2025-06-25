import Link from 'next/link';
import { postPathBySlug } from 'lib/posts';
import { decodeHtmlEntitiesSafe } from '@/lib/util';
import styles from './MorphPosts.module.scss';

const MorphPosts = ({ posts }) => {
  if (!posts || !Array.isArray(posts)) return null;

  const displayPosts = posts.slice(0, 3);

  return (
    <div className={styles.morphGrid}>
      {displayPosts.map((post, index) => (
        <Link
          key={post?.slug}
          href={postPathBySlug(post?.slug)}
          className={`${styles.morphItem} ${styles[`glassItem${index + 1}`]}`}
          style={{
            backgroundImage: `url(${post?.featuredImage?.sourceUrl})`,
          }}
        >
          <div className={styles.glassContent}>
            {post?.categories?.[0] && (
              <span className={styles.glassTag}>{post.categories[0].name}</span>
            )}
            <h3>{decodeHtmlEntitiesSafe(post?.title)}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MorphPosts;
