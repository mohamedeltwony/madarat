import React from 'react';

const PureButton = ({ children, onClick, style = {}, ...props }) => {
  // Define base button styles that override any potential global styles
  const baseButtonStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem 1.5rem',
    border: 'none',
    outline: 'none',
    borderRadius: '30px',
    fontFamily: 'Cairo, sans-serif',
    fontWeight: 600,
    fontSize: '1rem',
    color: 'white',
    cursor: 'pointer',
    overflow: 'hidden',
    // Force background to be transparent
    background: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    // Reset appearance properties
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    ...style,
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      <button onClick={onClick} style={baseButtonStyle} {...props}>
        {/* Button text */}
        <span
          style={{
            position: 'relative',
            zIndex: 3,
          }}
        >
          {children}
        </span>

        {/* Border container */}
        <div
          style={{
            position: 'absolute',
            top: '-2px',
            left: '-2px',
            right: '-2px',
            bottom: '-2px',
            borderRadius: '32px',
            zIndex: -1,
            overflow: 'hidden',
          }}
        >
          {/* Animated golden border */}
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
              animation: 'borderAnimation 6s linear infinite',
            }}
          />

          {/* Dark inner background */}
          <div
            style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              right: '2px',
              bottom: '2px',
              borderRadius: '28px',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              zIndex: 0,
            }}
          />
        </div>
      </button>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes borderAnimation {
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

export default PureButton;
