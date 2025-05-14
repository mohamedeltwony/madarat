import React from 'react';
import styles from './PureDivGoldButton.module.css';

const PureDivGoldButton = ({
  text,
  onClick,
  className = '',
  disabled = false,
}) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && onClick) {
        onClick(e);
      }
    }
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`${styles.pureDivGoldButton} ${disabled ? styles.disabled : ''} ${className}`}
      onClick={disabled ? undefined : onClick}
      onKeyPress={handleKeyPress}
      aria-disabled={disabled}
    >
      {text}
    </div>
  );
};

export default PureDivGoldButton;
