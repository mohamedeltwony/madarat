import { memo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import styles from './PostCard.module.scss';

// Dynamically import Metadata component
const Metadata = dynamic(() => import('../Metadata'), {
  loading: () => <div className={styles.metadataPlaceholder} />,
});

const PostCard = memo(({ post }) => {
  const { title, slug, metadata = {}, excerpt } = post;

  return (
    <div className={styles.postCard}>
      <Link href={`/posts/${slug}`}>
        <h3 className={styles.postCardTitle} dangerouslySetInnerHTML={{ __html: title }} />
      </Link>
      <Metadata className={styles.postCardMetadata} {...metadata} />
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
