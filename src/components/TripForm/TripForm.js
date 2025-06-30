import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getCsrfToken } from '@/utils/csrf';
import { trackFormSubmission, trackTripBooking, sendGTMEvent } from '../../lib/gtm';
import { saveUserProfile, getUserTrackingData } from '@/utils/userIdentification';
import { useGeolocation } from '@/hooks/useGeolocation';
import { validateSaudiPhone, isSnapchatTraffic, getPhoneFromURL, normalizePhoneNumber } from '@/utils/phoneValidation';
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
  // Memoize initial form data to prevent infinite renders
  const initialFormData = useMemo(() => {
    const initial = fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, { nationality: '' });
    return initial;
  }, [fields]);

  const [formData, setFormData] = useState(initialFormData);
  const [formStarted, setFormStarted] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Get geolocation data
  const { locationData, loading: locationLoading, getLocationForForm, getDisplayLocation } = useGeolocation();

  useEffect(() => {
    setCsrfToken(getCsrfToken());
  }, []);

  // Update form data only when initialFormData changes (but preserve existing values)
  useEffect(() => {
    setFormData(prevData => {
      // Only update if there are actual changes and don't overwrite existing data
      const hasChanges = JSON.stringify(prevData) !== JSON.stringify(initialFormData);
      if (hasChanges && Object.keys(prevData).every(key => !prevData[key])) {
        console.log('🔄 TripForm: Updating initial form data:', initialFormData);
        return initialFormData;
      }
      return prevData;
    });
  }, [initialFormData]);

  // Handle auto-population from URL parameters (common with Snapchat ads)
  useEffect(() => {
    const phoneFromURL = getPhoneFromURL();
    if (phoneFromURL && !formData.phone) {
      const isFromSnapchat = isSnapchatTraffic();
      const isValid = validateSaudiPhone(phoneFromURL, isFromSnapchat);
      
      setFormData(prev => ({ ...prev, phone: phoneFromURL }));
      setIsPhoneValid(isValid);
      setPhoneTouched(true);
      
      console.log('Phone auto-populated from URL:', {
        phone: phoneFromURL,
        isValid: isValid,
        isFromSnapchat: isFromSnapchat
      });
    }
  }, []); // ✅ Fixed: Remove formData.phone dependency to prevent infinite loop

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
    
    console.log('📝 TripForm: Input change:', { fieldName: name, value: value });
    
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    
    if (name === 'phone') {
      setPhoneTouched(true);
      
      // Enhanced validation with Snapchat support
      const isFromSnapchat = isSnapchatTraffic();
      currentPhoneValid = validateSaudiPhone(value, isFromSnapchat);
      setIsPhoneValid(currentPhoneValid);
      
      console.log('📞 Phone validation result:', {
        input: value,
        isValid: currentPhoneValid,
        isSnapchat: isFromSnapchat
      });
      
      // Log for debugging Snapchat issues
      if (isFromSnapchat) {
        console.log('Snapchat phone validation:', {
          input: value,
          normalized: normalizePhoneNumber(value),
          isValid: currentPhoneValid,
          userAgent: navigator.userAgent,
          referrer: document.referrer
        });
      }
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
      
      // --- Save user profile for persistence ---
      try {
        await saveUserProfile({
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          nationality: formData.nationality,
          user_type: formData.nationality === 'مواطن' ? 'citizen' : 'resident',
          form_submission: true,
          form_name: 'trip_form',
          external_id: externalId,
          event_id: leadEventId,
          conversion_value: formData.nationality === 'مواطن' ? 10 : 8,
          trip_destination: zapierConfig.extraPayload?.destination || 'unknown'
        });
        console.log('User profile saved for persistence from TripForm');
      } catch (error) {
        console.error('Error saving user profile from TripForm:', error);
      }
      
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
      // Get location data for form submission
      const formLocationData = getLocationForForm();

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
        // Add geolocation data
        ...formLocationData,
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
      
      // --- BACKUP: Send Lead Email via API Route (Non-blocking) ---
      // Don't await this - let it run in background to avoid blocking redirect
      fetch('/api/send-lead-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: processedPhone,
          email: formData.email,
          nationality: formData.nationality,
          destination: zapierConfig.extraPayload?.destination || 'Unknown',
          formName: `${zapierConfig.extraPayload?.tripName || 'Trip'} Form (TripForm)`,
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          ...clientData,
        }),
      })
      .then(response => {
        if (!response.ok) {
          return response.json().then(errorData => {
            console.error('Failed to send backup lead email:', errorData.message);
          });
        } else {
          console.log('Backup lead email sent successfully');
        }
      })
      .catch(error => {
        console.error('Error sending backup lead email:', error);
        // Log error but continue - don't block user flow
      });
      // --- End Backup Email ---

      // Add GTM tracking for successful form submission (now enhanced with persistent data)
      const formTrackingData = {
        form_location: window.location.pathname,
        form_type: 'trip_booking',
        user_nationality: formData.nationality,
        user_type: formData.nationality === 'مواطن' ? 'citizen' : 'resident',
        trip_destination: zapierConfig.extraPayload?.destination || 'unknown',
        trip_name: zapierConfig.extraPayload?.tripName || 'unknown',
        trip_value: zapierConfig.extraPayload?.price || 0,
        external_id: externalId,
        lead_event_id: leadEventId,
        timestamp: new Date().toISOString(),
        // Add user data for profile saving
        email: formData.email,
        phone: formData.phone,
        name: formData.name,
        nationality: formData.nationality,
        ...clientData,
      };

      // Track form submission with enhanced data (Non-blocking)
      trackFormSubmission('trip_booking_form', formTrackingData).catch(error => {
        console.error('Form submission tracking failed:', error);
      });

      // Track trip booking with enhanced data (Non-blocking)
      trackTripBooking({
        tripName: zapierConfig.extraPayload?.tripName || 'unknown',
        destination: zapierConfig.extraPayload?.destination || 'unknown',
        price: zapierConfig.extraPayload?.price || 0,
        nationality: formData.nationality,
        user_type: formData.nationality === 'مواطن' ? 'citizen' : 'resident',
        external_id: externalId,
        lead_event_id: leadEventId,
        // Add user data for profile saving
        email: formData.email,
        phone: formData.phone,
        name: formData.name
      });

      // Enhanced ecommerce tracking (Non-blocking)
      sendGTMEvent({
        event: 'purchase_intent',
        ecommerce: {
          currency: 'SAR',
          value: zapierConfig.extraPayload?.price || 0,
          items: [{
            item_id: `${zapierConfig.extraPayload?.tripName || 'unknown'}-${new Date().getFullYear()}`,
            item_name: `${zapierConfig.extraPayload?.destination || 'Unknown'} Trip Package`,
            item_category: 'Travel',
            item_variant: formData.nationality === 'مواطن' ? 'Citizen' : 'Resident',
            price: zapierConfig.extraPayload?.price || 0,
            quantity: 1
          }]
        },
        user_data: {
          nationality: formData.nationality,
          user_type: formData.nationality === 'مواطن' ? 'citizen' : 'resident',
          // Add user data for profile saving
          email: formData.email,
          phone: formData.phone,
          name: formData.name
        },
        ...formTrackingData
      }).catch(error => {
        console.error('GTM event tracking failed:', error);
      });

      // Call onSuccess with comprehensive data
      console.log('🎯 TripForm: Calling onSuccess with data:', {
        processedPhone,
        externalId,
        leadEventId,
        nationality: formData.nationality,
        email: formData.email,
        name: formData.name
      });
      
      onSuccess({
        processedPhone,
        externalId,
        leadEventId,
        nationality: formData.nationality,
        email: formData.email,
        name: formData.name,
        firstName: formData.name ? formData.name.split(' ')[0] : null,
        lastName: formData.name && formData.name.includes(' ') ? formData.name.substring(formData.name.indexOf(' ') + 1) : null,
        ...formData
      });

      // Set loading to false after onSuccess to avoid interfering with redirect
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      
      console.error('❌ TripForm submission error:', error);
      
      // Track form submission error
      sendGTMEvent({
        event: 'form_submission_error',
        form_name: 'trip_booking_form',
        error_message: error.message,
        form_location: window.location.pathname,
        timestamp: new Date().toISOString()
      });
      
      // Better error message based on error type
      let errorMessage = 'حدث خطأ في تقديم النموذج. يرجى المحاولة مرة أخرى.';
      if (error.message && error.message.includes('CSRF')) {
        errorMessage = 'انتهت صلاحية الجلسة. يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.';
      } else if (error.message && error.message.includes('Network')) {
        errorMessage = 'مشكلة في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
      }
      
      alert(errorMessage);
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