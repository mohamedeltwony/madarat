import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import dynamic from 'next/dynamic'; // Import dynamic
import SparkleButton from '@/components/UI/SparkleButton';
// import Chatbot from '@/components/Chatbot'; // Import dynamically
// import ExitPopup from '@/components/ExitPopup'; // Import dynamically
import styles from '@/styles/pages/LondonScotland.module.scss';

// Removed SVG Icon imports

// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Please add a high-quality image of London and Edinburgh to:
// public/images/destinations/london-edinburgh.jpg

// --- SVG Icons ---

// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components
const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false }); // Keep this one-line for consistency unless Prettier complains
const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
  ssr: false, // Format options object multi-line as requested
});
export default function LondonScotlandTrip() {
  // Removed blank line above
  const router = useRouter(); // Get router instance
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '', // Added nationality field
    // city: '', // Removed city field
    destination: 'لندن واسكتلندا',
  });
  const [formStarted, setFormStarted] = useState(false); // Track if form interaction started
  const [phoneTouched, setPhoneTouched] = useState(false); // Track if phone field was interacted with
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Track phone validity, assume valid initially
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  // Helper function to send events to the backend API
  const sendFbEvent = async (eventName, data) => {
    // Ensure phone number doesn't include country code if API expects only digits
    // Basic check assuming phone is just digits after potential country code removal client-side
    const phoneDigits = data.phone?.replace(/[^0-9]/g, '');

    try {
      const response = await fetch('/api/fb-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: eventName,
          // Send standard user data fields expected by Facebook CAPI
          userData: {
            em: data.email || null, // Send email if available
            ph: phoneDigits || null, // Send phone if available
            fn: data.name ? data.name.split(' ')[0] : null, // Attempt to get first name
            ln:
              data.name && data.name.includes(' ')
                ? data.name.substring(data.name.indexOf(' ') + 1)
                : null, // Attempt to get last name
            // Add other standard fields like ct (city), st (state), zp (zip) if you collect them
          },
          // Send other form fields as custom data
          custom_data: {
            nationality: data.nationality,
            destination: data.destination,
            full_name: data.name, // Send full name here if needed separately
          },
          eventSourceUrl: window.location.href,
          // Include fbc/fbp if available (requires separate logic to capture these)
          // fbc: getCookie('_fbc'),
          // fbp: getCookie('_fbp'),
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

  // // Detect mobile devices - Commented out as isMobile state is unused
  // useEffect(() => {
  //   const checkIfMobile = () => {
  //     setIsMobile(window.innerWidth < 768);
  //   };

  //   // Check on initial load
  //   checkIfMobile();

  //   // Add listener for window resize
  //   window.addEventListener('resize', checkIfMobile);

  //   // Cleanup
  //   return () => window.removeEventListener('resize', checkIfMobile);
  // }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let currentPhoneValid = isPhoneValid; // Keep track of validity for this change

    // Update form data state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Real-time phone validation
    if (name === 'phone') {
      setPhoneTouched(true); // Mark as touched on any change
      // Saudi Phone Validation: Starts with 5, exactly 9 digits total
      const phoneRegex = /^5[0-9]{8}$/;
      currentPhoneValid = phoneRegex.test(value);
      setIsPhoneValid(currentPhoneValid);
    }

    // Trigger InitiateCheckout on first interaction with PII fields
    // Only trigger if the field is valid (especially for phone)
    if (
      !formStarted &&
      ['name', 'email'].includes(name) &&
      value.trim() !== ''
    ) {
      setFormStarted(true);
      console.log('Form started (name/email), triggering InitiateCheckout');
      // Client-side Pixel event
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('Firing Pixel InitiateCheckout');
        window.fbq('track', 'InitiateCheckout');
      } else {
        console.log('fbq not available for InitiateCheckout');
      }
      // Server-side CAPI event (send current state + new value)
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value });
    } else if (!formStarted && name === 'phone' && currentPhoneValid) {
      // Trigger for phone only if it becomes valid on first interaction
      setFormStarted(true);
      console.log('Form started (valid phone), triggering InitiateCheckout');
      // Client-side Pixel event
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('Firing Pixel InitiateCheckout');
        window.fbq('track', 'InitiateCheckout');
      } else {
        console.log('fbq not available for InitiateCheckout');
      }
      // Server-side CAPI event (send current state + new value)
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value });
    } else if (
      !formStarted &&
      ['name', 'phone', 'email'].includes(name) &&
      value.trim() !== ''
    ) {
      // Fallback original logic just in case - might be redundant now
      setFormStarted(true);
      console.log('Form started, triggering InitiateCheckout');

      // Client-side Pixel event
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('Firing Pixel InitiateCheckout');
        window.fbq('track', 'InitiateCheckout');
      } else {
        console.log('fbq not available for InitiateCheckout');
      }

      // Server-side CAPI event (send current state + new value)
      // We send minimal data here as not all fields might be filled yet
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value });
    }
  };

  // Helper function to get cookie by name
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null; // Guard for SSR
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  const handleSubmit = async (e) => {
    // Make handleSubmit async
    e.preventDefault();
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true); // Start loading

    // --- Collect Additional Client Data ---
    const queryParams = new URLSearchParams(window.location.search);
    const clientData = {
      utm_source: queryParams.get('utm_source'),
      utm_medium: queryParams.get('utm_medium'),
      utm_campaign: queryParams.get('utm_campaign'),
      utm_term: queryParams.get('utm_term'),
      utm_content: queryParams.get('utm_content'),
      screenWidth: typeof window !== 'undefined' ? window.screen.width : null,
      fbc: getCookie('_fbc'),
      fbp: getCookie('_fbp'),
    };
    console.log('Collected Client Data:', clientData);
    // --- End Collect Additional Client Data ---

    // --- Form Validation Check ---
    if (!isPhoneValid && formData.phone.trim() !== '') {
      // Check if phone is invalid (and not empty)
      alert('الرجاء إدخال رقم جوال سعودي صحيح (يبدأ بـ 5 ويتكون من 9 أرقام).');
      return; // Stop submission
    }
    // Ensure other required fields are filled if necessary (currently only phone has strict validation)
    if (!formData.nationality) {
      alert('الرجاء اختيار الجنسية.');
      return; // Stop submission
    }
    // --- Facebook Event Tracking ---
    const eventData = {
      content_name: 'London Scotland Trip Form',
      content_category: 'Travel Lead',
      value: 0, // Optional: Assign a value to the lead
      currency: 'SAR', // Optional: Specify currency
    };

    // 1. Client-side Pixel Event - REMOVED to prevent double firing
    // The Lead event is now fired only on the thank-you-citizen page load.

    // 2. Server-side CAPI Event (Conditional based on nationality)
    if (formData.nationality === 'مواطن') {
      console.log('Sending Lead event via CAPI for citizen');
      await sendFbEvent('Lead', formData);
    } else {
      console.log('Skipping CAPI Lead event for non-citizen');
    }
    // --- End Facebook Event Tracking ---

    // --- Zapier Webhook Integration ---
    try {
      const zapierWebhookUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL;
      if (!zapierWebhookUrl) {
        console.error('Zapier webhook URL is not configured');
      } else {
        console.log('Sending form data to Zapier');
        const formBody = new URLSearchParams();
        formBody.append('name', formData.name);
        formBody.append('phone', formData.phone);
        formBody.append('email', formData.email);
        formBody.append('nationality', formData.nationality);
        formBody.append('destination', formData.destination);
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        formBody.append('formName', 'London Scotland Trip Form');
        formBody.append('pageUrl', window.location.href);
        formBody.append('timestamp', now.toISOString());
        formBody.append('date', date);
        formBody.append('time', time);

        const response = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody.toString(),
        });

        if (!response.ok) {
          console.error(
            'Failed to send data to Zapier:',
            await response.text()
          );
        } else {
          console.log('Data sent successfully to Zapier');
        }
      }
    } catch (error) {
      console.error('Error sending to Zapier:', error);
    }
    // --- End Zapier Integration ---

    // --- Send Lead Email via API Route ---
    try {
      console.log('Sending form data to email API route');
      const emailResponse = await fetch('/api/send-lead-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          nationality: formData.nationality,
          destination: formData.destination, // Specific destination for this page
          formName: 'London Scotland Trip Form', // Specific form name
          pageUrl: window.location.href,
          // Spread the collected client data
          ...clientData,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Failed to send lead email:', errorData.message);
        // Optional: Display a user-friendly error message, but don't block redirect
      } else {
        console.log('Lead email sent successfully via API route');
      }
    } catch (error) {
      console.error('Error calling send-lead-email API:', error);
      // Optional: Display a user-friendly error message, but don't block redirect
    }
    // --- End Send Lead Email ---

    // --- Generate External ID ---
    const externalId = crypto.randomUUID();
    console.log(`Generated External ID: ${externalId}`);

    // --- Construct Redirect URL with Query Params ---
    const thankYouPageBase =
      formData.nationality === 'مواطن'
        ? '/thank-you-citizen'
        : '/thank-you-resident';

    const redirectQueryParams = new URLSearchParams(); // Renamed variable
    if (formData.email) redirectQueryParams.set('email', formData.email);
    if (formData.phone) redirectQueryParams.set('phone', formData.phone);
    redirectQueryParams.set('external_id', externalId); // Add external_id

    const redirectUrl = `${thankYouPageBase}?${redirectQueryParams.toString()}`; // Use renamed variable

    console.log(`Redirecting to: ${redirectUrl}`);
    // No need to set isLoading false here, page is changing
    router.push(redirectUrl);
    // --- End Redirect ---

    // Reset form (Might happen after redirect, which is usually fine)
    setFormData({
      name: '',
      phone: '',
      email: '',
      nationality: '', // Reset nationality
      // city: '', // Removed city field
      destination: 'لندن واسكتلندا',
    });
    setFormStarted(false); // Reset form started state
  };

  // Saudi cities
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

  // Features data - Using updated WebP image paths
  const features = [
    { text: 'تأشيرة سريعة', iconPath: '/icons/تأشيرة.webp' }, // Matches file list
    { text: 'راحة تامة', iconPath: '/icons/راحة تامة.webp' }, // Matches file list (with space)
    { text: 'مواعيد مرنة', iconPath: '/icons/مواعيد مرنة.webp' }, // Matches file list (with space)
    { text: 'إقامة فاخرة', iconPath: '/icons/اقامه.webp' }, // Matches file list (shortened name)
    { text: 'فعاليات ممتعة', iconPath: '/icons/فعاليات-ممتعة.webp' }, // Matches file list (with hyphen)
    { text: 'إطلالة نهرية', iconPath: '/icons/إطلالة نهرية.webp' }, // Matches file list (with space)
    { text: 'أسعار تنافسية', iconPath: '/icons/اسعار-تنافسيه.webp' }, // Matches file list (with hyphen)
    { text: 'تقييمات عالية', iconPath: '/icons/تقييمات-عالية.webp' }, // Matches file list (with hyphen)
    { text: 'مرشد خبير', iconPath: '/icons/مرشد .webp' }, // Matches file list (with trailing space before .webp) - MIGHT CAUSE ISSUES
    { text: 'جولات مخصصة', iconPath: '/icons/جولات-مخصصة.webp' }, // Matches file list (with hyphen)
  ];

  // Removed iconComponents map

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>استكشف لندن واسكتلندا مع مدارات الكون | رحلة ساحرة</title>
        <meta
          name="description"
          content="رحلة سياحية استثنائية إلى لندن واسكتلندا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في بريطانيا"
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
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          {/* Background Image using next/image */}
          <Image
            src="/london-edinburgh.jpg" // Ensure this path is correct relative to public folder
            alt="Scenic view of London and Edinburgh"
            layout="fill"
            objectFit="cover"
            quality={75} // Adjust quality as needed
            priority // Prioritize loading for LCP
            className={styles.heroBackgroundImage} // Add a class for z-index
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
                // Removed unoptimized prop
              />
            </div>
            <h1 className={styles.title}>
              رحلة <span className={styles.highlight}>لندن</span> و{' '}
              <span className={styles.highlight}>اسكتلندا</span> الساحرة
            </h1>
            <p className={styles.description}>
              تجربة سفر فريدة لاستكشاف جمال الطبيعة والتاريخ والثقافة في المملكة
              المتحدة. رحلة استثنائية تجمع بين سحر المدن العريقة وروعة الطبيعة
              الخلابة.
            </p>

            {/* Features Section - Moved Inside Hero & Made Marquee */}
            <div className={styles.featuresSection}>
              <div className={styles.featuresGrid}>
                {/* Render features twice for infinite scroll effect */}
                {[...features, ...features].map((feature, index) => (
                  <div
                    key={`${feature.iconPath}-${index}`} // Use iconPath for key
                    className={styles.featureItem}
                  >
                    {' '}
                    {/* Added index to key for uniqueness */}
                    <div className={styles.featureIcon}>
                      {/* Render using Next.js Image component */}
                      <Image
                        src={feature.iconPath}
                        alt={feature.text} // Use feature text as alt text
                        width={60} // Updated width
                        height={60} // Updated height
                        unoptimized // Keep optimization disabled for these icons
                      />
                    </div>
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* End Features Section */}

            {/* Contact Form */}
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.tripForm}>
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
                      pattern="^5[0-9]{8}$" // Added HTML pattern for native validation
                      title="يجب أن يبدأ الرقم بـ 5 ويتكون من 9 أرقام" // Tooltip for pattern
                    />
                    <span className={styles.countryCode}>+966</span>
                  </div>
                  {/* Updated error message display */}
                  {phoneTouched &&
                    !isPhoneValid &&
                    formData.phone.trim() !== '' && (
                      <p className={styles.errorMessage}>
                        يجب أن يبدأ الرقم بـ 5 ويتكون من 9 أرقام.
                      </p>
                    )}
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

                {/* Removed City Field */}
                {/* <div className={styles.formGroup}> ... </div> */}

                <div className={styles.formActions}>
                  <SparkleButton
                    type="submit"
                    className={styles.mainCTA}
                    fullWidth
                  >
                    اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين السياحة
                    عندنا
                  </SparkleButton>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Features section moved inside hero content */}
      </main>

      {/* Chatbot - Disabled */}
      {/* <Chatbot /> */}

      {/* Exit Intent Popup - Disabled */}
      {/* <ExitPopup /> */}
    </div>
  );
}
