import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { decodeHtmlEntitiesSafe } from '@/lib/util';
import styles from './PostCard.module.scss';

const PostCard = memo(({ post }) => {
  const { title, slug, excerpt, date, author, featuredImage, categories } =
    post;

  // Create a consistent date formatter with specific options
  const dateFormatter = new Intl.DateTimeFormat('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'gregory',
    numberingSystem: 'arab',
  });

  // Format the date string consistently
  const formattedDate = date
    ? dateFormatter.format(new Date(date)).replace('،', '')
    : '';

  return (
    <div className={styles.postCard}>
      <Link href={`/posts/${slug}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          {featuredImage ? (
            <Image
              src={featuredImage.sourceUrl}
              alt={featuredImage.altText || title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
              priority={false}
            />
          ) : (
            <Image
              src="/images/post-default.jpg"
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
              priority={false}
            />
          )}
          <span className={styles.overlay} />
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
            {decodeHtmlEntitiesSafe(title)}
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
          <time className={styles.date} dateTime={date}>
            {formattedDate}
          </time>
        </div>
      </div>
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
