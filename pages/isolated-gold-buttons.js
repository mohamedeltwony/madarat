import React from 'react';
import {
  IsolatedGoldButton,
  IsolatedGoldDropdownButton,
} from '../components/UI';

const IsolatedGoldButtonsPage = () => {
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
        أزرار ذهبية معزولة تماماً
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
          Completely Isolated Gold Buttons
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            IsolatedGoldButton:
          </h3>
          <IsolatedGoldButton
            text="زر ذهبي معزول"
            onClick={() => alert('Isolated Gold Button Clicked!')}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            IsolatedGoldButton (Custom Size):
          </h3>
          <IsolatedGoldButton
            text="زر ذهبي معزول أوسع"
            width={300}
            height={60}
            onClick={() => alert('Large Isolated Gold Button Clicked!')}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            IsolatedGoldDropdownButton:
          </h3>
          <IsolatedGoldDropdownButton text="زر ذهبي منسدل معزول" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            IsolatedGoldDropdownButton (Custom Size):
          </h3>
          <IsolatedGoldDropdownButton
            text="للتواصل معنا اضغط هنا"
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
            ميزات الأزرار المعزولة
          </h3>
          <ul style={{ color: 'white', textAlign: 'right', lineHeight: '1.6' }}>
            <li>عزل تام باستخدام تقنية iframe</li>
            <li>استقلالية كاملة عن CSS الرئيسي</li>
            <li>حدود ذهبية متحركة</li>
            <li>خلفية شفافة بدون أي تداخل مع التنسيقات الخارجية</li>
            <li>عدم تأثر الزر بأي تنسيقات موروثة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IsolatedGoldButtonsPage;
