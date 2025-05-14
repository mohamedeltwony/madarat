import React, { useState, useRef, useEffect } from 'react';
import styles from './OptimizedGoldDropdownButton.module.css';

const OptimizedGoldDropdownButton = ({
  text = 'زر منسدل ذهبي',
  width = 200,
  height = 50,
  dropdownItems = [
    { text: 'خيار رقم ١', href: '#option1' },
    { text: 'خيار رقم ٢', href: '#option2' },
    { text: 'خيار رقم ٣', href: '#option3' },
  ],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={styles.dropdownContainer} 
      ref={dropdownRef}
      style={{ width: `${width}px` }}
    >
      <button
        type="button"
        className={styles.dropdownButton}
        onClick={handleToggle}
        style={{ height: `${height}px` }}
      >
        {text}
        <span className={`${styles.arrow} ${isOpen ? styles.up : ''}`}>▼</span>
      </button>
      {isOpen && (
        <ul className={styles.dropdownMenu} role="menu">
          {dropdownItems.map((item, index) => (
            <li key={index} role="menuitem">
              <a
                href={item.href}
                target={item.target}
                className={styles.dropdownItem}
                onClick={item.onClick}
              >
                {item.icon && (
                  <span className={styles.itemIcon}>
                    {typeof item.icon === 'object' ? 'Icon' : item.icon}
                  </span>
                )}
                <span className={styles.itemText}>{item.text}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OptimizedGoldDropdownButton;
