import React from 'react';
import { UltimateButton, UltimateDropdownButton } from '../components/UI';

const UltimateButtonsPage = () => {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        padding: '50px 20px',
        minHeight: '100vh',
        backgroundColor: '#121212',
      }}
    >
      <h1 style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}>
        أزرار ذات الحدود الذهبية - النسخة النهائية
      </h1>

      <div
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, #222, #111)',
          borderRadius: '10px',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h2 style={{ color: 'white', marginBottom: '20px' }}>
          Ultimate Buttons
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Ultimate Button:
          </h3>
          <UltimateButton
            text="زر ذهبي نهائي"
            onClick={() => alert('Button clicked!')}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Ultimate Button (Custom Size):
          </h3>
          <UltimateButton
            text="زر ذهبي نهائي أوسع"
            width={300}
            height={60}
            onClick={() => alert('Large button clicked!')}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Ultimate Dropdown Button:
          </h3>
          <UltimateDropdownButton text="زر منسدل نهائي" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Ultimate Dropdown Button (Custom Size):
          </h3>
          <UltimateDropdownButton
            text="اضغط هنا للتواصل معنا"
            width={250}
            height={60}
          />
        </div>

        <div
          style={{
            marginTop: '30px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
            maxWidth: '600px',
          }}
        >
          <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>
            ميزات الزر النهائي
          </h3>
          <ul style={{ color: 'white', textAlign: 'right', lineHeight: '1.6' }}>
            <li>بدون خلفية غير مرغوب فيها</li>
            <li>حدود ذهبية متحركة</li>
            <li>عزل تام عن أي تنسيقات CSS خارجية</li>
            <li>استخدام عناصر div فقط بدون button</li>
            <li>إعادة تعيين كاملة للتنسيقات (all: initial)</li>
            <li>متوافق مع معايير سهولة الوصول</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UltimateButtonsPage;
