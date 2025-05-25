import { useState, useEffect } from 'react';
import Script from 'next/script';
import Cookies from 'js-cookie';
import { GTM_ID, initializeDataLayer } from '../../lib/gtm';
import styles from './CookieConsent.module.scss';

const CookieConsent = () => {
  const [cookieState, setCookieState] = useState('not-answered');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for existing cookie consent
    const state = Cookies.get('cookie-consent-state');
    if (state) {
      setCookieState(state);
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (state) => {
    // Set cookie with 1 year expiration
    Cookies.set('cookie-consent-state', state, { expires: 365, sameSite: 'Lax' });
    setCookieState(state);
    setIsVisible(false);

    // Initialize dataLayer if consent is given
    if (state === 'accepted') {
      initializeDataLayer();
    }
  };

  const reopenConsent = () => {
    setIsVisible(true);
    setCookieState('not-answered');
  };

  // Render GTM scripts only if consent is given
  const renderGTMScripts = () => {
    if (cookieState !== 'accepted' || !GTM_ID) return null;

    return (
      <>
        {/* Google Tag Manager Script */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
      </>
    );
  };

  // Render consent banner
  const renderConsentBanner = () => {
    if (!isVisible || cookieState !== 'not-answered') return null;

    return (
      <div className={styles.cookieBanner}>
        <div className={styles.cookieContent}>
          <div className={styles.cookieText}>
            <h3>🍪 نحن نستخدم ملفات تعريف الارتباط</h3>
            <p>
              نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل حركة المرور على موقعنا. 
              هل توافق على استخدام ملفات تعريف الارتباط؟
            </p>
          </div>
          <div className={styles.cookieButtons}>
            <button
              className={`${styles.button} ${styles.acceptButton}`}
              onClick={() => handleConsent('accepted')}
            >
              موافق
            </button>
            <button
              className={`${styles.button} ${styles.rejectButton}`}
              onClick={() => handleConsent('rejected')}
            >
              رفض
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render cookie settings button for rejected users
  const renderCookieButton = () => {
    if (cookieState !== 'rejected') return null;

    return (
      <button
        className={styles.cookieSettingsButton}
        onClick={reopenConsent}
        title="إعدادات ملفات تعريف الارتباط"
      >
        🍪
      </button>
    );
  };

  return (
    <>
      {renderGTMScripts()}
      {renderConsentBanner()}
      {renderCookieButton()}
    </>
  );
};

export default CookieConsent; 