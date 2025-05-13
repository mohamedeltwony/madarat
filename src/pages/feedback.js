import { useState } from 'react';
import Head from 'next/head';
import {
  FaEnvelope,
  FaPhone,
  FaCommentAlt,
  FaUser,
  FaPaperPlane,
} from 'react-icons/fa';
import LocalizedLink from '../components/LocalizedLink';
import styles from '../styles/pages/Feedback.module.scss';

const FeedbackPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    type: 'complaint', // 'complaint' or 'suggestion'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would send the data to your backend
      // Example:
      // const response = await fetch('/api/submit-feedback', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful submission
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        type: 'complaint',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>شكاوى واقتراحات | مدارات الكون</title>
        <meta
          name="description"
          content="نرحب بشكاويكم واقتراحاتكم لتحسين خدماتنا السياحية"
        />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>شكاوى واقتراحات</h1>
          <p>
            نهتم برأيك ونسعى دائماً لتطوير خدماتنا، يرجى تعبئة النموذج أدناه
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.formContainer}>
            {submitStatus === 'success' ? (
              <div className={styles.thankYou}>
                <div className={styles.thankYouIcon}>
                  <FaPaperPlane />
                </div>
                <h2>شكراً لك!</h2>
                <p>
                  تم استلام رسالتك بنجاح وسنقوم بالرد عليك في أقرب وقت ممكن.
                </p>
                <button
                  className={styles.newMessageBtn}
                  onClick={() => setSubmitStatus(null)}
                >
                  إرسال رسالة أخرى
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.feedbackForm}>
                <div className={styles.formTypeSelector}>
                  <button
                    type="button"
                    className={`${styles.typeButton} ${formData.type === 'complaint' ? styles.active : ''}`}
                    onClick={() => handleTypeChange('complaint')}
                  >
                    <FaCommentAlt /> شكوى
                  </button>
                  <button
                    type="button"
                    className={`${styles.typeButton} ${formData.type === 'suggestion' ? styles.active : ''}`}
                    onClick={() => handleTypeChange('suggestion')}
                  >
                    <FaCommentAlt /> اقتراح
                  </button>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="name">
                    <FaUser /> الاسم الكامل
                  </label>
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
                    <label htmlFor="email">
                      <FaEnvelope /> البريد الإلكتروني
                    </label>
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
                    <label htmlFor="phone">
                      <FaPhone /> رقم الجوال
                    </label>
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
                  <label htmlFor="subject">
                    موضوع{' '}
                    {formData.type === 'complaint' ? 'الشكوى' : 'الاقتراح'}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder={`أدخل موضوع ${formData.type === 'complaint' ? 'الشكوى' : 'الاقتراح'}`}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">التفاصيل</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder={`يرجى كتابة تفاصيل ${formData.type === 'complaint' ? 'الشكوى' : 'الاقتراح'}`}
                  />
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
                  {isSubmitting ? 'جاري الإرسال...' : 'إرسال'}
                </button>
              </form>
            )}
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h3>تواصل معنا مباشرة</h3>
              <p>يمكنك التواصل معنا من خلال:</p>

              <div className={styles.contactMethod}>
                <FaPhone />
                <div>
                  <h4>اتصل بنا</h4>
                  <a href="tel:920034019">920034019</a>
                </div>
              </div>

              <div className={styles.contactMethod}>
                <FaEnvelope />
                <div>
                  <h4>راسلنا</h4>
                  <a href="mailto:info@madarat.com">info@madarat.com</a>
                </div>
              </div>

              <div className={styles.note}>
                <p>نحن نقدر آراءك ونعمل جاهدين على تحسين خدماتنا بشكل مستمر.</p>
                <p>سنقوم بالرد على شكواك خلال 24 ساعة من وقت استلامها.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;
