import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import styles from '@/styles/pages/ThankYou.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';
import confetti from 'canvas-confetti';
import { trackLeadEvent, getFacebookParams } from '@/utils/facebookTracking'; // Import tracking functions

// Helper function to get cookie value by name
const getCookieValue = (name) => {
  if (typeof document === 'undefined') {
    return null; // Return null on server-side
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to hash data using SHA-256
async function sha256(str) {
  if (!str || typeof str !== 'string') return null;
  try {
    const buffer = new TextEncoder().encode(str.toLowerCase().trim()); // Ensure lowercase and trimmed
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

// Clean and format user data for facebook
function cleanUserData(data) {
  const cleaned = {};
  
  // Clean email
  if (data.email) {
    cleaned.email = data.email.toLowerCase().trim();
  }
  
  // Clean phone (remove non-digits)
  if (data.phone) {
    cleaned.phone = data.phone.replace(/\D/g, '');
  }
  
  // Process name fields
  if (data.firstName) {
    cleaned.firstName = data.firstName.trim();
  }
  
  if (data.lastName) {
    cleaned.lastName = data.lastName.trim();
  }
  
  // If we have name but no first/last name, split it
  if (data.name && (!data.firstName && !data.lastName)) {
    const nameParts = data.name.trim().split(' ');
    cleaned.firstName = nameParts[0];
    if (nameParts.length > 1) {
      cleaned.lastName = nameParts.slice(1).join(' ');
    }
  }
  
  // Pass through other fields
  cleaned.external_id = data.external_id || null;
  cleaned.nationality = data.nationality || null;
  
  return cleaned;
}

export default function ThankYouCitizen() {
  const router = useRouter(); // Initialize router

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

  // Fire confetti on component mount
  useEffect(() => {
    // Add a slight delay to ensure canvas is ready
    const timer = setTimeout(() => {
      fireConfetti(); // Fire initially after delay
      // Fire intermittently
      const interval = setInterval(fireConfetti, 4000); // Fire every 4 seconds
      // Return cleanup for interval within the timeout scope
      return () => clearInterval(interval);
    }, 100); // 100ms delay

    // Return cleanup for the timeout itself
    return () => clearTimeout(timer);
  }, []); // Empty dependency array, fire only once on mount + intervals

  // Fire Pixel Lead event on page load with user data
  useEffect(() => {
    const trackLeadEventWithData = async () => {
      // Wait for router to be ready
      if (!router.isReady) return;

      console.log('Thank you page loaded with query params:', router.query);
      
      // --- Get User Data ---
      // 1. From Query Parameters
      const email = router.query.email || null;
      const phone = router.query.phone || null;
      const firstName = router.query.firstName || null;
      const lastName = router.query.lastName || null;
      const name = router.query.name || null;
      const external_id = router.query.external_id || null;
      const eventId = router.query.eventId || null;
      const nationality = router.query.nationality || null;
      
      // If we don't have any user data, we can't track effectively
      if (!email && !phone && !name && !firstName) {
        console.warn('No user data available for tracking in query parameters');
        return;
      }
      
      // --- Get Facebook Tracking Parameters ---
      const fbParams = getFacebookParams();
      // Also check URL parameters as fallback
      const fbc = router.query.fbc || fbParams.fbc || null;
      const fbp = router.query.fbp || fbParams.fbp || null;
      
      console.log('Facebook tracking parameters:', { 
        fbp: fbp ? 'present' : 'missing', 
        fbc: fbc ? 'present' : 'missing',
        eventId: eventId ? 'present' : 'missing'
      });
      
      // --- Clean and format user data ---
      const userData = cleanUserData({
        email,
        phone,
        firstName,
        lastName,
        name,
        external_id,
        nationality
      });
      
      // --- Send event to Facebook ---
      const result = await trackLeadEvent({
        ...userData,
        fbc,
        fbp,
        event_id: eventId,
        event_source_url: window.location.href,
        content_name: 'Citizenship Form Submission',
        lead_event_source: 'thank-you-page',
        form_id: 'citizen-form',
        value: 10, // Estimated value of this lead
        currency: 'SAR'
      });
      
      console.log('Tracking result:', result);
    };

    // Use a small delay to ensure fbq might be ready if loaded async
    const timer = setTimeout(trackLeadEventWithData, 500);
    return () => clearTimeout(timer);
  }, [router.isReady, router.query]); // Re-run if router becomes ready or query params change
  
  // Direct server event for Conversion API
  const sendServerEvent = async (eventName, eventData, eventId) => {
    try {
      console.log(`Sending ${eventName} to server with eventId: ${eventId}`);
      
      const response = await fetch('/api/facebook-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          userData: eventData,
          eventId
        })
      });
      
      if (!response.ok) {
        console.error('Error sending to Conversion API:', await response.json());
      } else {
        console.log('Successfully sent to Conversion API');
      }
    } catch (error) {
      console.error('Error sending server event:', error);
    }
  };

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

          <h1 className={styles.title}>تم استلام طلبك بنجاح!</h1>
          <p className={styles.subtitle}>
            شكراً لإهتمامك بالتسجيل في رحلة لندن واسكتلندا، سيتواصل معك فريقنا
            قريباً!
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

          {/* Add sparkle button to return to homepage */}
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

