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
import styles from '@/styles/pages/LondonScotland.module.scss';
// Removed getSiteMetadata import as it's no longer fetched here
import { getAllMenus } from '@/lib/menus'; // Keep menu import for now, though unused in getStaticProps
import TripForm from '../components/TripForm/TripForm';

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

  // Handle form submission success from TripForm component
  const handleFormSuccess = ({ processedPhone, externalId, leadEventId, nationality, email, name, firstName, lastName }) => {
    const thankYouUrl = nationality === 'مواطن' ? '/thank-you-citizen' : '/thank-you-resident';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (processedPhone) queryParams.set('phone', processedPhone);
    if (email) queryParams.set('email', email);
    if (name) queryParams.set('name', name);
    if (firstName) queryParams.set('firstName', firstName);
    if (lastName) queryParams.set('lastName', lastName);
    if (externalId) queryParams.set('external_id', externalId);
    if (leadEventId) queryParams.set('eventId', leadEventId);
    
    // Construct the full redirect URL
    const redirectUrl = `${thankYouUrl}?${queryParams.toString()}`;
    
    console.log(`Redirecting to: ${redirectUrl}`);
    
    // Use window.location.href for reliable redirect
    window.location.href = redirectUrl;
  };

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
      // Updated phone validation regex to be consistent with cruise and schengen pages
      const phoneRegex = /^(0|5|966)([0-9]{8,12})$/;
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

    // Declare variables outside try block so they're available in the finally block
    let redirectUrl = '';
    let externalId = '';
    let leadEventId = '';
    
    try {
      // --- Form Validation Check ---
      if (!isPhoneValid && formData.phone.trim() !== '') {
        alert(
          'يجب أن يبدأ الرقم بـ 0 أو 5 أو 966 ويتكون من المقطع المناسب من الأرقام.'
        );
        setIsLoading(false);
        return;
      }
      // Ensure other required fields are filled if necessary (currently only phone has strict validation)
      if (!formData.nationality) {
        alert('الرجاء اختيار الجنسية.');
        setIsLoading(false);
        return; // Stop submission
      }

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

      // --- Facebook Event Tracking ---
      const eventData = {
        content_name: 'London Scotland Trip Form',
        content_category: 'Travel Lead',
        value: 0, // Optional: Assign a value to the lead
        currency: 'SAR', // Optional: Specify currency
      };

      // --- Generate Event ID for Lead ---
      // Generate eventId regardless of nationality, as it's needed for the redirect
      // and potentially for the pixel event on the thank-you page.
      leadEventId = crypto.randomUUID();
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

      // --- Zapier Webhook Integration using API Proxy ---
      try {
        // Process phone number for Zapier to ensure consistent format
        let processedPhone = formData.phone;
        if (processedPhone) {
          // Remove all non-digit characters
          processedPhone = processedPhone.replace(/[^0-9]/g, '');

          // Handle different formats: standardize to Saudi mobile format
          if (processedPhone.startsWith('966') && processedPhone.length >= 12) {
            // If starts with 966, convert to 05xx format for better display
            processedPhone = '0' + processedPhone.substring(3);
            console.log(
              'Converted international format to local format:',
              processedPhone
            );
          } else if (
            !processedPhone.startsWith('0') &&
            processedPhone.startsWith('5') &&
            processedPhone.length === 9
          ) {
            // If starts with 5 and is 9 digits, add leading 0
            processedPhone = '0' + processedPhone;
            console.log('Added leading 0 to phone number:', processedPhone);
          }
        }

        const now = new Date();

        // Generate External ID 
        externalId = crypto.randomUUID();
        console.log(`Generated External ID: ${externalId}`);

        // Create payload for submission
        const zapierPayload = {
          name: formData.name || 'Not provided',
          phone: processedPhone || 'Not provided',
          email: formData.email || 'Not provided',
          nationality: formData.nationality,
          destination: formData.destination,
          formSource: 'london-scotland-trip',
          formName: 'London Scotland Trip Form',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
          timestamp: now.toISOString(),
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString(),
          leadEventId: leadEventId,
          externalId: externalId,
          ...clientData, // Include UTM parameters and other client data
        };

        console.log('Sending data to Zapier via API proxy:', zapierPayload);

        try {
          // Use our own API endpoint as proxy to avoid CORS issues
          const proxyResponse = await fetch('/api/zapier-proxy', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(zapierPayload),
          });

          const proxyData = await proxyResponse.json();
          console.log('Zapier proxy response:', proxyData);

          if (!proxyResponse.ok) {
            console.error('Error from Zapier proxy:', proxyData);
            // If the main proxy fails, try the direct endpoint as backup
            console.warn('Trying direct endpoint as backup');
            try {
              const directResponse = await fetch('/api/zapier-direct', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(zapierPayload),
              });

              const directData = await directResponse.json();
              console.log('Direct endpoint response:', directData);

              if (directResponse.ok) {
                console.log('Successfully logged data via direct endpoint');
              }
            } catch (directError) {
              console.error('Error with direct endpoint:', directError);
            }
          } else {
            console.log('Successfully sent data to Zapier via proxy');
          }
        } catch (zapierError) {
          console.error('Error sending to Zapier proxy:', zapierError);

          // Try the direct endpoint as backup
          console.warn('Proxy failed, trying direct endpoint as backup');
          try {
            const directResponse = await fetch('/api/zapier-direct', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(zapierPayload),
            });

            const directData = await directResponse.json();
            console.log('Direct endpoint response:', directData);

            if (directResponse.ok) {
              console.log('Successfully logged data via direct endpoint');
            }
          } catch (directError) {
            console.error('Error with direct endpoint:', directError);
          }
        }
      } catch (error) {
        console.error('Error in Zapier integration:', error);
        // Don't block the form submission due to Zapier errors
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

        // Check for successful response
        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Failed to send lead email:', errorData.message);
          // Log error but continue with redirect - don't block the user flow
        } else {
          console.log('Lead email sent successfully via API route');
        }
      } catch (error) {
        console.error('Error calling send-lead-email API:', error);
        // Log error but continue with redirect - don't block the user flow
      }
      // --- End Send Lead Email ---

      // --- Construct Redirect URL with Query Params ---
      const thankYouPageBase =
        formData.nationality === 'مواطن'
          ? '/thank-you-citizen'
          : '/thank-you-resident';

      const redirectQueryParams = new URLSearchParams(); // Renamed variable
      if (formData.email) redirectQueryParams.set('email', formData.email);
      if (formData.phone) redirectQueryParams.set('phone', formData.phone);
      if (formData.name) redirectQueryParams.set('name', formData.name);
      if (formData.name) {
        // Split name into firstName and lastName for better tracking
        const nameParts = formData.name.split(' ');
        redirectQueryParams.set('firstName', nameParts[0]);
        if (nameParts.length > 1) {
          redirectQueryParams.set('lastName', nameParts.slice(1).join(' '));
        }
      }
      
      redirectQueryParams.set('external_id', externalId); // Add external_id
      redirectQueryParams.set('eventId', leadEventId); // Add eventId for deduplication on thank-you page
      
      // Add fbp and fbc for better tracking
      const fbp = getCookie('_fbp') || localStorage.getItem('_fbp');
      const fbc = getCookie('_fbc') || localStorage.getItem('_fbc');
      if (fbp) redirectQueryParams.set('fbp', fbp);
      if (fbc) redirectQueryParams.set('fbc', fbc);

      redirectUrl = `${thankYouPageBase}?${redirectQueryParams.toString()}`; // Set redirectUrl for use in finally block
      console.log('DEBUG: Final redirect URL constructed:', redirectUrl);
      
      // Also log existence check for the thank-you pages
      const thankYouCitizenExists = typeof window !== 'undefined' && document.querySelector('a[href="/thank-you-citizen"]') !== null;
      const thankYouResidentExists = typeof window !== 'undefined' && document.querySelector('a[href="/thank-you-resident"]') !== null;
      console.log('DEBUG: Thank you page existence check (might be limited):', {
        thankYouCitizenExists,
        thankYouResidentExists,
        redirectingTo: formData.nationality === 'مواطن' ? 'thank-you-citizen' : 'thank-you-resident'
      });
    } catch (error) {
      console.error('Error processing form submission:', error);
      // You might want to track this error in analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'form_submission_error', {
          event_category: 'error',
          event_label: error.message,
        });
      }
      alert('حدث خطأ أثناء إرسال النموذج. يرجى المحاولة مرة أخرى.');
      
      // Fall back to a basic redirect URL if we encounter an error
      if (!redirectUrl && externalId && leadEventId) {
        redirectUrl = `/thank-you-citizen?eventId=${leadEventId}&external_id=${externalId}`;
      } else if (!redirectUrl) {
        redirectUrl = '/thank-you-citizen'; // Ultimate fallback
      }
    } finally {
      // Ensure we attempt the redirect even if errors occurred
      if (redirectUrl) {
        console.log(`Redirecting to: ${redirectUrl}`);
        // Define a function to execute the redirect that can be called multiple ways
        const executeRedirect = () => {
          console.log('Executing redirect now:', redirectUrl);
          window.location.href = redirectUrl;
        };
        
        // Try direct window.location first
        executeRedirect();
        
        // Also use setTimeout as a backup in case there's a timing issue
        setTimeout(executeRedirect, 100);
        
        // Last resort - create a hidden link and click it
        const link = document.createElement('a');
        link.href = redirectUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
      } else {
        // If everything failed, at least reset the loading state
        setIsLoading(false);
      }
      
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
    }
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
        <title>استكشف لندن واسكتلندا مع مدارات الكون | رحلة ساحرة - السعر لا يشمل الطيران</title>
        <meta
          name="description"
          content="رحلة سياحية استثنائية إلى لندن واسكتلندا مع شركة مدارات الكون للسياحة والسفر. اكتشف جمال الطبيعة والتاريخ والثقافة في بريطانيا. السعر 5900 ريال لا يشمل تذاكر الطيران."
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
              <br />
              <br />
              السعر للشخص: <span className={styles.highlight}>5900</span> ر.س
              <br />
              <span style={{ 
                fontSize: '0.9em', 
                color: '#cc9c64', 
                fontWeight: '600',
                backgroundColor: 'rgba(204, 156, 100, 0.15)',
                padding: '6px 12px',
                borderRadius: '6px',
                marginTop: '10px',
                display: 'inline-block',
                border: '1px solid rgba(204, 156, 100, 0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                ⚠️ السعر لا يشمل تذاكر الطيران
              </span>
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
                        // unoptimized // Removed to allow Next.js optimization
                      />
                    </div>
                    <p className={styles.featureText}>{feature.text}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* End Features Section */}

            {/* Contact Form - Replace with TripForm */}
            <div className={styles.formContainer}>
              <TripForm
                fields={[
                  {
                    name: 'phone',
                    label: 'الجوال',
                    type: 'tel',
                    required: true,
                    autoComplete: 'tel',
                    floatingLabel: true,
                    showCountryCode: true,
                  },
                  {
                    name: 'name',
                    label: 'الاسم الكامل (اختياري)',
                    type: 'text',
                    required: false,
                    autoComplete: 'name',
                    floatingLabel: true,
                  },
                  {
                    name: 'email',
                    label: 'البريد الإلكتروني (اختياري)',
                    type: 'email',
                    required: false,
                    autoComplete: 'email',
                    floatingLabel: true,
                  },
                ]}
                zapierConfig={{
                  endpoint: '/api/zapier-proxy',
                  extraPayload: {
                    destination: 'لندن وأسكتلندا',
                    tripName: 'London Scotland',
                    price: 5900,
                  },
                }}
                onSuccess={handleFormSuccess}
              />
            </div>
            {/* End Contact Form */}
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

export async function getStaticProps() {
  // No longer fetching getSiteMetadata here to improve build/revalidation speed.
  // Ensure necessary <Head> tags (title, meta description, OG tags)
  // are added directly within the LondonScotlandTrip component's JSX.
  // Also removed getAllMenus() call.

  return {
    props: {}, // Return empty props
    revalidate: 600, // Revalidate every 10 minutes (keeps ISR active)
  };
}
