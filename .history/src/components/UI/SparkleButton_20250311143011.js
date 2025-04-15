import React, { useState, useEffect, useRef } from 'react';
import styles from './UI.module.scss';

// Generate random number between min and max
const randomNumber = (min, max) => Math.random() * (max - min) + min;

const Sparkle = ({ style }) => {
  return (
    <svg
      className={styles.sparkle}
      style={style}
      width="20"
      height="20"
      viewBox="0 0 160 160"
      fill="none"
    >
      <path
        d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default function SparkleButton({
  children,
  type = 'button',
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  sparkleColors = ['#FFD700', '#FFA500', '#FF4500'],
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const buttonRef = useRef(null);

  // Create sparkles on hover
  useEffect(() => {
    if (!isHovered) {
      setSparkles([]);
      return;
    }

    const newSparkles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      createdAt: Date.now(),
      color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
      size: randomNumber(10, 20),
      style: {
        top: randomNumber(-20, 100) + '%',
        left: randomNumber(-10, 110) + '%',
        zIndex: 2,
        animation: `${randomNumber(0.5, 1.5)}s sparkle-float-out forwards`,
        animationDelay: `${randomNumber(0, 0.5)}s`,
      },
    }));

    setSparkles(newSparkles);

    // Clean up sparkles after animation
    const timeout = setTimeout(() => {
      setSparkles([]);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isHovered, sparkleColors]);

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <button
      ref={buttonRef}
      type={type}
      className={`${styles.sparkleButton} ${className} ${fullWidth ? styles.fullWidth : ''} ${isHovered ? styles.hovered : ''}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className={styles.buttonContent}>{children}</span>

      {/* Background glow effect */}
      <span
        className={`${styles.buttonGlow} ${isHovered ? styles.active : ''}`}
      ></span>

      {/* Sparkles */}
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          style={{
            ...sparkle.style,
            color: sparkle.color,
            width: sparkle.size,
            height: sparkle.size,
          }}
        />
      ))}
    </button>
  );
}
