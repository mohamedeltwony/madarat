import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import SparkleButton from '@/components/UI/SparkleButton';
import Chatbot from '@/components/Chatbot';
import ExitPopup from '@/components/ExitPopup';
import styles from '@/styles/pages/LondonScotland.module.scss';
import UIStyles from '@/components/UI/UI.module.scss';

// NOTE: Please add a high-quality image of London and Edinburgh to:
// public/images/destinations/london-edinburgh.jpg

export default function LondonScotlandTrip() {
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    destination: 'لندن واسكتلندا'
  });
  
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
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('شكراً لك! سنتواصل معك قريباً.');
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      destination: 'لندن واسكتلندا'
    });
  };
  
  // Saudi cities
  const cities = [
    "الرياض",
    "جدة",
    "القصيم – حائل",
    "مكة - الطائف",
    "المدينة المنورة",
    "المنطقة الشرقية",
    "المنطقة الشمالية",
    "المنطقة الجنوبية",
    "أخرى"
  ];
  
  // Travel destinations
  const destinations = [
    "لندن واسكتلندا",
    "جورجيا",
    "أذربيجان",
    "البوسنة",
    "ألبانيا",
    "تركيا",
    "المالديف",
    "ماليزيا",
    "اندونيسيا",
    "تايلاند",
    "سريلانكا",
    "موريشيوس",
    "صلالة",
    "اوزباكستان",
    "جنوب افريقيا",
    "سنغافورة",
    "روسيا",
    "الفلبين"
  ];
  
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
                unoptimized
              />
            </div>
            <h1 className={styles.title}>
              رحلة <span className={styles.highlight}>لندن</span> و <span className={styles.highlight}>اسكتلندا</span> الساحرة
            </h1>
            <p className={styles.description}>
              تجربة سفر فريدة لاستكشاف جمال الطبيعة والتاريخ والثقافة في المملكة المتحدة. رحلة استثنائية تجمع بين سحر المدن العريقة وروعة الطبيعة الخلابة.
            </p>
            
            {/* Contact Form */}
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.tripForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">الاسم الكامل</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="phone">الجوال</label>
                  <div className={styles.phoneInput}>
                    <span className={styles.countryCode}>+966</span>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="51 234 5678"
                      pattern="[0-9]{9}"
                      title="يرجى إدخال رقم سعودي مكون من 9 أرقام"
                      required
                    />
                  </div>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="أدخل بريدك الإلكتروني"
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="city">اختر المدينة</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">— الرجاء تحديد اختيار —</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="destination">اختر الوجهة</label>
                  <select
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  >
                    {destinations.map((destination) => (
                      <option key={destination} value={destination}>
                        {destination}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className={styles.formActions}>
                  <SparkleButton type="submit" className={styles.mainCTA} fullWidth>
                    طلب تواصل
                  </SparkleButton>
                </div>
              </form>
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
    </div>
  );
} 