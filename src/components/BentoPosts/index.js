import Link from 'next/link';
import Image from 'next/legacy/image';
import { formatDate } from 'lib/datetime';
import { postPathBySlug } from 'lib/posts';
import { decodeHtmlEntitiesSafe } from '@/lib/util';
import styles from './BentoPosts.module.scss';

const BentoPosts = ({ posts }) => {
  if (!posts || !Array.isArray(posts)) return null;

  // Ensure we have at least 5 posts for the layout
  const displayPosts = posts.slice(0, 6);

  return (
    <div className={styles.bentoGrid}>
      {displayPosts.map((post, index) => {
        const featuredImage = post.featuredImage?.sourceUrl;
        const isPriority = index < 2; // Prioritize first 2 images for LCP

        return (
          <Link
            key={post.slug}
            href={postPathBySlug(post.slug)}
            className={`${styles.bentoItem} ${styles[`item${index + 1}`]}`}
          >
            <div className={styles.imageWrapper}>
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt={post.title || 'مقال'}
                  layout="fill"
                  objectFit="cover"
                  quality={isPriority ? 90 : 75}
                  priority={isPriority}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAKAAoDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/igAoAKAP//Z"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholderImage}>
                  <span>لا توجد صورة</span>
                </div>
              )}
            </div>
            <div className={styles.overlay}></div>
            {post.categories && post.categories[0] && (
              <span className={styles.category}>{post.categories[0].name}</span>
            )}
            <h3 className={styles.title}>{decodeHtmlEntitiesSafe(post.title)}</h3>
          </Link>
        );
      })}
    </div>
  );
};

export default BentoPosts;
