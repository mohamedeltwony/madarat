import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import SparkleButton from '@/components/UI/SparkleButton';
import Chatbot from '@/components/Chatbot';
import ExitPopup from '@/components/ExitPopup';
import StickyLeadForm from '@/components/StickyLeadForm';
import styles from '@/styles/pages/LondonScotland.module.scss';
import UIStyles from '@/components/UI/UI.module.scss';

// NOTE: Please add a high-quality image of London and Edinburgh to:
// public/images/destinations/london-edinburgh.jpg

export default function LondonScotlandTrip() {
  const [showForm, setShowForm] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect mobile devices
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkIfMobile();
    
    // Add listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  const handleShowForm = () => {
    setShowForm(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('شكراً لك! سنتواصل معك قريباً.');
    setShowForm(false);
  };
  
  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>استكشف لندن واسكتلندا مع مدارات الكون | رحلة ساحرة</title>
        <meta name="description" content="رحلة سياحية استثنائية إلى لندن واسكتلندا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في بريطانيا" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.logoContainer}>
              <Image 
                src="/logo.png" 
                alt="مدارات الكون للسياحة والسفر" 
                width={240} 
                height={75} 
                priority
              />
            </div>
            <h1 className={styles.title}>
              رحلة <span className={styles.highlight}>لندن</span> و <span className={styles.highlight}>اسكتلندا</span> الساحرة
            </h1>
            <p className={styles.description}>
              تجربة سفر فريدة لاستكشاف جمال الطبيعة والتاريخ والثقافة في المملكة المتحدة. رحلة استثنائية تجمع بين سحر المدن العريقة وروعة الطبيعة الخلابة.
            </p>
            <div className={styles.ctaButtons}>
              <SparkleButton onClick={handleShowForm} className={styles.mainCTA}>
                احجز مقعدك الآن
              </SparkleButton>
              
              {!isMobile && (
                <a href="#trip-details" className={styles.secondaryCTA}>
                  اكتشف التفاصيل
                </a>
              )}
            </div>
          </div>
          
          {/* Mobile scroll indicator */}
          {isMobile && (
            <div className={styles.scrollIndicator}>
              <span>اسحب للأسفل</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10L12 15L17 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </section>
        
        {/* Trip Details Section (will be added in future work) */}
        <section id="trip-details" className={styles.tripDetails}>
          {/* This section will contain trip details */}
        </section>
      </main>
      
      {/* Chatbot */}
      <Chatbot />
      
      {/* Exit Intent Popup */}
      <ExitPopup />
      
      {/* Sticky Lead Form */}
      <StickyLeadForm />
      
      {/* Lead Form Popup */}
      {showForm && (
        <div className={styles.formOverlay}>
          <div className={`${UIStyles.glassCard} ${styles.formContainer}`}>
            <button className={styles.closeButton} onClick={() => setShowForm(false)}>
              ×
            </button>
            <h3>احجز رحلتك إلى لندن واسكتلندا</h3>
            <p>اترك بياناتك وسنتواصل معك قريباً بخصوص التفاصيل</p>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">الاسم الكامل</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">رقم الهاتف</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="أدخل رقم هاتفك"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <SparkleButton type="submit" fullWidth>
                  إرسال
                </SparkleButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 