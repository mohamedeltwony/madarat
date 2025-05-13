import React from 'react';
import Link from 'next/link';
import styles from './EnhancedGoldButton.module.css';

const EnhancedGoldButton = ({
  text,
  href,
  onClick,
  className = '',
  icon = null,
  external = false,
  ariaLabel = '',
}) => {
  const buttonProps = {
    className: `${styles.enhancedGoldButton} ${className}`,
    onClick,
    'aria-label': ariaLabel || text,
  };

  // If href is provided, render as a link
  if (href) {
    // For external links, use regular anchor tag
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          {...buttonProps}
        >
          <span>{text}</span>
          {icon && <span className={styles.buttonIcon}>{icon}</span>}
        </a>
      );
    }

    // For internal links, use Next.js Link component
    return (
      <Link href={href} {...buttonProps}>
        <span>{text}</span>
        {icon && <span className={styles.buttonIcon}>{icon}</span>}
      </Link>
    );
  }

  // If no href, render as a button
  return (
    <button {...buttonProps}>
      <span>{text}</span>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
    </button>
  );
};

export default EnhancedGoldButton;
