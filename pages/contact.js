import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
// import { useGeolocation } from '@/hooks/useGeolocation';
// import { getCsrfToken } from '@/utils/csrf';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaClock,
  FaEnvelope,
  FaPaperPlane,
  FaDirections,
  FaStar,
  FaHome,
  FaBuilding,
  FaInfoCircle,
  FaCalendar,
  FaArrowRight,
} from 'react-icons/fa';

// Import layout components
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import styles from '@/styles/pages/Contact.module.scss';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Get geolocation data - temporarily disabled
  // const { locationData, loading: locationLoading, error: locationError, getLocationForForm } = useGeolocation();

  // Get CSRF token - temporarily disabled
  // const csrfToken = getCsrfToken();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simplified submission data
      const submissionData = {
        ...formData,
        formSource: 'contact-form',
        formName: 'Contact Form',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        externalId: crypto.randomUUID(),
      };

      console.log('Contact form submission:', submissionData);

      // Send to Zapier via the proxy
      const response = await fetch('/api/zapier-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      if (response.ok) {
        console.log('Contact form submitted successfully with location data');
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Failed to submit contact form');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Breadcrumb data
  const breadcrumbs = [
    { id: 'home', title: 'الرئيسية', uri: '/' },
    { id: 'contact', title: 'تواصل معنا', uri: null },
  ];

  return (
    <>
      <Head>
        <title>تواصل معنا - مدارات الكون | خدمة عملاء متميزة</title>
        <meta
          name="description"
          content="تواصل مع فريق مدارات الكون للسياحة والسفر. نحن هنا لمساعدتك في تخطيط رحلتك القادمة وتقديم أفضل الخدمات السياحية. اتصل بنا الآن للحصول على استشارة مجانية."
        />
        <meta property="og:title" content="تواصل معنا - مدارات الكون | خدمة عملاء متميزة" />
        <meta property="og:description" content="تواصل مع فريق مدارات الكون للسياحة والسفر. نحن هنا لمساعدتك في تخطيط رحلتك القادمة وتقديم أفضل الخدمات السياحية. اتصل بنا الآن للحصول على استشارة مجانية." />
        <meta property="og:url" content="https://madaratalkon.com/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://madaratalkon.com/images/contact-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="تواصل معنا - مدارات الكون" />
        <meta name="twitter:description" content="تواصل مع فريق مدارات الكون للسياحة والسفر للحصول على أفضل الخدمات السياحية." />
      </Head>

      <SEO
        title="تواصل معنا - مدارات الكون"
        description="تواصل مع فريق مدارات الكون للسياحة والسفر. نحن هنا لمساعدتك في تخطيط رحلتك القادمة وتقديم أفضل الخدمات السياحية. اتصل بنا الآن للحصول على استشارة مجانية."
        keywords="تواصل, اتصال, مدارات الكون, خدمة عملاء, استشارة سياحية"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'تواصل معنا', url: '/contact' }
        ]}
      />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>تواصل معنا</h1>
          <p>نحن هنا لمساعدتك في تخطيط رحلتك المثالية</p>
        </div>
      </div>

      {/* Breadcrumb Section */}
      <div className={styles.breadcrumbSection}>
        <div className={styles.breadcrumbContainer}>
          <ul className={styles.breadcrumbList}>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.id} className={styles.breadcrumbItem}>
                {crumb.uri ? (
                  <Link href={crumb.uri} className={styles.breadcrumbLink}>
                    {index === 0 ? (
                      <FaHome className={styles.homeIcon} />
                    ) : (
                      crumb.title
                    )}
                  </Link>
                ) : (
                  <span className={styles.breadcrumbCurrent}>
                    {crumb.title}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className={styles.breadcrumbSeparator}>/</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content with Bentobox Design */}
      <div className={styles.bentoContainer}>
        <div className={styles.bentoIntro}>
          <h2>شركة مدارات الكون للسفر والسياحة</h2>
          <p>
            نسعد بتواصلك معنا في أي وقت للاستفسار عن برامجنا السياحية أو للحجز
          </p>
        </div>

        {/* Rating Box - Feature Box */}
        <div className={`${styles.bentoBox} ${styles.ratingBox}`}>
          <div className={styles.boxContent}>
            <div className={styles.rating}>
              <span className={styles.ratingNumber}>4.9</span>
              <div className={styles.stars}>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
              </div>
            </div>
            <p className={styles.reviewsCount}>
              تقييم رائع من 279 عميل على Google
            </p>
          </div>
        </div>

        {/* Call Box - Feature Box */}
        <div className={`${styles.bentoBox} ${styles.callBox}`}>
          <div className={styles.boxContent}>
            <div className={styles.iconBox}>
              <FaPhone />
            </div>
            <div className={styles.callDetails}>
              <h3>اتصل بنا</h3>
              <a href="tel:+966112137000" className={styles.phoneLink}>
                112137000
              </a>
            </div>
          </div>
        </div>

        {/* WhatsApp Box - Feature Box */}
        <div className={`${styles.bentoBox} ${styles.whatsappBox}`}>
          <div className={styles.boxContent}>
            <div className={styles.iconBox}>
              <FaWhatsapp />
            </div>
            <div className={styles.callDetails}>
              <h3>راسلنا واتساب</h3>
              <a
                href="https://wa.me/966557011015"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappLink}
              >
                واتساب <FaArrowRight className={styles.arrowIcon} />
              </a>
            </div>
          </div>
        </div>

        {/* Directions Box - Feature Box */}
        <div className={`${styles.bentoBox} ${styles.directionsBox}`}>
          <div className={styles.boxContent}>
            <div className={styles.iconBox}>
              <FaDirections />
            </div>
            <div className={styles.directionsDetails}>
              <h3>احصل على الاتجاهات</h3>
              <a
                href="https://www.google.com/maps/place/Madarat+Alkon+tourism+-+شركة+مدارات+الكون+للسفر+و+السياحة%E2%80%AD/@24.8082875,46.6191728,17z"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.directionsLink}
              >
                خرائط جوجل <FaArrowRight className={styles.arrowIcon} />
              </a>
            </div>
          </div>
        </div>

        {/* Address Box - Information Box */}
        <div className={`${styles.bentoBox} ${styles.addressBox}`}>
          <div className={styles.boxHeader}>
            <FaMapMarkerAlt className={styles.boxIcon} />
            <h3>العنوان</h3>
          </div>
          <div className={styles.boxContent}>
            <p className={styles.addressText}>
              طريق أنس بن مالك، الملقا، الرياض 13521، المملكة العربية السعودية
            </p>
            <p className={styles.locationName}>Al-Malqa Rihana Boulevard</p>
          </div>
        </div>

        {/* Hours Box - Information Box */}
        <div className={`${styles.bentoBox} ${styles.hoursBox}`}>
          <div className={styles.boxHeader}>
            <FaCalendar className={styles.boxIcon} />
            <h3>ساعات العمل</h3>
          </div>
          <div className={styles.boxContent}>
            <div className={styles.hoursGrid}>
              <div className={styles.hourItem}>
                <span className={styles.day}>الأحد</span>
                <span className={styles.time}>12–9 م</span>
              </div>
              <div className={styles.hourItem}>
                <span className={styles.day}>الإثنين</span>
                <span className={styles.time}>12–9 م</span>
              </div>
              <div className={styles.hourItem}>
                <span className={styles.day}>الثلاثاء</span>
                <span className={styles.time}>12–9 م</span>
              </div>
              <div className={styles.hourItem}>
                <span className={styles.day}>الأربعاء</span>
                <span className={styles.time}>12–9 م</span>
              </div>
              <div className={styles.hourItem}>
                <span className={styles.day}>الخميس</span>
                <span className={styles.time}>12–9 م</span>
              </div>
              <div className={styles.hourItem}>
                <span className={styles.day}>الجمعة</span>
                <span className={styles.time}>مغلق</span>
              </div>
              <div className={styles.hourItem}>
                <span className={styles.day}>السبت</span>
                <span className={styles.time}>12–9 م</span>
              </div>
            </div>
          </div>
        </div>

        {/* Map Box - Feature Box (Larger) */}
        <div className={`${styles.bentoBox} ${styles.mapBox}`}>
          <div className={styles.boxHeader}>
            <FaMapMarkerAlt className={styles.boxIcon} />
            <h3>موقعنا</h3>
          </div>
          <div className={styles.mapWrapper}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.4914371055103!2d46.616998800000004!3d24.808287500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee5c8fd8844ab%3A0x99a435db09f7b6d4!2sMadarat%20Alkon%20tourism%20-%20%D8%B4%D8%B1%D9%83%D8%A9%20%D9%85%D8%AF%D8%A7%D8%B1%D8%A7%D8%AA%20%D8%A7%D9%84%D9%83%D9%88%D9%86%20%D9%84%D9%84%D8%B3%D9%81%D8%B1%20%D9%88%20%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9%E2%80%AD!5e0!3m2!1sen!2sus!4v1685536163350!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع مدارات الكون للسياحة"
            ></iframe>
          </div>
        </div>

        {/* Contact Form Box - Feature Box (Larger) */}
        <div className={`${styles.bentoBox} ${styles.formBox}`}>
          <div className={styles.boxHeader}>
            <FaEnvelope className={styles.boxIcon} />
            <h3>أرسل لنا رسالة</h3>
          </div>

          {submitStatus === 'success' ? (
            <div className={styles.thankYou}>
              <div className={styles.thankYouIcon}>
                <FaPaperPlane />
              </div>
              <h3>شكراً لك!</h3>
              <p>تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.</p>
              <button
                className={styles.newMessageBtn}
                onClick={() => setSubmitStatus(null)}
              >
                إرسال رسالة أخرى
              </button>
            </div>
          ) : (
            <div className={styles.boxContent}>
              <p className={styles.formIntro}>
                يمكنك إرسال استفسارك وسنقوم بالرد عليك في أقرب وقت ممكن
              </p>
              <form className={styles.contactForm} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">الاسم الكامل</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="أدخل اسمك الكامل"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">البريد الإلكتروني</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                      className={styles.formInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">رقم الجوال</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="05xxxxxxxx"
                      className={styles.formInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">الموضوع</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="موضوع الرسالة"
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">الرسالة</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="اكتب رسالتك هنا..."
                    className={styles.formTextarea}
                  ></textarea>
                </div>

                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.
                  </div>
                )}

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default ContactPage;
