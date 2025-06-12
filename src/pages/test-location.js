// Test page for geolocation functionality
// This demonstrates how location data is collected and sent with forms

import React, { useState } from 'react';
import Head from 'next/head';
import { useGeolocation } from '@/hooks/useGeolocation';
import LocationIndicator from '@/components/LocationIndicator/LocationIndicator';
import styles from '@/styles/pages/TestLocation.module.scss';

const TestLocationPage = () => {
  const { locationData, loading, error, getLocationForForm, getDisplayLocation } = useGeolocation();
  const [testFormData, setTestFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestSubmission = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formLocationData = getLocationForForm();
      
      const payload = {
        ...testFormData,
        formSource: 'location-test',
        formName: 'Location Test Form',
        timestamp: new Date().toISOString(),
        externalId: crypto.randomUUID(),
        ...formLocationData,
      };

      console.log('Test submission payload:', payload);

      // Send to our Zapier proxy to test
      const response = await fetch('/api/zapier-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setSubmissionResult(result);
      
      if (result.success) {
        alert('تم إرسال النموذج بنجاح مع بيانات الموقع!');
      } else {
        alert('حدث خطأ في الإرسال: ' + result.error);
      }
      
    } catch (error) {
      console.error('Test submission error:', error);
      setSubmissionResult({ success: false, error: error.message });
      alert('حدث خطأ: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>اختبار تحديد الموقع | مدارات الكون</title>
        <meta name="description" content="صفحة اختبار لعرض كيفية عمل تحديد الموقع في النماذج" />
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>اختبار تحديد الموقع للنماذج</h1>
          <p>هذه الصفحة تعرض كيفية تحديد موقع المستخدم من عنوان IP بدون طلب إذن</p>
        </div>

        <div className={styles.content}>
          {/* Location Status */}
          <div className={styles.locationStatus}>
            <h2>حالة تحديد الموقع</h2>
            <LocationIndicator showInForm={true} className="inForm" />
            
            {locationData && (
              <div className={styles.locationDetails}>
                <h3>تفاصيل الموقع:</h3>
                <div className={styles.detailGrid}>
                  <div className={styles.detailItem}>
                    <strong>المدينة:</strong> {locationData.location?.city || 'غير محدد'}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>المنطقة:</strong> {locationData.location?.region || 'غير محدد'}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>الدولة:</strong> {locationData.location?.country || 'غير محدد'}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>المنطقة الزمنية:</strong> {locationData.location?.timezone || 'غير محدد'}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>مزود الخدمة:</strong> {locationData.location?.isp || 'غير محدد'}
                  </div>
                  <div className={styles.detailItem}>
                    <strong>مصدر البيانات:</strong> {locationData.location?.source || 'غير محدد'}
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.error}>
                <h3>خطأ في تحديد الموقع:</h3>
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Test Form */}
          <div className={styles.testForm}>
            <h2>نموذج تجريبي</h2>
            <p>قم بتعبئة هذا النموذج لاختبار إرسال بيانات الموقع إلى Zapier</p>
            
            <form onSubmit={handleTestSubmission}>
              <div className={styles.formGroup}>
                <label htmlFor="name">الاسم:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={testFormData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل اسمك"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={testFormData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">رقم الجوال:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={testFormData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="أدخل رقم جوالك"
                />
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال مع بيانات الموقع'}
              </button>
            </form>

            {submissionResult && (
              <div className={`${styles.result} ${submissionResult.success ? styles.success : styles.error}`}>
                <h3>نتيجة الإرسال:</h3>
                <pre>{JSON.stringify(submissionResult, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Location Data Preview */}
          {locationData && (
            <div className={styles.dataPreview}>
              <h2>بيانات الموقع التي سيتم إرسالها:</h2>
              <pre>{JSON.stringify(getLocationForForm(), null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TestLocationPage; 