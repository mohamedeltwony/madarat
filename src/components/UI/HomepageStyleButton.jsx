import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './HomepageStyleButton.module.css';

const HomepageStyleButton = ({
  text,
  href,
  onClick,
  icon = null,
  external = false,
  variant = 'default', // 'default' or 'featured'
  dropdownItems = null, // array of { label, onClick }
  className = '', // Add support for custom className
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonClass = `${
    variant === 'featured' ? styles.featuredButton : styles.viewAllButton
  } ${className}`;

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Dropdown button content (no caret)
  const buttonContent = (
    <>
      <span>{text}</span>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
    </>
  );

  // Dropdown logic (open on hover)
  if (dropdownItems) {
    return (
      <div
        style={{ position: 'relative', display: 'inline-block' }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          ref={buttonRef}
          className={buttonClass}
          type="button"
          tabIndex={0}
        >
          {buttonContent}
        </button>
        {open && (
          <div ref={dropdownRef} className={styles.dropdownMenu}>
            {dropdownItems.map((item, idx) => (
              <button
                key={idx}
                className={styles.dropdownButton}
                onClick={() => {
                  setOpen(false);
                  item.onClick && item.onClick();
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // If external link
  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonClass}
        onClick={onClick}
      >
        {buttonContent}
      </a>
    );
  }

  // If internal link
  if (href) {
    return (
      <Link href={href} className={buttonClass} onClick={onClick}>
        {buttonContent}
      </Link>
    );
  }

  // If button
  return (
    <button className={buttonClass} onClick={onClick}>
      {buttonContent}
    </button>
  );
};

export default HomepageStyleButton;
