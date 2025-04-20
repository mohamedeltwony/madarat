import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import styles from '@/styles/pages/ThankYou.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';
import confetti from 'canvas-confetti';

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
    const trackLeadEvent = async () => {
      // Check if fbq is loaded and its queue exists
      if (typeof window.fbq !== 'function' || !window.fbq.queue) {
        console.log('[Pixel] fbq not available on thank-you-citizen page load');
        return;
      }

      // --- Get User Data ---
      // 1. From Query Parameters (adjust keys if different)
      const email = router.query.email || null;
      const phone = router.query.phone || null;
      const external_id = router.query.external_id || null; // Read external_id

      // --- Get Cookie Data ---
      const fbc = getCookieValue('_fbc');
      const fbp = getCookieValue('_fbp');

      // --- Prepare Data Payload ---
      const userData = {};
      const hashedEmail = await sha256(email);
      const hashedPhone = await sha256(phone);

      if (hashedEmail) userData.em = hashedEmail;
      if (hashedPhone) userData.ph = hashedPhone;
      if (fbc) userData.fbc = fbc;
      if (fbp) userData.fbp = fbp;
      if (external_id) userData.external_id = external_id; // Add external_id if present

      // --- Fire Pixel Event ---
      if (Object.keys(userData).length > 0) {
        console.log('[Pixel] Firing Lead event with user data:', userData);
        window.fbq('track', 'Lead', userData);
      } else {
        console.log('[Pixel] Firing Lead event (no user data found)');
        window.fbq('track', 'Lead'); // Fallback to basic Lead event
      }
    };

    // Wait for router to be ready before accessing query params
    if (router.isReady) {
      // Use a small delay to ensure fbq might be ready if loaded async
      const timer = setTimeout(trackLeadEvent, 100);
      return () => clearTimeout(timer);
    }
  }, [router.isReady, router.query]); // Re-run if router becomes ready or query params change

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>شكراً لك! | مدارات الكون</title>
        <meta
          name="description"
          content="شكراً لتسجيلك معنا في رحلة لندن واسكتلندا."
        />
        <meta name="robots" content="noindex, nofollow" />{' '}
        {/* Prevent indexing */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background Image/Overlay handled by CSS on .container */}

      {/* No need for ReactCanvasConfetti component when using imperative API */}
      {/* <ReactCanvasConfetti ... /> */}

      {/* Content Overlay */}
      <main className={styles.mainContent}>
        <div className={styles.contentBox}>
          <div className={styles.logoContainer}>
            {' '}
            {/* Added container for logo */}
            <Image
              src="/logo.png" // Path relative to public folder
              alt="مدارات الكون للسياحة والسفر"
              width={180} // Adjust width as needed
              height={55} // Adjust height based on aspect ratio
              priority // Load logo quickly
            />
          </div>
          <h1 className={styles.title}>شكراً لك!</h1>
          <p className={styles.message}>
            يعطيك العافية! استلمنا بياناتك وبيتواصل معك مستشار السفر حقنا في
            أقرب وقت ممكن عشان يضبط لك رحلتك.
          </p>
          <div className={styles.buttonGroup}>
            {/* Updated to single button linking to Google Drive PDF */}
            <a
              href="https://drive.google.com/file/d/1jcY1xviwxlPB7JL6nOvARWC04b8m6iTq/view?usp=sharing"
              target="_blank" // Open in new tab
              rel="noopener noreferrer" // Security best practice for target="_blank"
              className={styles.downloadLink}
              // download attribute might not work reliably for cross-origin links
            >
              <SparkleButton className={styles.downloadButton}>
                حمّل دليل وجهة لندن
              </SparkleButton>
            </a>
          </div>
          {/* Removed Test Button */}
        </div>
      </main>
    </div>
  );
}
