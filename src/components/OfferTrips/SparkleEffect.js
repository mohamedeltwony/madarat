import React, { useRef, useEffect } from 'react';
import styles from './SparkleEffect.module.scss';

// Random number generator within a range
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min;

// SVG sparkle component
const SparkleIcon = ({ size, color, style }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={style}
  >
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
  </svg>
);

// Sparkle component with random properties
const Sparkle = ({ size, color, style }) => {
  const [sparkleStyle] = useState(() => {
    const top = random(0, 100);
    const left = random(0, 100);
    const animationDelay = `${random(0, 1000) / 100}s`;

    return {
      ...style,
      top: `${top}%`,
      left: `${left}%`,
      animationDelay,
    };
  });

  return <SparkleIcon size={size} color={color} style={sparkleStyle} />;
};

// Main sparkle effect component
const SparkleEffect = () => {
  const sparkleContainerRef = useRef(null);
  
  useEffect(() => {
    if (!sparkleContainerRef.current) return;
    
    // Create random sparkles
    const sparkleCount = 7; // Number of sparkles to create
    const container = sparkleContainerRef.current;
    const sparkles = [];
    
    for (let i = 0; i < sparkleCount; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = styles.sparkle;
      
      // Random size between 4px and 12px
      const size = 4 + Math.random() * 8;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
      
      // Random position
      sparkle.style.top = `${Math.random() * 100}%`;
      sparkle.style.left = `${Math.random() * 100}%`;
      
      // Random delay for animation
      sparkle.style.animationDelay = `${Math.random() * 1.5}s`;
      
      // Random duration for animation
      sparkle.style.animationDuration = `${1 + Math.random() * 2}s`;
      
      container.appendChild(sparkle);
      sparkles.push(sparkle);
    }
    
    return () => {
      // Clean up sparkles when component unmounts
      sparkles.forEach(sparkle => {
        if (container.contains(sparkle)) {
          container.removeChild(sparkle);
        }
      });
    };
  }, []);
  
  return (
    <div ref={sparkleContainerRef} className={styles.sparkleContainer}></div>
  );
};

export default SparkleEffect;
