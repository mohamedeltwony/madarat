import React, { useEffect, useState } from 'react';
import styles from './LeadMagnets.module.scss';
import LeadForm from './LeadForm';

export default function ExitPopup({ onClose }) {
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
      <div className={`${styles.popupContent} ${styles.exitPopup} ${isVisible ? styles.visible : ''}`}>
        <button className={styles.closeButton} onClick={handleClose}>&times;</button>
        
        <div className={styles.popupHeader}>
          <h2>انتظر لحظة!</h2>
          <p className={styles.urgencyText}>قبل أن تغادر، لدينا عرض خاص لك</p>
        </div>
        
        <div className={styles.popupImageContainer}>
          <img 
            src="https://placehold.co/400x200/FFF9C4/f57c00?text=عرض+خاص+محدود&font=Tajawal" 
            alt="عرض خاص" 
            className={styles.popupImage}
          />
        </div>
        
        <LeadForm 
          title="احصل على خصم 20% على خدماتنا"
          subtitle="سجل الآن واحصل على عرض حصري لفترة محدودة"
          buttonText="أريد الحصول على الخصم"
          onSuccess={handleSuccess}
          formStyle="popupForm"
        />
      </div>
    </div>
  );
} 