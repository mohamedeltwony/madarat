import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import dynamic from 'next/dynamic'; // Import dynamic
const SparkleButton = dynamic(() => import('@/components/UI/SparkleButton'), {
  ssr: false,
});
// import Chatbot from '@/components/Chatbot'; // Removed
// import ExitPopup from '@/components/ExitPopup'; // Removed
import styles from '@/styles/pages/LondonScotland.module.scss'; // Keep using the same styles for cloning
// Removed getSiteMetadata import as it's no longer fetched here
import { getAllMenus } from '@/lib/menus'; // Keep menu import for now, though unused in getStaticProps
import TripForm from '@/components/TripForm';

// Removed SVG Icon imports

// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Update image path comment if needed
// public/images/bosnia-background.webp

// --- SVG Icons ---

// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components - Removed
// const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });
// const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
//   ssr: false,
// });
export default function BosniaTrip() {
  // Changed component name
  const router = useRouter(); // Get router instance

  // Remove all form-related state and handlers except for the redirect logic
  const handleFormSuccess = ({ processedPhone, externalId, leadEventId, nationality }) => {
    // Determine redirect path based on nationality
    const redirectPath =
      (nationality === 'مواطن' || nationality === 'Saudi Arabia' || nationality === 'العربية السعودية')
        ? '/thank-you-citizen'
        : '/thank-you-resident';
    // Create a form and submit it for redirect
    const redirectForm = document.createElement('form');
    redirectForm.method = 'GET';
    redirectForm.action = redirectPath;
    // Add hidden fields
    const phoneField = document.createElement('input');
    phoneField.type = 'hidden';
    phoneField.name = 'phone';
    phoneField.value = processedPhone;
    redirectForm.appendChild(phoneField);
    const externalIdField = document.createElement('input');
    externalIdField.type = 'hidden';
    externalIdField.name = 'external_id';
    externalIdField.value = externalId;
    redirectForm.appendChild(externalIdField);
    const eventIdField = document.createElement('input');
    eventIdField.type = 'hidden';
    eventIdField.name = 'eventId';
    eventIdField.value = leadEventId;
    redirectForm.appendChild(eventIdField);
    document.body.appendChild(redirectForm);
    redirectForm.submit();
  };

  // Saudi cities (Keep original if needed by form logic, though not displayed)
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

  // Features data - Updated for Bosnia
  const features = [
    {
      text: 'استقبال وتوديع بالمطار',
      iconPath: '/icons/gorgia/استقبال-وتوديع.webp',
    },
    {
      text: 'الإقامة في فنادق 4 نجوم',
      iconPath: '/icons/gorgia/5-نجوم.webp',
    },
    {
      text: 'سيارة خاصة مع سائق',
      iconPath: '/icons/gorgia/التنقلات-بين-المدن.webp',
    },
    {
      text: 'جولات سياحية',
      iconPath: '/icons/gorgia/جولات-جماعية.webp',
    },
    {
      text: 'وجبات الإفطار اليومية',
      iconPath: '/icons/gorgia/الفنادق-مع-الافطار.webp',
    },
    {
      text: 'شريحة هاتف مع الإنترنت',
      iconPath: '/icons/gorgia/شريحة-انترنت.webp',
    },
    {
      text: 'خدمة عملاء ٢٤/٧',
      iconPath: '/icons/gorgia/خدمة-عملاء.webp',
    },
  ];

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>استكشف البوسنة مع مدارات الكون | رحلة ساحرة</title>
        <meta
          name="description"
          content="رحلة سياحية استثنائية إلى البوسنة مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في سراييفو وموستار وبيهاتش."
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
        {/* Removed redundant Google Font link - loaded in _document.js */}
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          {/* Background Image using next/image */}
          <Image
            src="/images/bosnia-background.webp" // Changed image src for Bosnia
            alt="Scenic view of Bosnia" // Changed alt text
            fill // Use fill prop instead of layout="fill"
            // objectFit="cover" // Remove prop, handle with CSS
            quality={75} // Adjust quality as needed
            priority // Prioritize loading for LCP
            className={styles.heroBackgroundImage} // Ensure this class handles object-fit: cover
          />
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.logoContainer}>
              <Image
                src="/logo.png"
                alt="مدارات الكون للسياحة والسفر"
                width={240}
                height={75}
                priority
                sizes="(max-width: 768px) 150px, 240px" // Refined sizes prop for responsiveness
                // Removed unoptimized prop
              />
            </div>
            <h1 className={styles.title}>
              رحلة <span className={styles.highlight}>البوسنة</span> الساحرة
            </h1>
            <p className={styles.description}>
              10 أيام - 9 ليالي
              <br />
              سراييفو - موستار - بيهاتش
              <br />
              السعر يبدأ من
              <br />
              <span className={styles.highlight}>4599</span> ر.س في الغرفة
              المزدوجة
            </p>

            {/* Features Section - Moved Inside Hero & Made Marquee */}
            <div className={styles.featuresSection}>
              <div className={styles.featuresGrid}>
                {/* Render features twice for infinite scroll effect */}
                {[...features, ...features].map((feature, index) => (
                  <div
                    key={`${feature.iconPath || feature.text}-${index}`} // Use iconPath or text for key
                    className={styles.featureItem}
                  >
                    {' '}
                    {/* Added index to key for uniqueness */}
                    {feature.iconPath && ( // Conditionally render icon div
                      <div className={styles.featureIcon}>
                        {/* Render using Next.js Image component */}
                        <Image
                          src={feature.iconPath}
                          alt={feature.text} // Use feature text as alt text
                          width={60} // Updated width
                          height={60} // Updated height
                          // unoptimized // Removed to allow Next.js optimization
                        />
                      </div>
                    )}
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* End Features Section */}

            {/* Contact Form - Using London/Scotland structure */}
            <div className={styles.formContainer}>
              <TripForm
                fields={[
                  {
                    name: 'phone',
                    label: 'الجوال',
                    type: 'tel',
                    required: true,
                    autoComplete: 'tel',
                    floatingLabel: true,
                    showCountryCode: true,
                  },
                  {
                    name: 'name',
                    label: 'الاسم الكامل (اختياري)',
                    type: 'text',
                    required: false,
                    autoComplete: 'name',
                    floatingLabel: true,
                  },
                  {
                    name: 'email',
                    label: 'البريد الإلكتروني (اختياري)',
                    type: 'email',
                    required: false,
                    autoComplete: 'email',
                    floatingLabel: true,
                  },
                ]}
                zapierConfig={{
                  endpoint: '/api/zapier-proxy',
                  extraPayload: {
                    destination: 'البوسنة',
                    tripName: 'Bosnia',
                    price: 1999,
                  },
                }}
                onSuccess={handleFormSuccess}
              />
            </div>
            {/* End Contact Form */}
          </div>
        </section>
        {/* End Hero Section */}

        {/* WhatsApp Button */}
        {/* Removed WhatsAppButton component */}
      </main>

      {/* Removed Chatbot and ExitPopup */}
    </div>
  );
}

export async function getStaticProps() {
  // No longer fetching getSiteMetadata here to improve build/revalidation speed.
  // Ensure necessary <Head> tags (title, meta description, OG tags)
  // are added directly within the BosniaTrip component's JSX.

  return {
    props: {}, // Return empty props
    revalidate: 600, // Revalidate every 10 minutes (keeps ISR active)
  };
}
