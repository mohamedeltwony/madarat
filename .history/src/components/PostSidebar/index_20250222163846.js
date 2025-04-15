import { useState } from 'react';
import styles from './PostSidebar.module.scss';
import FormPopup from '../FormPopup';

const PostSidebar = ({ post }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className={styles.sidebar}>
      <div className={styles.stickyContent}>
        {post.featuredImage && (
          <div className={styles.thumbnailWrapper}>
            <img
              src={post.featuredImage.sourceUrl}
              alt={post.title}
              className={styles.thumbnail}
            />
          </div>
        )}
        <h2 className={styles.title}>{post.title}</h2>
        <button
          className={styles.ctaButton}
          onClick={() => setIsPopupOpen(true)}
        >
          Get More Information
        </button>
      </div>

      <FormPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default PostSidebar;
