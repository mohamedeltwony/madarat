import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/pages/Offline.module.scss';

export default function Offline() {
  return (
    <div className={styles.offlinePage}>
      <Head>
        <title>أنت غير متصل بالإنترنت - مدارات الكون</title>
        <meta name="description" content="يبدو أنك غير متصل بالإنترنت. يرجى التحقق من اتصالك وإعادة المحاولة." />
      </Head>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>أنت غير متصل بالإنترنت</h1>
          
          <div className={styles.illustration}>
            <img 
              src="/images/world-map.png" 
              alt="World Map" 
              className={styles.worldMap}
            />
          </div>
          
          <p className={styles.message}>
            يبدو أنك غير متصل بالإنترنت حاليًا.
            <br/>
            لا تقلق، لا تزال بإمكانك استكشاف الصفحات التي قمت بزيارتها من قبل.
          </p>
          
          <div className={styles.suggestions}>
            <h3>يمكنك تجربة:</h3>
            <ul>
              <li>التحقق من اتصال الإنترنت لديك</li>
              <li>تحديث الصفحة عندما تكون متصلاً</li>
              <li>العودة إلى الصفحة السابقة</li>
            </ul>
          </div>
          
          <div className={styles.actions}>
            <button 
              className={styles.reloadButton}
              onClick={() => window.location.reload()}
            >
              إعادة المحاولة
            </button>
            <Link href="/" legacyBehavior>
              <a className={styles.homeButton}>الرئيسية</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 