import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';
import Link from 'next/link';

const IsolatedButton = ({ text = 'تواصل معنا', onClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const toggleDropdown = () => {
    if (onClick) {
      onClick();
    } else {
      setIsOpen(!isOpen);
    }
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

  // Add keyframes for animation
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'isolated-button-style';

    // Only add if not already present
    if (!document.getElementById('isolated-button-style')) {
      style.textContent = `
        @keyframes isolatedButtonGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (document.getElementById('isolated-button-style')) {
        document.head.removeChild(
          document.getElementById('isolated-button-style')
        );
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        margin: 0,
        padding: 0,
        background: 'none',
      }}
    >
      {/* Custom button element to avoid inherited styles */}
      <div
        ref={buttonRef}
        onClick={toggleDropdown}
        role="button"
        tabIndex={0}
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '12px 24px',
          margin: 0,
          border: 'none',
          outline: 'none',
          borderRadius: '30px',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          color: 'white',
          backgroundColor: 'transparent',
          background: 'none',
          backgroundImage: 'none',
          boxShadow: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
          zIndex: 1,
          textAlign: 'center',
          userSelect: 'none',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            toggleDropdown();
          }
        }}
      >
        {/* Text layer */}
        <span
          style={{
            position: 'relative',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        >
          {text}
        </span>

        {/* Border container */}
        <div
          style={{
            position: 'absolute',
            top: -2,
            left: -2,
            right: -2,
            bottom: -2,
            borderRadius: '32px',
            padding: 0,
            margin: 0,
            zIndex: -1,
            overflow: 'hidden',
          }}
        >
          {/* Animated gold border */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00)',
              backgroundSize: '300% 300%',
              animation: 'isolatedButtonGlow 6s linear infinite',
              padding: 0,
              margin: 0,
            }}
          />

          {/* Inner background */}
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              right: 2,
              bottom: 2,
              borderRadius: '28px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 0,
            }}
          />
        </div>
      </div>

      {/* Dropdown menu */}
      {isOpen && !onClick && (
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
          <a
            href="tel:+966123456789"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 15px',
              color: 'white',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ marginLeft: '12px' }}>
              <FaPhoneAlt style={{ color: '#ffd700' }} />
            </div>
            <span>إتصل في مستشارك</span>
          </a>

          <Link
            href="/booking"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 15px',
              color: 'white',
              textDecoration: 'none',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ marginLeft: '12px' }}>
              <FaUserTie style={{ color: '#ffd700' }} />
            </div>
            <span>للحجز سجل رقمك</span>
          </Link>

          <Link
            href="/feedback"
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 15px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            <div style={{ marginLeft: '12px' }}>
              <FaCommentDots style={{ color: '#ffd700' }} />
            </div>
            <span>شكوى أو ملاحظات</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default IsolatedButton;
