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
  dropdownItems = null, // array of { label, onClick }
  variant = 'default', // 'default', 'transparent', 'gold'
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);

  // Determine button class based on variant
  const buttonClass = `${styles.button} ${styles[variant]} ${className}`;

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Button content
  const buttonContent = (
    <>
      <span>{text}</span>
      {icon && <span className={styles.buttonIcon}>{icon}</span>}
    </>
  );

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 1000); // 1 second delay
  };

  // Dropdown logic
  if (dropdownItems) {
    return (
      <div
        className={styles.buttonContainer}
        style={{
          '--border-radius': borderRadius,
          '--animation-duration': animationDuration,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
          <div
            ref={dropdownRef}
            className={`${styles.dropdownMenu} ${styles[`${variant}Dropdown`]}`}
          >
            {dropdownItems.map((item, index) => (
              <div
                key={index}
                className={styles.dropdownItem}
                onClick={item.onClick}
                role="button"
                tabIndex={0}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
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
        style={{
          '--border-radius': borderRadius,
          '--animation-duration': animationDuration,
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
        className={buttonClass}
        onClick={onClick}
        style={{
          '--border-radius': borderRadius,
          '--animation-duration': animationDuration,
        }}
      >
        {buttonContent}
      </Link>
    );
  }

  // If button
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      style={{
        '--border-radius': borderRadius,
        '--animation-duration': animationDuration,
      }}
    >
      {buttonContent}
    </button>
  );
};

export default AnimatedBorderButton;
