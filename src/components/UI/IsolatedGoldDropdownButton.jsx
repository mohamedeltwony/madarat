import React, { useRef, useEffect, useState } from 'react';
import { FaPhoneAlt, FaUserTie, FaCommentDots } from 'react-icons/fa';

const IsolatedGoldDropdownButton = ({
  text = 'زر منسدل معزول',
  width = 200,
  height = 50,
}) => {
  const iframeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Default dropdown items
  const dropdownItems = [
    {
      text: 'إتصل في مستشارك',
      href: 'tel:+966123456789',
      icon: <FaPhoneAlt style={{ color: '#ffd700' }} />,
    },
    {
      text: 'للحجز سجل رقمك',
      href: '/booking',
      icon: <FaUserTie style={{ color: '#ffd700' }} />,
    },
    {
      text: 'شكوى أو ملاحظات',
      href: '/feedback',
      icon: <FaCommentDots style={{ color: '#ffd700' }} />,
    },
  ];

  // This HTML will be inserted into the iframe
  const buttonHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          
          body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: transparent;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          
          .button-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            overflow: hidden;
            border-radius: 25px;
          }
          
          .gold-border {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00);
            background-size: 300% 300%;
            animation: borderGlow 6s linear infinite;
            z-index: 1;
            border-radius: 25px;
          }
          
          .inner-background {
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: 23px;
            z-index: 2;
            transition: background-color 0.3s ease;
          }
          
          .button-container:hover .inner-background {
            background-color: rgba(0, 0, 0, 0.4);
          }
          
          .button-text {
            position: relative;
            z-index: 3;
            color: white;
            font-weight: bold;
            font-size: 16px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            font-family: 'Arial', sans-serif;
            text-align: center;
          }
          
          @keyframes borderGlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        </style>
      </head>
      <body>
        <div class="button-container" id="goldButton">
          <div class="gold-border"></div>
          <div class="inner-background"></div>
          <div class="button-text">${text}</div>
        </div>
        
        <script>
          document.getElementById('goldButton').addEventListener('click', function() {
            window.parent.postMessage('toggleDropdown', '*');
          });
        </script>
      </body>
    </html>
  `;

  useEffect(() => {
    if (iframeRef.current) {
      // Write the HTML content to the iframe
      const iframe = iframeRef.current;
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;

      iframeDocument.open();
      iframeDocument.write(buttonHTML);
      iframeDocument.close();

      // Add message listener for iframe communication
      const handleMessage = (event) => {
        if (event.data === 'toggleDropdown') {
          setIsOpen(!isOpen);
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [buttonHTML, isOpen]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        iframeRef.current &&
        !iframeRef.current.contains(event.target) &&
        !event.target.closest('.isolated-dropdown-menu')
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
        style={{
          width: width,
          height: height,
          border: 'none',
          overflow: 'hidden',
          background: 'transparent',
          backgroundColor: 'transparent',
          pointerEvents: 'auto',
        }}
        title="Gold Dropdown Button"
        scrolling="no"
        frameBorder="0"
      />

      {isOpen && (
        <div
          className="isolated-dropdown-menu"
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
                borderBottom:
                  index < dropdownItems.length - 1
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : 'none',
              }}
            >
              <div style={{ marginLeft: '12px' }}>{item.icon}</div>
              <span>{item.text}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default IsolatedGoldDropdownButton;
