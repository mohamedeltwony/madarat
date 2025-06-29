import { useState, useEffect } from 'react';
import Head from 'next/head';
import Meta from '@/components/Meta';
import { getSiteMetadataREST, getAllMenusREST } from '@/lib/rest-api';
import styles from '@/styles/pages/BookNow.module.scss';
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';

export default function BookNowPage({ metadata, menus, destinations = [] }) {
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    destination: '— الرجاء تحديد اختيار —',
    nationality: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number (required)
    if (!formData.phone.trim()) {
      setError('يرجى إدخال رقم الجوال');
      return;
    }

    // Validate destination
    if (formData.destination === '— الرجاء تحديد اختيار —') {
      setError('يرجى اختيار الوجهة');
      return;
    }

    // Validate nationality
    if (!formData.nationality) {
      setError('الرجاء اختيار الجنسية');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Generate unique IDs for tracking
      const leadEventId = crypto.randomUUID();
      const externalId = crypto.randomUUID();

      // Helper function to get browser and device information
      const getBrowserAndDeviceInfo = (userAgent) => {
        const info = {
          browser: 'Unknown',
          os: 'Unknown',
          device: 'Unknown',
        };
        
        // Browser detection
        if (/Firefox/i.test(userAgent)) info.browser = 'Firefox';
        else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent) && !/OPR/i.test(userAgent)) info.browser = 'Chrome';
        else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) info.browser = 'Safari';
        else if (/Edg/i.test(userAgent)) info.browser = 'Edge';
        else if (/OPR/i.test(userAgent)) info.browser = 'Opera';
        else if (/MSIE|Trident/i.test(userAgent)) info.browser = 'Internet Explorer';
        
        // OS detection
        if (/Windows/i.test(userAgent)) info.os = 'Windows';
        else if (/Macintosh|Mac OS X/i.test(userAgent)) info.os = 'macOS';
        else if (/Android/i.test(userAgent)) info.os = 'Android';
        else if (/iPhone|iPad|iPod/i.test(userAgent)) info.os = 'iOS';
        else if (/Linux/i.test(userAgent)) info.os = 'Linux';
        
        // Device vendor detection (simplified)
        if (/iPhone|iPad|iPod/i.test(userAgent)) info.device = 'Apple';
        else if (/Android.*Samsung/i.test(userAgent)) info.device = 'Samsung';
        else if (/Android.*Pixel/i.test(userAgent)) info.device = 'Google';
        else if (/Android.*Huawei/i.test(userAgent)) info.device = 'Huawei';
        else if (/Macintosh|Mac OS X/i.test(userAgent)) info.device = 'Apple';
        else if (/Windows/i.test(userAgent)) info.device = 'PC';
        
        return info;
      };

      // Helper function to get cookie value
      const getCookie = (name) => {
        if (typeof document === 'undefined') return null;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
      };

      // Get URL parameters and browser info
      const queryParams = new URLSearchParams(window.location.search);
      const userAgent = navigator.userAgent;
      const browserInfo = getBrowserAndDeviceInfo(userAgent);
      
      console.log('Browser detection result:', browserInfo); // Debug log

      // Collect all tracking data
      const clientData = {
        utm_source: queryParams.get('utm_source') || 'direct',
        utm_medium: queryParams.get('utm_medium') || 'none',
        utm_campaign: queryParams.get('utm_campaign') || 'none',
        utm_term: queryParams.get('utm_term') || 'none',
        utm_content: queryParams.get('utm_content') || 'none',
        screen_width: typeof window !== 'undefined' ? window.screen.width : null,
        screen_height: typeof window !== 'undefined' ? window.screen.height : null,
        device_vendor: browserInfo.device,
        operating_system: browserInfo.os,
        browser: browserInfo.browser,
        user_agent: userAgent,
        fb_browser_id: getCookie('_fbp') || 'none',
        fb_click_id: getCookie('_fbc') || 'none',
        referrer: document.referrer || 'direct',
      };

      // Prepare payload for Zapier with all comprehensive data
      const zapierPayload = {
        phone: formData.phone,
        name: formData.name,
        email: formData.email,
        destination: formData.destination,
        tripName: 'Book Now General Inquiry',
        price: 0,
        nationality: formData.nationality,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        leadEventId: leadEventId,
        externalId: externalId,
        emails: [
          'mohammed@madaratalkon.com',
          'hesham@madaratalkon.com',
        ],
        formSource: 'book-now-page',
        // Add all the tracking data
        ...clientData
      };

      // Send data to Zapier proxy
      const response = await fetch('/api/zapier-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(zapierPayload),
      });

      const result = await response.json();

      if (result.success) {
        console.log('Form submitted successfully:', formData);
        setFormSubmitted(true);
      } else {
        throw new Error(result.error || 'Failed to submit form');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>احجز رحلتك الآن | مدارات الكون</title>
        <meta 
          name="description" 
          content="احجز رحلتك السياحية المثالية مع مدارات الكون واستمتع بتجربة سفر لا تُنسى بأفضل الأسعار والخدمات"
        />
        <link rel="canonical" href="https://madaratalkon.sa/book-now" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="احجز رحلتك الآن | مدارات الكون" />
        <meta property="og:description" content="احجز رحلتك السياحية المثالية مع مدارات الكون واستمتع بتجربة سفر لا تُنسى بأفضل الأسعار والخدمات" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://madaratalkon.sa/book-now" />
        <meta property="og:site_name" content="مدارات الكون" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="احجز رحلتك الآن | مدارات الكون" />
        <meta name="twitter:description" content="احجز رحلتك السياحية المثالية مع مدارات الكون واستمتع بتجربة سفر لا تُنسى بأفضل الأسعار والخدمات" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="مدارات الكون" />
      </Head>

      <div className="rtl">
        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>احجز رحلتك المثالية الآن</h1>
            <p className={styles.heroSubtitle}>
              نوفر لك تجربة سفر استثنائية مع أفضل الخدمات والأسعار المناسبة
            </p>
          </div>
        </div>

        <div className={styles.bookNowContainer}>
          <div className={styles.bookNowContent}>
            <div className={styles.formWrapper}>
              {formSubmitted ? (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      width="64"
                      height="64"
                    >
                      <path
                        fillRule="evenodd"
                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h2 className={styles.successTitle}>تم إرسال طلبك بنجاح!</h2>
                  <p className={styles.successText}>
                    شكراً لك! سيقوم فريقنا بالتواصل معك في أقرب وقت ممكن لتأكيد
                    حجزك وتقديم كافة التفاصيل اللازمة.
                  </p>
                  <button
                    className={`${styles.newRequestButton} ${styles.cairoFont}`}
                    onClick={() => {
                      setFormData({
                        phone: '',
                        name: '',
                        email: '',
                        destination: '— الرجاء تحديد اختيار —',
                        nationality: '',
                      });
                      setFormSubmitted(false);
                    }}
                  >
                    إرسال طلب جديد
                  </button>
                </div>
              ) : (
                <div className={styles.formCard}>
                  <div className={styles.formInfo}>
                    <h2 className={styles.formTitle}>نموذج طلب الحجز</h2>
                    <p className={styles.formDescription}>
                      املأ النموذج أدناه وسيتواصل معك أحد مستشاري السفر في أقرب وقت لترتيب رحلتك المثالية
                    </p>
                  </div>

                  {error && (
                    <div className={styles.errorMessage}>
                      <span>{error}</span>
                    </div>
                  )}

                  <form className={styles.bookingForm} onSubmit={handleSubmit}>
                    <div
                      className={`${styles.formGroup} ${styles.floatingLabelGroup} ${styles.phoneGroup}`}
                    >
                      <div className={styles.phoneInput}>
                        <input
                          id="phone"
                          className={`${styles.formInput} ${styles.cairoFont}`}
                          placeholder=" "
                          autoComplete="tel"
                          required
                          type="tel"
                          value={formData.phone}
                          name="phone"
                          onChange={handleChange}
                        />
                      </div>
                      <label htmlFor="phone" className={styles.formLabel}>
                        الجوال
                      </label>
                    </div>

                    <div
                      className={`${styles.formGroup} ${styles.floatingLabelGroup}`}
                    >
                      <input
                        id="name"
                        className={`${styles.formInput} ${styles.cairoFont}`}
                        placeholder=" "
                        autoComplete="name"
                        type="text"
                        value={formData.name}
                        name="name"
                        onChange={handleChange}
                      />
                      <label htmlFor="name" className={styles.formLabel}>
                        الاسم الكامل (اختياري)
                      </label>
                    </div>

                    <div
                      className={`${styles.formGroup} ${styles.floatingLabelGroup}`}
                    >
                      <input
                        id="email"
                        className={`${styles.formInput} ${styles.cairoFont}`}
                        placeholder=" "
                        autoComplete="email"
                        type="email"
                        value={formData.email}
                        name="email"
                        onChange={handleChange}
                      />
                      <label htmlFor="email" className={styles.formLabel}>
                        البريد الإلكتروني (اختياري)
                      </label>
                    </div>

                    <div
                      className={`${styles.formGroup} ${styles.floatingLabelGroup}`}
                    >
                      <select
                        id="destination"
                        name="destination"
                        className={`${styles.formSelect} ${styles.cairoFont}`}
                        value={formData.destination}
                        onChange={handleChange}
                        required
                      >
                        <option value="— الرجاء تحديد اختيار —">
                          — الرجاء تحديد اختيار —
                        </option>
                        {(destinations || []).map((destination) => (
                          <option key={destination.id} value={destination.name}>
                            {destination.name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="destination" className={styles.formLabel}>
                        الوجهة
                      </label>
                    </div>

                    {/* Nationality radio group */}
                    <div className={`${styles.formGroup} ${styles.nationalityGroup}`}>
                      <div className={styles.radioGroup}>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name="nationality"
                            value="مواطن"
                            checked={formData.nationality === 'مواطن'}
                            onChange={handleChange}
                            required
                          />
                          <span>مواطن</span>
                        </label>
                        <label className={styles.radioLabel}>
                          <input
                            type="radio"
                            name="nationality"
                            value="مقيم"
                            checked={formData.nationality === 'مقيم'}
                            onChange={handleChange}
                            required
                          />
                          <span>مقيم</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`${styles.bookingSubmitButton} ${styles.cairoFont}`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? 'جاري الإرسال...'
                        : 'اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين السياحة لدينا'}
                    </button>
                  </form>

                  <div className={styles.featuresSection}>
                    <h3 className={styles.featuresTitle}>
                      لماذا تختار السفر معنا؟
                    </h3>
                    <div className={styles.featuresGrid}>
                      <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="24"
                            height="24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.75.75 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className={styles.featureContent}>
                          <h4 className={styles.featureTitle}>
                            حجز آمن ومضمون
                          </h4>
                          <p className={styles.featureDescription}>
                            ضمان استرداد كامل المبلغ في حالة عدم الحصول على
                            التأشيرة
                          </p>
                        </div>
                      </div>

                      <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="24"
                            height="24"
                          >
                            <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                          </svg>
                        </div>
                        <div className={styles.featureContent}>
                          <h4 className={styles.featureTitle}>
                            خدمة عملاء متميزة
                          </h4>
                          <p className={styles.featureDescription}>
                            دعم على مدار الساعة أثناء رحلتك من فريق متخصص يتحدث
                            العربية
                          </p>
                        </div>
                      </div>

                      <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="24"
                            height="24"
                          >
                            <path
                              fillRule="evenodd"
                              d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className={styles.featureContent}>
                          <h4 className={styles.featureTitle}>
                            فنادق في أفضل المواقع
                          </h4>
                          <p className={styles.featureDescription}>
                            نختار فنادقنا بعناية في مواقع مميزة قريبة من المعالم
                            السياحية
                          </p>
                        </div>
                      </div>

                      <div className={styles.featureItem}>
                        <div className={styles.featureIcon}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            width="24"
                            height="24"
                          >
                            <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM7.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM8.25 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM9.75 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM10.5 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM12.75 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM14.25 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 17.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 15.75a.75.75 0 100-1.5.75.75 0 000 1.5zM15 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM16.5 13.5a.75.75 0 100-1.5.75.75 0 000 1.5z" />
                            <path
                              fillRule="evenodd"
                              d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v12a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-12a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className={styles.featureContent}>
                          <h4 className={styles.featureTitle}>
                            برامج سياحية متكاملة
                          </h4>
                          <p className={styles.featureDescription}>
                            خطط سفر مدروسة تشمل أفضل المعالم والمزارات السياحية
                            في كل وجهة
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    // Fetch layout data
    const metadata = await getSiteMetadataREST();
    const { menus = [] } = await getAllMenusREST();

    // Fetch destinations from WordPress API
    const destinationsResponse = await fetch('https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?_fields=id,name&per_page=100');
    let destinations = [];
    
    if (destinationsResponse.ok) {
      const data = await destinationsResponse.json();
      // Ensure we have a valid array of destinations with required fields
      destinations = Array.isArray(data) ? data.map(item => ({
        id: item.id,
        name: item.name || ''
      })).filter(item => item.name) : [];
    } else {
      console.error('Failed to fetch destinations:', destinationsResponse.statusText);
    }

    return {
      props: {
        metadata: metadata || {},
        menus: menus || [],
        destinations: destinations || [], // Ensure we always return an array
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        metadata: {
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع السفر والرحلات الأول في الوطن العربي',
        },
        menus: [],
        destinations: [], // Return empty array on error
      },
    };
  }
}
