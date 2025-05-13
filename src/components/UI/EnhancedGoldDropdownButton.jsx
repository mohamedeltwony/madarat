import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import styles from './EnhancedGoldButton.module.css';

const EnhancedGoldDropdownButton = ({
  text,
  items = [],
  className = '',
  icon = null,
  ariaLabel = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <button
        className={styles.enhancedGoldButton}
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={ariaLabel || text}
      >
        <span>{text}</span>
        {icon && <span className={styles.buttonIcon}>{icon}</span>}
      </button>

      {isOpen && (
        <div className={styles.dropdownContent}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.type === 'divider' ? (
                <div className={styles.dropdownDivider} />
              ) : item.href ? (
                item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.dropdownItem}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.text}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={styles.dropdownItem}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.text}
                  </Link>
                )
              ) : (
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsOpen(false);
                  }}
                >
                  {item.text}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedGoldDropdownButton;
