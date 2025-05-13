import React from 'react';
import Head from 'next/head';
import { SimpleGoldButton } from '../components/UI';

const SimpleGoldButtonsPage = () => {
  // Arrow right icon
  const ArrowIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="20"
      height="20"
    >
      <path
        fillRule="evenodd"
        d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
        clipRule="evenodd"
      />
    </svg>
  );

  return (
    <>
      <Head>
        <title>Simple Gold Buttons | Madarat</title>
        <meta
          name="description"
          content="Simple gold-bordered buttons with pure CSS"
        />
      </Head>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '50px 20px',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)',
        }}
      >
        <h1
          style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}
        >
          أزرار ذهبية بسيطة
        </h1>

        <div
          style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #111, #000)',
            borderRadius: '10px',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            Simple Gold Buttons
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              Basic Button:
            </h3>
            <SimpleGoldButton
              text="زر ذهبي بسيط"
              onClick={() => alert('Simple Gold Button Clicked!')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>With Icon:</h3>
            <SimpleGoldButton
              text="عرض كل الرحلات"
              href="/trips"
              icon={<ArrowIcon />}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              External Link Button:
            </h3>
            <SimpleGoldButton
              text="زيارة موقع جوجل"
              href="https://www.google.com"
              external={true}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              Homepage Style Button:
            </h3>
            <SimpleGoldButton text="اكتشف المزيد" href="/destinations" />
          </div>

          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              border: '2px solid #ffd700',
              borderRadius: '10px',
              maxWidth: '600px',
            }}
          >
            <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>
              ميزات هذا النوع من الأزرار
            </h3>
            <ul
              style={{ color: 'white', textAlign: 'right', lineHeight: '1.6' }}
            >
              <li>بساطة التصميم والتنفيذ</li>
              <li>تركيبة مشابهة للأزرار الموجودة في الصفحة الرئيسية</li>
              <li>استخدام CSS قياسي دون الحاجة لإطارات iframe</li>
              <li>سهولة التخصيص والتعديل</li>
              <li>توافق مع مكتبة Next.js للروابط الداخلية</li>
              <li>خلفية سوداء نقية وحدود ذهبية واضحة</li>
              <li>دعم للأيقونات وتوافق مع العربية (RTL)</li>
            </ul>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              المقارنة مع الأزرار الأخرى:
            </h3>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center',
                marginTop: '20px',
              }}
            >
              <SimpleGoldButton
                text="الأزرار ذات الخلفية السوداء"
                href="/pure-black-gold-buttons"
              />
              <SimpleGoldButton
                text="الأزرار المحسنة"
                href="/optimized-gold-buttons"
              />
              <SimpleGoldButton
                text="الرجوع للرئيسية"
                href="/"
                icon={<ArrowIcon />}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleGoldButtonsPage;
