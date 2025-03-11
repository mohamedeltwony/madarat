import React, { useEffect, useState } from 'react';
import styles from './LeadMagnets.module.scss';
import LeadForm from './LeadForm';

export default function WelcomePopup({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Slight delay to allow animation
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);
  
  const handleSuccess = () => {
    setTimeout(() => {
      handleClose();
    }, 3000);
  };
  
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 500); // Allow time for fade out animation
  };
  
  return (
    <div className={`${styles.popupOverlay} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.popupContent} ${styles.welcomePopup} ${isVisible ? styles.visible : ''}`}>
        <button className={styles.closeButton} onClick={handleClose}>&times;</button>
        
        <div className={styles.popupImageContainer}>
          <img 
            src="https://placehold.co/400x200/E9F7FF/1e88e5?text=أهلاً+بك+في+موقعنا&font=Tajawal" 
            alt="ترحيب" 
            className={styles.popupImage}
          />
        </div>
        
        <LeadForm 
          title="مرحباً بك في مدارات!"
          subtitle="سجل بياناتك الآن واحصل على استشارة مجانية مع خبرائنا"
          buttonText="احصل على استشارة مجانية"
          onSuccess={handleSuccess}
          formStyle="popupForm"
        />
      </div>
    </div>
  );
} 