import Head from 'next/head';
import styles from '../src/styles/pages/ComingSoon.module.scss';

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>الموقع مغلق مؤقتاً - Madarat</title>
        <meta name="description" content="الموقع مغلق مؤقتاً لأعمال الصيانة والتطوير" />
        <meta name="robots" content="noindex, nofollow" />

      </Head>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <h1>مدارات</h1>
            <span>MADARAT</span>
          </div>
          
          <div className={styles.mainMessage}>
            <h2>الموقع مغلق مؤقتاً</h2>
            <p className={styles.subtitle}>
              نعتذر عن الإزعاج - الموقع مغلق حالياً لحين سداد رسوم التطوير والصيانة
            </p>
          </div>
          
          <div className={styles.description}>
            <p>
              نحن نعمل على تحسين تجربتك معنا. سيتم إعادة تشغيل الموقع قريباً بمميزات جديدة ومحسنة.
            </p>
            <p>
              شكراً لصبركم وتفهمكم.
            </p>
          </div>
          
          <div className={styles.contactInfo}>
            <h3>للاستفسارات</h3>
            <p>يرجى التواصل مع فريق التطوير</p>
          </div>
          
          <div className={styles.loadingBar}>
            <div className={styles.progress}></div>
          </div>
        </div>
        
        <div className={styles.background}>
          <div className={styles.wave1}></div>
          <div className={styles.wave2}></div>
          <div className={styles.wave3}></div>
        </div>
      </div>
    </>
  );
} 