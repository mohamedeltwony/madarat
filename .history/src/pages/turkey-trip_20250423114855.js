import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import dynamic from 'next/dynamic'; // Import dynamic
import SparkleButton from '@/components/UI/SparkleButton';
// import Chatbot from '@/components/Chatbot'; // Import dynamically
// import ExitPopup from '@/components/ExitPopup'; // Import dynamically
import styles from '@/styles/pages/LondonScotland.module.scss'; // Keep existing style for now, suggest creating a new one later

// NOTE: Please add a high-quality image for Turkey to:
// public/images/destinations/turkey-hero.jpg (or similar) and update the path below

// --- SVG Icons ---
// Removed PlaceholderIcon and inline VisaIcon component definition
// --- End SVG Icons ---

// Dynamically import components
const Chatbot = dynamic(() => import('@/components/Chatbot'), { ssr: false }); // Keep this one-line for consistency unless Prettier complains
const ExitPopup = dynamic(() => import('@/components/ExitPopup'), {
  ssr: false, // Format options object multi-line as requested
});
export default function TurkeyTrip() {
  // Renamed component
  // Removed blank line above
  const router = useRouter(); // Get router instance
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '', // Added nationality field
    // city: '', // Removed city field
    destination: 'تركيا', // Updated destination
  });
  const [formStarted, setFormStarted] = useState(false); // Track if form interaction started
  const [phoneTouched, setPhoneTouched] = useState(false); // Track if phone field was interacted with
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Track phone validity, assume valid initially
  const [isLoading, setIsLoading] = useState(false); // Add loading state

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
      setIsLoading(false); // Stop loading on validation error
      return; // Stop submission
    }
    // Ensure other required fields are filled if necessary (currently only phone has strict validation)
    if (!formData.nationality) {
      alert('الرجاء اختيار الجنسية.');
      setIsLoading(false); // Stop loading on validation error
      return; // Stop submission
    }
    // --- Facebook Event Tracking ---
    const eventData = {
      content_name: 'Turkey Trip Form', // Updated form name
      content_category: 'Travel Lead',
      value: 0, // Optional: Assign a value to the lead
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
        formBody.append('destination', formData.destination); // Sends 'تركيا'
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();

        formBody.append('formName', 'Turkey Trip Form'); // Updated form name
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
          destination: formData.destination, // Sends 'تركيا'
          formName: 'Turkey Trip Form', // Updated form name
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
    redirectQueryParams.set('eventId', leadEventId); // Add eventId for deduplication on thank-you page

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
      destination: 'تركيا', // Reset destination
    });
    setFormStarted(false); // Reset form started state
    // setIsLoading(false); // Reset loading state after redirect logic starts
  };

  // Saudi cities (Keep as is, might be relevant for user origin)
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

  // Features data - Updated for Turkey based on provided text
  const features = [
    { text: 'بدون تأشيرة للسعوديين', iconPath: '/icons/تأشيرة.webp' }, // Assuming visa icon is relevant
    { text: 'إقامة 4 نجوم مع فطور', iconPath: '/icons/اقامه.webp' }, // Using existing accommodation icon
    { text: 'استقبال من المطار', iconPath: '/icons/راحة تامة.webp' }, // Using existing comfort icon
    { text: 'تنقلات خاصة', iconPath: '/icons/جولات-مخصصة.webp' }, // Using existing tours icon
    { text: 'دخول شامل للفعاليات', iconPath: '/icons/فعاليات-ممتعة.webp' }, // Using existing activities icon
    { text: 'منطاد كابادوكيا', iconPath: '/icons/مواعيد مرنة.webp' }, // Reusing an icon, consider adding specific ones
    { text: 'مغامرات دبابات وخيول', iconPath: '/icons/مرشد .webp' }, // Reusing an icon
    { text: 'شلالات ومعالم طبيعية', iconPath: '/icons/إطلالة نهرية.webp' }, // Using existing view icon
    { text: 'أشهى المأكولات التركية', iconPath: '/icons/اسعار-تنافسيه.webp' }, // Reusing an icon
    { text: 'ضمان استرجاع', iconPath: '/icons/تقييمات-عالية.webp' }, // Reusing an icon
  ];

  // Removed iconComponents map

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>رحلتك إلى تركيا من جدة مع مدارات الكون | بدون تأشيرة!</title>{' '}
        {/* Updated Title */}
        <meta
          name="description"
          content="سافر إلى تركيا من جدة بدون تأشيرة وبأقل سعر مع مدارات الكون. رحلة منظمة تشمل إقامة 4 نجوم، استقبال، تنقلات، وفعاليات ممتعة مثل منطاد كابادوكيا." // Updated Description
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
            src="/images/destinations/turkey-hero.jpg" // UPDATE THIS PATH with a real Turkey image
            alt="Scenic view of Turkey (e.g., Cappadocia or Istanbul)"
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
              هلا بأهل ديرتنا الغالية! <br /> رحلتك لـ{' '}
              <span className={styles.highlight}>تركيا</span> من جدة صارت أسهل!
            </h1>{' '}
            {/* Updated Headline */}
            <p className={styles.description}>
              سافر بدون تأشيرة، بدون مجهود، وبأقل سعر! اكتشف سحر تركيا الآسيوي
              والأوروبي مع رحلة مرتبة وآمنة ومريحة لك ولعائلتك. كل شي جاهز من
              يوم توصل!
            </p>{' '}
            {/* Updated Description */}
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
              <h2 className={styles.formTitle}>
                احجز مغامرتك الآن قبل اكتمال العدد!
              </h2>
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

                <div
                  className={`${styles.formGroup} ${styles.floatingLabelGroup} ${
                    phoneTouched && !isPhoneValid ? styles.invalid : ''
                  }`}
                >
                  <input
                    type="tel" // Use tel type for phone numbers
                    id="phone"
                    className={styles.formInput}
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder=" "
                    autoComplete="tel" // Added autocomplete
                    required // Phone is required
                    pattern="^5[0-9]{8}$" // Add pattern for basic HTML5 validation hint
                    title="أدخل رقم جوال سعودي صحيح (9 أرقام تبدأ بـ 5)" // Add title for validation message hint
                  />
                  <label htmlFor="phone" className={styles.formLabel}>
                    رقم الجوال (9 أرقام تبدأ بـ 5) *
                  </label>
                  {phoneTouched && !isPhoneValid && (
                    <span className={styles.errorMessage}>
                      الرجاء إدخال رقم جوال سعودي صحيح.
                    </span>
                  )}
                </div>

                <div
                  className={`${styles.formGroup} ${styles.floatingLabelGroup}`}
                >
                  <input
                    type="email"
                    id="email"
                    className={styles.formInput}
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange} // Already handles InitiateCheckout trigger
                    placeholder=" "
                    autoComplete="email" // Added autocomplete
                    // required // Made optional
                  />
                  <label htmlFor="email" className={styles.formLabel}>
                    البريد الإلكتروني (اختياري)
                  </label>
                </div>

                {/* Nationality Dropdown */}
                <div
                  className={`${styles.formGroup} ${styles.floatingLabelGroup}`}
                >
                  <select
                    id="nationality"
                    name="nationality"
                    className={styles.formInput} // Use same styling as input
                    value={formData.nationality}
                    onChange={handleInputChange}
                    required // Nationality is required
                  >
                    <option value="" disabled>
                      اختر الجنسية *
                    </option>
                    <option value="مواطن">مواطن</option>
                    <option value="مقيم">مقيم</option>
                  </select>
                  {/* No floating label needed for select if it has a default prompt */}
                </div>

                {/* City Dropdown - Removed */}
                {/* <div className={`${styles.formGroup} ${styles.floatingLabelGroup}`}>
                  <select
                    id="city"
                    name="city"
                    className={styles.formInput} // Use same styling as input
                    value={formData.city}
                    onChange={handleInputChange}
                    required // City is required
                  >
                    <option value="" disabled>اختر مدينتك *</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div> */}

                {/* Submit Button */}
                <SparkleButton
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading || (phoneTouched && !isPhoneValid)} // Disable if loading or phone invalid
                >
                  {isLoading
                    ? 'جاري الإرسال...'
                    : 'أرسل لنا "سعودي وأفتخر" الآن!'}
                </SparkleButton>
                <p className={styles.ctaNote}>
                  لا تفوت الفرصة! المقاعد محدودة والعرض قد لا يتكرر.
                </p>
              </form>
            </div>
            {/* End Contact Form */}
          </div>
        </section>
        {/* End Hero Section */}

        {/* Rest of the page content can be added here, mirroring the structure of the original page but with Turkey-specific details */}
        {/* Example: Why Choose Us Section */}
        <section className={styles.whyChooseUs}>
          <h2>ليش تثق في مدارات الكون؟</h2>
          <ul>
            <li>✅ أكثر من 250 عميل راضٍ بتقييم 4.9 نجوم.</li>
            <li>✅ ضمان استرجاع كامل المبلغ إذا لم تجد الفعاليات كما وُعدت.</li>
            <li>✅ أسعار تنافسية لن تجدها في مكان آخر.</li>
            <li>✅ مرشد سياحي خاص ودعم 24/7 طوال الرحلة.</li>
          </ul>
        </section>

        {/* Example: What Awaits You Section */}
        <section className={styles.whatAwaits}>
          <h2>💥 وش ينتظرك هناك؟</h2>
          <ul>
            <li>جمال مضيق البسفور</li>
            <li>منطاد شروق الشمس في كابادوكيا</li>
            <li>مغامرات بالدبابات والخيول في وادي الخيول</li>
            <li>مدينة الجن الغامضة</li>
            <li>شلالات أوزنجول، جبل كارتبيه، قلعة ريزا</li>
            <li>حمامات ايدر الحارة</li>
            <li>كباب الجرة، البقلاوة، الشاي التركي الأصيل</li>
          </ul>
          <p>كل لحظة أحلى من الثانية!</p>
        </section>

        {/* Final CTA */}
        <section className={styles.finalCta}>
          <h2>الرحلة اللي تستاهل تعب السنة كلها… تبدأ بخطوة بسيطة:</h2>
          <p>✍️ أرسل لنا "سعودي وأفتخر" الآن عبر النموذج أعلاه!</p>
          <p>
            وخلنا نحجز لك مقعد في مغامرة ما تنسى، ممكن ما تلاقي نفس العرض بكرة!
            فالحين فرصتك!
          </p>
        </section>
      </main>

      {/* Dynamically loaded components */}
      <Chatbot />
      <ExitPopup />
    </div>
  );
}
