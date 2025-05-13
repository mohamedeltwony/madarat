import React, { useRef, useEffect } from 'react';

const PureBlackGoldButton = ({ 
  text = "زر ذهبي", 
  onClick,
  href = null,
  target = "_self",
  width = 200,
  height = 50
}) => {
  const iframeRef = useRef(null);
  
  // This HTML will be inserted into the iframe - using absolutely no transparency
  const buttonHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          /* Complete CSS Reset */
          * {
            margin: 0;
            padding: 0;
            border: 0;
            outline: 0;
            font-size: 100%;
            vertical-align: baseline;
            background: transparent;
            box-sizing: border-box;
          }
          
          body, html {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background-color: transparent !important;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
          }
          
          .button-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            background-color: transparent !important;
          }
          
          .button-container {
            position: relative;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: ${height / 2}px;
            overflow: hidden;
          }
          
          /* Black background with gold border */
          .button-bg {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #000000;
            border: 2px solid #ffd700;
            border-radius: ${height / 2}px;
            z-index: 1;
          }
          
          /* Gold glow effect */
          .gold-glow {
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: ${height / 2}px;
            background: linear-gradient(45deg, #ffd700, #ffea00, #e6c200, #ffd700, #ffea00);
            background-size: 300% 300%;
            animation: borderGlow 6s linear infinite;
            z-index: 0;
            opacity: 0.8;
            filter: blur(4px);
          }
          
          .button-container:hover .button-bg {
            background-color: #111111;
          }
          
          .button-container:hover .gold-glow {
            opacity: 1;
            filter: blur(6px);
          }
          
          .button-text {
            position: relative;
            z-index: 2;
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
        <div class="button-wrapper">
          ${href 
            ? `<a href="${href}" target="${target}" class="button-container" id="goldButton">
                <div class="gold-glow"></div>
                <div class="button-bg"></div>
                <div class="button-text">${text}</div>
              </a>` 
            : `<div class="button-container" id="goldButton">
                <div class="gold-glow"></div>
                <div class="button-bg"></div>
                <div class="button-text">${text}</div>
              </div>`
          }
        </div>
        
        <script>
          document.getElementById('goldButton').addEventListener('click', function(e) {
            if (!${!!href}) {
              e.preventDefault();
              window.parent.postMessage('buttonClicked', '*');
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
      const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
      
      iframeDocument.open();
      iframeDocument.write(buttonHTML);
      iframeDocument.close();
      
      // Add message listener for iframe communication (for onClick functionality)
      const handleMessage = (event) => {
        if (event.data === 'buttonClicked' && onClick) {
          onClick();
        }
      };
      
      window.addEventListener('message', handleMessage);
      
      return () => {
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [buttonHTML, onClick, href]);
  
  return (
    <iframe 
      ref={iframeRef}
      style={{
        width,
        height,
        border: 'none',
        overflow: 'hidden',
        background: 'transparent',
        backgroundColor: 'transparent',
        pointerEvents: 'auto'
      }}
      title="Pure Black Gold Button"
      scrolling="no"
      frameBorder="0"
      allowTransparency="true"
    />
  );
};

export default PureBlackGoldButton; 