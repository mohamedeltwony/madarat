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

export default function GenericTrip() { // Renamed function
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

  // Placeholder - handleSubmit needed

  return (
    <div>
      <Head>
        <title>Generic Trip Page</title>
        <meta name="description" content="Generic trip description." />
      </Head>
      <main>
        <h1>Generic Trip Headline</h1>
        {/* Placeholder for content and form */}
      </main>
    </div>
  );
}