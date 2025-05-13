import React from 'react';
import Link from 'next/link';
import styles from './HeaderGoldButton.module.css';

const HeaderGoldButton = ({
  text,
  href,
  onClick,
  className = '',
  icon = null,
  external = false,
  size = 'medium', // 'small', 'medium', or 'large'
}) => {
  // Determine size class
  const sizeClass = styles[size] || styles.medium;

  // Combine CSS classes
  const buttonClass = `${styles.headerGoldButton} ${sizeClass} ${className}`;

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

export default HeaderGoldButton;
