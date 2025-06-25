import React from 'react';
import {
  PureBlackGoldButton,
  PureBlackGoldDropdownButton,
} from '../src/components/UI';
import Head from 'next/head';
import Link from 'next/link';

const PureBlackGoldButtonsPage = () => {
  return (
    <>
      <Head>
        <title>Pure Black Gold Buttons | Madarat</title>
        <meta
          name="description"
          content="Testing pure black gold buttons with no transparency"
        />
      </Head>

      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '50px 20px',
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #0d0d0d, #1a1a1a)',
        }}
      >
        <h1
          style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}
        >
          أزرار ذهبية بخلفية سوداء
        </h1>

        <div
          style={{
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, #121212, #0a0a0a)',
            borderRadius: '10px',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
          }}
        >
          <h2 style={{ color: 'white', marginBottom: '20px' }}>
            Pure Black Gold Buttons
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Standard Pure Black Gold Button:
            </h3>
            <PureBlackGoldButton
              text="زر ذهبي بخلفية سوداء"
              onClick={() => alert('Pure Black Gold Button Clicked!')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Link Button:
            </h3>
            <PureBlackGoldButton
              text="انتقل إلى الصفحة الرئيسية"
              href="/"
              width={250}
              height={50}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Wide Button:
            </h3>
            <PureBlackGoldButton
              text="زر ذهبي أوسع"
              width={300}
              height={60}
              onClick={() => alert('Wide Button Clicked!')}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              External Link Button:
            </h3>
            <PureBlackGoldButton
              text="زيارة موقع جوجل"
              href="https://www.google.com"
              target="_blank"
              width={220}
              height={50}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Pure Black Gold Dropdown Button:
            </h3>
            <PureBlackGoldDropdownButton
              text="القائمة المنسدلة"
              width={200}
              height={50}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: 'white', marginBottom: '10px' }}>
              Custom Dropdown Items:
            </h3>
            <PureBlackGoldDropdownButton
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
              border: '2px solid #ffd700',
              borderRadius: '10px',
              maxWidth: '600px',
              boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
            }}
          >
            <h3 style={{ color: '#ffd700', marginBottom: '15px' }}>
              ميزات الأزرار ذات الخلفية السوداء
            </h3>
            <ul
              style={{ color: 'white', textAlign: 'right', lineHeight: '1.6' }}
            >
              <li>خلفية سوداء مُعتمة بنسبة 100% (بدون شفافية)</li>
              <li>حدود ذهبية متوهجة بتأثير النيون</li>
              <li>عزل تام عن CSS الصفحة الرئيسية</li>
              <li>تحكم كامل بجميع الألوان والتنسيقات</li>
              <li>تأثيرات حركية عند التحويم</li>
              <li>قائمة منسدلة متناسقة مع الزر الرئيسي</li>
              <li>تصميم متوافق مع جميع أحجام الشاشات</li>
            </ul>
          </div>

          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>
              مقارنة مع الأزرار الأخرى:
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
              <Link
                href="/optimized-gold-buttons"
                style={{ marginBottom: '10px' }}
              >
                <PureBlackGoldButton
                  text="Optimized Buttons"
                  width={200}
                  height={50}
                />
              </Link>
              <Link href="/isolated-gold-buttons" style={{ marginBottom: '10px' }}>
                <PureBlackGoldButton
                  text="Isolated Buttons"
                  width={200}
                  height={50}
                />
              </Link>
              <Link href="/gold-link-buttons" style={{ marginBottom: '10px' }}>
                <PureBlackGoldButton
                  text="Link Buttons"
                  width={200}
                  height={50}
                />
              </Link>
              <Link href="/ultimate-buttons" style={{ marginBottom: '10px' }}>
                <PureBlackGoldButton
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

export default PureBlackGoldButtonsPage;
