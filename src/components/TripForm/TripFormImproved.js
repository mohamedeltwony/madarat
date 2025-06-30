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

export default function TripFormImproved({
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
  
  // 🆕 Enhanced Error State Management
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [touchedFields, setTouchedFields] = useState({});

  // Get geolocation data
  const { locationData, loading: locationLoading, getLocationForForm, getDisplayLocation } = useGeolocation();

  useEffect(() => {
    setCsrfToken(getCsrfToken());
  }, []);

  // Update form data only when initialFormData changes
  useEffect(() => {
    setFormData(initialFormData);
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
      setTouchedFields(prev => ({ ...prev, phone: true }));
      
      console.log('Phone auto-populated from URL:', {
        phone: phoneFromURL,
        isValid: isValid,
        isFromSnapchat: isFromSnapchat
      });
    }
  }, [formData.phone]);

  // 🆕 Enhanced Validation Function
  const validateField = (name, value) => {
    const fieldErrors = {};
    
    switch (name) {
      case 'phone':
        if (value.trim() && !validateSaudiPhone(value, isSnapchatTraffic())) {
          fieldErrors.phone = 'يجب أن يبدأ الرقم بـ 0 أو 5 أو 966 ويتكون من الأرقام المناسبة';
        }
        break;
      case 'email':
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          fieldErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
        }
        break;
      case 'nationality':
        if (!value && touchedFields.nationality) {
          fieldErrors.nationality = 'الرجاء اختيار الجنسية';
        }
        break;
    }
    
    return fieldErrors;
  };

  // 🆕 Real-time Validation
  const validateForm = () => {
    const allErrors = {};
    
    // Validate all form fields
    Object.keys(formData).forEach(fieldName => {
      const fieldErrors = validateField(fieldName, formData[fieldName]);
      Object.assign(allErrors, fieldErrors);
    });
    
    // Check required nationality
    if (!formData.nationality) {
      allErrors.nationality = 'الرجاء اختيار الجنسية';
    }
    
    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

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
      console.warn('Facebook event tracking failed:', error);
    }
  };

  // 🆕 Enhanced Input Change Handler
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    // Update form data
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    
    // Mark field as touched
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Clear previous errors for this field
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
    
    // Real-time validation for specific fields
    if (name === 'phone') {
      setPhoneTouched(true);
      const isFromSnapchat = isSnapchatTraffic();
      const currentPhoneValid = validateSaudiPhone(value, isFromSnapchat);
      setIsPhoneValid(currentPhoneValid);
      
      // Set error if invalid
      if (value.trim() && !currentPhoneValid) {
        setErrors(prev => ({
          ...prev,
          phone: 'يجب أن يبدأ الرقم بـ 0 أو 5 أو 966 ويتكون من الأرقام المناسبة'
        }));
      }
      
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
    
    // Real-time email validation
    if (name === 'email' && value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors(prev => ({
          ...prev,
          email: 'يرجى إدخال بريد إلكتروني صحيح'
        }));
      }
    }
    
    // Trigger InitiateCheckout on first valid PII field interaction
    if (
      !formStarted &&
      ['name', 'email', 'phone'].includes(name) &&
      value.trim() !== '' &&
      !errors[name] // Only trigger if field is valid
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

  // 🆕 Enhanced Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    
    // Mark all fields as touched for validation display
    const allTouched = {};
    Object.keys(formData).forEach(key => {
      allTouched[key] = true;
    });
    setTouchedFields(allTouched);
    
    // Validate form
    const isValid = validateForm();
    if (!isValid) {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.focus();
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }
    
    setIsLoading(true);
    setSubmitError(null);
    
    try {
      const leadEventId = crypto.randomUUID();
      const externalId = crypto.randomUUID();
      
      // Save user profile for persistence
      try {
        await saveUserProfile({
          email: formData.email,
          phone: formData.phone,
          name: formData.name,
          nationality: formData.nationality,
          user_type: formData.nationality === 'مواطن' ? 'citizen' : 'resident',
          form_submission: true,
          form_name: 'trip_form_improved',
          external_id: externalId,
          event_id: leadEventId,
          conversion_value: formData.nationality === 'مواطن' ? 10 : 8,
          trip_destination: zapierConfig.extraPayload?.destination || 'unknown'
        });
        console.log('User profile saved for persistence from TripFormImproved');
      } catch (error) {
        console.error('Error saving user profile from TripFormImproved:', error);
      }
      
      // Process phone number
      let processedPhone = formData.phone ? formData.phone.replace(/[^0-9]/g, '') : '';
      if (processedPhone.startsWith('966') && processedPhone.length >= 12) {
        processedPhone = '0' + processedPhone.substring(3);
      } else if (!processedPhone.startsWith('0') && processedPhone.startsWith('5') && processedPhone.length === 9) {
        processedPhone = '0' + processedPhone;
      }
      
      // Collect client data
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
      
      // Facebook Lead event for Saudi citizens only
      if (formData.nationality === 'مواطن') {
        sendFbEvent('Lead', formData, leadEventId).catch(err => 
          console.warn('Facebook lead event failed:', err)
        );
      }
      
      // Get location data for form submission
      const formLocationData = getLocationForForm();

      // Build payload
      const zapierPayload = {
        ...fields.reduce((acc, field) => {
          acc[field.name] = formData[field.name];
          return acc;
        }, {}),
        nationality: formData.nationality,
        phone: processedPhone, // Use processed phone
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
        ...formLocationData,
      };
      
      // Submit to Zapier
      const response = await fetch(zapierConfig.endpoint || '/api/zapier-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrf-token': csrfToken,
        },
        body: JSON.stringify(zapierPayload),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      console.log('Zapier submission successful, preparing redirect data...');
      setFormSubmitted(true);
      
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
          formName: `${zapierConfig.extraPayload?.tripName || 'Trip'} Form (TripFormImproved)`,
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
      
      // Enhanced tracking
      const formTrackingData = {
        form_location: window.location.pathname,
        form_type: 'trip_booking_improved',
        user_nationality: formData.nationality,
        user_type: formData.nationality === 'مواطن' ? 'citizen' : 'resident',
        trip_destination: zapierConfig.extraPayload?.destination || 'unknown',
        trip_name: zapierConfig.extraPayload?.tripName || 'unknown',
        trip_value: zapierConfig.extraPayload?.price || 0,
        external_id: externalId,
        lead_event_id: leadEventId,
        timestamp: new Date().toISOString(),
        email: formData.email,
        phone: processedPhone,
        name: formData.name,
        nationality: formData.nationality,
        ...clientData,
      };

      // Track form submission and trip booking (Non-blocking)
      // Don't await - let tracking run in background to avoid blocking redirect
      
      // Track form submission (async)
      trackFormSubmission('trip_booking_form_improved', formTrackingData).catch(error => {
        console.error('Form submission tracking failed:', error);
      });
      
      // Track trip booking (sync)
      try {
        trackTripBooking({
          tripName: zapierConfig.extraPayload?.tripName || 'unknown',
          destination: zapierConfig.extraPayload?.destination || 'unknown',
          price: zapierConfig.extraPayload?.price || 0,
          nationality: formData.nationality,
          user_type: formData.nationality === 'مواطن' ? 'citizen' : 'resident',
          external_id: externalId,
          lead_event_id: leadEventId,
          ...clientData,
        });
        console.log('Trip booking tracking completed');
      } catch (error) {
        console.error('Trip booking tracking failed:', error);
      }
      
      // Success callback
      onSuccess({
        processedPhone,
        externalId,
        leadEventId,
        nationality: formData.nationality,
        email: formData.email,
        name: formData.name,
        firstName: formData.name ? formData.name.split(' ')[0] : '',
        lastName: formData.name && formData.name.includes(' ') 
          ? formData.name.substring(formData.name.indexOf(' ') + 1) 
          : ''
      });
      
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(
        error.message || 'حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 🆕 Enhanced Form Reset Function
  const resetForm = () => {
    setFormData(initialFormData);
    setErrors({});
    setTouchedFields({});
    setFormSubmitted(false);
    setSubmitError(null);
    setFormStarted(false);
    setPhoneTouched(false);
    setIsPhoneValid(true);
  };

  // If form was successfully submitted, show success message
  if (formSubmitted) {
    return (
      <div className={styles.formContainer}>
        <div className={styles.successMessage}>
          <div className={styles.successIcon}>✅</div>
          <h3>تم إرسال طلبك بنجاح!</h3>
          <p>سيتواصل معك أحد متخصصي السياحة خلال دقائق</p>
          <button 
            onClick={resetForm}
            className={styles.resetButton}
            type="button"
          >
            إرسال طلب آخر
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.tripForm}>
        {/* 🆕 Global Form Error Display */}
        {submitError && (
          <div className={styles.errorAlert} role="alert">
            <span className={styles.errorIcon}>⚠️</span>
            <span>{submitError}</span>
          </div>
        )}
        
        {/* Render form fields */}
        {fields.map((field) => {
          const hasError = errors[field.name];
          const isTouched = touchedFields[field.name];
          
          if (field.name === 'phone') {
            return (
              <div key={field.name} className={`${styles.formGroup} ${field.phoneGroup ? styles.phoneGroup : ''} ${styles.floatingLabelGroup}`}>
                <label htmlFor={field.name} className={styles.formLabel}>
                  {field.label}
                  {field.required && <span className={styles.required}>*</span>}
                </label>
                <div className={styles.phoneInput}>
                  {field.showCountryCode && (
                    <span className={styles.countryCode}>+966</span>
                  )}
                  <input
                    type={field.type}
                    id={field.name}
                    className={`${styles.formInput} ${hasError && isTouched ? styles.errorInput : ''} ${isPhoneValid && phoneTouched ? styles.validInput : ''}`}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    placeholder={field.placeholder || ' '}
                    autoComplete={field.autoComplete || field.name}
                    required={field.required}
                    aria-invalid={hasError && isTouched}
                    aria-describedby={hasError && isTouched ? `${field.name}-error` : undefined}
                  />
                  <div data-lastpass-icon-root="" style={{position: 'relative !important', height: '0px !important', width: '0px !important', float: 'left !important'}}></div>
                </div>
                {/* 🆕 Individual Field Error Display */}
                {hasError && isTouched && (
                  <div id={`${field.name}-error`} className={styles.fieldError} role="alert">
                    <span className={styles.errorIcon}>⚠️</span>
                    <span>{hasError}</span>
                  </div>
                )}
              </div>
            );
          }
          
          // Default field rendering with enhanced error handling
          return (
            <div key={field.name} className={`${styles.formGroup} ${styles.floatingLabelGroup}`}>
              <input
                type={field.type}
                id={field.name}
                className={`${styles.formInput} ${hasError && isTouched ? styles.errorInput : ''}`}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                placeholder={field.placeholder || ' '}
                autoComplete={field.autoComplete || field.name}
                required={field.required}
                aria-invalid={hasError && isTouched}
                aria-describedby={hasError && isTouched ? `${field.name}-error` : undefined}
              />
              <label htmlFor={field.name} className={styles.formLabel}>
                {field.label}
                {field.required && <span className={styles.required}>*</span>}
              </label>
              {/* Individual Field Error Display */}
              {hasError && isTouched && (
                <div id={`${field.name}-error`} className={styles.fieldError} role="alert">
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{hasError}</span>
                </div>
              )}
            </div>
          );
        })}
        
        {/* Nationality radio group (always included) with enhanced error handling */}
        <div className={`${styles.formGroup} ${styles.nationalityGroup}`}>
          <div className={`${styles.radioGroup} ${errors.nationality && touchedFields.nationality ? styles.errorRadioGroup : ''}`}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="nationality"
                value="مواطن"
                checked={formData.nationality === 'مواطن'}
                onChange={handleInputChange}
                required
                aria-invalid={errors.nationality && touchedFields.nationality}
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
                aria-invalid={errors.nationality && touchedFields.nationality}
              />
              <span>مقيم</span>
            </label>
          </div>
          {/* Nationality Error Display */}
          {errors.nationality && touchedFields.nationality && (
            <div className={styles.fieldError} role="alert">
              <span className={styles.errorIcon}>⚠️</span>
              <span>{errors.nationality}</span>
            </div>
          )}
        </div>
        
        {/* 🆕 Enhanced Submit Button */}
        <div className={styles.formActions}>
          <SparkleButton
            type="submit"
            className={styles.mainCTA}
            disabled={isLoading || Object.keys(errors).length > 0}
            fullWidth
          >
            {isLoading ? (
              <>
                <span className={styles.loadingSpinner}></span>
                جاري الإرسال...
              </>
            ) : (
              'اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين السياحة عندنا'
            )}
          </SparkleButton>
        </div>
      </form>
    </div>
  );
} 