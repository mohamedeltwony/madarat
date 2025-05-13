import React, { useRef, useEffect, useState } from 'react';

const IframeButton = ({
  text = 'زر الإطار',
  onClick,
  width = 200,
  height = 50,
}) => {
  const iframeRef = useRef(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);

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
              window.parent.postMessage('buttonClick', '*');
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

  // Listen for message from iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'buttonClick' && onClick) {
        onClick();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onClick]);

  return (
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
        overflow: 'hidden',
      }}
      title="Button iframe"
    />
  );
};

export default IframeButton;
