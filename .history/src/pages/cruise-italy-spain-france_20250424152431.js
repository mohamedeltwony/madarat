import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import dynamic from 'next/dynamic'; // Import dynamic
import SparkleButton from '@/components/UI/SparkleButton';
// import Chatbot from '@/components/Chatbot'; // Removed
// import ExitPopup from '@/components/ExitPopup'; // Removed
import styles from '@/styles/pages/LondonScotland.module.scss'; // Use LondonScotland styles for the marquee
// Removed getSiteMetadata import as it's no longer fetched here

// Removed SVG Icon imports

// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Please add a high-quality image of London and Edinburgh to:
// public/images/destinations/london-edinburgh.jpg

// --- SVG Icons ---

// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components - Removed
// const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });
// const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
//   ssr: false,
// });
export default function CruiseItalySpainFrance() {
  // Updated component name
  // Removed blank line above
  const router = useRouter(); // Get router instance
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '', // Added nationality field
    // city: '', // Removed city field
    destination: 'كروز: إيطاليا، إسبانيا، فرنسا', // Updated destination
  });
  const [formStarted, setFormStarted] = useState(false); // Track if form interaction started
  const [phoneTouched, setPhoneTouched] = useState(false); // Track if phone field was interacted with
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Track phone validity, assume valid initially

  // Helper function to send events to the backend API
  const sendFbEvent = async (eventName, data, eventId = null) => {
    // Add eventId parameter
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
          eventId: eventId, // Include eventId in the request body
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
      const eventId = crypto.randomUUID(); // Generate unique event ID
      console.log('Form started (name/email), triggering InitiateCheckout');
      // Client-side Pixel event
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('Firing Pixel InitiateCheckout');
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId }); // Add eventID
      } else {
        console.log('fbq not available for InitiateCheckout');
      }
      // Server-side CAPI event (send current state + new value)
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value }, eventId); // Pass eventId
    } else if (!formStarted && name === 'phone' && currentPhoneValid) {
      // Trigger for phone only if it becomes valid on first interaction
      setFormStarted(true);
      const eventId = crypto.randomUUID(); // Generate unique event ID
      console.log('Form started (valid phone), triggering InitiateCheckout');
      // Client-side Pixel event
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('Firing Pixel InitiateCheckout');
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId }); // Add eventID
      } else {
        console.log('fbq not available for InitiateCheckout');
      }
      // Server-side CAPI event (send current state + new value)
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value }, eventId); // Pass eventId
    } else if (
      !formStarted &&
      ['name', 'phone', 'email'].includes(name) &&
      value.trim() !== ''
    ) {
      // Fallback original logic just in case - might be redundant now
      setFormStarted(true);
      const eventId = crypto.randomUUID(); // Generate unique event ID
      console.log('Form started, triggering InitiateCheckout');

      // Client-side Pixel event
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('Firing Pixel InitiateCheckout');
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId }); // Add eventID
      } else {
        console.log('fbq not available for InitiateCheckout');
      }

      // Server-side CAPI event (send current state + new value)
      // We send minimal data here as not all fields might be filled yet
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value }, eventId); // Pass eventId
    }
  };

  const handleSubmit = async (e) => {
    // Make handleSubmit async
    e.preventDefault();

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
      content_name: 'Cruise Italy Spain France Form', // Updated content name
      content_category: 'Travel Lead', // Keep category generic or specify 'Cruise Lead'
      value: 3700, // Updated value based on offer price
      currency: 'SAR', // Optional: Specify currency
    };

    // --- Generate Event ID for Lead ---
    const leadEventId = crypto.randomUUID();
    console.log(`Generated Lead Event ID: ${leadEventId}`);

    // 1. Client-side Pixel Event - REMOVED to prevent double firing
    // The Lead event is now fired only on the thank-you-citizen/resident page load.

    // 2. Server-side CAPI Event (Conditional based on nationality)
    if (formData.nationality === 'مواطن') {
      console.log('Sending Lead event via CAPI for citizen');
      // Pass the generated leadEventId to the CAPI call
      await sendFbEvent('Lead', formData, leadEventId);
    } else {
      console.log('Skipping CAPI Lead event for non-citizen');
      // Note: Even if CAPI isn't sent, the pixel on thank-you-resident might still fire.
      // We still pass the eventId in the redirect for potential pixel deduplication there.
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

        formBody.append('formName', 'Cruise Italy Spain France Form'); // Updated form name for Zapier
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

    // --- Generate External ID ---
    const externalId = crypto.randomUUID();
    console.log(`Generated External ID: ${externalId}`);

    // --- Construct Redirect URL with Query Params ---
    const thankYouPageBase =
      formData.nationality === 'مواطن'
        ? '/thank-you-citizen'
        : '/thank-you-resident';

    const queryParams = new URLSearchParams();
    if (formData.email) queryParams.set('email', formData.email);
    if (formData.phone) queryParams.set('phone', formData.phone);
    queryParams.set('external_id', externalId); // Add external_id
    queryParams.set('eventId', leadEventId); // Add eventId for deduplication on thank-you page

    const redirectUrl = `${thankYouPageBase}?${queryParams.toString()}`;

    console.log(`Redirecting to: ${redirectUrl}`);
    router.push(redirectUrl);
    // --- End Redirect ---

    // Reset form (Might happen after redirect, which is usually fine)
    setFormData({
      name: '',
      phone: '',
      email: '',
      nationality: '', // Reset nationality
      // city: '', // Removed city field
      destination: 'كروز: إيطاليا، إسبانيا، فرنسا', // Updated destination on reset
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

  // Features data - Copied from London/Scotland page
  const features = [
    { text: 'تأشيرة سريعة', iconPath: '/icons/تأشيرة.webp' },
    { text: 'راحة تامة', iconPath: '/icons/راحة تامة.webp' },
    { text: 'مواعيد مرنة', iconPath: '/icons/مواعيد مرنة.webp' },
    { text: 'إقامة فاخرة', iconPath: '/icons/اقامه.webp' },
    { text: 'فعاليات ممتعة', iconPath: '/icons/فعاليات-ممتعة.webp' },
    { text: 'إطلالة نهرية', iconPath: '/icons/إطلالة نهرية.webp' },
    { text: 'أسعار تنافسية', iconPath: '/icons/اسعار-تنافسيه.webp' },
    { text: 'تقييمات عالية', iconPath: '/icons/تقييمات-عالية.webp' },
    { text: 'مرشد خبير', iconPath: '/icons/مرشد .webp' },
    { text: 'جولات مخصصة', iconPath: '/icons/جولات-مخصصة.webp' },
  ];

  // Removed iconComponents map

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>عرض كروز الأحلام: إيطاليا، إسبانيا، فرنسا | مدارات الكون</title>{' '}
        {/* Updated Title */}
        <meta
          name="description"
          content="انطلق في رحلة بحرية لا تُنسى لمدة 8 أيام عبر إيطاليا وإسبانيا وفرنسا مع مدارات الكون. إقامة ووجبات وترفيه بـ 3700 ريال فقط!" // Updated Description
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
          {/* TODO: Replace with actual cruise image path */}
          <Image
            src="/images/cruise-background.jpg" // Placeholder - UPDATE THIS PATH
            alt="كروز بحري فاخر في البحر المتوسط" // Updated Alt Text
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
              كروز الأحلام: <span className={styles.highlight}>إيطاليا</span>،{' '}
              <span className={styles.highlight}>إسبانيا</span>،{' '}
              <span className={styles.highlight}>فرنسا</span>
            </h1>{' '}
            {/* Updated Headline */}
            <p className={styles.description}>
              انطلق في مغامرة بحرية استثنائية لمدة 8 أيام و 7 ليالي بسعر يبدأ من
              3700 ريال للشخص. استمتع بالإقامة الفاخرة، الوجبات الشهية، والمرافق
              الترفيهية على متن الكروز.
            </p>{' '}
            {/* Updated Description */}
            {/* Features Section - Copied from London/Scotland page */}
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
                        // unoptimized // Removed to allow Next.js optimization
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

                {/* Removed City Dropdown */}

                <SparkleButton type="submit" className={styles.submitButton}>
                  احجز مكانك الآن
                </SparkleButton>
              </form>
            </div>
            {/* End Contact Form */}
          </div>
        </section>
        {/* End Hero Section */}

        {/* Dynamically loaded components - Removed */}
        {/* <Chatbot /> */}
        {/* <ExitPopup /> */}
      </main>
    </div>
  );
}

export async function getStaticProps() {
  // No longer fetching getSiteMetadata here to improve build/revalidation speed.
  // Ensure necessary <Head> tags (title, meta description, OG tags)
  // are added directly within the CruiseItalySpainFrance component's JSX.

  return {
    props: {}, // Return empty props
    revalidate: 600, // Revalidate every 10 minutes (keeps ISR active)
  };
}
