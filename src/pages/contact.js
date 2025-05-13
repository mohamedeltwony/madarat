import React, { useState } from 'react';
import Head from 'next/head';
import { FaMapMarkerAlt, FaPhone, FaWhatsapp, FaClock, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import styles from '../styles/pages/Contact.module.scss';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Here you would send the data to your backend
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate successful submission
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting message:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>تواصل معنا | مدارات الكون للسفر والسياحة</title>
        <meta name="description" content="تواصل مع فريق مدارات الكون للسياحة والسفر واحصل على المساعدة في تخطيط رحلتك المثالية." />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>تواصل معنا</h1>
          <p>نحن هنا لمساعدتك في تخطيط رحلة أحلامك. لا تتردد في التواصل معنا بأي طريقة مناسبة لك.</p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h2>مدارات الكون للسفر والسياحة</h2>
              <div className={styles.rating}>
                <span>4.9</span>
                <div className={styles.stars}>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
                <span className={styles.reviews}>من تقييمات Google</span>
              </div>

              <div className={styles.contactMethods}>
                <div className={styles.contactMethod}>
                  <div className={styles.icon}><FaMapMarkerAlt /></div>
                  <div className={styles.details}>
                    <h3>العنوان</h3>
                    <p>طريق أنس بن مالك، الملقا، الرياض 13521، المملكة العربية السعودية</p>
                    <p className={styles.subDetails}>المتواجد في: الملقا، ريحانة بوليفارد</p>
                    <a href="https://www.google.com/maps/place/Madarat+Alkon+tourism+-+شركة+مدارات+الكون+للسفر+و+السياحة%E2%80%AD/@24.8082875,46.6191728,17z" target="_blank" rel="noopener noreferrer" className={styles.directionButton}>
                      الاتجاهات
                    </a>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.icon}><FaPhone /></div>
                  <div className={styles.details}>
                    <h3>اتصل بنا</h3>
                    <a href="tel:920034019" className={styles.phoneNumber}>920034019</a>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.icon}><FaWhatsapp /></div>
                  <div className={styles.details}>
                    <h3>واتساب</h3>
                    <a href="https://wa.me/966920034019" target="_blank" rel="noopener noreferrer" className={styles.whatsappNumber}>920034019</a>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.icon}><FaEnvelope /></div>
                  <div className={styles.details}>
                    <h3>البريد الإلكتروني</h3>
                    <a href="mailto:info@madarat.com" className={styles.email}>info@madarat.com</a>
                  </div>
                </div>

                <div className={styles.contactMethod}>
                  <div className={styles.icon}><FaClock /></div>
                  <div className={styles.details}>
                    <h3>ساعات العمل</h3>
                    <div className={styles.hours}>
                      <div className={styles.hourRow}>
                        <span className={styles.day}>الأحد</span>
                        <span className={styles.time}>12 م - 9 م</span>
                      </div>
                      <div className={styles.hourRow}>
                        <span className={styles.day}>الإثنين</span>
                        <span className={styles.time}>12 م - 9 م</span>
                      </div>
                      <div className={styles.hourRow}>
                        <span className={styles.day}>الثلاثاء</span>
                        <span className={styles.time}>12 م - 9 م</span>
                      </div>
                      <div className={styles.hourRow}>
                        <span className={styles.day}>الأربعاء</span>
                        <span className={styles.time}>12 م - 9 م</span>
                      </div>
                      <div className={styles.hourRow}>
                        <span className={styles.day}>الخميس</span>
                        <span className={styles.time}>12 م - 9 م</span>
                      </div>
                      <div className={styles.hourRow}>
                        <span className={styles.day}>الجمعة</span>
                        <span className={styles.time}>مغلق</span>
                      </div>
                      <div className={styles.hourRow}>
                        <span className={styles.day}>السبت</span>
                        <span className={styles.time}>12 م - 9 م</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.mapContainer}>
            <h2>موقعنا</h2>
            <div className={styles.map}>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3622.4914371055103!2d46.616998800000004!3d24.808287500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2ee5c8fd8844ab%3A0x99a435db09f7b6d4!2sMadarat%20Alkon%20tourism%20-%20%D8%B4%D8%B1%D9%83%D8%A9%20%D9%85%D8%AF%D8%A7%D8%B1%D8%A7%D8%AA%20%D8%A7%D9%84%D9%83%D9%88%D9%86%20%D9%84%D9%84%D8%B3%D9%81%D8%B1%20%D9%88%20%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AD%D8%A9%E2%80%AD!5e0!3m2!1sen!2sus!4v1685536163350!5m2!1sen!2sus" 
                width="100%" 
                height="450" 
                style={{ border: 0 }}
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="موقع مدارات الكون للسياحة"
              ></iframe>
            </div>
          </div>

          <div className={styles.contactFormContainer}>
            <h2>أرسل لنا رسالة</h2>
            <p>يمكنك إرسال استفسارك وسنقوم بالرد عليك في أقرب وقت ممكن</p>
            
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
                  ></textarea>
                </div>
                
                {submitStatus === 'error' && (
                  <div className={styles.errorMessage}>
                    حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.
                  </div>
                )}
                
                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage; 