import React, { useEffect, useRef } from 'react';

const CSSFreeButton = ({ text = "زر بدون CSS", onClick }) => {
  // Button container ref
  const containerRef = useRef(null);
  
  // Add keyframes for animation
  useEffect(() => {
    // Check if style element already exists
    if (!document.getElementById('css-free-button-style')) {
      // Create style element
      const style = document.createElement('style');
      style.id = 'css-free-button-style';
      style.innerHTML = `
        @keyframes cssFreeButtonGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `;
      // Append style to document head
      document.head.appendChild(style);
      
      // Clean up
      return () => {
        const existingStyle = document.getElementById('css-free-button-style');
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      onClick={onClick}
      style={{
        position: 'relative',
        display: 'inline-block',
        padding: 0,
        margin: 0,
        border: 'none',
        background: 'none',
        backgroundColor: 'transparent',
        cursor: 'pointer'
      }}
    >
      {/* Parent container with no styling */}
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '12px 24px',
          borderRadius: '30px',
          cursor: 'pointer',
          background: 'transparent',
          backgroundColor: 'transparent'
        }}
      >
        {/* Text content */}
        <span
          style={{
            position: 'relative',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '16px',
            fontWeight: 600,
            color: 'white',
            zIndex: 3
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
            zIndex: 0,
            overflow: 'hidden'
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
              background: 'linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00)',
              backgroundSize: '300% 300%',
              animation: 'cssFreeButtonGlow 6s linear infinite'
            }}
          />
          
          {/* Dark inner background with low opacity */}
          <div
            style={{
              position: 'absolute',
              top: 2,
              left: 2,
              right: 2,
              bottom: 2,
              borderRadius: '28px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CSSFreeButton; 