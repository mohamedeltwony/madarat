import { useState, useEffect } from 'react';
import styles from './GoogleReviewsSection.module.scss';
import { FaStar, FaStarHalfAlt, FaRegStar, FaChevronLeft, FaChevronRight } from '@/components/icons';
import Image from 'next/legacy/image';
import Container from '@/components/Container';

const GoogleReviewsSection = () => {
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch reviews: ${response.status}`);
        }
        
        const data = await response.json();
        setReviewsData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Google reviews:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchReviews();
  }, []);

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className={styles.star} />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className={styles.star} />);
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className={styles.star} />);
    }
    
    return stars;
  };

  // Function to format the review time
  const formatReviewTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function to navigate to the next review
  const nextReview = () => {
    if (reviewsData && reviewsData.reviews.length > 0) {
      setActiveIndex((prevIndex) => 
        prevIndex === reviewsData.reviews.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  // Function to navigate to the previous review
  const prevReview = () => {
    if (reviewsData && reviewsData.reviews.length > 0) {
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? reviewsData.reviews.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>جاري تحميل التقييمات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>عذراً، حدث خطأ أثناء تحميل التقييمات. يرجى المحاولة مرة أخرى لاحقاً.</p>
      </div>
    );
  }

  if (!reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) {
    return null;
  }

  const currentReview = reviewsData.reviews[activeIndex];

  return (
    <div className={styles.googleReviewsSection}>
      <Container>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>آراء عملائنا</h2>
          <div className={styles.ratingOverview}>
            <div className={styles.averageRating}>
              <span className={styles.ratingValue}>{reviewsData.averageRating.toFixed(1)}</span>
              <div className={styles.starsContainer}>
                {renderStars(reviewsData.averageRating)}
              </div>
            </div>
            <div className={styles.totalReviews}>
              <span>{reviewsData.totalReviews}</span> تقييم على Google
            </div>
          </div>
        </div>

        <div className={styles.reviewsCarousel}>
          <button 
            className={`${styles.carouselButton} ${styles.prevButton}`}
            onClick={prevReview}
            aria-label="Previous review"
          >
            <FaChevronRight />
          </button>

          <div className={styles.reviewCard}>
            <div className={styles.reviewHeader}>
              <div className={styles.reviewerInfo}>
                {currentReview.profile_photo_url && (
                  <div className={styles.reviewerAvatar}>
                    <Image 
                      src={currentReview.profile_photo_url} 
                      alt={currentReview.author_name}
                      width={48}
                      height={48}
                      layout="fixed"
                      className={styles.avatarImage}
                    />
                  </div>
                )}
                <div className={styles.reviewerDetails}>
                  <h3 className={styles.reviewerName}>{currentReview.author_name}</h3>
                  <div className={styles.reviewDate}>
                    {formatReviewTime(currentReview.time)}
                  </div>
                </div>
              </div>
              <div className={styles.reviewRating}>
                {renderStars(currentReview.rating)}
              </div>
            </div>
            <div className={styles.reviewContent}>
              <p>{currentReview.text}</p>
            </div>
          </div>

          <button 
            className={`${styles.carouselButton} ${styles.nextButton}`}
            onClick={nextReview}
            aria-label="Next review"
          >
            <FaChevronLeft />
          </button>
        </div>

        <div className={styles.reviewsIndicators}>
          {reviewsData.reviews.map((_, index) => (
            <button
              key={index}
              className={`${styles.indicator} ${index === activeIndex ? styles.activeIndicator : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>

        <div className={styles.googleBadge}>
          <a 
            href="https://search.google.com/local/reviews" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.googleLink}
          >
            <Image 
              src="/images/google-logo.png" 
              alt="Google" 
              width={20} 
              height={20} 
              layout="fixed"
            />
            <span>اقرأ المزيد من التقييمات على Google</span>
          </a>
        </div>
      </Container>
    </div>
  );
};

export default GoogleReviewsSection;
