import React, { useState } from 'react';

const PureDivGoldButton = ({
  text = 'زر ذهبي',
  onClick,
  href = null,
  width = 200,
  height = 50,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Handle click
  const handleClick = (e) => {
    if (href) {
      // If href is provided, navigate to it
      window.location.href = href;
    } else if (onClick) {
      // Otherwise, call the onClick callback
      onClick(e);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        width,
        height,
        overflow: 'hidden',
      }}
    >
      {/* Clickable area */}
      <div
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          borderRadius: height / 2,
          overflow: 'hidden',
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
            animation: 'pureDivGlow 6s linear infinite',
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
            transition: 'background-color 0.3s ease',
            zIndex: 1,
          }}
        />

        {/* Text content */}
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
            fontFamily: 'Arial, sans-serif',
            zIndex: 2,
          }}
        >
          {text}
        </div>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes pureDivGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default PureDivGoldButton;
