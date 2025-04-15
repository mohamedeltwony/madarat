import Link from 'next/link';
import styles from './PostHeader.module.scss';
import { categoryPathBySlug } from 'lib/categories';
import { formatDate } from 'lib/datetime';

const PostHeader = ({ title, featuredImage, categories, author, date }) => {
  return (
    <div className={styles.postHeader}>
      <div className={styles.postImage}>
        {featuredImage && (
          <Link href={featuredImage.sourceUrl}>
            <div
              className={styles.featuredImageWrapper}
              style={{
                backgroundImage: `url(${featuredImage.sourceUrl})`,
                paddingTop: '66.6667%',
              }}
            />
          </Link>
        )}
        <div className={styles.headerContent}>
          <div className={styles.categories}>
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={categoryPathBySlug(category.slug)}
                className={styles.category}
              >
                {category.name}
              </Link>
            ))}
          </div>

          <h1 className={styles.title}>{title}</h1>

          <div className={styles.meta}>
            <span className={styles.author}>
              by <Link href={`/author/${author?.slug}`}>{author?.name}</Link>
            </span>
            <span className={styles.date}>{formatDate(date)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostHeader;
