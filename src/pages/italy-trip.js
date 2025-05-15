import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import dynamic from 'next/dynamic'; // Import dynamic
const SparkleButton = dynamic(() => import('@/components/UI/SparkleButton'), {
  ssr: false,
});
// import Chatbot from '@/components/Chatbot'; // Removed
// import ExitPopup from '@/components/ExitPopup'; // Removed
import styles from '@/styles/pages/LondonScotland.module.scss'; // Keep using the same styles for cloning
// Removed getSiteMetadata import as it's no longer fetched here
import { getAllMenus } from '@/lib/menus'; // Keep menu import for now, though unused in getStaticProps
import { sendPartialFormData, debounce } from '@/utils/form-helpers';

// Removed SVG Icon imports

// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Update image path comment if needed
// public/images/italy-background.webp

// --- SVG Icons ---

// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components - Removed
// const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });
// const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
//   ssr: false,
// });
export default function ItalyTrip() {
  // Changed component name
  const router = useRouter(); // Get router instance
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '', // Added nationality field
    // city: '', // Removed city field
    destination: 'ايطاليا', // Changed destination to Italy
  });
  const [formStarted, setFormStarted] = useState(false); // Track if form interaction started
  const [phoneTouched, setPhoneTouched] = useState(false); // Track if phone field was interacted with
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Track phone validity, assume valid initially
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Create a reference to the debounced function
  const debouncedPartialSubmitRef = useRef(null);

  // Initialize the debounced function on component mount
  useEffect(() => {
    debouncedPartialSubmitRef.current = debounce(
      (currentFormData, fieldName) => {
        const queryParams = new URLSearchParams(
          typeof window !== 'undefined' ? window.location.search : ''
        );

        const clientData = {
          utm_source: queryParams.get('utm_source'),
          utm_medium: queryParams.get('utm_medium'),
          utm_campaign: queryParams.get('utm_campaign'),
          utm_term: queryParams.get('utm_term'),
          utm_content: queryParams.get('utm_content'),
          screenWidth:
            typeof window !== 'undefined' ? window.screen.width : null,
          fbc: getCookie('_fbc'),
          fbp: getCookie('_fbp'),
        };

        sendPartialFormData(
          currentFormData,
          'italy-trip',
          'Italy Trip Form',
          clientData,
          fieldName,
          2000
        );
      },
      2000
    ); // 2 second debounce time
  }, []);

  // Helper function to send events to the backend API (Keep original logic)
  const sendFbEvent = async (eventName, data, eventId = null) => {
    const phoneDigits = data.phone?.replace(/[^0-9]/g, '');
    try {
      const response = await fetch('/api/fb-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: eventName,
          eventId: eventId,
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
            destination: data.destination, // This will be 'ايطاليا' from state
            full_name: data.name,
          },
          eventSourceUrl: window.location.href,
          // fbc: getCookie('_fbc'), // Keep commented if not used
          // fbp: getCookie('_fbp'), // Keep commented if not used
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          `Failed to send ${eventName} event to CAPI:`,
          errorData.message
        );
      } else {
        const successData = await response.json();
        console.log(
          `${eventName} event sent successfully via CAPI:`,
          successData
        );
      }
    } catch (error) {
      console.error(`Error sending ${eventName} event via CAPI:`, error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let currentPhoneValid = isPhoneValid;

    // Update form data state
    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    if (name === 'phone') {
      setPhoneTouched(true);
      // Phone validation logic
      const phoneRegex = /^(0|5|966)([0-9]{8,12})$/;
      currentPhoneValid = phoneRegex.test(value);
      setIsPhoneValid(currentPhoneValid);
    }

    // Trigger InitiateCheckout logic (Keep original logic)
    if (
      !formStarted &&
      ['name', 'email'].includes(name) &&
      value.trim() !== ''
    ) {
      setFormStarted(true);
      const eventId = crypto.randomUUID();
      console.log('Form started (name/email), triggering InitiateCheckout');
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId });
      }
      sendFbEvent(
        'InitiateCheckout',
        { ...updatedFormData, [name]: value },
        eventId
      );
    } else if (!formStarted && name === 'phone' && currentPhoneValid) {
      setFormStarted(true);
      const eventId = crypto.randomUUID();
      console.log('Form started (valid phone), triggering InitiateCheckout');
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId });
      }
      sendFbEvent(
        'InitiateCheckout',
        { ...updatedFormData, [name]: value },
        eventId
      );
    } else if (
      !formStarted &&
      ['name', 'phone', 'email'].includes(name) &&
      value.trim() !== ''
    ) {
      setFormStarted(true);
      const eventId = crypto.randomUUID();
      console.log('Form started, triggering InitiateCheckout');
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId });
      }
      sendFbEvent(
        'InitiateCheckout',
        { ...updatedFormData, [name]: value },
        eventId
      );
    }

    // Send partial form data to Zapier if we have meaningful data
    if (
      (name === 'name' && value.trim().length > 2) ||
      (name === 'email' && value.trim().length > 5) ||
      (name === 'phone' && value.trim().length > 5)
    ) {
      // Use the debounced function to avoid too many requests
      if (debouncedPartialSubmitRef.current) {
        debouncedPartialSubmitRef.current(updatedFormData, name);
      }
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
    e.preventDefault(); // We'll still prevent default and handle it manually
    if (isLoading) return;
    setIsLoading(true);

    try {
      // --- Form Validation Check ---
      if (!isPhoneValid && formData.phone.trim() !== '') {
        alert(
          'يجب أن يبدأ الرقم بـ 0 أو 5 أو 966 ويتكون من المقطع المناسب من الأرقام.'
        );
        setIsLoading(false);
        return;
      }
      if (!formData.nationality) {
        alert('الرجاء اختيار الجنسية.');
        setIsLoading(false);
        return;
      }

      // Generate IDs
      const leadEventId = crypto.randomUUID();
      const externalId = crypto.randomUUID();
      
      // Process phone number
      let processedPhone = formData.phone.replace(/[^0-9]/g, '');
      if (processedPhone.startsWith('966') && processedPhone.length >= 12) {
        processedPhone = '0' + processedPhone.substring(3);
      } else if (!processedPhone.startsWith('0') && processedPhone.startsWith('5') && processedPhone.length === 9) {
        processedPhone = '0' + processedPhone;
      }

      // Prepare data payload
      const queryParams = new URLSearchParams(window.location.search);
      
      // Get browser and device information
      const userAgent = navigator.userAgent;
      const browserInfo = getBrowserAndDeviceInfo(userAgent);
      
      const clientData = {
        // UTM parameters
        utm_source: queryParams.get('utm_source') || 'direct',
        utm_medium: queryParams.get('utm_medium') || 'none',
        utm_campaign: queryParams.get('utm_campaign') || 'none',
        utm_term: queryParams.get('utm_term') || 'none',
        utm_content: queryParams.get('utm_content') || 'none',
        
        // Device and browser info - Standardized field names
        screen_width: typeof window !== 'undefined' ? window.screen.width : null,
        screen_height: typeof window !== 'undefined' ? window.screen.height : null,
        device_vendor: browserInfo.device,
        operating_system: browserInfo.os,
        browser: browserInfo.browser,
        user_agent: userAgent,
        
        // Facebook tracking IDs
        fb_browser_id: getCookie('_fbp') || 'none',
        fb_click_id: getCookie('_fbc') || 'none',
        
        // Referrer info
        referrer: document.referrer || 'direct',
      };

      // Facebook event tracking (in background - don't await)
      if (formData.nationality === 'مواطن') {
        sendFbEvent('Lead', formData, leadEventId).catch(err => {
          console.error('FB event error (non-blocking):', err);
        });
      }

      // Create Zapier payload
      const zapierPayload = {
        name: formData.name || 'Not provided',
        phone: processedPhone || 'Not provided',
        email: formData.email || 'Not provided',
        nationality: formData.nationality,
        destination: formData.destination,
        formSource: 'italy-trip',
        formName: 'Italy Trip Form',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        leadEventId: leadEventId,
        externalId: externalId,
        ...clientData,
      };

      console.log('Sending data to Zapier via API...');
      try {
        // Wait for the request to complete before redirecting
        const response = await fetch('/api/zapier-proxy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(zapierPayload),
        });
        
        const responseData = await response.json();
        console.log('Zapier proxy response:', responseData);
        
        // Determine redirect path based on nationality
        const redirectPath = 
          (formData.nationality === 'مواطن' || 
           formData.nationality === 'Saudi Arabia' || 
           formData.nationality === 'العربية السعودية') 
            ? '/thank-you-citizen' 
            : '/thank-you-resident';
            
        console.log(`Redirecting to: ${redirectPath}`);
        
        // This is the new approach - directly create a form and submit it
        const redirectForm = document.createElement('form');
        redirectForm.method = 'GET';
        redirectForm.action = redirectPath;
        
        // Add hidden fields
        const phoneField = document.createElement('input');
        phoneField.type = 'hidden';
        phoneField.name = 'phone';
        phoneField.value = processedPhone;
        redirectForm.appendChild(phoneField);
        
        const externalIdField = document.createElement('input');
        externalIdField.type = 'hidden';
        externalIdField.name = 'external_id';
        externalIdField.value = externalId;
        redirectForm.appendChild(externalIdField);
        
        const eventIdField = document.createElement('input');
        eventIdField.type = 'hidden';
        eventIdField.name = 'eventId';
        eventIdField.value = leadEventId;
        redirectForm.appendChild(eventIdField);
        
        // Add form to body
        document.body.appendChild(redirectForm);
        
        // Submit the form
        redirectForm.submit();
        
      } catch (error) {
        console.error('Zapier proxy error:', error);
        setIsLoading(false);
        alert('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
      }
      
    } catch (error) {
      console.error('Error processing form submission:', error);
      alert('حدث خطأ في تقديم النموذج. يرجى المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

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

  // Saudi cities (Keep original if needed by form logic, though not displayed)
  const cities = [
    'الرياض',
    'جدة',
    'القصيم – حائل',
    'مكة - الطائف',
    'المدينة المنورة',
    'المنطقة الشرقية',
    'المنطقة الشمالية',
    'المنطقة الجنوبية',
    'أخرى',
  ];

  // Features data - Updated for Italy
  const features = [
    {
      text: 'استقبال بسيارة خاصة',
      iconPath: '/icons/gorgia/استقبال-وتوديع.webp',
    },
    {
      text: 'الفنادق مع الافطار',
      iconPath: '/icons/gorgia/الفنادق-مع-الافطار.webp',
    },
    {
      text: 'جولات سياحية جماعيه',
      iconPath: '/icons/gorgia/جولات-جماعية.webp',
    },
    {
      text: 'التنقلات بين المدن',
      iconPath: '/icons/gorgia/التنقلات-بين-المدن.webp',
    },
    {
      text: 'خدمة عملاء ٢٤/٧',
      iconPath: '/icons/gorgia/خدمة-عملاء.webp',
    },
    {
      text: 'تذاكر دخول الاماكن السياحية',
      iconPath: '/icons/gorgia/تأمين.webp',
    },
    {
      text: 'جولات مائية',
      iconPath: '/icons/gorgia/شريحة-انترنت.webp',
    },
  ];

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>استكشف ايطاليا مع مدارات الكون | رحلة ساحرة</title>
        <meta
          name="description"
          content="رحلة سياحية استثنائية إلى ايطاليا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة الايطالية الساحرة."
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Removed redundant Google Font link - loaded in _document.js */}
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          {/* Background Image using next/image */}
          <Image
            src="/images/italy-background.webp" // Changed image src for Italy
            alt="Scenic view of Italy" // Changed alt text
            fill // Use fill prop instead of layout="fill"
            // objectFit="cover" // Remove prop, handle with CSS
            quality={75} // Adjust quality as needed
            priority // Prioritize loading for LCP
            className={styles.heroBackgroundImage} // Ensure this class handles object-fit: cover
          />
          <div className={styles.heroOverlay}></div>
          <div className={styles.heroContent}>
            <div className={styles.logoContainer}>
              <Image
                src="/logo.png"
                alt="مدارات الكون للسياحة والسفر"
                width={240}
                height={75}
                priority
                sizes="(max-width: 768px) 150px, 240px" // Refined sizes prop for responsiveness
                // Removed unoptimized prop
              />
            </div>
            <h1 className={styles.title}>
              رحلة <span className={styles.highlight}>ايطاليا</span> الساحرة
            </h1>
            <p className={styles.description}>
              7 أيام - 6 ليالي
              <br />
              السعر يبدأ من
              <br />
              <span className={styles.highlight}>4499</span> ر.س في الغرفة
              المزدوجة
            </p>

            {/* Features Section - Moved Inside Hero & Made Marquee */}
            <div className={styles.featuresSection}>
              <div className={styles.featuresGrid}>
                {/* Render features twice for infinite scroll effect */}
                {[...features, ...features].map((feature, index) => (
                  <div
                    key={`${feature.iconPath || feature.text}-${index}`} // Use iconPath or text for key
                    className={styles.featureItem}
                  >
                    {' '}
                    {/* Added index to key for uniqueness */}
                    {feature.iconPath && ( // Conditionally render icon div
                      <div className={styles.featureIcon}>
                        {/* Render using Next.js Image component */}
                        <Image
                          src={feature.iconPath}
                          alt={feature.text} // Use feature text as alt text
                          width={60} // Updated width
                          height={60} // Updated height
                          // unoptimized // Removed to allow Next.js optimization
                        />
                      </div>
                    )}
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* End Features Section */}

            {/* Contact Form - Using London/Scotland structure */}
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.tripForm}>
                {/* Phone field needs special handling due to country code */}
                {/* Add hasValue and inputError classes conditionally */}
                <div
                  className={`${styles.formGroup} ${styles.floatingLabelGroup} ${styles.phoneGroup} ${formData.phone ? styles.hasValue : ''} ${phoneTouched && !isPhoneValid && formData.phone.trim() !== '' ? styles.inputError : ''}`}
                >
                  <label htmlFor="phone" className={styles.formLabel}>
                    الجوال
                  </label>
                  <div className={styles.phoneInput}>
                    {/* Moved country code to the left */}
                    <input
                      type="tel"
                      id="phone"
                      className={styles.formInput} // Add class for styling
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => setPhoneTouched(true)} // Mark as touched on blur
                      placeholder=" " // Use space for placeholder trick
                      autoComplete="tel" // Added autocomplete
                      required // Made required
                      // Removed pattern attribute to avoid conflicts with JS validation
                    />
                    <span className={styles.countryCode}>+966</span>
                  </div>
                  {/* Updated error message display */}
                  {phoneTouched &&
                    !isPhoneValid &&
                    formData.phone.trim() !== '' && (
                      <p className={styles.errorMessage}>
                        يجب أن يبدأ الرقم بـ 0 أو 5 أو 966 ويتكون من المقطع
                        المناسب من الأرقام.
                      </p>
                    )}
                </div>

                <div
                  className={`${styles.formGroup} ${styles.floatingLabelGroup}`}
                >
                  <input
                    type="text"
                    id="name"
                    className={styles.formInput} // Add class for styling
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange} // Already handles InitiateCheckout trigger
                    placeholder=" " // Use space for placeholder trick
                    autoComplete="name" // Added autocomplete
                    // required // Made optional
                  />
                  <label htmlFor="name" className={styles.formLabel}>
                    الاسم الكامل (اختياري)
                  </label>
                </div>

                <div
                  className={`${styles.formGroup} ${styles.floatingLabelGroup}`}
                >
                  <input
                    type="email"
                    id="email"
                    className={styles.formInput} // Add class for styling
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder=" " // Use space for placeholder trick
                    autoComplete="email" // Added autocomplete
                    // required // Made optional
                  />
                  <label htmlFor="email" className={styles.formLabel}>
                    البريد الإلكتروني (اختياري)
                  </label>
                </div>

                {/* Nationality Field */}
                <div
                  className={`${styles.formGroup} ${styles.nationalityGroup}`}
                >
                  {/* <label>الجنسية</label> Removed this label */}
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

                {/* Removed City Dropdown */}
                <div className={styles.formActions}>
                  <SparkleButton
                    type="submit"
                    disabled={isLoading}
                    className={styles.mainCTA}
                  >
                    <div className={styles.buttonGlow}></div>
                    <span className={styles.buttonContent}>
                      اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين
                      السياحة عندنا
                    </span>
                  </SparkleButton>
                </div>
              </form>
            </div>
            {/* End Contact Form */}
          </div>
        </section>
        {/* End Hero Section */}

        {/* WhatsApp Button */}
        {/* Removed WhatsAppButton component */}
      </main>

      {/* Removed Chatbot and ExitPopup */}
    </div>
  );
}

export async function getStaticProps() {
  // No longer fetching getSiteMetadata here to improve build/revalidation speed.
  // Ensure necessary <Head> tags (title, meta description, OG tags)
  // are added directly within the ItalyTrip component's JSX.

  return {
    props: {}, // Return empty props
    revalidate: 600, // Revalidate every 10 minutes (keeps ISR active)
  };
}
