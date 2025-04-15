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

// Placeholder SVG Icon Component (Replace with actual SVGs later)
const PlaceholderIcon = ({ color = 'currentColor', size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill={color} fillOpacity="0.2"/>
    <path d="M12 6V18M6 12H18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);


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

  // Features data
  const features = [
    { text: 'تأشيرة سريعة', icon: 'visa' },
    { text: 'راحة تامة', icon: 'comfort' },
    { text: 'مواعيد مرنة', icon: 'flexible' },
    { text: 'إقامة فاخرة', icon: 'luxury' },
    { text: 'فعاليات ممتعة', icon: 'events' },
    { text: 'إطلالة نهرية', icon: 'river' },
    { text: 'أسعار تنافسية', icon: 'price' },
    { text: 'تقييمات عالية', icon: 'rating' },
    { text: 'مرشد خبير', icon: 'guide' },
    { text: 'جولات مخصصة', icon: 'custom' },
  ];
  
  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>استكشف لندن واسكتلندا مع مدارات الكون | رحلة ساحرة</title>
        <meta name="description" content="رحلة سياحية استثنائية إلى لندن واسكتلندا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في بريطانيا" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
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

            {/* Features Section - Moved Inside Hero & Made Marquee */}
            <div className={styles.featuresSection}> 
              <div className={styles.featuresGrid}>
                {/* Render features twice for infinite scroll effect */}
                {[...features, ...features].map((feature, index) => (
                  <div key={`${feature.icon}-${index}`} className={styles.featureItem}> {/* Added index to key for uniqueness */}
                    <div className={styles.featureIcon}>
                      {/* Replace PlaceholderIcon with your actual SVG component/path */}
                      <PlaceholderIcon color="#cc9c64" size={28} /> 
                    </div>
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* End Features Section */}
            
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
                  <label htmlFor="city">اختر مدينة الانطلاق</label>
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
                
                <div className={styles.formActions}>
                  <SparkleButton type="submit" className={styles.mainCTA} fullWidth>
                    اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين السياحة عندنا
                  </SparkleButton>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Features section moved inside hero content */}

      </main>
      
      {/* Chatbot */}
      <Chatbot />
      
      {/* Exit Intent Popup */}
      <ExitPopup />
    </div>
  );
}