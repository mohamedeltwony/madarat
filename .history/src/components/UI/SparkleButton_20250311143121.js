import React, { useState, useRef, useEffect } from 'react';
import styles from './UI.module.scss';

const SparkleButton = ({
  children,
  onClick,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sparkles, setSparkles] = useState([]);
  const buttonRef = useRef(null);

  // Create sparkle elements when hovered
  useEffect(() => {
    if (!isHovered || disabled) return;

    const interval = setInterval(() => {
      if (!buttonRef.current) return;

      // Create a new sparkle
      const sparkle = {
        id: Date.now(),
        size: Math.random() * 10 + 5, // 5-15px
        color: `hsl(${Math.random() * 60 + 30}, 100%, 70%)`, // Gold-ish colors
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 1000 + 1000, // 1-2s
      };

      setSparkles((prev) => [...prev, sparkle]);

      // Remove old sparkles to prevent memory issues
      if (sparkles.length > 20) {
        setSparkles((prev) => prev.slice(1));
      }
    }, 150);

    return () => clearInterval(interval);
  }, [isHovered, disabled, sparkles.length]);

  // Clear sparkles when not hovered
  useEffect(() => {
    if (!isHovered) {
      const timer = setTimeout(() => {
        setSparkles([]);
      }, 2000); // Allow time for exit animations
      return () => clearTimeout(timer);
    }
  }, [isHovered]);

  // SVG for the sparkle
  const SparkleIcon = ({ size, color }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z"
        fill={color}
      />
    </svg>
  );

  return (
    <button
      ref={buttonRef}
      className={`${styles.sparkleButton} ${isHovered ? styles.hovered : ''} ${fullWidth ? styles.fullWidth : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir="auto" // Automatically sets direction based on content
    >
      {/* Animated gradient background */}
      <div
        className={`${styles.buttonGlow} ${isHovered ? styles.active : ''}`}
      />

      {/* Sparkle elements */}
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className={styles.sparkle}
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            animation: `${styles['sparkle-float-out']} ${sparkle.duration}ms forwards`,
          }}
        >
          <SparkleIcon size={sparkle.size} color={sparkle.color} />
        </div>
      ))}

      {/* Button content */}
      <span className={styles.buttonContent}>{children}</span>
    </button>
  );
};

export default SparkleButton;
