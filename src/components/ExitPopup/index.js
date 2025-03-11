import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import SparkleButton from '@/components/UI/SparkleButton';
import styles from './ExitPopup.module.scss';

const ExitPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  
  // Set up exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Only trigger when mouse leaves through the top of the viewport
      if (e.clientY <= 0 && !formSubmitted) {
        // Get from localStorage if user has closed this popup before
        const hasClosedPopup = localStorage.getItem('exitPopupClosed');
        
        if (!hasClosedPopup) {
          setShowPopup(true);
        }
      }
    };
    
    // Add event listener
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [formSubmitted]);
  
  const handleClose = () => {
    setShowPopup(false);
    // Set in localStorage to prevent showing again in this session
    localStorage.setItem('exitPopupClosed', 'true');
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Handle form submission logic here
    // ...
    
    // Update state to show success message
    setFormSubmitted(true);
    
    // Close popup after delay
    setTimeout(() => {
      setShowPopup(false);
      // Set in localStorage to prevent showing again
      localStorage.setItem('exitPopupClosed', 'true');
    }, 3000);
  };
  
  if (!showPopup) {
    return null;
  }
  
  return (
    <div className={styles.exitPopupOverlay}>
      <div className={styles.exitPopupContainer}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="إغلاق">
          <FaTimes />
        </button>
        
        {!formSubmitted ? (
          <>
            <div className={styles.exitPopupImage}>
              <img src="https://placehold.co/300x200/00a1f8/ffffff?text=عرض+خاص" alt="عرض خاص" />
            </div>
            
            <div className={styles.exitPopupContent}>
              <h2>لا تفوت هذه الفرصة!</h2>
              <p>اشترك الآن واحصل على خصم 20٪ على جميع خدماتنا</p>
              
              <form onSubmit={handleSubmit} className={styles.exitPopupForm}>
                <div className={styles.formGroup}>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="البريد الإلكتروني"
                    required
                  />
                </div>
                
                <div className={styles.formActions}>
                  <SparkleButton type="submit" fullWidth>
                    اشترك الآن
                  </SparkleButton>
                </div>
              </form>
              
              <div className={styles.smallText}>
                لن نشارك بريدك الإلكتروني مطلقاً مع أي طرف ثالث.
              </div>
            </div>
          </>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h2>تم التسجيل بنجاح!</h2>
            <p>شكراً لاشتراكك معنا. سيتم إرسال تفاصيل الخصم إلى بريدك الإلكتروني قريباً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitPopup; 