import { memo } from 'react';
import Link from 'next/link';
import styles from './PostCard.module.scss';

const PostCard = memo(({ post }) => {
  const { title, slug, excerpt } = post;

  return (
    <div className={styles.postCard}>
      <Link href={`/posts/${slug}`}>
        <h3
          className={styles.postCardTitle}
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </Link>
      <ul
        className={`Metadata_metadata__DBDXc ${styles.postCardMetadata}`}
      ></ul>
      {excerpt && (
        <div
          className={styles.postCardContent}
          dangerouslySetInnerHTML={{
            __html: excerpt,
          }}
        />
      )}
    </div>
  );
});

PostCard.displayName = 'PostCard';

export default PostCard;
