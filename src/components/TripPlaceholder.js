import React from 'react';

/**
 * SVG placeholder component for trips when no image is available
 * Can be exported as a static file or used inline
 */
const TripPlaceholder = ({ width = 1200, height = 800, text = "مدارات الكون" }) => {
  // Generate a subtle pattern
  const patternId = `trip-pattern-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern 
          id={patternId} 
          patternUnits="userSpaceOnUse" 
          width="60" 
          height="60" 
          patternTransform="rotate(45)"
        >
          <path 
            d="M0 0h60v60H0z" 
            fill="#f0f4f8" 
          />
          <path 
            d="M30 10v50M10 30h50" 
            stroke="#e1e8ed" 
            strokeWidth="2"
          />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect width={width} height={height} fill={`url(#${patternId})`} />
      
      {/* Dark overlay */}
      <rect 
        width={width} 
        height={height} 
        fill="#2c5282" 
        fillOpacity="0.85"
      />
      
      {/* Header text */}
      <text 
        x="50%" 
        y="45%" 
        fontFamily="Arial, sans-serif" 
        fontSize="48"
        fontWeight="bold"
        fill="#ffffff" 
        textAnchor="middle"
      >
        {text}
      </text>
      
      {/* Tagline */}
      <text 
        x="50%" 
        y="55%" 
        fontFamily="Arial, sans-serif" 
        fontSize="24"
        fill="#ffffff" 
        textAnchor="middle"
        opacity="0.8"
      >
        رحلة سياحية
      </text>
      
      {/* Simple icons suggesting travel */}
      <g fill="#ffffff" opacity="0.3">
        <path d="M300,650 l50,-30 l50,30 l-20,-40 l40,-20 h-45 l-25,-45 l-25,45 h-45 l40,20 z" />
        <path d="M900,650 l50,-30 l50,30 l-20,-40 l40,-20 h-45 l-25,-45 l-25,45 h-45 l40,20 z" />
        <path d="M600,200 l50,-30 l50,30 l-20,-40 l40,-20 h-45 l-25,-45 l-25,45 h-45 l40,20 z" />
      </g>
    </svg>
  );
};

export default TripPlaceholder;

// Helper to get a data URL version for use in img tags
export const getTripPlaceholderDataUrl = (width = 1200, height = 800) => {
  if (typeof window === 'undefined') return '';
  
  const svgElement = document.createElement('div');
  svgElement.innerHTML = ReactDOMServer.renderToString(
    <TripPlaceholder width={width} height={height} />
  );
  
  const svgString = svgElement.innerHTML;
  const encoded = encodeURIComponent(svgString)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  
  return `data:image/svg+xml;charset=utf-8,${encoded}`;
}; 