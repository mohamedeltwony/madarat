import styles from './JoinMission.module.scss';

const JoinMission = () => {
  return (
    <section id="mission" className={styles.missionSection}>
      <div className={styles.sectionBackground}></div>
      <div className={styles.overlay}></div>
      <div className={styles.sectionContent}>
        <h2 className={styles.title}>انضم إلى رحلتنا</h2>
        <p className={styles.description}>
          اكتشف عالماً مليئاً بالمغامرات والتجارب الاستثنائية. نحن هنا لنقدم لك أفضل الخدمات السياحية وأجمل الوجهات حول العالم.
        </p>
        <button className={styles.ctaButton}>
          ابدأ رحلتك الآن
        </button>
        <div className={styles.gridContainer}>
          <div className={styles.gridItem}>
            <div className={styles.iconContainer}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
                <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm95.8 32.6L272 480l-32-136 32-56h-96l32 56-32 136-47.8-191.4C56.9 292 0 350.3 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-72.1-56.9-130.4-128.2-133.8z"></path>
              </svg>
            </div>
            <h3 className={styles.gridTitle}>احجز رحلتك الآن</h3>
            <p className={styles.gridDescription}>
              احجز رحلتك المثالية واستكشف أجمل الوجهات السياحية حول العالم مع خدماتنا المتميزة.
            </p>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.iconContainer}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
                <path d="M497.39 361.8l-112-48a24 24 0 0 0-28 6.9l-49.6 60.6A370.66 370.66 0 0 1 130.6 204.11l60.6-49.6a23.94 23.94 0 0 0 6.9-28l-48-112A24.16 24.16 0 0 0 122.6.61l-104 24A24 24 0 0 0 0 48c0 256.5 207.9 464 464 464a24 24 0 0 0 23.4-18.6l24-104a24.29 24.29 0 0 0-14.01-27.6z"></path>
              </svg>
            </div>
            <h3 className={styles.gridTitle}>اتصل بنا</h3>
            <p className={styles.gridDescription}>
              تواصل معنا للحصول على أفضل الخدمات السياحية واستشارات السفر المتخصصة.
            </p>
          </div>
          <div className={styles.gridItem}>
            <div className={styles.iconContainer}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="28" width="28" xmlns="http://www.w3.org/2000/svg">
                <path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path>
              </svg>
            </div>
            <h3 className={styles.gridTitle}>ملاحظات وشكاوى</h3>
            <p className={styles.gridDescription}>
              شاركنا آراءك وملاحظاتك لتحسين خدماتنا وتطوير تجربة السفر معنا.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinMission; 