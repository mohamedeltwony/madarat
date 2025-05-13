import React from 'react';
import Head from 'next/head';
import { EnhancedGoldButton, EnhancedGoldDropdownButton } from '../components/UI';
import styles from '../styles/TestButtons.module.css';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

export default function EnhancedGoldButtonsPage() {
  // Sample dropdown items
  const dropdownItems = [
    { text: 'Profile', href: '/profile' },
    { text: 'Settings', href: '/settings' },
    { type: 'divider' },
    { text: 'Help', href: '/help' },
    { text: 'Logout', onClick: () => alert('Logout clicked') }
  ];

  return (
    <div className={styles.container}>
      <Head>
        <title>Enhanced Gold Buttons Demo</title>
        <meta name="description" content="Demo page for enhanced gold buttons with true transparent backgrounds" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Enhanced Gold Buttons</h1>
        <p className={styles.description}>
          Gold-bordered buttons with true black backgrounds
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Regular Button</h2>
            <div className={styles.buttonContainer} style={{ background: 'linear-gradient(45deg, #8B4513, #CD853F)' }}>
              <EnhancedGoldButton 
                text="Standard Button" 
                onClick={() => alert('Button clicked')}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h2>Button with Icon</h2>
            <div className={styles.buttonContainer} style={{ background: 'linear-gradient(45deg, #8B4513, #CD853F)' }}>
              <EnhancedGoldButton 
                text="Explore More" 
                icon={<FiChevronRight />} 
                onClick={() => alert('Button with icon clicked')}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h2>Link Button</h2>
            <div className={styles.buttonContainer} style={{ background: 'linear-gradient(45deg, #8B4513, #CD853F)' }}>
              <EnhancedGoldButton 
                text="Go to Home" 
                href="/"
              />
            </div>
          </div>

          <div className={styles.card}>
            <h2>External Link Button</h2>
            <div className={styles.buttonContainer} style={{ background: 'linear-gradient(45deg, #8B4513, #CD853F)' }}>
              <EnhancedGoldButton 
                text="Visit Google" 
                href="https://www.google.com"
                external
                icon={<FiChevronRight />}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h2>Dropdown Button</h2>
            <div className={styles.buttonContainer} style={{ background: 'linear-gradient(45deg, #8B4513, #CD853F)' }}>
              <EnhancedGoldDropdownButton 
                text="Account" 
                items={dropdownItems}
                icon={<FiChevronDown />}
              />
            </div>
          </div>

          <div className={styles.card}>
            <h2>Button Comparison</h2>
            <div className={styles.comparisonContainer}>
              <div className={styles.buttonRow} style={{ background: 'linear-gradient(45deg, #8B4513, #CD853F)' }}>
                <EnhancedGoldButton text="Enhanced" />
                {/* You can add other button types here for comparison */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 