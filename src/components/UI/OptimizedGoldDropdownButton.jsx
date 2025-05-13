import React, { useRef, useEffect, useState } from 'react';

const OptimizedGoldDropdownButton = ({
  text = 'زر منسدل ذهبي',
  width = 200,
  height = 50,
  dropdownItems = [
    { text: 'خيار رقم ١', href: '#option1' },
    { text: 'خيار رقم ٢', href: '#option2' },
    { text: 'خيار رقم ٣', href: '#option3' },
  ],
}) => {
  const iframeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Generate items HTML for the dropdown
  const dropdownItemsHtml = dropdownItems
    .map((item, index) => {
      return `
      <a href="${item.href || '#'}" 
        target="${item.target || '_self'}" 
        class="dropdown-item" 
        data-index="${index}">
        ${
          item.icon
            ? `<span class="item-icon">${
                typeof item.icon === 'object' ? 'Icon' : item.icon
              }</span>`
            : ''
        }
        <span class="item-text">${item.text}</span>
      </a>
    `;
    })
    .join('');

  // This HTML will be inserted into the iframe with specific CSS reset
  const buttonHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* CSS Reset to prevent inheritance */
          html, body, div, span, a, button, ul, li {
            margin: 0;
            padding: 0;
            border: 0;
            font-size: 100%;
            font: inherit;
            vertical-align: baseline;
            box-sizing: border-box;
            background: transparent;
          }
          
          body, html {
            width: 100%;
            height: 100%;
            overflow: visible;
            background-color: transparent !important;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          
          .dropdown-container {
            position: relative;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .button-container {
            position: relative;
            width: 100%;
            height: ${height}px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            overflow: hidden;
            border-radius: ${height / 2}px;
            background-color: transparent !important;
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
            border-radius: ${height / 2}px;
          }
          
          .inner-background {
            position: absolute;
            top: 2px;
            left: 2px;
            right: 2px;
            bottom: 2px;
            background-color: #000000 !important;
            border-radius: ${height / 2 - 2}px;
            z-index: 2;
            transition: background-color 0.3s ease;
          }
          
          .button-container:hover .inner-background {
            background-color: #1a1a1a !important;
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
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .dropdown-arrow {
            margin-right: 8px;
            transition: transform 0.3s ease;
          }
          
          .dropdown-arrow.open {
            transform: rotate(180deg);
          }
          
          .dropdown-menu {
            position: absolute;
            top: calc(100% + 5px);
            left: 0;
            width: 100%;
            max-height: 0;
            overflow: hidden;
            background: #111111;
            border-radius: 10px;
            border: 2px solid #ffd700;
            z-index: 10;
            transition: max-height 0.3s ease, opacity 0.3s ease;
            opacity: 0;
            display: flex;
            flex-direction: column;
            padding: 0;
          }
          
          .dropdown-menu.open {
            max-height: 300px;
            opacity: 1;
            padding: 8px 0;
          }
          
          .dropdown-item {
            display: flex;
            align-items: center;
            padding: 10px 15px;
            color: white;
            text-decoration: none;
            transition: background-color 0.2s ease;
          }
          
          .dropdown-item:hover {
            background-color: #222222;
          }
          
          .item-icon {
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .item-text {
            flex: 1;
            text-align: right;
          }
          
          @keyframes borderGlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        </style>
      </head>
      <body>
        <div class="dropdown-container">
          <div class="button-container" id="goldButton">
            <div class="gold-border"></div>
            <div class="inner-background"></div>
            <div class="button-text">
              ${text}
              <span class="dropdown-arrow" id="arrow">▼</span>
            </div>
          </div>
          
          <div class="dropdown-menu" id="dropdownMenu">
            ${dropdownItemsHtml}
          </div>
        </div>
        
        <script>
          const button = document.getElementById('goldButton');
          const menu = document.getElementById('dropdownMenu');
          const arrow = document.getElementById('arrow');
          let isOpen = false;
          
          function toggleDropdown() {
            isOpen = !isOpen;
            if (isOpen) {
              menu.classList.add('open');
              arrow.classList.add('open');
            } else {
              menu.classList.remove('open');
              arrow.classList.remove('open');
            }
            
            // Send current state to parent
            window.parent.postMessage({ type: 'dropdownStateChange', isOpen }, '*');
          }
          
          button.addEventListener('click', function(e) {
            e.preventDefault();
            toggleDropdown();
          });
          
          // Handle clicks on dropdown items
          const items = document.querySelectorAll('.dropdown-item');
          items.forEach(item => {
            item.addEventListener('click', function() {
              const index = this.getAttribute('data-index');
              window.parent.postMessage({ 
                type: 'dropdownItemClicked', 
                index: Number(index) 
              }, '*');
              // Optionally close the dropdown after selection
              // toggleDropdown();
            });
          });
          
          // Handle clicks outside of dropdown to close it
          document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown-container') && isOpen) {
              toggleDropdown();
            }
          });
          
          // Listen for messages from parent to control dropdown
          window.addEventListener('message', function(event) {
            if (event.data === 'closeDropdown' && isOpen) {
              toggleDropdown();
            } else if (event.data === 'openDropdown' && !isOpen) {
              toggleDropdown();
            }
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
        if (event.data?.type === 'dropdownStateChange') {
          setIsOpen(event.data.isOpen);
        } else if (event.data?.type === 'dropdownItemClicked') {
          const item = dropdownItems[event.data.index];
          if (item && item.onClick) {
            item.onClick();
          }
        }
      };

      window.addEventListener('message', handleMessage);

      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [buttonHTML, dropdownItems]);

  return (
    <iframe
      ref={iframeRef}
      style={{
        width,
        height: isOpen ? height + dropdownItems.length * 40 + 16 : height, // Adjust height dynamically
        border: 'none',
        overflow: 'visible',
        background: 'transparent',
        backgroundColor: 'transparent',
        pointerEvents: 'auto',
        transition: 'height 0.3s ease',
      }}
      title="Gold Dropdown Button"
      scrolling="no"
      frameBorder="0"
      allowTransparency="true"
    />
  );
};

export default OptimizedGoldDropdownButton;
