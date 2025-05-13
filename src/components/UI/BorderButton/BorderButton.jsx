import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';

const BorderButton = ({ text = 'تواصل مع مستشارك السياحي' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Core container style
  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
  };

  // Button style with NO background
  const buttonStyle = {
    position: 'relative',
    padding: '0.75rem 1.5rem',
    border: 'none',
    borderRadius: '30px',
    fontFamily: 'Cairo, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'white',
    background: 'transparent !important',
    backgroundColor: 'transparent !important',
    boxShadow: 'none',
    cursor: 'pointer',
    overflow: 'hidden',
    zIndex: 1,
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
  };

  // Button text style
  const textStyle = {
    position: 'relative',
    zIndex: 3,
  };

  // Border container style
  const borderContainerStyle = {
    position: 'absolute',
    top: '-2px',
    left: '-2px',
    right: '-2px',
    bottom: '-2px',
    borderRadius: '32px',
    zIndex: -1,
    overflow: 'hidden',
  };

  // Animated border style
  const animatedBorderStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background:
      'linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00)',
    backgroundSize: '300% 300%',
    animation: 'borderGlow 6s linear infinite',
  };

  // Inner background style
  const innerBackgroundStyle = {
    position: 'absolute',
    top: '2px',
    left: '2px',
    right: '2px',
    bottom: '2px',
    borderRadius: '28px',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 0,
  };

  // Dropdown style
  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 15px)',
    right: 0,
    minWidth: '220px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderRadius: '15px',
    overflow: 'hidden',
    zIndex: 100,
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  // Dropdown item style
  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 15px',
    color: 'white',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  // Last item without border
  const lastItemStyle = {
    ...itemStyle,
    borderBottom: 'none',
  };

  // Icon wrapper style
  const iconWrapperStyle = {
    marginLeft: '12px',
  };

  // Icon color style
  const iconStyle = {
    color: '#ffd700',
  };

  return (
    <div style={containerStyle}>
      <button ref={buttonRef} onClick={toggleDropdown} style={buttonStyle}>
        <span style={textStyle}>{text}</span>

        <div style={borderContainerStyle}>
          <div style={animatedBorderStyle}></div>
          <div style={innerBackgroundStyle}></div>
        </div>
      </button>

      {isOpen && (
        <div style={dropdownStyle}>
          <a href="tel:+966123456789" style={itemStyle}>
            <div style={iconWrapperStyle}>
              <FaPhoneAlt style={iconStyle} />
            </div>
            <span>إتصل في مستشارك</span>
          </a>
          <a href="/booking" style={itemStyle}>
            <div style={iconWrapperStyle}>
              <FaUserTie style={iconStyle} />
            </div>
            <span>للحجز سجل رقمك</span>
          </a>
          <a href="/feedback" style={lastItemStyle}>
            <div style={iconWrapperStyle}>
              <FaCommentDots style={iconStyle} />
            </div>
            <span>شكوى أو ملاحظات</span>
          </a>
        </div>
      )}

      <style jsx>{`
        @keyframes borderGlow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default BorderButton;
