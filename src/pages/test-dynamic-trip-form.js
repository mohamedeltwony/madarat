import React, { useState } from 'react';
import TripForm from '@/components/TripForm';
import styles from '@/styles/pages/LondonScotland.module.scss';

export default function TestDynamicTripForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleFormSuccess = () => {
    setSubmitted(true);
  };

  return (
    <div className={styles.container} dir="rtl">
      <h1>Test Dynamic Trip Form</h1>
      <p>Fill out the form below to test the new dynamic TripForm component.</p>
      {submitted ? (
        <div style={{ color: 'green', fontWeight: 'bold', margin: '2rem 0' }}>
          تم إرسال النموذج بنجاح!
        </div>
      ) : (
        <TripForm
          fields={[
            { name: 'name', label: 'الاسم الكامل', type: 'text', required: false },
            { name: 'phone', label: 'الجوال', type: 'tel', required: true, autoComplete: 'tel' },
            { name: 'email', label: 'البريد الإلكتروني', type: 'email', required: false, autoComplete: 'email' },
          ]}
          zapierConfig={{
            endpoint: '/api/zapier-proxy',
            extraPayload: { tripName: 'Test Trip', price: 1234 },
          }}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
} 