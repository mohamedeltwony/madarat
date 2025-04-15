import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMusic } from 'react-icons/fa';
import styles from './PostCard.module.scss';

const PostCard = memo(({ post }) => {
  const { title, slug, excerpt, date, author, featuredImage, categories } =
    post;

  return (
    <div className={styles.postCard}>
      <Link href={`/posts/${slug}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          {featuredImage && (
            <Image
              src={featuredImage.sourceUrl}
              alt={title}
              fill
              sizes="(max-width: 600px) 480px, 800px"
              className={styles.image}
            />
          )}
          <span className={styles.overlay}>
            <div className={styles.postTypeIcon}>
              <span className={styles.iconWrapper}>
                <FaMusic className={styles.icon} />
              </span>
            </div>
          </span>
        </div>
      </Link>

      {categories && categories.length > 0 && (
        <div className={styles.categories}>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/category/${category.slug}`}
              className={styles.category}
            >
              {category.name}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.content}>
        <h2 className={styles.title}>
          <Link href={`/posts/${slug}`}>
            <span dangerouslySetInnerHTML={{ __html: title }} />
          </Link>
        </h2>

        <div className={styles.meta}>
          {author && (
            <Link href={`/author/${author.slug}`} className={styles.author}>
              {author.avatar && (
                <div className={styles.avatar}>
                  <Image
                    src={author.avatar.url}
                    alt={author.name}
                    fill
                    className={styles.avatarImage}
                  />
                </div>
              )}
              <span className={styles.authorName}>{author.name}</span>
            </Link>
          )}
          <span className={styles.separator}>·</span>
          <time className={styles.date}>
            {new Date(date).toLocaleDateString('ar-EG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
