import React, { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import styles from '@/styles/pages/ThankYou.module.scss';
import SparkleButton from '@/components/UI/SparkleButton';
import confetti from 'canvas-confetti';
import { trackLeadEvent, getFacebookParams } from '@/utils/facebookTracking'; // Import tracking functions
import { sendGTMEvent, trackFormSubmission } from '@/lib/gtm';
import { saveUserProfile, getUserTrackingData } from '@/utils/userIdentification';

// Helper function to get cookie value by name
const getCookieValue = (name) => {
  if (typeof document === 'undefined') {
    return null; // Return null on server-side
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Helper function to hash data using SHA-256
async function sha256(str) {
  if (!str || typeof str !== 'string') return null;
  try {
    const buffer = new TextEncoder().encode(str.toLowerCase().trim()); // Ensure lowercase and trimmed
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  } catch (error) {
    console.error('SHA-256 Hashing Error:', error);
    return null;
  }
}

// Clean and format user data for facebook
function cleanUserData(data) {
  const cleaned = {};
  
  // Clean email
  if (data.email) {
    cleaned.email = data.email.toLowerCase().trim();
  }
  
  // Clean phone (remove non-digits)
  if (data.phone) {
    cleaned.phone = data.phone.replace(/\D/g, '');
  }
  
  // Process name fields
  if (data.firstName) {
    cleaned.firstName = data.firstName.trim();
  }
  
  if (data.lastName) {
    cleaned.lastName = data.lastName.trim();
  }
  
  // If we have name but no first/last name, split it
  if (data.name && (!data.firstName && !data.lastName)) {
    const nameParts = data.name.trim().split(' ');
    cleaned.firstName = nameParts[0];
    if (nameParts.length > 1) {
      cleaned.lastName = nameParts.slice(1).join(' ');
    }
  }
  
  // Pass through other fields
  cleaned.external_id = data.external_id || null;
  cleaned.nationality = data.nationality || null;
  
  return cleaned;
}

export default function ThankYouCitizen() {
  const router = useRouter(); // Initialize router

  // Function to fire confetti with specific options
  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.6 },
      colors: ['#cc9c64', '#ffffff', '#0c4c44'], // Gold, White, Teal
    };

    function fire(particleRatio, opts) {
      // Check if confetti function exists before calling
      if (typeof confetti === 'function') {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      } else {
        console.warn('Confetti function not available');
      }
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // Fire confetti on component mount
  useEffect(() => {
    // Add a slight delay to ensure canvas is ready
    const timer = setTimeout(() => {
      fireConfetti(); // Fire initially after delay
      // Fire intermittently
      const interval = setInterval(fireConfetti, 4000); // Fire every 4 seconds
      // Return cleanup for interval within the timeout scope
      return () => clearInterval(interval);
    }, 100); // 100ms delay

    // Return cleanup for the timeout itself
    return () => clearTimeout(timer);
  }, []); // Empty dependency array, fire only once on mount + intervals

  // Fire Pixel Lead event on page load with user data
  useEffect(() => {
    const trackLeadEventWithData = async () => {
      // Wait for router to be ready
      if (!router.isReady) return;

      console.log('Thank you page loaded with query params:', router.query);
      
      // --- Get User Data ---
      // 1. From Query Parameters
      const email = router.query.email || null;
      const phone = router.query.phone || null;
      const firstName = router.query.firstName || null;
      const lastName = router.query.lastName || null;
      const name = router.query.name || null;
      const external_id = router.query.external_id || null;
      const eventId = router.query.eventId || null;
      const nationality = router.query.nationality || null;
      
      // If we don't have any user data, we can't track effectively
      if (!email && !phone && !name && !firstName) {
        console.warn('No user data available for tracking in query parameters');
        return;
      }
      
      // --- Save user profile for persistence ---
      try {
        await saveUserProfile({
          email: email,
          phone: phone,
          name: name || (firstName && lastName ? `${firstName} ${lastName}` : firstName),
          nationality: 'مواطن',
          user_type: 'citizen',
          form_submission: true,
          form_name: 'citizenship_form',
          external_id: external_id,
          event_id: eventId,
          conversion_value: 10,
          trip_destination: 'general_inquiry'
        });
        console.log('User profile saved for persistence');
      } catch (error) {
        console.error('Error saving user profile:', error);
      }
      
      // --- Get Facebook Tracking Parameters ---
      const fbParams = getFacebookParams();
      // Also check URL parameters as fallback
      const fbc = router.query.fbc || fbParams.fbc || null;
      const fbp = router.query.fbp || fbParams.fbp || null;
      
      console.log('Facebook tracking parameters:', { 
        fbp: fbp ? 'present' : 'missing', 
        fbc: fbc ? 'present' : 'missing',
        eventId: eventId ? 'present' : 'missing'
      });
      
      // --- Clean and format user data ---
      const userData = cleanUserData({
        email,
        phone,
        firstName,
        lastName,
        name,
        external_id,
        nationality
      });
      
      // --- Google Ads Enhanced Conversion Tracking ---
      if (typeof window !== 'undefined' && window.gtag) {
        try {
          // Prepare enhanced conversion data with all available user information
          const enhancedConversionData = {
            'send_to': 'AW-16691848441/Y1RHCJuO-dUZEPnJpZc-',
            'value': 10.0,
            'currency': 'SAR',
            'transaction_id': external_id || eventId || `citizen_${Date.now()}`,
            'custom_parameters': {
              'user_type': 'citizen',
              'nationality': 'مواطن',
              'form_name': 'citizenship_form',
              'lead_quality': 'high',
              'page_type': 'thank_you',
              'lead_source': 'website',
              'conversion_type': 'lead_generation',
              'event_id': eventId || `citizen_${Date.now()}`,
              'external_id': external_id || '',
              'timestamp': new Date().toISOString(),
              'page_url': window.location.href,
              'page_title': document.title,
              'user_language': 'ar'
            }
          };

          // Add enhanced conversion user data for better matching (hashed automatically by gtag)
          if (userData.email || userData.phone || userData.firstName || userData.lastName) {
            enhancedConversionData.user_data = {};
            
            if (userData.email) {
              enhancedConversionData.user_data.email_address = userData.email;
            }
            
            if (userData.phone) {
              // Format phone number for enhanced conversions (remove non-digits and add country code if needed)
              let formattedPhone = userData.phone.replace(/\D/g, '');
              if (formattedPhone.startsWith('5') && formattedPhone.length === 9) {
                formattedPhone = '966' + formattedPhone; // Add Saudi Arabia country code
              }
              enhancedConversionData.user_data.phone_number = '+' + formattedPhone;
            }
            
            if (userData.firstName) {
              enhancedConversionData.user_data.first_name = userData.firstName;
            }
            
            if (userData.lastName) {
              enhancedConversionData.user_data.last_name = userData.lastName;
            }
            
            // Add address data if available (helps with enhanced conversions)
            enhancedConversionData.user_data.country = 'SA'; // Saudi Arabia
            
            console.log('Enhanced conversion data prepared with user data for better matching');
          }

          // Fire the optimized Google Ads conversion event
          window.gtag('event', 'conversion', enhancedConversionData);
          
          console.log('Google Ads enhanced conversion tracked successfully:', {
            conversion_id: 'AW-16691848441/Y1RHCJuO-dUZEPnJpZc-',
            value: 10.0,
            currency: 'SAR',
            transaction_id: enhancedConversionData.transaction_id,
            has_user_data: !!enhancedConversionData.user_data,
            user_data_fields: enhancedConversionData.user_data ? Object.keys(enhancedConversionData.user_data) : []
          });

          // Also push to dataLayer for GTM if needed
          if (window.dataLayer) {
            window.dataLayer.push({
              'event': 'google_ads_conversion',
              'google_ads_conversion_id': 'AW-16691848441',
              'google_ads_conversion_label': 'Y1RHCJuO-dUZEPnJpZc-',
              'conversion_value': 10.0,
              'currency': 'SAR',
              'transaction_id': enhancedConversionData.transaction_id,
              'user_type': 'citizen',
              'nationality': 'مواطن',
              'form_name': 'citizenship_form',
              'lead_quality': 'high',
              'conversion_type': 'lead_generation',
              'enhanced_conversion_enabled': !!enhancedConversionData.user_data,
              'timestamp': new Date().toISOString()
            });
          }

        } catch (error) {
          console.error('Error tracking Google Ads conversion:', error);
          
          // Fallback to basic conversion tracking if enhanced conversion fails
          if (window.gtag) {
            window.gtag('event', 'conversion', {
              'send_to': 'AW-16691848441/Y1RHCJuO-dUZEPnJpZc-',
              'value': 10.0,
              'currency': 'SAR',
              'transaction_id': external_id || eventId || `citizen_${Date.now()}`
            });
            console.log('Fallback Google Ads conversion tracked');
          }
        }
      } else {
        console.warn('Google Ads gtag not available for conversion tracking');
      }
      
      // --- Send event to Facebook ---
      const result = await trackLeadEvent({
        ...userData,
        fbc,
        fbp,
        event_id: eventId,
        event_source_url: window.location.href,
        content_name: 'Citizenship Form Submission',
        lead_event_source: 'thank-you-page',
        form_id: 'citizen-form',
        value: 10, // Estimated value of this lead
        currency: 'SAR'
      });
      
      console.log('Tracking result:', result);

      // Add GTM tracking for successful conversion (now enhanced with persistent data)
      await sendGTMEvent({
        event: 'conversion',
        conversion_type: 'lead',
        conversion_value: 10,
        currency: 'SAR',
        user_type: 'citizen',
        nationality: 'مواطن',
        form_name: 'citizenship_form',
        page_type: 'thank_you',
        lead_source: 'website',
        external_id: router.query.external_id || '',
        event_id: eventId,
        timestamp: new Date().toISOString(),
        // Add encrypted user data
        encrypted_email: userData.email ? await sha256(userData.email) : null,
        encrypted_phone: userData.phone ? await sha256(userData.phone) : null,
        encrypted_name: userData.firstName && userData.lastName ? await sha256(`${userData.firstName} ${userData.lastName}`) : 
                       userData.name ? await sha256(userData.name) : null,
        // Add page context
        url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        page_category: 'thank-you-citizen',
        user_language: 'ar',
        form_location: 'thank-you-citizen',
        lead_quality: 'high',
        completion_time: new Date().toISOString()
      });

      // Track as completed form submission (now enhanced with persistent data)
      await trackFormSubmission('citizenship_form_complete', {
        form_location: 'thank-you-citizen',
        conversion_value: 10,
        currency: 'SAR',
        user_type: 'citizen',
        lead_quality: 'high',
        completion_time: new Date().toISOString(),
        // Add encrypted user data
        encrypted_email: userData.email ? await sha256(userData.email) : null,
        encrypted_phone: userData.phone ? await sha256(userData.phone) : null,
        encrypted_name: userData.firstName && userData.lastName ? await sha256(`${userData.firstName} ${userData.lastName}`) : 
                       userData.name ? await sha256(userData.name) : null,
        // Add page context
        url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        page_category: 'thank-you-citizen',
        user_language: 'ar',
        external_id: router.query.external_id || '',
        event_id: eventId,
        timestamp: new Date().toISOString(),
        // Add user data for profile saving
        email: userData.email,
        phone: userData.phone,
        name: userData.name || (userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.firstName),
        nationality: 'مواطن'
      });

      // Enhanced ecommerce tracking for lead conversion (now enhanced with persistent data)
      await sendGTMEvent({
        event: 'purchase',
        ecommerce: {
          transaction_id: router.query.external_id || eventId,
          value: 10,
          currency: 'SAR',
          items: [{
            item_id: 'citizen-lead',
            item_name: 'Citizen Lead Conversion',
            item_category: 'Lead Generation',
            item_variant: 'Citizen',
            price: 10,
            quantity: 1
          }]
        },
        user_data: {
          nationality: 'مواطن',
          user_type: 'citizen',
          lead_source: 'website',
          encrypted_email: userData.email ? await sha256(userData.email) : null,
          encrypted_phone: userData.phone ? await sha256(userData.phone) : null,
          encrypted_name: userData.firstName && userData.lastName ? await sha256(`${userData.firstName} ${userData.lastName}`) : 
                         userData.name ? await sha256(userData.name) : null
        },
        // Add additional context
        conversion_type: 'lead',
        conversion_value: 10,
        currency: 'SAR',
        form_name: 'citizenship_form',
        page_type: 'thank_you',
        lead_source: 'website',
        external_id: router.query.external_id || '',
        event_id: eventId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        page_title: document.title,
        page_path: window.location.pathname,
        page_category: 'thank-you-citizen',
        user_language: 'ar',
        form_location: 'thank-you-citizen',
        lead_quality: 'high',
        completion_time: new Date().toISOString()
      });
    };

    // Use a small delay to ensure fbq might be ready if loaded async
    const timer = setTimeout(trackLeadEventWithData, 500);
    return () => clearTimeout(timer);
  }, [router.isReady, router.query]);
  
  // Direct server event for Conversion API
  const sendServerEvent = async (eventName, eventData, eventId) => {
    try {
      console.log(`Sending ${eventName} to server with eventId: ${eventId}`);
      
      const response = await fetch('/api/facebook-conversion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventName,
          userData: eventData,
          eventId
        })
      });
      
      if (!response.ok) {
        console.error('Error sending to Conversion API:', await response.json());
      } else {
        console.log('Successfully sent to Conversion API');
      }
    } catch (error) {
      console.error('Error sending server event:', error);
    }
  };

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>شكراً لك! | مدارات الكون</title>
        <meta
          name="description"
          content="شكراً لتسجيلك معنا في مدارات الكون للسياحة والسفر."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/images/مدارات-2.png" />
        <link rel="apple-touch-icon" href="/images/مدارات-2.png" />
      </Head>

      <main className={styles.mainContent}>
        <div className={styles.contentBox}>
          <div className={styles.logoContainer}>
            <Image
              src="/logo.png"
              alt="مدارات الكون للسياحة والسفر"
              width={180}
              height={55}
              priority
            />
          </div>

          <h1 className={styles.title}>تم استلام طلبك بنجاح!</h1>
          <p className={styles.subtitle}>
            شكراً لإهتمامك بالتسجيل في رحلة لندن واسكتلندا، سيتواصل معك فريقنا
            قريباً!
          </p>

          {/* Contact Information */}
          <div className={styles.contactInfo}>
            <h3 className={styles.contactTitle}>هل لديك أي استفسار؟</h3>
            <p className={styles.contactText}>
              يمكنك التواصل معنا عبر:
            </p>
            <p className={styles.contactMethod}>
              <strong>العنوان:</strong> طريق أنس بن مالك، الملقا، الرياض 13521، المملكة العربية السعودية
            </p>
            <p className={styles.contactMethod}>
              <strong>الموقع:</strong> الملقا، ريحانة بوليفارد
            </p>
            <p className={styles.contactMethod}>
              <strong>الجوال:</strong> +966 9200 34019
            </p>
            <p className={styles.contactMethod}>
              <strong>البريد الإلكتروني:</strong> info@madaratalkon.com
            </p>
          </div>
          
          {/* Social Media Links */}
          <div className={styles.socialLinks}>
            <h3 className={styles.socialTitle}>تابعنا على مواقع التواصل الاجتماعي</h3>
            <div className={styles.socialIcons}>
              <a href="https://www.instagram.com/madaraatalkon/" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/instagram.svg" alt="Instagram" width={30} height={30} />
              </a>
              <a href="https://www.youtube.com/@MadaratAlkon" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/youtube.svg" alt="YouTube" width={30} height={30} />
              </a>
              <a href="https://www.tiktok.com/@madaraatalkon" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/tiktok.svg" alt="TikTok" width={30} height={30} />
              </a>
              <a href="http://www.linkedin.com/company/madaraatalkon" target="_blank" rel="noopener noreferrer" className={styles.socialIcon}>
                <Image src="/icons/linkedin.svg" alt="LinkedIn" width={30} height={30} />
              </a>
            </div>
          </div>

          {/* Add sparkle button to return to homepage */}
          <div className={styles.buttonWrapper}>
            <SparkleButton href="/" filled>
              العودة للصفحة الرئيسية
            </SparkleButton>
          </div>
        </div>
      </main>
    </div>
  );
}

