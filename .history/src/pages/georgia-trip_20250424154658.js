import React, { useState, useEffect } from 'react';
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

// Removed SVG Icon imports

// import UIStyles from '@/components/UI/UI.module.scss'; // Commented out - unused

// NOTE: Update image path comment if needed
// public/images/gorgia-background.webp

// --- SVG Icons ---

// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components - Removed
// const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false });
// const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
//   ssr: false,
// });
export default function GeorgiaTrip() {
  // Changed component name
  const router = useRouter(); // Get router instance
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '', // Added nationality field
    // city: '', // Removed city field
    destination: 'جورجيا', // Changed destination
  });
  const [formStarted, setFormStarted] = useState(false); // Track if form interaction started
  const [phoneTouched, setPhoneTouched] = useState(false); // Track if phone field was interacted with
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Track phone validity, assume valid initially
  const [isLoading, setIsLoading] = useState(false); // Add loading state

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
            destination: data.destination, // This will be 'جورجيا' from state
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

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === 'phone') {
      setPhoneTouched(true);
      const phoneRegex = /^5[0-9]{8}$/;
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
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value }, eventId);
    } else if (!formStarted && name === 'phone' && currentPhoneValid) {
      setFormStarted(true);
      const eventId = crypto.randomUUID();
      console.log('Form started (valid phone), triggering InitiateCheckout');
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {}, { eventID: eventId });
      }
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value }, eventId);
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

    if (!isPhoneValid && formData.phone.trim() !== '') {
      alert('الرجاء إدخال رقم جوال سعودي صحيح (يبدأ بـ 5 ويتكون من 9 أرقام).');
      setIsLoading(false); // Reset loading state on validation error
      return;
    }
    if (!formData.nationality) {
      alert('الرجاء اختيار الجنسية.');
      setIsLoading(false); // Reset loading state on validation error
      return;
    }

    // --- Facebook Event Tracking (Keep original logic/names) ---
    const eventData = {
      content_name: 'London Scotland Trip Form', // Keep original name
      content_category: 'Travel Lead',
      value: 0, // Keep original value
      currency: 'SAR',
    };
    const leadEventId = crypto.randomUUID();
    console.log(`Generated Lead Event ID: ${leadEventId}`);
    if (formData.nationality === 'مواطن') {
      console.log('Sending Lead event via CAPI for citizen');
      await sendFbEvent('Lead', formData, leadEventId);
    } else {
      console.log('Skipping CAPI Lead event for non-citizen');
    }
    // --- End Facebook Event Tracking ---

    // --- Zapier Webhook Integration (Keep original logic/names) ---
    try {
      const zapierWebhookUrl = process.env.NEXT_PUBLIC_ZAPIER_WEBHOOK_URL;
      if (!zapierWebhookUrl) {
        console.error('Zapier webhook URL is not configured');
      } else {
        const formBody = new URLSearchParams();
        formBody.append('name', formData.name);
        formBody.append('phone', formData.phone);
        formBody.append('email', formData.email);
        formBody.append('nationality', formData.nationality);
        formBody.append('destination', formData.destination); // Will send 'جورجيا'
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        formBody.append('formName', 'London Scotland Trip Form'); // Keep original name
        formBody.append('pageUrl', window.location.href);
        formBody.append('timestamp', now.toISOString());
        formBody.append('date', date);
        formBody.append('time', time);
        const response = await fetch(zapierWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    // --- Facebook Event Tracking ---
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

    // --- Zapier Webhook Integration (Keep original logic/names) ---

    // --- Send Lead Email via API Route (Keep original logic/names) ---
    try {
      const emailResponse = await fetch('/api/send-lead-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          nationality: formData.nationality,
          destination: formData.destination, // Will send 'جورجيا'
          formName: 'London Scotland Trip Form', // Keep original name
          pageUrl: window.location.href,
          ...clientData,
        }),
      });
      if (!emailResponse.ok) {
        const errorData = await emailResponse.json();
        console.error('Failed to send lead email:', errorData.message);
      } else {
        console.log('Lead email sent successfully via API route');
      }
    } catch (error) {
      console.error('Error calling send-lead-email API:', error);
    }
    // --- End Send Lead Email ---

    const externalId = crypto.randomUUID();
    const thankYouPageBase =
      formData.nationality === 'مواطن'
        ? '/thank-you-citizen'
        : '/thank-you-resident';
    const redirectQueryParams = new URLSearchParams();
    if (formData.email) redirectQueryParams.set('email', formData.email);
    if (formData.phone) redirectQueryParams.set('phone', formData.phone);
    redirectQueryParams.set('external_id', externalId);
    redirectQueryParams.set('eventId', leadEventId);
    const redirectUrl = `${thankYouPageBase}?${redirectQueryParams.toString()}`;
    console.log(`Redirecting to: ${redirectUrl}`);
    router.push(redirectUrl);

    // Reset form (Keep original logic)
    setFormData({
      name: '',
      phone: '',
      email: '',
      nationality: '',
      destination: 'لندن واسكتلندا', // Keep original destination in reset
    });
    setFormStarted(false);
    // Don't reset isLoading here as page is redirecting
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

  // Features data - Updated for Georgia
  const features = [
    {
      text: 'استقبال بسيارة خاصة في المطار والفنادق',
      iconPath: '/icons/gorgia/استقبال-وتوديع.webp',
    },
    {
      text: 'الإقامة فاخرة في فنادق ٤ و ٥ نجوم',
      iconPath: '/icons/gorgia/5-نجوم.webp',
    },
    {
      text: 'التنقلات بين المدن السياحية',
      iconPath: '/icons/gorgia/التنقلات-بين-المدن.webp',
    }, // Added new icon
    {
      text: 'جولات سياحية جماعية',
      iconPath: '/icons/gorgia/جولات-جماعية.webp',
    }, // Using the closest match
    {
      text: 'وجبات الإفطار اليومية',
      iconPath: '/icons/gorgia/الفنادق-مع-الافطار.webp',
    },
    { text: 'جولات جماعية', iconPath: '/icons/gorgia/جولات-جماعية.webp' },
    { text: 'تأمين سفر دولي', iconPath: '/icons/gorgia/تأمين.webp' },
    { text: 'خدمة عملاء ٢٤/٧', iconPath: '/icons/gorgia/خدمة-عملاء.webp' },
  ];

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>استكشف جورجيا مع مدارات الكون | رحلة ساحرة</title>{' '}
        {/* Changed title */}
        <meta
          name="description"
          content="رحلة سياحية استثنائية إلى جورجيا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في جورجيا." // Changed description
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
            src="/images/gorgia-background.webp" // Changed image src
            alt="Scenic view of Georgia" // Changed alt text
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
              رحلة <span className={styles.highlight}>جورجيا</span> الساحرة{' '}
              {/* Changed title */}
            </h1>
            <p className={styles.description}>
              {' '}
              {/* Changed description */}
              ٨ أيام - ٧ ليالي
              <br />
              السعر يبدأ من
              <br />
              <span className={styles.highlight}>2699</span> ر.س في الغرفة
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
  // are added directly within the GeorgiaTrip component's JSX.

  return {
    props: {}, // Return empty props
    revalidate: 600, // Revalidate every 10 minutes (keeps ISR active)
  };
}
