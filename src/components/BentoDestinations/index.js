import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import styles from './BentoDestinations.module.scss';

const BentoDestinations = ({ destinations = [], error = null }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortedDestinations, setSortedDestinations] = useState([]);
  const [topDestinations, setTopDestinations] = useState([]);
  const [remainingDestinations, setRemainingDestinations] = useState([]);
  const [isButtonAnimating, setIsButtonAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const expandedGridRef = useRef(null);

  // Sort destinations by trip count to find most popular ones
  useEffect(() => {
    if (destinations && destinations.length) {
      setIsLoading(true);
      
      // Sort by trip count (highest first)
      const sorted = [...destinations].sort((a, b) => 
        (b.tripCount || 0) - (a.tripCount || 0)
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
    } else {
      setIsLoading(false);
    }
  }, [destinations]);

  const toggleShowAll = useCallback(() => {
    setIsButtonAnimating(true);
    setTimeout(() => {
      setShowAll(prev => !prev);
      setIsButtonAnimating(false);
      
      // Scroll to expanded grid when showing all
      if (!showAll && expandedGridRef.current) {
        setTimeout(() => {
          expandedGridRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }, 100);
      }
    }, 300);
  }, [showAll]);

  if (error) {
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
      { size: 8, position: { top: Math.random() * 30, left: Math.random() * 20 + 70 }, delay: Math.random() * 2, opacity: 'BB', animation: 'cardSparkleIn' },
      { size: 6, position: { top: Math.random() * 20 + 50, left: Math.random() * 30 }, delay: Math.random() * 2 + 1, opacity: 'AA', animation: 'cardSparkleIn' },
    ];

    return (
      <Link
        key={destination.id}
        href={`/destinations/${destination.slug}/trips`}
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
            {destination.tripCount || 0}
          </span>
          <span className={styles.countLabel}>
            {destination.tripCount === 1 ? 'رحلة' : 'رحلات'}
          </span>
        </div>
        <div className={styles.imageWrapper}>
          {destination.image ? (
            <Image
              src={destination.image}
              alt={destination.title}
              layout="fill"
              objectFit="cover"
              className={styles.image}
              priority={isPriority}
              loading={isPriority ? "eager" : "lazy"}
              onError={(e) => {
                console.error('Image loading error:', e);
                e.target.src = '/images/placeholder.jpg';
              }}
            />
          ) : (
            <div className={styles.placeholderImage}>
              <span>لا توجد صورة</span>
            </div>
          )}
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>
            {destination.title || 'وجهة غير معروفة'}
          </h3>
          {destination.description && (
            <p className={styles.description}>
              {destination.description}
            </p>
          )}
        </div>
      </Link>
    );
  };

  // Star SVG component for sparkle effect with animation control
  const StarSparkle = ({ size, position, delay, opacity, animation = 'starSparkle' }) => (
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
      <div className={styles.glassCircle} style={{ 
        top: '15%', 
        left: '5%', 
        width: '180px', 
        height: '180px',
        opacity: 0.4,
        background: 'radial-gradient(circle at 30% 30%, rgba(204, 156, 100, 0.2), rgba(255, 255, 255, 0.05))'
      }}></div>
      
      <div className={styles.glassCircle} style={{ 
        top: '60%', 
        right: '8%', 
        width: '220px', 
        height: '220px',
        opacity: 0.3,
        background: 'radial-gradient(circle at 70% 30%, rgba(204, 156, 100, 0.15), rgba(255, 255, 255, 0.03))'
      }}></div>
      
      <div className={styles.glassDiamond} style={{
        top: '35%',
        right: '20%',
        transform: 'rotate(45deg)',
        width: '100px',
        height: '100px',
        opacity: 0.2,
        background: 'linear-gradient(135deg, rgba(204, 156, 100, 0.1), rgba(255, 255, 255, 0.05))'
      }}></div>
    </div>
  );

  return (
    <div className={`${styles.destinationsContainer} ${isLoading ? styles.loading : styles.loaded}`}>
      <GlassDecoration />
      
      <div className={styles.sectionHeading}>
        <h2>أشهر الوجهات السياحية</h2>
        <p>اكتشف معنا أفضل الوجهات حول العالم</p>
      </div>
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
        </div>
      )}
      
      {/* Top Destinations Grid */}
      <div className={`${styles.destinationsGrid} ${!isLoading ? styles.fadeIn : ''}`}>
        {topDestinations.map((destination, index) => renderDestinationCard(destination, index, true))}
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
              <StarSparkle size={12} position={{ top: 92, left: 10 }} delay={1.12} opacity="CC" />
              <StarSparkle size={10} position={{ top: 17, left: 87 }} delay={3.22} opacity="BB" />
              <StarSparkle size={9} position={{ top: 80, left: 41 }} delay={1.72} opacity="BB" />
              <StarSparkle size={7} position={{ top: 11, left: 50 }} delay={2.15} opacity="CC" />
              <StarSparkle size={6} position={{ top: 60, left: 75 }} delay={2.8} opacity="AA" />
              <StarSparkle size={8} position={{ top: 40, left: 15 }} delay={0.9} opacity="BB" />
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
          {remainingDestinations.map((destination, index) => renderDestinationCard(destination, index, false))}
        </div>
      )}
    </div>
  );
};

export default BentoDestinations;
