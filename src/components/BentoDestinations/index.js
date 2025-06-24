import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import styles from './BentoDestinations.module.scss';

// Fallback destinations data when API fails
const fallbackDestinations = [
  {
    id: 1,
    title: 'تركيا',
    slug: 'turkey',
    description: 'اكتشف جمال تركيا مع رحلات مميزة',
    image: '/images/destinations/turkey.jpg',
    tripCount: 12
  },
  {
    id: 2,
    title: 'جورجيا',
    slug: 'georgia',
    description: 'رحلات رائعة إلى جورجيا',
    image: '/images/destinations/georgia.jpg',
    tripCount: 8
  },
  {
    id: 3,
    title: 'أذربيجان',
    slug: 'azerbaijan',
    description: 'استمتع بجمال أذربيجان',
    image: '/images/destinations/azerbaijan.jpg',
    tripCount: 6
  },
  {
    id: 4,
    title: 'إيطاليا',
    slug: 'italy',
    description: 'رحلات مميزة إلى إيطاليا',
    image: '/images/destinations/italy.jpg',
    tripCount: 5
  },
  {
    id: 5,
    title: 'البوسنة',
    slug: 'bosnia',
    description: 'استكشف جمال البوسنة الطبيعي',
    image: '/images/destinations/bosnia.jpg',
    tripCount: 4
  },
  {
    id: 6,
    title: 'بولندا',
    slug: 'poland',
    description: 'رحلات إلى بولندا بأسعار مميزة',
    image: '/images/destinations/poland.jpg',
    tripCount: 3
  }
];

const BentoDestinations = ({ destinations = [], error = null }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortedDestinations, setSortedDestinations] = useState([]);
  const [topDestinations, setTopDestinations] = useState([]);
  const [remainingDestinations, setRemainingDestinations] = useState([]);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const expandedGridRef = useRef(null);

  // Sort destinations by trip count to find most popular ones
  useEffect(() => {
    setIsLoading(true);
    
    // Use fallback data if destinations is empty or contains invalid data
    const destinationsToUse = 
      (!destinations || destinations.length === 0 || !Array.isArray(destinations)) 
        ? fallbackDestinations 
        : destinations;
    
    if (destinationsToUse !== destinations) {
      setUsingFallback(true);
      console.log('Using fallback destinations data');
    }

    try {
      // Sort by trip count (highest first)
      const sorted = [...destinationsToUse].sort(
        (a, b) => (b.count || 0) - (a.count || 0)
      );

      setSortedDestinations(sorted);
      // Get top 12 for featured grid
      setTopDestinations(sorted.slice(0, 12));
      // Get remaining destinations
      setRemainingDestinations(sorted.slice(12));

      // Small delay to ensure smooth rendering
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    } catch (err) {
      console.error('Error processing destinations data:', err);
      // Fallback to default data in case of any error
      setSortedDestinations(fallbackDestinations);
      setTopDestinations(fallbackDestinations.slice(0, 6));
      setRemainingDestinations(fallbackDestinations.slice(6));
      setUsingFallback(true);
      setIsLoading(false);
    }
  }, [destinations]);

  const toggleShowAll = useCallback(() => {
    setIsButtonAnimating(true);
    setTimeout(() => {
      setShowAll((prev) => !prev);
      setIsButtonAnimating(false);

      // Scroll to expanded grid when showing all
      if (!showAll && expandedGridRef.current) {
        setTimeout(() => {
          const headerOffset = 100;
          const elementPosition = expandedGridRef.current.offsetTop;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    }, 300);
  }, [showAll]);

  if (error && !usingFallback) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
      </div>
    );
  }

  if (!destinations || destinations.length === 0) {
    return (
      <div className={styles.noDestinations}>
        <p>لا توجد وجهات متاحة حالياً</p>
      </div>
    );
  }

  const renderDestinationCard = (destination, index, isTopDestination) => {
    if (!destination || !destination.id) {
      console.error('Invalid destination data:', destination);
      return null;
    }

    // Determine if this is a priority image (load faster for top visible cards)
    const isPriority = isTopDestination && index < 4;

    // Generate random sparkle positions for each card
    const sparkles = [
      {
        size: 8,
        position: { top: Math.random() * 30, left: Math.random() * 20 + 70 },
        delay: Math.random() * 2,
        opacity: 'BB',
        animation: 'cardSparkleIn',
      },
      {
        size: 6,
        position: { top: Math.random() * 20 + 50, left: Math.random() * 30 },
        delay: Math.random() * 2 + 1,
        opacity: 'AA',
        animation: 'cardSparkleIn',
      },
    ];

    return (
      <Link
        key={destination.id}
        href={`/destinations/${destination.slug}`}
        className={styles.destinationCard}
        aria-label={`View trips for ${destination.title || 'Unknown destination'}`}
      >
        {/* Card Sparkles */}
        <div className={styles.sparkleContainer}>
          {sparkles.map((sparkle, i) => (
            <StarSparkle
              key={`sparkle-${destination.id}-${i}`}
              size={sparkle.size}
              position={sparkle.position}
              delay={sparkle.delay}
              opacity={sparkle.opacity}
              animation={sparkle.animation}
            />
          ))}
        </div>

        <div className={styles.tripCount}>
          <span className={styles.countNumber}>
            {destination.count || 0}
          </span>
          <span className={styles.countLabel}>
            {destination.count === 1 ? 'رحلة' : 'رحلات'}
          </span>
        </div>
        <div className={styles.imageWrapper}>
          <Image
            src={destination.thumbnail?.source_url || destination.image || '/images/placeholder.jpg'}
            alt={destination.title || destination.name || 'Destination Image'}
            layout="fill"
            objectFit="cover"
            quality={isPriority ? 90 : 75}
            priority={isPriority}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAKAAoDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/igAoAKAP//Z"
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>
            {destination.title || destination.name || 'وجهة غير معروفة'}
          </h3>
          {destination.description && (
            <p className={styles.description}>{destination.description}</p>
          )}
        </div>
      </Link>
    );
  };

  // Star SVG component for sparkle effect with animation control
  const StarSparkle = ({
    size,
    position,
    delay,
    opacity,
    animation = 'starSparkle',
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 24 24"
      fill={`#cc9c64${opacity}`}
      style={{
        position: 'absolute',
        top: `${position.top}%`,
        left: `${position.left}%`,
        animationDelay: `${delay}s`,
        animation: `${animation} 3s ease-in-out infinite`,
        filter: 'drop-shadow(0 0 3px rgba(204, 156, 100, 0.7))',
      }}
    >
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
  );

  // Background decoration elements
  const GlassDecoration = () => (
    <div className={styles.glassDecorations}>
      <div
        className={styles.glassCircle}
        style={{
          top: '15%',
          left: '5%',
          width: '180px',
          height: '180px',
          opacity: 0.05,
        }}
      ></div>
      <div
        className={styles.glassCircle}
        style={{
          top: '70%',
          left: '8%',
          width: '120px',
          height: '120px',
          opacity: 0.03,
        }}
      ></div>
      <div
        className={styles.glassCircle}
        style={{
          top: '30%',
          right: '3%',
          width: '150px',
          height: '150px',
          opacity: 0.04,
        }}
      ></div>
      <div
        className={styles.glassCircle}
        style={{
          top: '75%',
          right: '10%',
          width: '100px',
          height: '100px',
          opacity: 0.02,
        }}
      ></div>
    </div>
  );

  return (
    <div
      className={`${styles.destinationsContainer} ${isLoading ? styles.loading : styles.loaded}`}
    >
      <GlassDecoration />

      <div className={styles.sectionHeading}>
        <h2>أشهر الوجهات السياحية</h2>
        <p>اكتشف معنا أفضل الوجهات حول العالم</p>
        {usingFallback && (
          <div className={styles.fallbackNotice}>
            <p>يتم عرض بيانات محلية بسبب مشكلة في الاتصال بخادم البيانات</p>
          </div>
        )}
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}

      {/* Top Destinations Grid */}
      <div
        className={`${styles.destinationsGrid} ${!isLoading ? styles.fadeIn : ''}`}
      >
        {topDestinations.map((destination, index) =>
          renderDestinationCard(destination, index, true)
        )}
      </div>

      {/* Explore All Button */}
      {remainingDestinations.length > 0 && (
        <div className={styles.exploreButtonContainer}>
          <button
            className={`${styles.exploreAllButton} ${isButtonAnimating ? styles.animating : ''}`}
            onClick={toggleShowAll}
            aria-expanded={showAll}
            disabled={isButtonAnimating}
          >
            <div className={styles.sparkleContainer}>
              <StarSparkle
                size={12}
                position={{ top: 92, left: 10 }}
                delay={1.12}
                opacity="CC"
              />
              <StarSparkle
                size={10}
                position={{ top: 17, left: 87 }}
                delay={3.22}
                opacity="BB"
              />
              <StarSparkle
                size={9}
                position={{ top: 80, left: 41 }}
                delay={1.72}
                opacity="BB"
              />
              <StarSparkle
                size={7}
                position={{ top: 11, left: 50 }}
                delay={2.15}
                opacity="CC"
              />
              <StarSparkle
                size={6}
                position={{ top: 60, left: 75 }}
                delay={2.8}
                opacity="AA"
              />
              <StarSparkle
                size={8}
                position={{ top: 40, left: 15 }}
                delay={0.9}
                opacity="BB"
              />
            </div>

            <span className={styles.buttonContent}>
              {showAll ? 'عرض الأشهر فقط' : 'استكشاف كل الوجهات'}
            </span>
          </button>
        </div>
      )}

      {/* Expanded Grid View (conditionally rendered) */}
      {showAll && (
        <div
          className={`${styles.destinationsGrid} ${styles.expandedGrid}`}
          ref={expandedGridRef}
        >
          {remainingDestinations.map((destination, index) =>
            renderDestinationCard(destination, index, false)
          )}
        </div>
      )}
    </div>
  );
};

export default BentoDestinations;
