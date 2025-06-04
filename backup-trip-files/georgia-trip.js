import React, { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@/styles/pages/LondonScotland.module.scss';

import TripForm from '@/components/TripForm';

export default function GeorgiaTrip() {
  const router = useRouter();

  // Inline trip configuration to avoid import issues
  const tripConfig = useMemo(() => ({
    id: 'georgia-trip',
    name: 'جورجيا',
    price: 3800,
    currency: 'SAR',
    category: 'travel_packages'
  }), []);

  // Inline Snapchat tracking to avoid import issues
  useEffect(() => {
    const trackViewContent = async () => {
      if (typeof window === 'undefined' || !window.snaptr) {
        console.warn('Snapchat pixel not available');
        return;
      }
      
      try {
        const userData = {};
        
        // Get user data from URL params
        if (router.query) {
          userData.email = router.query.email || null;
          userData.phone = router.query.phone || null;
          userData.firstName = router.query.firstName || null;
          userData.external_id = router.query.external_id || null;
        }
        
        const viewContentData = {
          price: 3800,
          currency: 'SAR',
          item_ids: ['georgia-trip'],
          item_category: 'travel_packages',
          geo_country: 'SA',
          geo_region: 'Riyadh',
          geo_city: 'Riyadh'
        };
        
        // Add user data if available
        if (userData.email) {
          viewContentData.user_email = userData.email;
        }
        if (userData.phone) {
          viewContentData.user_phone_number = userData.phone;
        }
        if (userData.firstName) {
          viewContentData.firstname = userData.firstName;
        }
        
        window.snaptr('track', 'VIEW_CONTENT', viewContentData);
        console.log('Snapchat VIEW_CONTENT tracked successfully:', viewContentData);
      } catch (error) {
        console.error('Error tracking Snapchat VIEW_CONTENT:', error);
      }
    };
    
    const timer = setTimeout(trackViewContent, 1000);
    return () => clearTimeout(timer);
  }, [router]);

  const handleFormSuccess = ({ processedPhone, externalId, leadEventId, nationality, email, name, firstName, lastName }) => {
    const redirectPath =
      (nationality === 'مواطن' || nationality === 'Saudi Arabia' || nationality === 'العربية السعودية')
        ? '/thank-you-citizen'
        : '/thank-you-resident';
    
    const queryParams = new URLSearchParams();
    if (processedPhone) queryParams.set('phone', processedPhone);
    if (email) queryParams.set('email', email);
    if (name) queryParams.set('name', name);
    if (firstName) queryParams.set('firstName', firstName);
    if (lastName) queryParams.set('lastName', lastName);
    if (externalId) queryParams.set('external_id', externalId);
    if (leadEventId) queryParams.set('eventId', leadEventId);
    
    queryParams.set('trip_source', 'georgia-trip');
    
    const redirectUrl = `${redirectPath}?${queryParams.toString()}`;
    console.log(`Redirecting to: ${redirectUrl}`);
    window.location.href = redirectUrl;
  };

  const features = [
    {
      text: 'استقبال بسيارة خاصة في المطار والفنادق',
      iconPath: '/icons/gorgia/استقبال-وتوديع.webp',
    },
    {
      text: 'الإقامة فاخرة في فنادق ٤ و ٥ نجوم',
      iconPath: '/icons/gorgia/5-نجوم.webp',
    },
    {
      text: 'التنقلات بين المدن السياحية',
      iconPath: '/icons/gorgia/التنقلات-بين-المدن.webp',
    },
    {
      text: 'جولات سياحية جماعية',
      iconPath: '/icons/gorgia/جولات-جماعية.webp',
    },
    {
      text: 'وجبات الإفطار اليومية',
      iconPath: '/icons/gorgia/الفنادق-مع-الافطار.webp',
    },
    { text: 'تأمين سفر دولي', iconPath: '/icons/gorgia/تأمين.webp' },
    { text: 'خدمة عملاء ٢٤/٧', iconPath: '/icons/gorgia/خدمة-عملاء.webp' },
  ];

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>استكشف جورجيا مع مدارات الكون | رحلة ساحرة - السعر لا يشمل الطيران</title>
        <meta
          name="description"
          content="رحلة سياحية استثنائية إلى جورجيا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في جورجيا. السعر 3800 ريال لا يشمل تذاكر الطيران."
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
      </Head>

      <main className={styles.main}>
        <section className={styles.hero}>
          <Image
            src="/images/gorgia-background.webp"
            alt="Scenic view of Georgia"
            fill
            quality={75}
            priority
            sizes="100vw"
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
                sizes="(max-width: 768px) 150px, 240px"
                placeholder="blur"
                blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=="
              />
            </div>
            <h1 className={styles.title}>
              رحلة <span className={styles.highlight}>جورجيا</span> الساحرة
            </h1>
            <p className={styles.description}>
              ٨ أيام - ٧ ليالي
              <br />
              تبليسي - برجومي - باتومي
              <br />
              السعر للشخص في الغرفة المزدوجة{' '}
              <span className={styles.highlight}>{tripConfig?.price?.toLocaleString() || '3800'}</span> ريال
              <br />
              <span style={{ 
                fontSize: '0.9em', 
                color: '#cc9c64', 
                fontWeight: '600',
                backgroundColor: 'rgba(204, 156, 100, 0.15)',
                padding: '6px 12px',
                borderRadius: '6px',
                marginTop: '10px',
                display: 'inline-block',
                border: '1px solid rgba(204, 156, 100, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                ⚠️ السعر لا يشمل تذاكر الطيران
              </span>
            </p>

            <div className={styles.featuresSection}>
              <div className={styles.featuresGrid}>
                {[...features, ...features].map((feature, index) => (
                  <div
                    key={`${feature.iconPath || feature.text}-${index}`}
                    className={styles.featureItem}
                  >
                    {feature.iconPath && (
                      <div className={styles.featureIcon}>
                        <Image
                          src={feature.iconPath}
                          alt={feature.text}
                          width={60}
                          height={60}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>

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
                    destination: 'جورجيا',
                    tripName: 'Georgia',
                    price: tripConfig?.price || 3800,
                  },
                }}
                onSuccess={handleFormSuccess}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 600,
  };
}
