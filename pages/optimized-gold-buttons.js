import React from 'react';
import {
  OptimizedGoldButton,
  OptimizedGoldDropdownButton,
} from '../src/components/UI';
import Head from 'next/head';
import Link from 'next/link';

const OptimizedGoldButtonsPage = () => {
  return (
    <>
      <Head>
        <title>Optimized Gold Buttons | Madarat</title>
        <meta
          name="description"
          content="Testing optimized gold buttons with transparent backgrounds"
        />
      </Head>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '50px 20px',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #1a1a1a, #333)',
        }}
      >
        <h1
          style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}
        >
          أزرار ذهبية محسنة
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
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            Optimized Gold Buttons
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Standard Optimized Gold Button:
            </h3>
            <OptimizedGoldButton
              text="زر ذهبي محسن"
              onClick={() => alert('Optimized Gold Button Clicked!')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Link Optimized Gold Button:
            </h3>
            <OptimizedGoldButton
              text="انتقل إلى الصفحة الرئيسية"
              href="/"
              width={250}
              height={50}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Wide Optimized Gold Button:
            </h3>
            <OptimizedGoldButton
              text="زر ذهبي أوسع"
              width={300}
              height={60}
              onClick={() => alert('Wide Optimized Gold Button Clicked!')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              External Link Button:
            </h3>
            <OptimizedGoldButton
              text="زيارة موقع جوجل"
              href="https://www.google.com"
              target="_blank"
              width={220}
              height={50}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Optimized Gold Dropdown Button:
            </h3>
            <OptimizedGoldDropdownButton
              text="القائمة المنسدلة"
              width={200}
              height={50}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Custom Dropdown Items:
            </h3>
            <OptimizedGoldDropdownButton
              text="وسائل التواصل"
              width={250}
              height={50}
              dropdownItems={[
                {
                  text: 'الواتساب',
                  href: 'https://wa.me/1234567890',
                  icon: '📱',
                  target: '_blank',
                },
                {
                  text: 'الإيميل',
                  href: 'mailto:info@example.com',
                  icon: '✉️',
                },
                {
                  text: 'الهاتف',
                  href: 'tel:+123456789',
                  icon: '📞',
                },
              ]}
            />
          </div>

          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              border: '1px solid rgba(255,215,0,0.3)',
              borderRadius: '10px',
              maxWidth: '600px',
            }}
          >
            <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>
              ميزات الأزرار المحسنة
            </h3>
            <ul
              style={{ color: 'white', textAlign: 'right', lineHeight: '1.6' }}
            >
              <li>عزل تام باستخدام تقنية iframe مع إعادة تعيين CSS</li>
              <li>تخلص تام من خلفية الزيتوني/الذهبي الغامق</li>
              <li>حدود ذهبية متحركة مع خلفية شفافة حقيقية</li>
              <li>دعم الروابط والأحداث onClick بشكل متكامل</li>
              <li>خيارات تخصيص واسعة للحجم والنص</li>
              <li>قائمة منسدلة متوافقة تمامًا مع الزر الأساسي</li>
              <li>استخدام !important لمنع تداخل التنسيقات الخارجية</li>
            </ul>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              Button Comparison:
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
              <Link href="/button-test" style={{ marginBottom: '10px' }}>
                <OptimizedGoldButton
                  text="All Test Buttons"
                  width={200}
                  height={50}
                />
              </Link>
              <Link href="/isolated-gold-buttons" style={{ marginBottom: '10px' }}>
                <OptimizedGoldButton
                  text="Isolated Buttons"
                  width={200}
                  height={50}
                />
              </Link>
              <Link href="/gold-link-buttons" style={{ marginBottom: '10px' }}>
                <OptimizedGoldButton
                  text="Link Buttons"
                  width={200}
                  height={50}
                />
              </Link>
              <Link href="/ultimate-buttons" style={{ marginBottom: '10px' }}>
                <OptimizedGoldButton
                  text="Ultimate Buttons"
                  width={200}
                  height={50}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OptimizedGoldButtonsPage;
