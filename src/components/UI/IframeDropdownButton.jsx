import React, { useRef, useEffect, useState } from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';

const IframeDropdownButton = ({ 
  text = "زر الإطار مع قائمة", 
  width = 200,
  height = 50
}) => {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Dropdown items
  const dropdownItems = [
    {
      text: "إتصل في مستشارك",
      href: "tel:+966123456789",
      icon: <FaPhoneAlt style={{ color: '#ffd700' }} />
    },
    {
      text: "للحجز سجل رقمك",
      href: "/booking",
      icon: <FaUserTie style={{ color: '#ffd700' }} />
    },
    {
      text: "شكوى أو ملاحظات",
      href: "/feedback",
      icon: <FaCommentDots style={{ color: '#ffd700' }} />
    }
  ];
  
  // Handle iframe load event
  const handleIframeLoad = () => {
    setIframeLoaded(true);
  };
  
  // Apply content to iframe once it's loaded
  useEffect(() => {
    if (!iframeLoaded || !iframeRef.current) return;
    
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    // Create completely isolated HTML with its own styles
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              overflow: hidden;
              width: 100%;
              height: 100%;
              background-color: transparent;
            }
            
            @keyframes borderGlow {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            
            .button-container {
              position: relative;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              background-color: transparent;
            }
            
            .button-border {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              border-radius: 25px;
              background: linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00);
              background-size: 300% 300%;
              animation: borderGlow 6s linear infinite;
            }
            
            .button-inner {
              position: absolute;
              top: 2px;
              left: 2px;
              right: 2px;
              bottom: 2px;
              border-radius: 23px;
              background-color: rgba(0, 0, 0, 0.5);
            }
            
            .button-text {
              position: relative;
              z-index: 2;
              font-family: 'Cairo', Arial, sans-serif;
              font-weight: bold;
              font-size: 16px;
              color: white;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              user-select: none;
            }
            
            .button-container:hover .button-inner {
              background-color: rgba(0, 0, 0, 0.4);
            }
          </style>
          
          <!-- Optional: Add Cairo font with a fallback to traditional Arabic font -->
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600&display=swap" rel="stylesheet">
        </head>
        <body>
          <div class="button-container" id="buttonContainer">
            <div class="button-border"></div>
            <div class="button-inner"></div>
            <div class="button-text">${text}</div>
          </div>
          
          <script>
            document.getElementById('buttonContainer').addEventListener('click', function() {
              // Send message to parent
              window.parent.postMessage('toggleDropdown', '*');
            });
          </script>
        </body>
      </html>
    `;
    
    // Write content to iframe
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
    
  }, [iframeLoaded, text]);
  
  // Toggle dropdown when button is clicked
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'toggleDropdown') {
        setIsOpen(!isOpen);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event) => {
      const iframe = iframeRef.current;
      if (
        isOpen &&
        iframe &&
        event.target !== iframe &&
        !event.target.closest('.dropdown-menu')
      ) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
  
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <iframe
        ref={iframeRef}
        onLoad={handleIframeLoad}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        allowTransparency="true"
        style={{
          backgroundColor: 'transparent',
          background: 'transparent',
          border: 'none',
          overflow: 'hidden'
        }}
        title="Button iframe"
      />
      
      {/* Dropdown menu */}
      {isOpen && (
        <div
          className="dropdown-menu"
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
            border: '1px solid rgba(255, 255, 255, 0.1)'
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
            >
              <div style={{ marginLeft: '12px' }}>
                {item.icon}
              </div>
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default IframeDropdownButton; 