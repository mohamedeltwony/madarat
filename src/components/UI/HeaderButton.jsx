import React from 'react';
import Link from 'next/link';
import styles from './HeaderButton.module.css';

const HeaderButton = ({ 
  text, 
  href, 
  onClick, 
  className = '', 
  active = false,
  icon = null,
  external = false,
  dropdown = false
}) => {
  // Determine the CSS class based on props
  const buttonClass = `${styles.headerButton} ${active ? styles.active : ''} ${dropdown ? styles.dropdown : ''} ${className}`;
  
  // Handle click event
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  // Content to render inside button
  const buttonContent = (
    <>
      <span className={styles.buttonText}>{text}</span>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
      {dropdown && (
        <span className={styles.dropdownArrow}>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
    </>
  );
  
  // External link button
  if (href && external) {
    return (
      <a 
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        onClick={handleClick}
      >
        {buttonContent}
      </a>
    );
  }
  
  // Internal link button
  if (href) {
    return (
      <Link href={href} className={buttonClass} onClick={handleClick}>
        {buttonContent}
      </Link>
    );
  }
  
  // Regular button (no link)
  return (
    <button className={buttonClass} onClick={handleClick}>
      {buttonContent}
    </button>
  );
};

export default HeaderButton; 