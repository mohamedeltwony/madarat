import React, { useState } from 'react';

const FinalButton = ({
  text = 'زر ذهبي',
  onClick,
  width = 200,
  height = 50,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Calculate button size based on text
  const buttonWidth = Math.max(text.length * 12 + 40, width);

  // Handle events
  const handleClick = () => {
    if (onClick) onClick();
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: buttonWidth,
        height: height,
        cursor: 'pointer',
        overflow: 'hidden',
        fontFamily: 'Cairo, sans-serif',
        borderRadius: height / 2,
        backgroundColor: 'transparent !important',
        backgroundImage: 'none !important',
        background: 'none !important',
      }}
    >
      {/* Gold border */}
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
          animation: 'finalButtonGlow 6s linear infinite',
          backgroundColor: 'transparent !important',
          backgroundOrigin: 'border-box',
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
        }}
      >
        {text}
      </div>

      {/* CSS animation in a style tag */}
      <style>{`
        @keyframes finalButtonGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default FinalButton;
