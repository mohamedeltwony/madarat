import { useState, useEffect } from 'react';
import styles from './PostSidebar.module.scss';
import FormPopup from '../FormPopup';
import Link from 'next/link';
import { FaPhone } from 'react-icons/fa';

const PostSidebar = ({ post, recentPosts = [] }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [formattedDates, setFormattedDates] = useState({});
  const phoneNumber = '920034019';
  const whatsappNumber = '966920034019';

  // Handle client-side initialization to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);

    // Format dates on client-side only
    if (recentPosts && recentPosts.length) {
      const dates = {};
      recentPosts.forEach((post) => {
        if (post.date) {
          try {
            const date = new Date(post.date);
            if (date.toString() !== 'Invalid Date') {
              dates[post.slug] = date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });
            }
          } catch (e) {
            console.error('Error formatting date:', e);
          }
        }
      });
      setFormattedDates(dates);
    }
  }, [recentPosts]);

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
          <p className={styles.subtitle}>
            تواصل معنا للحصول على معلومات أكثر حول رحلاتنا وعروضنا المميزة
          </p>

          <div className={styles.ctaButtonsContainer}>
            <a
              href={isMounted ? `https://wa.me/${whatsappNumber}` : '#'}
              className={`${styles.ctaButton} ${styles.whatsappButton} ${isMounted ? styles.client : ''}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className={styles.whatsappIcon}
              >
                <path
                  fill="#FFFFFF"
                  d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345m-5.446 7.443h-.016c-1.77 0-3.524-.48-5.055-1.38l-.36-.214-3.75.975 1.005-3.645-.239-.375c-.99-1.576-1.516-3.391-1.516-5.26 0-5.445 4.455-9.885 9.942-9.885 2.654 0 5.145 1.035 7.021 2.91 1.875 1.859 2.909 4.35 2.909 6.99-.004 5.444-4.46 9.885-9.935 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"
                />
              </svg>
            </a>

            <a
              href={`tel:${phoneNumber}`}
              className={`${styles.ctaButton} ${styles.callButton}`}
            >
              <FaPhone className={styles.ctaIcon} />
              <span>اتصل بنا</span>
            </a>
          </div>
        </div>

        {/* Popular Posts Section */}
        {recentPosts && recentPosts.length > 0 && (
          <div className={styles.popularPostsCard}>
            <h3 className={styles.popularPostsTitle}>مقالات مشابهة</h3>
            <div className={styles.popularPostsList}>
              {recentPosts.map((recentPost) => (
                <div
                  key={recentPost.slug || `post-${Math.random()}`}
                  className={styles.popularPostItem}
                >
                  {recentPost.featuredImage && (
                    <img
                      src={recentPost.featuredImage.sourceUrl}
                      alt={recentPost.title || ''}
                      className={styles.popularPostImage}
                    />
                  )}
                  <div className={styles.popularPostContent}>
                    <h4 className={styles.popularPostTitle}>
                      <Link href={`/posts/${recentPost.slug || ''}`}>
                        {recentPost.title || ''}
                      </Link>
                    </h4>
                    <div className={styles.popularPostMeta}>
                      {formattedDates[recentPost.slug] || ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isMounted && (
        <FormPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
      )}
    </div>
  );
};

export default PostSidebar;
