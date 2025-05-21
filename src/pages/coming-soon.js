import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../styles/ComingSoon.module.scss';
import LeadForm from '@/components/LeadMagnets/LeadForm';

export default function ComingSoon() {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const launchDate = new Date();
    launchDate.setDate(launchDate.getDate() + 30); // Launch in 30 days

    const timer = setInterval(() => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();
      
      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFormSuccess = (data) => {
    console.log('Form submitted:', data);
    // You can add additional tracking here
  };

  return (
    <div className={styles.splitContainer} dir="rtl">
      <Head>
        <title>قريباً | مدارات الكون للسفر والسياحة</title>
        <meta name="description" content="مدارات الكون للسفر والسياحة - منصتكم المثالية لتخطيط رحلات سفر استثنائية مع خدمات متكاملة وباقات متنوعة. انضم إلينا في رحلة لن تنساها." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.imageSide}>
        <div className={styles.imageContent}>
          <div className={styles.logoContainerImage}>
            <Image 
              src="/Madarat_logo.png" 
              alt="شعار مدارات الكون" 
              width={220} 
              height={68} 
              priority
            />
          </div>
          <h2 className={styles.imageTagline}>
            اكتشف العالم مع <span className={styles.accentColor}>مدارات الكون</span>
          </h2>
          <p className={styles.imageDescription}>
            وجهات متنوعة، خدمة متكاملة، تجارب فريدة
          </p>
        </div>
        <div className={styles.imageOverlay}></div>
      </div>

      <div className={styles.contentSide}>
        <div className={styles.contentInner}>
          <h1 className={styles.title}>
            <span>تجربة سفر جديدة تنتظركم قريباً</span>
            <div className={styles.subtitle}>نعمل بجد لجعل رحلات سفركم لا تُنسى وأكثر متعة مع مدارات الكون للسفر والسياحة</div>
          </h1>

          <div className={styles.countdown}>
            <div className={styles.countdownItem}>
              <span className={styles.countdownNumber}>{seconds}</span>
              <span className={styles.countdownLabel}>ثواني</span>
            </div>
            <div className={styles.countdownItem}>
              <span className={styles.countdownNumber}>{minutes}</span>
              <span className={styles.countdownLabel}>دقائق</span>
            </div>
            <div className={styles.countdownItem}>
              <span className={styles.countdownNumber}>{hours}</span>
              <span className={styles.countdownLabel}>ساعات</span>
            </div>
            <div className={styles.countdownItem}>
              <span className={styles.countdownNumber}>{days}</span>
              <span className={styles.countdownLabel}>أيام</span>
            </div>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>✈️</div>
              <h3>وجهات سياحية متنوعة</h3>
              <p>اكتشف أفضل الوجهات السياحية حول العالم مع باقات سفر مصممة خصيصاً لتناسب تطلعاتك واهتماماتك</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🏨</div>
              <h3>إقامات فاخرة وراحة تامة</h3>
              <p>استمتع بإقامة في أفخم الفنادق والمنتجعات العالمية المختارة بعناية لضمان راحتك ورفاهيتك</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🧳</div>
              <h3>تجارب سفر مميزة ومتكاملة</h3>
              <p>برامج سياحية متكاملة تشمل النقل والإقامة والجولات السياحية مع مرشدين محترفين لتجربة سفر لا تُنسى</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💰</div>
              <h3>أسعار تنافسية وقيمة استثنائية</h3>
              <p>باقات سفر بأسعار مناسبة للجميع مع خيارات متعددة تناسب مختلف الميزانيات دون المساس بالجودة</p>
            </div>
          </div>

          <div className={styles.formSection}>
            <LeadForm
              title="سجل اهتمامك واحصل على عروضنا الحصرية أولاً"
              subtitle="انضم إلينا الآن وكن من أول المسافرين مع مدارات الكون. سنبقيك على اطلاع بأحدث العروض والوجهات والباقات الخاصة"
              buttonText="أرسل بياناتك الآن"
              onSuccess={handleFormSuccess}
              formStyle="subscriptionForm"
            />
          </div>

          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon} aria-label="Instagram">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.162c3.204 0 3.584.012 4.849.07 1.308.06 2.655.358 3.608 1.311.962.962 1.251 2.296 1.311 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.849c-.06 1.308-.358 2.655-1.311 3.608-.962.962-2.296 1.251-3.608 1.311-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07c-1.308-.06-2.655-.358-3.608-1.311-.962-.962-1.251-2.296-1.311-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849c.06-1.308.358-2.655 1.311-3.608.962-.962 2.296-1.251 3.608-1.311 1.265-.058 1.645-.07 4.849-.07M12 0C8.741 0 8.332.014 7.052.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.052.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.085 1.855.601 3.697 1.942 5.038 1.341 1.341 3.183 1.857 5.038 1.942 1.28.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 1.855-.085 3.697-.601 5.038-1.942 1.341-1.341 1.857-3.183 1.942-5.038.058-1.28.072-1.689.072-4.948 0-3.259-.014-3.668-.072-4.948-.085-1.855-.601-3.697-1.942-5.038C20.643.673 18.801.157 16.948.072 15.668.014 15.259 0 12 0z" fill="currentColor"/>
                <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" fill="currentColor"/>
                <circle cx="18.406" cy="5.594" r="1.44" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Facebook">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" fill="currentColor"/>
              </svg>
            </a>
            <a href="#" className={styles.socialIcon} aria-label="Twitter">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.954 4.569a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.691 8.094 4.066 6.13 1.64 3.161a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.061a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63a9.936 9.936 0 002.46-2.548l-.047-.02z" fill="currentColor"/>
              </svg>
            </a>
          </div>

          <footer className={styles.footer}>
            <p>© {new Date().getFullYear()} مدارات الكون للسفر والسياحة. جميع الحقوق محفوظة.</p>
          </footer>
        </div>
      </div>
    </div>
  );
} 