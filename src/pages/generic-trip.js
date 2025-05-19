import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import SparkleButton from '@/components/UI/SparkleButton';
// import Chatbot from '@/components/Chatbot'; // Removed
// import ExitPopup from '@/components/ExitPopup'; // Removed
// Reusing LondonScotland styles for now
import styles from '@/styles/pages/LondonScotland.module.scss';
import TripForm from '@/components/TripForm';

// NOTE: Add a generic placeholder background image to:
// public/images/placeholder-trip.jpg

export default function GenericTrip() {
  // Brace back on same line
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

  // Saudi cities (kept for now, might need adjustment)
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

  // Removed specific features array

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        {/* Generic Title and Description */}
        <title>عرض رحلة خاصة | مدارات الكون للسياحة والسفر</title>
        <meta
          name="description"
          content="اكتشف أفضل عروض السفر والرحلات السياحية مع مدارات الكون. احجز رحلتك الآن!"
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
          {/* Background Image using placeholder path */}
          <Image
            src="/images/placeholder-trip.jpg" // Placeholder path
            alt="Scenic view of travel destination" // Generic alt text
            layout="fill"
            objectFit="cover"
            quality={75}
            priority
            className={styles.heroBackgroundImage}
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
              />
            </div>
            {/* Generic Headline and Description */}
            <h1 className={styles.title}>
              اكتشف <span className={styles.highlight}>وجهتك</span> التالية
            </h1>
            <p className={styles.description}>
              نقدم لك تجربة سفر فريدة مصممة خصيصاً لك. استكشف أفضل الوجهات
              السياحية معنا.
            </p>

            {/* Removed Features Section */}

            {/* Contact Form */}
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
                    destination: 'وجهة مختارة',
                    tripName: 'Generic',
                    price: 0,
                  },
                }}
                onSuccess={handleFormSuccess}
              />
            </div>
            {/* End Contact Form */}
          </div>
        </section>
        {/* <Chatbot /> */} {/* Removed */}
        {/* <ExitPopup /> */} {/* Removed */}
      </main>
    </div>
  );
}
