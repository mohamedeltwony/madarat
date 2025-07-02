import { useEffect, useState, useCallback } from 'react';
import styles from './PageIndicator.module.scss';

const PageIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (docHeight <= 0) {
      setScrollProgress(0);
      return;
    }
    
    const scrolled = (scrollTop / docHeight) * 100;
    setScrollProgress(Math.min(100, Math.max(0, scrolled)));
  }, []);

  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    handleScroll(); // Calculate initial position

    return () => window.removeEventListener('scroll', throttledScroll);
  }, [handleScroll]);

  return (
    <div className={styles.pageIndicatorContainer}>
      <div className={styles.pageIndicator}>
        <div 
          className={styles.indicatorMarker} 
          style={{ top: `${scrollProgress}%` }}
        />
      </div>
    </div>
  );
};

export default PageIndicator; 