import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@/styles/pages/ThankYou.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';
import confetti from 'canvas-confetti';
import { sendGTMEvent, trackFormSubmission } from '@/lib/gtm';
import { saveUserProfile, getUserTrackingData } from '@/utils/userIdentification';

// Helper function to hash data using SHA-256
async function sha256(str) {
  if (!str || typeof str !== 'string') return null;
  try {
    const buffer = new TextEncoder().encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  } catch (error) {
    console.error('SHA-256 Hashing Error:', error);
    return null;
  }
}

export default function ThankYouResident() {
  const router = useRouter();

  // Function to fire confetti with specific options
  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#cc9c64', '#ffffff', '#0c4c44'], // Gold, White, Teal
    };

    function fire(particleRatio, opts) {
      // Check if confetti function exists before calling
      if (typeof confetti === 'function') {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      } else {
        console.warn('Confetti function not available');
      }
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Fire confetti on component mount and track conversion
  useEffect(() => {
    // Add a slight delay to ensure canvas is ready
    const timer = setTimeout(() => {
      fireConfetti(); // Fire initially after delay
      // Fire intermittently
      const interval = setInterval(fireConfetti, 4000); // Fire every 4 seconds
      // Return cleanup for interval within the timeout scope
      return () => clearInterval(interval);
    }, 100); // 100ms delay

    // Track GTM conversion for resident with encrypted user data
    const trackConversionWithEncryptedData = async () => {
      if (router.isReady) {
        const eventId = router.query.eventId || `resident_${Date.now()}`;
        
        // Get user data from URL parameters
        const email = router.query.email || null;
        const phone = router.query.phone || null;
        const name = router.query.name || null;
        const firstName = router.query.firstName || null;
        const lastName = router.query.lastName || null;
        const external_id = router.query.external_id || null;
        
        // --- Save user profile for persistence ---
        try {
          await saveUserProfile({
            email: email,
            phone: phone,
            name: name || (firstName && lastName ? `${firstName} ${lastName}` : firstName),
            nationality: 'مقيم',
            user_type: 'resident',
            form_submission: true,
            form_name: 'resident_form',
            external_id: external_id,
            event_id: eventId,
            conversion_value: 8,
            trip_destination: 'general_inquiry'
          });
          console.log('User profile saved for persistence');
        } catch (error) {
          console.error('Error saving user profile:', error);
        }
        
        // Hash user data for privacy compliance
        const encryptedEmail = email ? await sha256(email) : null;
        const encryptedPhone = phone ? await sha256(phone.replace(/\D/g, '')) : null;
        const encryptedName = name ? await sha256(name) : null;
        
        // Base event data with encrypted user information
        const baseEventData = {
          conversion_type: 'lead',
          conversion_value: 8,
          currency: 'SAR',
          user_type: 'resident',
          nationality: 'مقيم',
          form_name: 'resident_form',
          page_type: 'thank_you',
          lead_source: 'website',
          external_id: router.query.external_id || '',
          event_id: eventId,
          timestamp: new Date().toISOString(),
          form_location: 'thank-you-resident',
          lead_quality: 'medium',
          completion_time: new Date().toISOString(),
          // Add encrypted user data
          encrypted_email: encryptedEmail,
          encrypted_phone: encryptedPhone,
          encrypted_name: encryptedName,
          // Add page context
          url: window.location.href,
          page_title: document.title,
          page_path: window.location.pathname,
          page_category: 'thank-you-resident',
          user_language: 'ar',
          // Add user data for profile saving
          email: email,
          phone: phone,
          name: name || (firstName && lastName ? `${firstName} ${lastName}` : firstName)
        };
        
        // Add GTM tracking for successful conversion (now enhanced with persistent data)
        await sendGTMEvent({
          event: 'conversion',
          ...baseEventData
        });

        // Track as completed form submission (now enhanced with persistent data)
        await trackFormSubmission('resident_form_complete', {
          ...baseEventData
        });

        // Enhanced ecommerce tracking for lead conversion (now enhanced with persistent data)
        await sendGTMEvent({
          event: 'purchase',
          ...baseEventData,
          ecommerce: {
            transaction_id: router.query.external_id || eventId,
            value: 8,
            currency: 'SAR',
            items: [{
              item_id: 'resident-lead',
              item_name: 'Resident Lead Conversion',
              item_category: 'Lead Generation',
              item_variant: 'Resident',
              price: 8,
              quantity: 1
            }]
          },
          user_data: {
            nationality: 'مقيم',
            user_type: 'resident',
            lead_source: 'website',
            encrypted_email: encryptedEmail,
            encrypted_phone: encryptedPhone,
            encrypted_name: encryptedName
          }
        });
      }
    };

    trackConversionWithEncryptedData();

    // Return cleanup for the timeout itself
    return () => clearTimeout(timer);
  }, [router.isReady, router.query]); // Track when router is ready and query params change

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>شكراً لك! | مدارات الكون</title>
        <meta
          name="description"
          content="شكراً لتسجيلك معنا في مدارات الكون للسياحة والسفر."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/images/مدارات-2.png" />
        <link rel="apple-touch-icon" href="/images/مدارات-2.png" />
      </Head>

      <main className={styles.mainContent}>
        <div className={styles.contentBox}>
          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="مدارات الكون للسياحة والسفر"
              width={180}
              height={55}
              priority
            />
          </div>
          <h1 className={styles.title}>شكراً لك!</h1>
          <p className={styles.message}>
            يعطيك العافية! استلمنا بياناتك وبيتواصل معك مستشار السفر حقنا في
            أقرب وقت ممكن عشان يضبط لك رحلتك.
          </p>
          
          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>هل لديك أي استفسار؟</h3>
            <p className={styles.contactText}>
              يمكنك التواصل معنا عبر:
            </p>
            <p className={styles.contactMethod}>
              <strong>العنوان:</strong> طريق أنس بن مالك، الملقا، الرياض 13521، المملكة العربية السعودية
            </p>
            <p className={styles.contactMethod}>
              <strong>الموقع:</strong> الملقا، ريحانة بوليفارد
            </p>
            <p className={styles.contactMethod}>
              <strong>الجوال:</strong> +966 9200 34019
            </p>
            <p className={styles.contactMethod}>
              <strong>البريد الإلكتروني:</strong> info@madaratalkon.com
            </p>
          </div>
          


          {/* Return to homepage button */}
          <div className={styles.buttonWrapper}>
            <SparkleButton href="/" filled>
              العودة للصفحة الرئيسية
            </SparkleButton>
          </div>
        </div>
      </main>
    </div>
  );
}

