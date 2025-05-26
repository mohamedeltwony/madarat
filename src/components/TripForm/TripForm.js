import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { getCsrfToken } from '@/utils/csrf';
// Lazy load the SparkleButton component
const SparkleButton = dynamic(() => import('@/components/UI/SparkleButton'), { 
  ssr: false,
  loading: () => <button className={styles.mainCTA} type="submit" disabled>إرسال</button> 
});
import styles from '@/styles/pages/LondonScotland.module.scss';

export default function TripForm({
  fields = [],
  zapierConfig = {},
  onSuccess = () => {},
}) {
  // Build initial state from fields
  const initialFormData = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || '';
    return acc;
  }, { nationality: '' });
  const [formData, setFormData] = useState(initialFormData);
  const [formStarted, setFormStarted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    setCsrfToken(getCsrfToken());
    setFormData(initialFormData);
    // eslint-disable-next-line
  }, [fields]);

  const getBrowserAndDeviceInfo = (userAgent) => {
    const info = { browser: 'Unknown', os: 'Unknown', device: 'Unknown' };
    if (/Firefox/i.test(userAgent)) info.browser = 'Firefox';
    else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent) && !/OPR/i.test(userAgent)) info.browser = 'Chrome';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) info.browser = 'Safari';
    else if (/Edg/i.test(userAgent)) info.browser = 'Edge';
    else if (/OPR/i.test(userAgent)) info.browser = 'Opera';
    else if (/MSIE|Trident/i.test(userAgent)) info.browser = 'Internet Explorer';
    if (/Windows/i.test(userAgent)) info.os = 'Windows';
    else if (/Macintosh|Mac OS X/i.test(userAgent)) info.os = 'macOS';
    else if (/Android/i.test(userAgent)) info.os = 'Android';
    else if (/iPhone|iPad|iPod/i.test(userAgent)) info.os = 'iOS';
    else if (/Linux/i.test(userAgent)) info.os = 'Linux';
    if (/iPhone|iPad|iPod/i.test(userAgent)) info.device = 'Apple';
    else if (/Android.*Samsung/i.test(userAgent)) info.device = 'Samsung';
    else if (/Android.*Pixel/i.test(userAgent)) info.device = 'Google';
    else if (/Android.*Huawei/i.test(userAgent)) info.device = 'Huawei';
    return info;
  };

  const sendFbEvent = async (eventName, data, eventId = null) => {
    const phoneDigits = data.phone?.replace(/[^0-9]/g, '');
    try {
      await fetch('/api/fb-events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          eventId,
          userData: {
            em: data.email || null,
            ph: phoneDigits || null,
            fn: data.name ? data.name.split(' ')[0] : null,
            ln:
              data.name && data.name.includes(' ')
                ? data.name.substring(data.name.indexOf(' ') + 1)
                : null,
          },
          custom_data: {
            nationality: data.nationality,
            ...fields.reduce((acc, field) => {
              acc[field.name] = data[field.name];
              return acc;
            }, {}),
          },
          eventSourceUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });
    } catch (error) {
      // Ignore errors for analytics
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    let currentPhoneValid = isPhoneValid;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (name === 'phone') {
      setPhoneTouched(true);
      const phoneRegex = /^(0|5|966)([0-9]{8,12})$/;
      currentPhoneValid = phoneRegex.test(value);
      setIsPhoneValid(currentPhoneValid);
    }
    if (
      !formStarted &&
      ['name', 'email', 'phone'].includes(name) &&
      value.trim() !== ''
    ) {
      setFormStarted(true);
      const eventId = crypto.randomUUID();
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId });
      }
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value }, eventId);
    }
  };

  const getCookie = (name) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      if ('phone' in formData && !isPhoneValid && formData.phone.trim() !== '') {
        alert('يجب أن يبدأ الرقم بـ 0 أو 5 أو 966 ويتكون من المقطع المناسب من الأرقام.');
        setIsLoading(false);
        return;
      }
      if (!formData.nationality) {
        alert('الرجاء اختيار الجنسية.');
        setIsLoading(false);
        return;
      }
      const leadEventId = crypto.randomUUID();
      const externalId = crypto.randomUUID();
      let processedPhone = formData.phone ? formData.phone.replace(/[^0-9]/g, '') : '';
      if (processedPhone.startsWith('966') && processedPhone.length >= 12) {
        processedPhone = '0' + processedPhone.substring(3);
      } else if (!processedPhone.startsWith('0') && processedPhone.startsWith('5') && processedPhone.length === 9) {
        processedPhone = '0' + processedPhone;
      }
      const queryParams = new URLSearchParams(window.location.search);
      const userAgent = navigator.userAgent;
      const browserInfo = getBrowserAndDeviceInfo(userAgent);
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
      if (formData.nationality === 'مواطن') {
        sendFbEvent('Lead', formData, leadEventId).catch(() => {});
      }
      // Build payload from all fields, nationality, and extraPayload
      const zapierPayload = {
        ...fields.reduce((acc, field) => {
          acc[field.name] = formData[field.name];
          return acc;
        }, {}),
        nationality: formData.nationality,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        leadEventId: leadEventId,
        externalId: externalId,
        ...zapierConfig.extraPayload,
        emails: [
          'mohammed@madaratalkon.com',
          'hesham@madaratalkon.com',
        ],
        ...clientData,
      };
      const response = await fetch(zapierConfig.endpoint || '/api/zapier-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,
        },
        body: JSON.stringify(zapierPayload),
      });
      if (!response.ok) throw new Error('Zapier proxy error');
      
      console.log('Zapier submission successful, preparing redirect data...');
      
      // Prepare cleaned user data for thank-you page
      const cleanedEmail = formData.email ? formData.email.toLowerCase().trim() : '';
      const cleanedPhone = formData.phone ? formData.phone.replace(/\D/g, '') : '';
      const nameParts = formData.name ? formData.name.trim().split(' ') : [];
      const firstName = nameParts.length > 0 ? nameParts[0] : '';
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
      
      // Collect Facebook browser and click IDs
      const fbp = getCookie('_fbp') || localStorage.getItem('_fbp') || '';
      const fbc = getCookie('_fbc') || localStorage.getItem('_fbc') || '';
      
      const successData = {
        processedPhone: cleanedPhone,
        externalId,
        leadEventId,
        nationality: formData.nationality,
        email: cleanedEmail,
        name: formData.name || '',
        firstName: firstName,
        lastName: lastName,
        fbp,
        fbc
      };
      
      console.log('Calling onSuccess with data:', successData);
      
      // Pass all needed data to the success handler
      onSuccess(successData);
      
      // Set loading to false after onSuccess to avoid interfering with redirect
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert('حدث خطأ في تقديم النموذج. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer + ' ' + styles.tripForm}>
      {fields.map((field) => {
        if (field.name === 'phone') {
          return (
            <div
              key={field.name}
              className={
                `${styles.formGroup} ${styles.floatingLabelGroup} ${styles.phoneGroup} ` +
                `${formData.phone ? styles.hasValue : ''} ` +
                `${phoneTouched && !isPhoneValid && formData.phone.trim() !== '' ? styles.inputError : ''}`
              }
            >
              <label htmlFor="phone" className={styles.formLabel}>
                {field.label}
              </label>
              <div className={styles.phoneInput}>
                <input
                  type="tel"
                  id="phone"
                  className={styles.formInput}
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  onBlur={() => setPhoneTouched(true)}
                  placeholder={field.placeholder || ' '}
                  autoComplete={field.autoComplete || 'tel'}
                  required={field.required}
                />
              </div>
              {phoneTouched && !isPhoneValid && formData.phone.trim() !== '' && (
                <p className={styles.errorMessage}>
                  يجب أن يبدأ الرقم بـ 0 أو 5 أو 966 ويتكون من المقطع المناسب من الأرقام.
                </p>
              )}
            </div>
          );
        }
        // Default field rendering
        return (
          <div key={field.name} className={`${styles.formGroup} ${styles.floatingLabelGroup}`}>
            <input
              type={field.type}
              id={field.name}
              className={styles.formInput}
              name={field.name}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              placeholder={field.placeholder || ' '}
              autoComplete={field.autoComplete || field.name}
              required={field.required}
            />
            <label htmlFor={field.name} className={styles.formLabel}>
              {field.label}
              {field.required ? ' *' : ''}
            </label>
          </div>
        );
      })}
      {/* Nationality radio group (always included) */}
      <div className={`${styles.formGroup} ${styles.nationalityGroup}`}>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="nationality"
              value="مواطن"
              checked={formData.nationality === 'مواطن'}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
              required
            />
            <span>مقيم</span>
          </label>
        </div>
      </div>
      <div className={styles.formActions}>
        <SparkleButton
          type="submit"
          disabled={isLoading}
          className={styles.mainCTA}
        >
          <div className={styles.buttonGlow}></div>
          <span className={styles.buttonContent}>
            اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين السياحة عندنا
          </span>
        </SparkleButton>
      </div>
    </form>
  );
} 