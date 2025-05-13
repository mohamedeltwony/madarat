import React, { useState, useEffect, useRef } from 'react';

const SVGButton = ({ text = 'زر SVG', onClick }) => {
  // Generate a unique ID for the gradient and animation
  const uniqueId = useRef(
    `svg-button-${Math.random().toString(36).substr(2, 9)}`
  );
  const [isHovered, setIsHovered] = useState(false);

  // Handle click
  const handleClick = () => {
    if (onClick) onClick();
  };

  // Handle hover states
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Calculate width based on text length (approximation)
  const buttonWidth = Math.max(text.length * 12 + 40, 140);

  return (
    <div
      style={{
        display: 'inline-block',
        cursor: 'pointer',
        margin: 0,
        padding: 0,
        background: 'none',
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <svg
        width={buttonWidth}
        height="50"
        viewBox={`0 0 ${buttonWidth} 50`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold gradient for border */}
          <linearGradient
            id={`${uniqueId.current}-gradient`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#ffd700">
              <animate
                attributeName="offset"
                values="0;0.25;0.5;0.75;1;0.75;0.5;0.25;0"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="25%" stopColor="#ffea00">
              <animate
                attributeName="offset"
                values="0.25;0.5;0.75;1;0.75;0.5;0.25;0;0.25"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#e6c200">
              <animate
                attributeName="offset"
                values="0.5;0.75;1;0.75;0.5;0.25;0;0.25;0.5"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="75%" stopColor="#ffd700">
              <animate
                attributeName="offset"
                values="0.75;1;0.75;0.5;0.25;0;0.25;0.5;0.75"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#ffea00">
              <animate
                attributeName="offset"
                values="1;0.75;0.5;0.25;0;0.25;0.5;0.75;1"
                dur="6s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          {/* Text shadow filter */}
          <filter
            id={`${uniqueId.current}-shadow`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* Outer border with gradient animation */}
        <rect
          x="2"
          y="2"
          width={buttonWidth - 4}
          height="46"
          rx="23"
          fill={`url(#${uniqueId.current}-gradient)`}
        />

        {/* Inner background (semi-transparent black) */}
        <rect
          x="4"
          y="4"
          width={buttonWidth - 8}
          height="42"
          rx="21"
          fill="rgba(0, 0, 0, 0.5)"
        />

        {/* Text element */}
        <text
          x={buttonWidth / 2}
          y="29"
          fontFamily="Cairo, sans-serif"
          fontSize="16"
          fontWeight="600"
          fill="white"
          textAnchor="middle"
          dominantBaseline="middle"
          filter={`url(#${uniqueId.current}-shadow)`}
        >
          {text}
        </text>

        {/* Hover overlay */}
        {isHovered && (
          <rect
            x="4"
            y="4"
            width={buttonWidth - 8}
            height="42"
            rx="21"
            fill="rgba(255, 255, 255, 0.1)"
            opacity="0.5"
          />
        )}
      </svg>
    </div>
  );
};

export default SVGButton;
