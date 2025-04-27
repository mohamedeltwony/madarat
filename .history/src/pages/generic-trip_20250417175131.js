import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router'; // Import useRouter
import SparkleButton from '@/components/UI/SparkleButton';
import Chatbot from '@/components/Chatbot';
import ExitPopup from '@/components/ExitPopup';
// Reusing LondonScotland styles for now
import styles from '@/styles/pages/LondonScotland.module.scss';

// NOTE: Add a generic placeholder background image to:
// public/images/placeholder-trip.jpg

export default function GenericTrip() {
  // Renamed function
  const router = useRouter(); // Get router instance
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    nationality: '', // Added nationality field
    destination: 'وجهة مختارة', // Generic destination
  });
  const [formStarted, setFormStarted] = useState(false); // Track if form interaction started
  const [phoneTouched, setPhoneTouched] = useState(false); // Track if phone field was interacted with
  const [isPhoneValid, setIsPhoneValid] = useState(true); // Track phone validity, assume valid initially

  // Helper function to send events to the backend API
  const sendFbEvent = async (eventName, data) => {
    const phoneDigits = data.phone?.replace(/[^0-9]/g, '');

    try {
      const response = await fetch('/api/fb-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: eventName,
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
            destination: data.destination,
            full_name: data.name,
          },
          eventSourceUrl: window.location.href,
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

    // Trigger InitiateCheckout logic (remains the same)
    if (
      !formStarted &&
      ['name', 'email'].includes(name) &&
      value.trim() !== ''
    ) {
      setFormStarted(true);
      console.log('Form started (name/email), triggering InitiateCheckout');
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout');
      }
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value });
    } else if (!formStarted && name === 'phone' && currentPhoneValid) {
      setFormStarted(true);
      console.log('Form started (valid phone), triggering InitiateCheckout');
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout');
      }
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value });
    } else if (
      !formStarted &&
      ['name', 'phone', 'email'].includes(name) &&
      value.trim() !== ''
    ) {
      setFormStarted(true);
      console.log('Form started, triggering InitiateCheckout');
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout');
      }
      sendFbEvent('InitiateCheckout', { ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Form Validation Check ---
    if (!isPhoneValid && formData.phone.trim() !== '') {
      alert('الرجاء إدخال رقم جوال سعودي صحيح (يبدأ بـ 5 ويتكون من 9 أرقام).');
      return;
    }
    if (!formData.nationality) {
      alert('الرجاء اختيار الجنسية.');
      return;
    }

    // --- Facebook Event Tracking ---
    const eventData = {
      content_name: 'Generic Trip Form', // Updated form name
      content_category: 'Travel Lead',
      value: 0,
      currency: 'SAR',
    };

    if (typeof window !== 'undefined' && window.fbq) {
      console.log('Firing Pixel Lead event');
      window.fbq('track', 'Lead', eventData);
    } else {
      console.log('fbq not available for Lead event');
    }

    await sendFbEvent('Lead', formData);
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

        formBody.append('formName', 'Generic Trip Form'); // Updated form name
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

    // --- Redirect based on nationality ---
    const thankYouPage =
      formData.nationality === 'مواطن'
        ? '/thank-you-citizen'
        : '/thank-you-resident';

    console.log(`Redirecting to: ${thankYouPage}`);
    router.push(thankYouPage);
    // --- End Redirect ---

    // Reset form
    setFormData({
      name: '',
      phone: '',
      email: '',
      nationality: '',
      destination: 'وجهة مختارة', // Reset to generic destination
    });
    setFormStarted(false);
  };

  // Saudi cities (kept for now, might need adjustment)
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

  // Removed specific features array

  return (
    <div className={styles.container} dir="rtl">
      <Head>
        {/* Generic Title and Description */}
        <title>عرض رحلة خاصة | مدارات الكون للسياحة والسفر</title>
        <meta
          name="description"
          content="اكتشف أفضل عروض السفر والرحلات السياحية مع مدارات الكون. احجز رحلتك الآن!"
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
        {/* Font link kept, assuming it's global */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className={styles.main}>
        {/* Placeholder for Hero Section content */}
        <h1>Generic Trip Headline</h1>
        {/* Placeholder for content and form */}
      </main>
    </div>
  );
}
