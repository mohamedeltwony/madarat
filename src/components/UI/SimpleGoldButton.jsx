import React from 'react';
import styles from './SimpleGoldButton.module.css';

const SimpleGoldButton = ({
  text,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      className={`${styles.simpleGoldButton} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default SimpleGoldButton;
