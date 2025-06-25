import React from 'react';
import { GoldLinkButton, GoldLinkDropdownButton } from '@/components/UI';

const GoldLinkButtonsPage = () => {
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
        أزرار الروابط الذهبية
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
          Gold Link Buttons
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Basic Gold Link Button:
          </h3>
          <GoldLinkButton
            text="رابط ذهبي"
            href="https://example.com"
            target="_blank"
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Telephone Link:
          </h3>
          <GoldLinkButton
            text="اتصل بنا"
            href="tel:+966123456789"
            width={180}
            height={50}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>Email Link:</h3>
          <GoldLinkButton
            text="راسلنا"
            href="mailto:info@example.com"
            width={180}
            height={50}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Large Internal Link:
          </h3>
          <GoldLinkButton
            text="تصفح خدماتنا"
            href="/services"
            width={300}
            height={60}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Gold Link Dropdown Button:
          </h3>
          <GoldLinkDropdownButton
            text="روابط التواصل"
            width={220}
            height={50}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'white', marginBottom: '10px' }}>
            Custom Dropdown Items:
          </h3>
          <GoldLinkDropdownButton
            text="وسائل الدفع"
            width={200}
            height={50}
            dropdownItems={[
              {
                text: 'بطاقات الائتمان',
                href: '/payment/credit-card',
                icon: (
                  <span style={{ color: '#ffd700', fontSize: '18px' }}>💳</span>
                ),
              },
              {
                text: 'حوالة بنكية',
                href: '/payment/bank-transfer',
                icon: (
                  <span style={{ color: '#ffd700', fontSize: '18px' }}>🏦</span>
                ),
              },
              {
                text: 'الدفع عند الاستلام',
                href: '/payment/cash-on-delivery',
                icon: (
                  <span style={{ color: '#ffd700', fontSize: '18px' }}>💰</span>
                ),
              },
            ]}
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
            مميزات أزرار الروابط
          </h3>
          <ul style={{ color: 'white', textAlign: 'right', lineHeight: '1.6' }}>
            <li>
              استخدام عناصر الروابط &lt;a&gt; بدلاً من الأزرار &lt;button&gt;
            </li>
            <li>عزل تام عن CSS الصفحة الرئيسية</li>
            <li>تدعم جميع أنواع الروابط (URL، هاتف، بريد إلكتروني)</li>
            <li>حدود ذهبية متحركة بدون خلفية</li>
            <li>تأثيرات تفاعلية عند التحويم</li>
            <li>خيارات تخصيص متعددة للروابط المنسدلة</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoldLinkButtonsPage;
