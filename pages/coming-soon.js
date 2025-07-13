import Head from 'next/head';
import styles from '../src/styles/pages/ComingSoon.module.scss';

export default function ComingSoon() {
  return (
    <>
      <Head>
        <title>الموقع معلق - عدم سداد رسوم التطوير</title>
        <meta name="description" content="الموقع معلق نهائياً بسبب عدم سداد رسوم التطوير والتصميم المستحقة للمطور" />
        <meta name="robots" content="noindex, nofollow" />

      </Head>
      
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logo}>
            <h1>مدارات</h1>
            <span>MADARAT</span>
          </div>
          
          <div className={styles.mainMessage}>
            <h2>الموقع معلق نهائياً</h2>
            <p className={styles.subtitle}>
              تم إيقاف الموقع بسبب عدم سداد رسوم التطوير والتصميم المستحقة للمطور
            </p>
          </div>
          
          <div className={styles.description}>
            <p>
              <strong>تنبيه مهم:</strong> الموقع محجوب حالياً بسبب تأخر سداد المستحقات المالية المتفق عليها.
            </p>
            <p>
              لن يتم إعادة تشغيل الموقع إلا بعد تسوية جميع المستحقات المالية كاملة.
            </p>
            <p>
              هذا الإجراء ضروري لحماية حقوق المطور وضمان استمرارية الخدمة.
            </p>
          </div>
          
          <div className={styles.contactInfo}>
            <h3>لتسوية المستحقات</h3>
            <p>يرجى التواصل فوراً مع المطور لتسوية المبالغ المستحقة</p>
            <p style={{ color: '#e53e3e', fontWeight: 'bold', marginTop: '1rem' }}>
              ⚠️ الموقع سيبقى معلقاً حتى السداد الكامل
            </p>
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