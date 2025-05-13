import React, { useRef, useEffect, useState, useCallback } from 'react';

const CanvasButton = ({ 
  text = "زر كانفاس", 
  onClick, 
  width = 200, 
  height = 50, 
  dropdownItems = null 
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const calculatedWidth = Math.max(text.length * 12 + 40, width);
  
  // Draw the button on canvas
  const drawButton = useCallback((ctx) => {
    if (!ctx) return;
    
    const w = calculatedWidth;
    const h = height;
    const time = Date.now() / 1000;
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);
    
    // Draw gold border with animation
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    
    // Animate gradient by shifting color stops
    const shift = (Math.sin(time) + 1) / 2; // Value between 0 and 1
    
    gradient.addColorStop((0 + shift) % 1, '#ffd700');
    gradient.addColorStop((0.25 + shift) % 1, '#ffea00');
    gradient.addColorStop((0.5 + shift) % 1, '#e6c200');
    gradient.addColorStop((0.75 + shift) % 1, '#ffd700');
    gradient.addColorStop((1 + shift) % 1, '#ffea00');
    
    // Draw outer rounded rectangle (border)
    ctx.fillStyle = gradient;
    roundRect(ctx, 0, 0, w, h, h/2, true);
    
    // Draw inner rounded rectangle (background)
    if (isHovered) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    }
    roundRect(ctx, 2, 2, w-4, h-4, h/2-1, true);
    
    // Draw text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Cairo, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Add text shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 2;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 1;
    
    ctx.fillText(text, w/2, h/2);
    
    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
  }, [calculatedWidth, height, isHovered, text]);
  
  // Helper function to draw rounded rectangles
  const roundRect = (ctx, x, y, width, height, radius, fill, stroke) => {
    if (typeof radius === 'undefined') {
      radius = 5;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
      ctx.fill();
    }
    if (stroke) {
      ctx.stroke();
    }
  };
  
  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      drawButton(ctx);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, [drawButton]);
  
  // Initialize and clean up animation
  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);
  
  // Handle click outside for dropdown
  useEffect(() => {
    if (!dropdownItems) return;
    
    const handleClickOutside = (event) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, dropdownItems]);
  
  // Handle events
  const handleClick = () => {
    if (dropdownItems) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };
  
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  
  return (
    <div 
      ref={containerRef}
      style={{ 
        position: 'relative',
        display: 'inline-block',
        fontSize: 0, // This prevents any text styling from affecting the container
        lineHeight: 0,
        background: 'none',
        backgroundColor: 'transparent'
      }}
    >
      <canvas
        ref={canvasRef}
        width={calculatedWidth}
        height={height}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ 
          cursor: 'pointer',
          display: 'block',
          margin: 0,
          padding: 0,
          background: 'none',
          backgroundColor: 'transparent'
        }}
      />
      
      {/* Dropdown menu */}
      {isOpen && dropdownItems && (
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
            fontSize: '16px',
            lineHeight: '1.5'
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
                borderBottom: index < dropdownItems.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
              }}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                  setIsOpen(false);
                }
              }}
            >
              {item.icon && (
                <div style={{ marginLeft: '12px', color: '#ffd700' }}>
                  {item.icon}
                </div>
              )}
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CanvasButton; 