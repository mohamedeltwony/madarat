import React, { useState, useRef, useEffect } from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';

const PureDivGoldDropdownButton = ({
  text = 'زر ذهبي منسدل',
  width = 200,
  height = 50,
  items = null,
}) => {
  const buttonRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Default dropdown items if not provided
  const dropdownItems = items || [
    {
      text: 'إتصل في مستشارك',
      href: 'tel:+966123456789',
      icon: <FaPhoneAlt style={{ color: '#ffd700' }} />,
    },
    {
      text: 'للحجز سجل رقمك',
      href: '/booking',
      icon: <FaUserTie style={{ color: '#ffd700' }} />,
    },
    {
      text: 'شكوى أو ملاحظات',
      href: '/feedback',
      icon: <FaCommentDots style={{ color: '#ffd700' }} />,
    },
  ];

  // Handle events
  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Handle outside clicks to close dropdown
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={buttonRef}
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* Button */}
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          display: 'inline-block',
          width,
          height,
          cursor: 'pointer',
          overflow: 'hidden',
          borderRadius: height / 2,
        }}
      >
        {/* Gold animated border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: height / 2,
            backgroundImage:
              'linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00)',
            backgroundSize: '300% 300%',
            animation: 'pureDivDropdownGlow 6s linear infinite',
            zIndex: 0,
          }}
        />

        {/* Dark inner background */}
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 2,
            right: 2,
            bottom: 2,
            borderRadius: height / 2 - 1,
            backgroundColor: isHovered
              ? 'rgba(0, 0, 0, 0.4)'
              : 'rgba(0, 0, 0, 0.7)',
            zIndex: 1,
            transition: 'background-color 0.3s ease',
          }}
        />

        {/* Button text */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            zIndex: 2,
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {text}
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          style={{
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
          }}
        >
          {dropdownItems.map((item, index) => (
            <a
              key={index}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 15px',
                color: 'white',
                textDecoration: 'none',
                borderBottom:
                  index < dropdownItems.length - 1
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : 'none',
              }}
            >
              <div style={{ marginLeft: '12px' }}>{item.icon}</div>
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      )}

      {/* CSS animation in a style tag */}
      <style>{`
        @keyframes pureDivDropdownGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default PureDivGoldDropdownButton;
