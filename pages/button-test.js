import React from 'react';
import Head from 'next/head';
import ButtonTest from '../components/UI/ButtonTest';

const ButtonTestPage = () => {
  return (
    <>
      <Head>
        <title>Button Test Page</title>
      </Head>
      <div
        style={{
          minHeight: '100vh',
          padding: '50px 20px',
          background: 'radial-gradient(circle, #333, #111)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              marginBottom: '40px',
              fontSize: '2.5rem',
            }}
          >
            اختبار الأزرار ذات الحدود الذهبية
          </h1>

          <ButtonTest />
        </div>
      </div>
    </>
  );
};

export default ButtonTestPage;
