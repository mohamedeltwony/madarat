import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './AnimatedBorderButton.module.scss';

const AnimatedBorderButton = ({ 
  text, 
  href, 
  onClick, 
  icon = null, 
  external = false,
  borderRadius = '20px',
  animationDuration = '7s',
  className = '',
  dropdownItems = null // array of { label, onClick }
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Button content
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
        className={styles.buttonContainer}
        style={{ 
          '--border-radius': borderRadius,
          '--animation-duration': animationDuration
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <button
          ref={buttonRef}
          className={`${styles.button} ${className}`}
          type="button"
          tabIndex={0}
        >
          {buttonContent}
        </button>
        {open && (
          <div
            ref={dropdownRef}
            className={styles.dropdownMenu}
          >
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
        className={`${styles.button} ${className}`}
        onClick={onClick}
        style={{ 
          '--border-radius': borderRadius,
          '--animation-duration': animationDuration
        }}
      >
        {buttonContent}
      </a>
    );
  }
  
  // If internal link
  if (href) {
    return (
      <Link 
        href={href} 
        className={`${styles.button} ${className}`} 
        onClick={onClick}
        style={{ 
          '--border-radius': borderRadius,
          '--animation-duration': animationDuration
        }}
      >
        {buttonContent}
      </Link>
    );
  }
  
  // If button
  return (
    <button 
      className={`${styles.button} ${className}`} 
      onClick={onClick}
      style={{ 
        '--border-radius': borderRadius,
        '--animation-duration': animationDuration
      }}
    >
      {buttonContent}
    </button>
  );
};

export default AnimatedBorderButton; 