import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';
import Link from 'next/link';

const GoldenButton = ({ text = 'تواصل مع مستشارك السياحي' }) => {
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

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        style={{
          position: 'relative',
          padding: '0.75rem 1.5rem',
          border: 'none',
          outline: 'none',
          borderRadius: '30px',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          color: 'white',
          backgroundColor: 'transparent',
          background: 'transparent',
          boxShadow: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
          zIndex: 1,
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
        }}
      >
        {/* Button text */}
        <span
          style={{
            position: 'relative',
            zIndex: 3,
          }}
        >
          {text}
        </span>

        {/* Border container */}
        <div
          style={{
            position: 'absolute',
            inset: '-2px',
            borderRadius: '32px',
            zIndex: -1,
            overflow: 'hidden',
          }}
        >
          {/* Animated golden border */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00)',
              backgroundSize: '300% 300%',
              animation: 'goldenGlow 6s linear infinite',
            }}
          />

          {/* Dark inner background */}
          <div
            style={{
              position: 'absolute',
              inset: '2px',
              borderRadius: '28px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 0,
            }}
          />
        </div>
      </button>

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
          {/* Call option */}
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

          {/* Booking option */}
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

          {/* Feedback option */}
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

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes goldenGlow {
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

export default GoldenButton;
