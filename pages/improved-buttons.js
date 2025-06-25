import React from 'react';
import { ImprovedButton, ImprovedDropdownButton } from '../src/components/UI';

const ImprovedButtonsPage = () => {
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
        أزرار محسنة بحدود ذهبية
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
          Improved Buttons
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            ImprovedButton:
          </h3>
          <ImprovedButton text="زر ذهبي محسن" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            ImprovedButton (Custom Size):
          </h3>
          <ImprovedButton text="زر ذهبي محسن أوسع" width={300} height={60} />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            ImprovedDropdownButton:
          </h3>
          <ImprovedDropdownButton text="زر ذهبي منسدل محسن" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            ImprovedDropdownButton (Custom Size):
          </h3>
          <ImprovedDropdownButton
            text="إضغط هنا للتواصل معنا"
            width={250}
            height={60}
          />
        </div>
      </div>
    </div>
  );
};

export default ImprovedButtonsPage;
