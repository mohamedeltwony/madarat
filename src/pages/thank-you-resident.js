import React, { useEffect } from 'react'; // Removed useRef, useCallback
import Head from 'next/head';
import Image from 'next/image'; // Import Image component
import styles from '@/styles/pages/ThankYou.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';
import confetti from 'canvas-confetti'; // Import the confetti function directly

export default function ThankYouResident() {
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
