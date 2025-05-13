import React, { useRef, useEffect } from 'react';

const IsolatedGoldButton = ({ 
  text = "زر ذهبي معزول", 
  onClick,
  width = 200,
  height = 50
}) => {
  const iframeRef = useRef(null);
  
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
            window.parent.postMessage('buttonClicked', '*');
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
      
      // Add message listener for iframe communication
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
  }, [buttonHTML, onClick]);
  
  return (
    <iframe 
      ref={iframeRef}
      style={{
        width: width,
        height: height,
        border: 'none',
        overflow: 'hidden',
        background: 'transparent',
        backgroundColor: 'transparent',
        pointerEvents: 'auto'
      }}
      title="Gold Button"
      scrolling="no"
      frameBorder="0"
    />
  );
};

export default IsolatedGoldButton; 