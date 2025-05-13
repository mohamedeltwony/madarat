import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { BsCameraFill } from 'react-icons/bs';
import styles from './BlogPosts.module.scss';

// SVG Icons as components
const CalendarIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const UserIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const CategoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path fillRule="evenodd" d="M5.25 2.25a3 3 0 00-3 3v4.318a3 3 0 00.879 2.121l9.58 9.581c.92.92 2.39.92 3.31 0l4.431-4.43a2.25 2.25 0 000-3.181l-9.58-9.58a3 3 0 00-2.12-.879H5.25zM6.375 7.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://madaratalkon.com/wp-json/wp/v2/posts');
        
        if (!response.ok) {
          throw new Error(`Error fetching posts: ${response.status}`);
        }
        
        const data = await response.json();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Helper function to extract slug from WordPress URL
  const getSlugFromUrl = (url) => {
    // Extract the slug from the URL
    const urlParts = url.split('/');
    // Remove empty strings from the end
    const filteredParts = urlParts.filter(part => part !== '');
    // Get the last part which should be the slug
    return filteredParts[filteredParts.length - 1];
  };

  // Helper function to clean HTML content
  const stripHtml = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Format date in Arabic
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('ar-SA', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Function to extract excerpt
  const getExcerpt = (html, maxLength = 150) => {
    if (!html) return '';
    // Remove HTML tags
    const textContent = html.replace(/<\/?[^>]+(>|$)/g, '');
    // Decode HTML entities
    const decoded = textContent.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#039;/g, "'");
    // Truncate if needed
    return decoded.length > maxLength ? decoded.substring(0, maxLength) + '...' : decoded;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>جاري تحميل المقالات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>
          عذراً، حدث خطأ أثناء تحميل المقالات. الرجاء المحاولة مرة أخرى لاحقاً.
        </p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className={styles.noPostsContainer}>
        <p className={styles.noPostsMessage}>
          لا توجد مقالات متاحة حالياً. يرجى زيارة الصفحة لاحقاً.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.blogPostsContainer}>
      <div className={styles.blogPostsHeader}>
        <h2 className={styles.blogPostsTitle}>أحدث المقالات</h2>
      </div>

      {/* Regular Posts Grid */}
      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.gridItem}>
            <Link href={`/posts/${getSlugFromUrl(post.link)}`} passHref className={styles.postCard}>
              <div className={styles.postImageContainer}>
                {post.yoast_head_json?.og_image?.[0]?.url ? (
                  <div 
                    className={styles.postImage} 
                    style={{
                      backgroundImage: `url('${post.yoast_head_json.og_image[0].url}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '100%'
                    }}
                  />
                ) : (
                  <div className={styles.placeholderImage}>
                    <BsCameraFill size={40} />
                  </div>
                )}
                <span className={styles.postCategory}>
                  <span className={styles.categoryIcon}></span>
                  سفر وسياحة
                </span>
              </div>
              <div className={styles.postContent}>
                <h3 className={styles.postTitle} dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                <div className={styles.postMeta}>
                  <span className={styles.postDate}>
                    <span className={styles.dateIcon}><CalendarIcon /></span>
                    {formatDate(post.date)}
                  </span>
                  <span className={styles.postAuthor}>
                    <span className={styles.authorIcon}><UserIcon /></span>
                    مدارات الكون
                  </span>
                </div>
                <div className={styles.postExcerpt}>
                  <p>{getExcerpt(post.excerpt.rendered)}</p>
                </div>
                <div className={styles.postFooter}>
                  <span className={styles.viewDetails}>
                    قراءة المزيد <ArrowRightIcon />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className={styles.viewAllContainer}>
        <Link href="/posts" className={styles.viewAllButton}>
          عرض جميع المقالات
          <span className={styles.buttonIcon}><ArrowRightIcon /></span>
        </Link>
      </div>
    </div>
  );
};

export default BlogPosts; 