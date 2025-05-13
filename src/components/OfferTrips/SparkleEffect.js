import React, { useState, useEffect } from 'react';
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
const SparkleEffect = ({ active = false, color = '#cc9c64' }) => {
  const [sparkles, setSparkles] = useState([]);

  // Generate new sparkles when active changes
  useEffect(() => {
    if (active) {
      // Create 4 sparkles
      const newSparkles = Array.from({ length: 4 }, (_, i) => ({
        id: `sparkle-${i}-${Date.now()}`,
        size: `${random(6, 12)}px`,
        color: color + (i % 2 === 0 ? 'BB' : 'AA'), // Semi-transparent color
      }));
      setSparkles(newSparkles);
    } else {
      setSparkles([]);
    }
  }, [active, color]);

  if (!active) return null;

  return (
    <div className={styles.sparkleContainer}>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          size={sparkle.size}
          color={sparkle.color}
          style={{ position: 'absolute' }}
        />
      ))}
    </div>
  );
};

export default SparkleEffect;
