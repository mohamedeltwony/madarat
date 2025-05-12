import { useState } from 'react';
import styles from './PostSidebar.module.scss';
import FormPopup from '../FormPopup';
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';

const PostSidebar = ({ post, recentPosts = [] }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className={styles.sidebar}>
      <div className={styles.stickyContent}>
        {/* Call-to-Action Card */}
        <div className={styles.ctaCard}>
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
          <p className={styles.subtitle}>تواصل معنا للحصول على معلومات أكثر حول رحلاتنا وعروضنا المميزة</p>
          <button
            className={styles.ctaButton}
            onClick={() => setIsPopupOpen(true)}
          >
            <FaWhatsapp className={styles.ctaIcon} /> تواصل معنا الآن
          </button>
        </div>

        {/* Popular Posts Section */}
        {recentPosts.length > 0 && (
          <div className={styles.popularPostsCard}>
            <h3 className={styles.popularPostsTitle}>مقالات مشابهة</h3>
            <div className={styles.popularPostsList}>
              {recentPosts.map((recentPost) => (
                <div key={recentPost.slug} className={styles.popularPostItem}>
                  {recentPost.featuredImage && (
                    <img
                      src={recentPost.featuredImage.sourceUrl}
                      alt={recentPost.title}
                      className={styles.popularPostImage}
                    />
                  )}
                  <div className={styles.popularPostContent}>
                    <h4 className={styles.popularPostTitle}>
                      <Link href={`/posts/${recentPost.slug}`}>
                        {recentPost.title}
                      </Link>
                    </h4>
                    <div className={styles.popularPostMeta}>
                      {recentPost.date ? 
                        (new Date(recentPost.date).toString() !== 'Invalid Date' ?
                        new Date(recentPost.date).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : '') : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FormPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
};

export default PostSidebar;
