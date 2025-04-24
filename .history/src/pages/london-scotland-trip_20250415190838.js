import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import SparkleButton from '@/components/UI/SparkleButton';
import Chatbot from '@/components/Chatbot';
import ExitPopup from '@/components/ExitPopup';
import styles from '@/styles/pages/LondonScotland.module.scss';
// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Please add a high-quality image of London and Edinburgh to:
// public/images/destinations/london-edinburgh.jpg

// --- SVG Icons ---

// Placeholder Icon (Keep for other features until SVGs are provided)
const PlaceholderIcon = ({ color = 'currentColor', size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="24" height="24" rx="4" fill={color} fillOpacity="0.2" />
    <path
      d="M12 6V18M6 12H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Visa Icon Component from src/Icons/تأشيرة.svg
const VisaIcon = ({ size = 28 }) => (
  <svg
    id="Layer_1"
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 433.83 448.63"
    width={size}
    height={size}
    fill="#fff" // Applied fill directly from .cls-1 style
  >
    <path
      d="M57.25,464.18a70.44,70.44,0,0,1-7.83-4.29c-7.16-5.11-9.49-12.53-9.49-21q0-48,0-95.92V131.87c0-8.45,1.41-10.37,9.59-12.53q86.91-22.95,173.83-45.83c14.18-3.72,26.35,2.91,29.64,16.15,1.35,5.41.42,11,.56,16.58a70.3,70.3,0,0,1-.06,9.63c-.41,3.67,1.15,4.22,4.38,4.18,11.12-.15,11.12,0,14.79-10.42Q288,66.36,303.26,23.08c2.6-7.36,5.77-8.94,12.92-6.41Q391,43.11,465.9,69.6c7.9,2.8,9.37,5.91,6.54,13.92Q420.59,230.39,368.71,377.25c-1.36,3.83-2.63,7.68-4,11.5-2.29,6.26-5.87,8-12.23,5.78-17.93-6.27-35.87-12.52-53.72-19-3.66-1.34-4.23-.56-4.2,3.05.15,19.71.07,39.42.07,59.13,0,14.63-4.2,20.7-18.32,26.48ZM55.38,289.37V438.28c0,8.64,2.25,10.94,10.73,10.94H268.44c8.51,0,10.77-2.29,10.77-10.89q0-146.07,0-292.13c0-8.95-1.81-10.77-10.7-10.77q-104.23,0-208.46-.09c-3.75,0-4.79.74-4.77,4.68C55.43,189.8,55.38,239.58,55.38,289.37Zm288.75-44.59c-2.55,7.2-4.61,14.14-7.47,20.73-2.46,5.66-2.58,10.7,1,15.8,5.22,7.46,5.6,15.15,1.29,23.26-1.62,3-2.37,6.54-3.55,9.81-3.06,8.43-8.8,9.71-15,3.34-5.63-5.73-11.36-11.37-16.71-17.35-2.39-2.66-5-2.08-7.58-1.54-2.72.58-1.38,3.19-1.39,4.83-.1,16.79,0,33.58-.15,50.37,0,3.19,1,4.38,4,5.39q25.13,8.56,50,17.69c2.94,1.07,3.92.73,5-2.34q34-96.67,68.21-193.25,16.88-47.79,33.78-95.58c.95-2.67,1-3.89-2.09-4.76-4.74-1.34-9.32-3.22-14-4.86q-59.88-21.15-119.8-42.27c-1.62-.57-3.52-2.33-4.71,1.09q-15,43.14-30.36,86.18c-.59,1.66-.41,2.71,1,3.73,7,5.14,9.06,12.47,9.05,20.7,0,14.27,0,28.54,0,43.2,7.36-2.57,14.28-5.15,21.31-7.37a6,6,0,0,0,4.23-4.34c2.23-6.59,4.7-13.11,6.91-19.7a10.75,10.75,0,0,1,5.71-6.78c5.65-2.67,11.24-5.46,16.91-8.06,5.2-2.37,9-1,11.58,4.09,2.68,5.3,5.11,10.74,7.78,16.06a11.69,11.69,0,0,1,.49,10c-2.43,6.37-4.39,12.92-6.86,19.27a6.43,6.43,0,0,0,.71,6.45c6.69,10.57,13.16,21.28,19.92,31.81,2.49,3.88,3.13,7.6,1.42,11.93-2.09,5.25-3.88,10.62-5.79,15.94-3.06,8.5-8.26,9.78-15.12,3.74C357.36,256.34,350.89,250.7,344.13,244.78ZM109.68,119.22l.22.76q63,0,126,.06c2.53,0,2.8-1,2.77-3.05-.1-6.13,0-12.25,0-18.38,0-9.68-3.73-12.5-13.07-10Q196.33,96.35,167.1,104ZM324.36,299c2.58-4.57,2.59-4.81.38-9.46a51.44,51.44,0,0,0-3-6.26c-3.9-5.9-3.42-11.55-1-18.11,11.2-30.77,21.76-61.77,32.92-92.56,1.93-5.33-1.49-8.42-2.86-12.45-.26-.77-.74-.67-1.32-.35-4.06,2.17-8.41,3.15-10.33,8.8-10.76,31.69-22.09,63.19-33.22,94.76-1.12,3.2-2.25,6.76-5.74,7.76-5.44,1.57-6,5.16-5.67,9.9.17,2.51.83,2.94,3.07,2.34,6.18-1.65,11.2-.22,15.51,4.93C316.41,292.24,320.64,295.47,324.36,299ZM355,213.8c-1.78,5.1-3.16,9.21-4.67,13.26-.5,1.34-.82,2.37.47,3.49,5,4.27,9.88,8.63,14.83,12.94.6.53,1.68,1.61,2.07.49.81-2.3,3.12-4.51,1.5-7.2C364.74,229.35,360.12,222,355,213.8Zm-42.79-14.27a4.15,4.15,0,0,0-1.15-.11q-5.14,1.74-10.25,3.52c-6.68,2.31-6.61,2.31-6.3,9.24.08,1.79.4,2.43,2.41,2.49,9.78.26,9.78.34,13-8.69C310.7,203.94,311.41,201.9,312.25,199.53ZM294.6,247.26h.79c1.67-4.73,3.32-9.46,5-14.17.34-.94,1.08-2.27.33-2.76-1.5-1-3.37-.23-5.08-.16-1.27,0-1,1.16-1,2C294.59,237.18,294.6,242.22,294.6,247.26Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M294.6,247.26c0-5,0-10.08,0-15.11,0-.82-.23-1.94,1-2,1.71-.07,3.58-.81,5.08.16.75.49,0,1.82-.33,2.76-1.69,4.71-3.34,9.44-5,14.17Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M164,314.75c-40.78.37-74.73-33.29-75.12-74.49-.38-41,33.39-75,74.77-75.3,40.62-.24,74.65,33.2,75,73.65C238.93,280.8,206.05,314.37,164,314.75Zm16.78-75.08c0-4.52-.1-9,0-13.55.07-2.2-.55-2.91-2.89-3.08a173.88,173.88,0,0,0-27.95,0c-1.87.16-2.91.39-3,2.58a230.33,230.33,0,0,0,0,28.42c.11,1.69.57,2.46,2.53,2.62a179,179,0,0,0,28.83,0c1.88-.16,2.52-.71,2.49-2.57C180.73,249.28,180.79,244.48,180.79,239.67ZM131.89,225c-5.28,1.1-9.87,1.83-14.33,3-4.25,1.17-10.19.18-12.38,3.8s-.84,9.07-.62,13.72a8.42,8.42,0,0,1,0,.87c-.1,1.76.78,2.65,2.46,3,8.13,1.7,16.26,3.44,24.87,5.27A177.56,177.56,0,0,1,131.89,225ZM149,207.54c9.38,0,18.36-.06,27.34,0,2.54,0,2-1.51,1.77-2.84-.85-4.4-1.75-8.8-2.75-13.18-2.69-11.75-3.92-12.57-16.23-11.1a20.1,20.1,0,0,1-2.16.32c-1.78,0-2.3.88-2.66,2.61C152.67,191.31,150.83,199.19,149,207.54Zm.06,64.63c1.25,5.69,2.4,10.93,3.56,16.17,2.54,11.51,3.57,12.25,15.4,11,1-.11,2-.37,3-.44s1.87-.35,2.15-1.64c1.63-7.67,3.33-15.33,5-23,.3-1.4-.09-2.11-1.75-2.09C167.4,272.2,158.39,272.17,149,272.17Zm46.9-17.47,24.67-5.24a2.53,2.53,0,0,0,2.36-2.55A61.13,61.13,0,0,0,223,233c-.19-1.56-.67-2.38-2.19-2.69-7.39-1.51-14.79-3-22.15-4.64-2.08-.47-2.83-.33-2.6,2.1A165.06,165.06,0,0,1,195.93,254.7Zm-85.71-40.85,21.93-4.15c1.27-.24,1.43-1.23,1.63-2.26,1.34-6.93,2.7-13.85,4.16-21.3A63,63,0,0,0,110.22,213.85ZM138,293.59c-1.28-6.28-2.8-11.76-3.41-17.34-.5-4.59-2.13-6.78-7-7.25-5.63-.55-11.17-2-17.52-3.18A64,64,0,0,0,138,293.59Zm79-79.82c-4.75-11.23-17.84-24-27.16-26.91,1.32,6.68,2.67,13.34,3.9,20,.24,1.34.23,2.65,1.9,3Zm-27.32,79.6c12.6-6.19,21.13-15.24,27.77-27.48l-21.74,4c-1.66.3-1.72,1.54-2,2.91C192.61,279.19,191.28,285.58,189.73,293.37Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M163.72,389.62c-18.67,0-37.35-.06-56,.07-2.93,0-4-.6-4-3.8,0-11.68-.09-11.68,11.41-11.68,34.72,0,69.43.06,104.15-.09,3.65,0,4.91.88,4.52,4.53-.36,3.45,1.11,8.08-.64,10.15-2.07,2.45-6.84.76-10.42.78C196.4,389.68,180.06,389.62,163.72,389.62Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M163.24,419.46c-13.56,0-27.12-.09-40.68.07-3.06,0-3.91-.78-3.89-3.86.07-11.42,0-11.42,11.2-11.42,24.93,0,49.87.08,74.81-.09,3.56,0,4.49,1,4.18,4.37s1.11,8.09-.64,10.13c-2.07,2.41-6.83.72-10.42.76C186.29,419.53,174.76,419.46,163.24,419.46Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M186.08,351.67c0-7.4,0-7.4,7.25-7.4,8.13,0,8.13,0,8.13,8.32,0,7.18,0,7.18-7.08,7.18C186.08,359.77,186.08,359.77,186.08,351.67Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M126.45,352.13c0-7.84,0-7.84,8-7.84,7,0,7,0,7,7.62,0,7.84,0,7.84-7.61,7.84C126.45,359.75,126.45,359.75,126.45,352.13Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M164.08,344.29c7.28,0,7.28,0,7.28,7.25,0,8.22,0,8.22-8.07,8.22-7,0-7,0-7-7v-.44C156.26,344.29,156.26,344.29,164.08,344.29Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M320.64,97.87c-3.74-1.35-7.43-2.65-11.09-4-.82-.31-.81-1-.46-1.81.47-1.06.85-2.16,1.23-3.25,3.72-10.66,3.93-10.73,14.34-5.72,1,.48,2,.84,1.53,2.16-1.38,4-2.84,7.91-4.24,11.87C321.7,97.81,321.17,97.82,320.64,97.87Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M352,93.85c-1.48,4.27-2.77,8.09-4.13,11.88-.31.85-.94,1.46-2,1-.39-.18-.84-.23-1.24-.39q-5-1.93-10-3.91c1.36-4.21,2.7-8.44,4.11-12.64.27-.81.71-1.5,1.91-1,3.36,1.28,6.77,2.45,10.15,3.67C351.67,92.73,352.44,93.14,352,93.85Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M365.7,97.62c4.12,1.45,7.68,2.68,11.23,4,.84.31.88,1,.53,1.76-.46,1.07-.82,2.17-1.2,3.27-3.77,10.72-3.77,10.72-14.22,5.9-1.05-.48-2.24-.79-1.64-2.44,1.33-3.68,2.55-7.4,3.92-11.07C364.58,98.29,365,97.12,365.7,97.62Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M403.31,111.86c-1.55,4.33-3,8.29-4.35,12.26-.33.94-.95,1-1.7.81a4.27,4.27,0,0,1-.8-.34c-3.5-1.6-9.52-1.44-10.14-4.56-.73-3.67,2.39-8.09,3.74-12.22.39-1.17,1.07-1.26,2-1,3.29,1.13,6.56,2.3,9.83,3.48C402.73,110.65,403.49,111.1,403.31,111.86Z"
      transform="translate(-39.93 -15.55)"
    />
    <path
      d="M428.86,121.12c-1.47,4.15-2.78,7.84-4.06,11.54-.65,1.87-1.9,1.26-3.16.89-10.71-3.09-10.49-3-7.09-13.73,1.26-4,2.74-4.66,6.24-2.77,1.88,1,4.11,1.38,6.14,2.14C428,119.58,429.31,119.91,428.86,121.12Z"
      transform="translate(-39.93 -15.55)"
    />
  </svg>
);

// --- End SVG Icons ---

export default function LondonScotlandTrip() {
  // const [isMobile, setIsMobile] = useState(false); // Commented out - unused
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    destination: 'لندن واسكتلندا',
  });

  // // Detect mobile devices - Commented out as isMobile state is unused
  // useEffect(() => {
  //   const checkIfMobile = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   // Check on initial load
  //   checkIfMobile();

  //   // Add listener for window resize
  //   window.addEventListener('resize', checkIfMobile);

  //   // Cleanup
  //   return () => window.removeEventListener('resize', checkIfMobile);
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      destination: 'لندن واسكتلندا',
    });
  };

  // Saudi cities
  const cities = [
    'الرياض',
    'جدة',
    'القصيم – حائل',
    'مكة - الطائف',
    'المدينة المنورة',
    'المنطقة الشرقية',
    'المنطقة الشمالية',
    'المنطقة الجنوبية',
    'أخرى',
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
        <meta
          name="description"
          content="رحلة سياحية استثنائية إلى لندن واسكتلندا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في بريطانيا"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
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
                // Removed unoptimized prop
              />
            </div>
            <h1 className={styles.title}>
              رحلة <span className={styles.highlight}>لندن</span> و{' '}
              <span className={styles.highlight}>اسكتلندا</span> الساحرة
            </h1>
            <p className={styles.description}>
              تجربة سفر فريدة لاستكشاف جمال الطبيعة والتاريخ والثقافة في المملكة
              المتحدة. رحلة استثنائية تجمع بين سحر المدن العريقة وروعة الطبيعة
              الخلابة.
            </p>

            {/* Features Section - Moved Inside Hero & Made Marquee */}
            <div className={styles.featuresSection}>
              <div className={styles.featuresGrid}>
                {/* Render features twice for infinite scroll effect */}
                {[...features, ...features].map((feature, index) => (
                  <div
                    key={`${feature.icon}-${index}`}
                    className={styles.featureItem}
                  >
                    {' '}
                    {/* Added index to key for uniqueness */}
                    <div className={styles.featureIcon}>
                      {/* Conditionally render the VisaIcon or PlaceholderIcon */}
                      {feature.icon === 'visa' ? (
                        <VisaIcon size={42} />
                      ) : (
                        <PlaceholderIcon color="#cc9c64" size={28} />
                      )}
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
                  <SparkleButton
                    type="submit"
                    className={styles.mainCTA}
                    fullWidth
                  >
                    اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين السياحة
                    عندنا
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
