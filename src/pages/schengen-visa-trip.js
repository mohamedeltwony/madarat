import React, { useState } from 'react';
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
import TripForm from '@/components/TripForm';

// Removed SVG Icon imports

// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Update image path comment if needed
// public/images/gorgia-background.webp

// --- SVG Icons ---

// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components - Removed
// const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });
// const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
//   ssr: false,
// });
export default function SchengenVisaTrip() {
  // Changed component name
  const router = useRouter(); // Get router instance

  // Remove all form-related state and handlers except for the redirect logic
  const handleFormSuccess = ({ processedPhone, externalId, leadEventId, nationality }) => {
    // Determine redirect path based on nationality
    const thankYouPageBase =
      nationality === 'مواطن'
        ? '/thank-you-citizen'
        : '/thank-you-resident';
    
    // Create query params using URLSearchParams
    const queryParams = new URLSearchParams();
    queryParams.set('phone', processedPhone);
    queryParams.set('external_id', externalId);
    queryParams.set('eventId', leadEventId);
    
    // Construct the full redirect URL
    const redirectUrl = `${thankYouPageBase}?${queryParams.toString()}`;
    
    // Use direct window location for redirection
    console.log(`Redirecting to: ${redirectUrl}`);
    window.location.href = redirectUrl;
  };

  // Features data - Updated for Schengen visa
  const features = [
    {
      text: 'خبرة واسعة في تأشيرات شنغن',
      iconPath: '/icons/خبرة.webp',
    },
    {
      text: 'متابعة متكاملة للطلب',
      iconPath: '/icons/متابعة متكاملة.webp',
    },
    {
      text: 'خدمة سريعة وموثوقة',
      iconPath: '/icons/خدمة_سريعة_وموثوقة.webp',
    },
    {
      text: 'استشارات مجانية للسفر',
      iconPath: '/icons/استشارات السفر.webp',
    },
    {
      text: 'مساعدة في الأوراق المطلوبة',
      iconPath: '/icons/مساعدة في الأوراق.webp',
    },
    {
      text: 'متابعة الطلب إلكترونياً',
      iconPath: '/icons/متابعة الطلب الكترونيا .webp',
    },
    {
      text: 'دعم فني 24/7',
      iconPath: '/icons/خدمة عملاء.webp',
    },
  ];

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>احصل على تأشيرة شنغن | مدارات الكون للسياحة والسفر</title>
        <meta
          name="description"
          content="خدمات تأشيرة شنغن المميزة من مدارات الكون للسياحة والسفر. استمتع بخدمة احترافية وسريعة للحصول على تأشيرة شنغن بسعر 299 ريال سعودي فقط."
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
            src="/images/schengen-background.webp" // Using Italy image as it's a Schengen country
            alt="تأشيرة شنغن" // Changed alt text
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
              تأشيرة <span className={styles.highlight}>شنغن</span>
            </h1>
            <p className={styles.description}>
              خدمة استخراج تأشيرة شنغن بطريقة سهلة وميسرة
              <br />
              السعر
              <br />
              <span className={styles.highlight}>299</span> ر.س فقط
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

            {/* Contact Form - Using TripForm component */}
            <TripForm
              fields={[
                {
                  name: 'phone',
                  label: 'الجوال',
                  type: 'tel',
                  required: true,
                  autoComplete: 'tel',
                  floatingLabel: true,
                  showCountryCode: true, // Custom prop for UI
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
                  destination: 'تأشيرة شنغن',
                  tripName: 'Schengen Visa',
                  price: 299,
                },
              }}
              onSuccess={handleFormSuccess}
            />
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
  // are added directly within the SchengenVisaTrip component's JSX.

  return {
    props: {}, // Return empty props
    revalidate: 600, // Revalidate every 10 minutes (keeps ISR active)
  };
}
