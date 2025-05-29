import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import styles from '@/styles/pages/ThankYou.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';
import confetti from 'canvas-confetti';
import { sendGTMEvent, trackFormSubmission } from '@/lib/gtm';

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

    // Track GTM conversion for resident
    if (router.isReady) {
      const eventId = router.query.eventId || `resident_${Date.now()}`;
      
      // Add GTM tracking for successful conversion
      sendGTMEvent({
        event: 'conversion',
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
        timestamp: new Date().toISOString()
      });

      // Track as completed form submission
      trackFormSubmission('resident_form_complete', {
        form_location: 'thank-you-resident',
        conversion_value: 8,
        currency: 'SAR',
        user_type: 'resident',
        lead_quality: 'medium',
        completion_time: new Date().toISOString()
      });

      // Enhanced ecommerce tracking for lead conversion
      sendGTMEvent({
        event: 'purchase',
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
          lead_source: 'website'
        }
      });
    }

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
          
          {/* Social Media Links */}
          <div className={styles.socialLinks}>
            <h3 className={styles.socialTitle}>تابعنا على مواقع التواصل الاجتماعي</h3>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/madaraatalkon/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/instagram.svg" alt="Instagram" width={30} height={30} />
              </a>
              <a href="https://www.youtube.com/@MadaratAlkon" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/youtube.svg" alt="YouTube" width={30} height={30} />
              </a>
              <a href="https://www.tiktok.com/@madaraatalkon" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/tiktok.svg" alt="TikTok" width={30} height={30} />
              </a>
              <a href="http://www.linkedin.com/company/madaraatalkon" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={30} height={30} />
              </a>
            </div>
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

