import React from 'react';
import Link from 'next/link';
import styles from './SimpleGoldButton.module.css';

const SimpleGoldButton = ({ 
  text, 
  href, 
  onClick, 
  className = '', 
  icon = null,
  external = false
}) => {
  // If href is provided, render as a link
  if (href) {
    // For external links, use regular anchor tag
    if (external) {
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`${styles.goldButton} ${className}`}
          onClick={onClick}
        >
          <span>{text}</span>
          {icon && <span className={styles.buttonIcon}>{icon}</span>}
        </a>
      );
    }
    
    // For internal links, use Next.js Link component
    return (
      <Link 
        href={href} 
        className={`${styles.goldButton} ${className}`}
        onClick={onClick}
      >
        <span>{text}</span>
        {icon && <span className={styles.buttonIcon}>{icon}</span>}
      </Link>
    );
  }
  
  // If no href, render as a button
  return (
    <button 
      onClick={onClick} 
      className={`${styles.goldButton} ${className}`}
    >
      <span>{text}</span>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
    </button>
  );
};

export default SimpleGoldButton; 