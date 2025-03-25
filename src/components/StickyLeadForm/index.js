import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SparkleButton from '@/components/UI/SparkleButton';
import styles from './StickyLeadForm.module.scss';

const StickyLeadForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  // Show the form after 5 seconds on the page
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleForm = () => {
    setIsMinimized((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    // ...

    // Show success state
    setFormSubmitted(true);

    // After 3 seconds, minimize the form
    setTimeout(() => {
      setIsMinimized(true);
    }, 3000);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={`${styles.stickyFormContainer} ${isMinimized ? styles.minimized : ''}`}
    >
      {/* Toggle button */}
      <button
        className={styles.toggleButton}
        onClick={toggleForm}
        aria-label={isMinimized ? 'فتح نموذج التواصل' : 'تصغير نموذج التواصل'}
      >
        {isMinimized ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      <div className={styles.formContent}>
        {!formSubmitted ? (
          <>
            <div className={styles.formHeader}>
              <h3>تواصل معنا</h3>
              <p>دعنا نساعدك في بدء رحلتك مع مدارات</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.leadForm}>
              <div className={styles.formGroup}>
                <label htmlFor="sticky-name">الاسم</label>
                <input
                  type="text"
                  id="sticky-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخل اسمك"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="sticky-phone">رقم الهاتف</label>
                <input
                  type="tel"
                  id="sticky-phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="أدخل رقم هاتفك"
                  required
                />
              </div>

              <div className={styles.formActions}>
                <SparkleButton type="submit" fullWidth>
                  تواصل معنا
                </SparkleButton>
              </div>
            </form>
          </>
        ) : (
          <div className={styles.successMessage}>
            <div className={styles.successIcon}>✓</div>
            <h3>شكراً لك!</h3>
            <p>سيقوم فريقنا بالتواصل معك قريباً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StickyLeadForm;
