import React from 'react';
import Head from 'next/head';
import { 
  EnhancedGoldButton, 
  SimpleGoldButton, 
  PureDivGoldButton, 
  OptimizedGoldButton, 
  PureBlackGoldButton
} from '../components/UI';
import styles from '../styles/TestButtons.module.css';

export default function ButtonComparisonPage() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Gold Button Comparison</title>
        <meta name="description" content="Comparison of different gold button implementations" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Gold Button Comparison</h1>
        <p className={styles.description}>
          Compare different gold button implementations against various backgrounds
        </p>

        {/* Light Gold / Yellow Background */}
        <div className={styles.comparisonContainer}>
          <h2 className={styles.sectionTitle}>Against Light Gold/Yellow Background</h2>
          <div 
            className={styles.buttonRow} 
            style={{ background: 'linear-gradient(45deg, #ffd700, #ffb300)' }}
          >
            <div className={styles.buttonWithLabel}>
              <span>EnhancedGoldButton (New)</span>
              <EnhancedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>SimpleGoldButton</span>
              <SimpleGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureDivGoldButton</span>
              <PureDivGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>OptimizedGoldButton</span>
              <OptimizedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureBlackGoldButton</span>
              <PureBlackGoldButton text="Gold Button" />
            </div>
          </div>
        </div>

        {/* Brown/Olive Background */}
        <div className={styles.comparisonContainer}>
          <h2 className={styles.sectionTitle}>Against Brown/Olive Background</h2>
          <div 
            className={styles.buttonRow} 
            style={{ background: 'linear-gradient(45deg, #8B4513, #808000)' }}
          >
            <div className={styles.buttonWithLabel}>
              <span>EnhancedGoldButton (New)</span>
              <EnhancedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>SimpleGoldButton</span>
              <SimpleGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureDivGoldButton</span>
              <PureDivGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>OptimizedGoldButton</span>
              <OptimizedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureBlackGoldButton</span>
              <PureBlackGoldButton text="Gold Button" />
            </div>
          </div>
        </div>

        {/* Blue Background */}
        <div className={styles.comparisonContainer}>
          <h2 className={styles.sectionTitle}>Against Blue Background</h2>
          <div 
            className={styles.buttonRow} 
            style={{ background: 'linear-gradient(45deg, #0047AB, #4169E1)' }}
          >
            <div className={styles.buttonWithLabel}>
              <span>EnhancedGoldButton (New)</span>
              <EnhancedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>SimpleGoldButton</span>
              <SimpleGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureDivGoldButton</span>
              <PureDivGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>OptimizedGoldButton</span>
              <OptimizedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureBlackGoldButton</span>
              <PureBlackGoldButton text="Gold Button" />
            </div>
          </div>
        </div>

        {/* Green Background */}
        <div className={styles.comparisonContainer}>
          <h2 className={styles.sectionTitle}>Against Green Background</h2>
          <div 
            className={styles.buttonRow} 
            style={{ background: 'linear-gradient(45deg, #006400, #32CD32)' }}
          >
            <div className={styles.buttonWithLabel}>
              <span>EnhancedGoldButton (New)</span>
              <EnhancedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>SimpleGoldButton</span>
              <SimpleGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureDivGoldButton</span>
              <PureDivGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>OptimizedGoldButton</span>
              <OptimizedGoldButton text="Gold Button" />
            </div>

            <div className={styles.buttonWithLabel}>
              <span>PureBlackGoldButton</span>
              <PureBlackGoldButton text="Gold Button" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 