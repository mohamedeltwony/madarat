import React, { useState, useEffect, useRef } from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';

const BorderButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && buttonRef.current && !buttonRef.current.contains(event.target)) {
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
    style.innerHTML = `
      @keyframes borderGlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button 
        ref={buttonRef}
        onClick={toggleDropdown}
        style={{
          position: 'relative',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: '30px',
          fontFamily: 'Cairo, sans-serif',
          fontWeight: 600,
          fontSize: '1rem',
          color: 'white',
          background: 'transparent',
          boxShadow: 'none',
          cursor: 'pointer',
          overflow: 'hidden',
          zIndex: 1
        }}
      >
        <span style={{ position: 'relative', zIndex: 3 }}>
          تواصل مع مستشارك السياحي
        </span>
        
        <div style={{
          position: 'absolute',
          top: '-2px',
          left: '-2px',
          right: '-2px',
          bottom: '-2px',
          borderRadius: '32px',
          zIndex: -1,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00)',
            backgroundSize: '300% 300%',
            animation: 'borderGlow 6s linear infinite'
          }}></div>
          
          <div style={{
            position: 'absolute',
            top: '2px',
            left: '2px',
            right: '2px',
            bottom: '2px',
            borderRadius: '28px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 0
          }}></div>
        </div>
      </button>
      
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 15px)',
          right: 0,
          minWidth: '220px',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          zIndex: 100,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <a href="tel:+966123456789" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 15px',
            color: 'white',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ marginLeft: '12px' }}>
              <FaPhoneAlt style={{ color: '#ffd700' }} />
            </div>
            <span>إتصل في مستشارك</span>
          </a>
          <a href="/booking" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 15px',
            color: 'white',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ marginLeft: '12px' }}>
              <FaUserTie style={{ color: '#ffd700' }} />
            </div>
            <span>للحجز سجل رقمك</span>
          </a>
          <a href="/feedback" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 15px',
            color: 'white',
            textDecoration: 'none'
          }}>
            <div style={{ marginLeft: '12px' }}>
              <FaCommentDots style={{ color: '#ffd700' }} />
            </div>
            <span>شكوى أو ملاحظات</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default BorderButton; 