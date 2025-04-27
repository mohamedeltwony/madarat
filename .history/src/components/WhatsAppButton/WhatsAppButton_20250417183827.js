import React from 'react'; // Fixed typo and added semicolon
import styles from './WhatsAppButton.module.scss';
// Placeholder for an actual WhatsApp icon SVG component if you have one
// import WhatsAppIcon from '@/Icons/whatsapp.svg';

const WhatsAppButton = () => {
  // Use wa.me link for better mobile compatibility
  const whatsappUrl = 'https://wa.me/966920034019';

  return (
    <a
      href={whatsappUrl}
      className={styles.whatsappButton}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      {/* Replace text with an Icon component if available */}
      {/* <WhatsAppIcon /> */}
      WhatsApp
    </a>
  );
};

export default WhatsAppButton;

// Added blank line at EOF
