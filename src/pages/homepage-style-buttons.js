import React from 'react';
import Head from 'next/head';
import { HomepageStyleButton } from '../components/UI';

const HomepageStyleButtonsPage = () => {
  // Arrow icon for "View All" button
  const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
      <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
    </svg>
  );
  
  return (
    <>
      <Head>
        <title>Homepage Style Buttons | Madarat</title>
        <meta name="description" content="Recreating the exact style of the homepage gold buttons" />
      </Head>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        textAlign: 'center', 
        padding: '50px 20px', 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, #0a0a0a, #1a1a1a)'
      }}>
        <h1 style={{ color: 'white', marginBottom: '40px', fontSize: '2.5rem' }}>
          أزرار بنفس ستايل الصفحة الرئيسية
        </h1>
        
        <div style={{ 
          padding: '40px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '30px', 
          alignItems: 'center', 
          background: '#101010', 
          borderRadius: '10px', 
          maxWidth: '800px', 
          margin: '0 auto',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '20px' }}>Homepage Style Buttons</h2>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>ViewAll Button ("عرض كل الرحلات"):</h3>
            <div style={{ background: '#111', padding: '30px', borderRadius: '8px' }}>
              <HomepageStyleButton 
                text="عرض كل الرحلات" 
                href="/trips"
                icon={<ArrowIcon />}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Featured Button ("اكتشف المزيد"):</h3>
            <div style={{ background: '#111', padding: '30px', borderRadius: '8px' }}>
              <HomepageStyleButton 
                text="اكتشف المزيد" 
                href="/destinations"
                variant="featured"
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>Button with Click Handler:</h3>
            <HomepageStyleButton 
              text="اضغط هنا" 
              onClick={() => alert('Button clicked!')}
              variant="featured"
            />
          </div>
          
          <div style={{ marginBottom: '30px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>External Link Button:</h3>
            <HomepageStyleButton 
              text="زيارة موقع خارجي" 
              href="https://www.google.com"
              external={true}
              icon={<ArrowIcon />}
            />
          </div>
          
          <div style={{ 
            marginTop: '30px', 
            padding: '20px', 
            border: '1px solid #ffd700', 
            borderRadius: '10px', 
            maxWidth: '600px',
            boxShadow: '0 0 15px rgba(255, 215, 0, 0.15)',
            textAlign: 'right'
          }}>
            <h3 style={{ color: '#ffd700', marginBottom: '15px', textAlign: 'center' }}>مقارنة هذا الحل مع الحلول السابقة</h3>
            <ul style={{ color: 'white', lineHeight: '1.6' }}>
              <li><strong>التشابه التام مع الأزرار الأصلية:</strong> تم تصميم هذه الأزرار لتطابق بالضبط الأزرار الموجودة في الصفحة الرئيسية.</li>
              <li><strong>بساطة التنفيذ:</strong> تستخدم CSS قياسي بدون تقنيات معقدة مثل iframe أو SVG.</li>
              <li><strong>سهولة الاستخدام:</strong> تدعم الروابط الداخلية والخارجية والأحداث onClick بطريقة مناسبة.</li>
              <li><strong>الأداء الأفضل:</strong> أداء أفضل من الحلول السابقة لأنها لا تحتاج إلى تحميل iframe.</li>
              <li><strong>سهولة التخصيص:</strong> يمكن تعديل المظهر بسهولة عن طريق تغيير ملف CSS.</li>
              <li><strong>توافق أفضل مع Next.js:</strong> استخدام مكون Link بشكل صحيح للروابط الداخلية.</li>
            </ul>
          </div>
          
          <div style={{ marginTop: '40px' }}>
            <h3 style={{ color: 'white', marginBottom: '15px' }}>مقارنة مع الأنماط الأخرى:</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center', marginTop: '20px' }}>
              <HomepageStyleButton text="الأزرار البسيطة" href="/simple-gold-buttons" />
              <HomepageStyleButton text="الأزرار السوداء الذهبية" href="/pure-black-gold-buttons" variant="featured" />
              <HomepageStyleButton text="العودة للصفحة الرئيسية" href="/" icon={<ArrowIcon />} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageStyleButtonsPage; 