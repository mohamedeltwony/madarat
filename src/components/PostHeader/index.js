import Link from 'next/link';
import { FaChevronDown } from 'react-icons/fa';
import styles from './PostHeader.module.scss';
import { categoryPathBySlug } from 'lib/categories';
import { formatDate } from 'lib/datetime';

const PostHeader = ({
  title,
  featuredImage,
  categories,
  author,
  date,
  useHeroLayout = true,
}) => {
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight - 80,
      behavior: 'smooth',
    });
  };

  // Format the date for display
  const formattedDate = formatDate(date);

  // Hero layout (full-screen header with image background)
  if (useHeroLayout && featuredImage) {
    return (
      <div className={styles.postHeader}>
        <div className={styles.heroHeader}>
          <div className={styles.featuredImageWrapper}>
            <img src={featuredImage.sourceUrl} alt={title} />
          </div>

          <div className={styles.heroContent}>
            {categories?.length > 0 && (
              <div className={styles.categories}>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={categoryPathBySlug(category.slug)}
                    className={styles.category}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            )}

            <h1 className={styles.title}>{title}</h1>

            <div className={styles.meta}>
              {author && (
                <div className={styles.authorWrapper}>
                  {author.avatar?.url && (
                    <img
                      src={author.avatar.url}
                      alt={author.name}
                      className={styles.authorImage}
                    />
                  )}
                  <div className={styles.authorInfo}>
                    <div className={styles.authorLabel}>كتب بواسطة</div>
                    <Link
                      href={`/author/${author?.slug}`}
                      className={styles.authorName}
                    >
                      {author?.name}
                    </Link>
                  </div>
                </div>
              )}

              <div className={styles.dateItem}>
                <div className={styles.dateLabel}>تم النشر في</div>
                <div className={styles.dateValue}>{formattedDate}</div>
              </div>
            </div>
          </div>

          <div className={styles.scrollDown} onClick={scrollToContent}>
            <FaChevronDown />
          </div>
        </div>
      </div>
    );
  }

  // Standard layout (compact header with title first, then image)
  return (
    <div className={styles.postHeader}>
      <div className={styles.standardHeader}>
        <div className={styles.headerContent}>
          {categories?.length > 0 && (
            <div className={styles.categories}>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={categoryPathBySlug(category.slug)}
                  className={styles.category}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}

          <h1 className={styles.title}>{title}</h1>

          <div className={styles.meta}>
            {author && (
              <span className={styles.author}>
                كتب بواسطة{' '}
                <Link href={`/author/${author?.slug}`}>{author?.name}</Link>
              </span>
            )}
            <span className={styles.date}>{formattedDate}</span>
          </div>
        </div>

        {featuredImage && (
          <div className={styles.featuredImage}>
            <img src={featuredImage.sourceUrl} alt={title} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostHeader;
