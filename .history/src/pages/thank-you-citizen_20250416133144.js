import React from 'react';
import Head from 'next/head';
// import { Fireworks } from 'react-fireworks'; // Remove static import
import styles from '@/styles/pages/ThankYou.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';
import dynamic from 'next/dynamic'; // Import dynamic

// Dynamically import Fireworks, disabling SSR
const FireworksComponent = dynamic(
  () => import('react-fireworks').then((mod) => mod.Fireworks),
  {
    ssr: false,
    // Optional: Add a loading component while fireworks load
    // loading: () => <p>Loading fireworks...</p>,
  }
);

export default function ThankYouCitizen() {
  const fwProps = {
    initialStart: true,
    initialOptions: {
      hue: {
        min: 0,
        max: 345,
      },
      delay: {
        min: 15,
        max: 15,
      },
      rocketsPoint: 50,
      opacity: 0.5,
      speed: 1,
      acceleration: 1.2,
      friction: 0.96,
      gravity: 1,
      particles: 90,
      trace: 3,
      explosion: 6,
      autoresize: true,
      brightness: {
        min: 50,
        max: 80,
        decay: {
          min: 0.015,
          max: 0.03,
        },
      },
      boundaries: {
        visible: false,
      },
      sound: {
        enabled: true,
        files: [
          'https://fireworks.js.org/sounds/explosion0.mp3',
          'https://fireworks.js.org/sounds/explosion1.mp3',
          'https://fireworks.js.org/sounds/explosion2.mp3',
        ],
        volume: {
          min: 2,
          max: 4,
        },
      },
      mouse: {
        click: false,
        move: false,
        max: 1,
      },
    },
  };

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

      {/* Background Video */}
      <video autoPlay muted loop playsInline className={styles.backgroundVideo}>
        {/* IMPORTANT: Replace with your actual video path */}
        <source src="/videos/london-scotland.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Fireworks Overlay - Use the dynamically imported component */}
      <FireworksComponent
        {...fwProps}
        style={{
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          position: 'fixed',
          zIndex: 1,
        }}
      />

      {/* Content Overlay */}
      <main className={styles.mainContent}>
        <div className={styles.contentBox}>
          <h1 className={styles.title}>شكراً لك!</h1>
          <p className={styles.message}>
            يعطيك العافية! استلمنا بياناتك وبيتواصل معك مستشار السفر حقنا في
            أقرب وقت ممكن عشان يضبط لك رحلتك.
          </p>
          <div className={styles.buttonGroup}>
            {/* IMPORTANT: Replace href with your actual PDF paths */}
            <a
              href="/pdfs/london-scotland-activities.pdf"
              download
              className={styles.downloadLink}
            >
              <SparkleButton className={styles.downloadButton}>
                حمّل جدول الأنشطة
              </SparkleButton>
            </a>
            <a
              href="/pdfs/bonus-destination-guide.pdf"
              download
              className={styles.downloadLink}
            >
              <SparkleButton className={styles.downloadButton}>
                حمّل دليل الوجهة الإضافي
              </SparkleButton>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
