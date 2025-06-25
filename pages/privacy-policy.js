import React from 'react';
import Head from 'next/head';
import LegalLayout from '@/components/LegalLayout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import styles from '@/styles/pages/Legal.module.scss';

export default function PrivacyPolicy() {
  return (
    <LegalLayout>
      <Head>
        <title>سياسة الخصوصية - مدارات الكون</title>
        <meta
          name="description"
          content="سياسة الخصوصية وشروط استخدام موقع مدارات الكون للسياحة والسفر"
        />
        <link rel="canonical" href="https://madaratalkon.sa/privacy-policy" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="سياسة الخصوصية - مدارات الكون" />
        <meta property="og:description" content="سياسة الخصوصية وشروط استخدام موقع مدارات الكون للسياحة والسفر" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://madaratalkon.sa/privacy-policy" />
        <meta property="og:site_name" content="مدارات الكون" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="سياسة الخصوصية - مدارات الكون" />
        <meta name="twitter:description" content="سياسة الخصوصية وشروط استخدام موقع مدارات الكون للسياحة والسفر" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="مدارات الكون" />
      </Head>

      <PageHero
        title="سياسة الخصوصية"
        breadcrumb="سياسة الخصوصية"
        featuredImage="/images/hero-background.jpg"
      />

      <Section>
        <Container>
          <div className={styles.legalContent}>
            <div className={styles.termsIntro}>
              <h2>سياسة الخصوصية وشروط الاستخدام</h2>
              <p>
                يعد قبول الشروط والأحكام الخاصة بنا أمرًا ضروريًا للوصول إلى
                خدماتنا والاستفادة منها. تنطبق شروط وأحكام الاستخدام هذه
                الموجودة على موقع مدارات الكون وباستخدامك للموقع فانت توافق على
                هذه الشروط؛ إذا كنت لا توافق على ذلك، فلا تستخدم الموقع. طالما
                أنك تلتزم بهذه الشروط، تمنحك مدارات الكون امتيازًا محدودًا غير
                حصري وغير قابل للتحويل لدخول واستخدام الموقع.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h3>النزاعات والقانون المطبق</h3>
              <p>
                أي نزاع أو شكوى ناتجة أو متصلة باستخدامك للموقع ستكون خاضعة
                للقوانين المعمول بها في المملكة العربية السعودية. حيث أن مقرّنا
                يقع في المملكة العربية السعودية.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h3>قيود العمر</h3>
              <p>
                لا يحق للقصّر البالغ أعمارهم أقل من 18 عاماً التسجيل كمستخدم
                لهذا الموقع الإلكتروني وغير مسموح لهم بتنفيذ أي معاملات أو
                استخدام الموقع الإلكتروني.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h3>المدفوعات والبيانات المالية</h3>
              <ul className={styles.termsList}>
                <li>
                  إذا قمت بالدفع مقابل أحد منتجاتنا أو خدماتنا من على الموقع
                  الإلكتروني، فإن جميع البيانات التي نطلبها منك سيتم تقديمها
                  مباشرة إلى الشركة المقدّمة لخدمة الدفع من خلال اتصال آمن.
                </li>
                <li>
                  يحق لصاحب البطاقة الاحتفاظ بنسخة من المعاملة التي تمّت وبنسخة
                  من سياسات وشروط التاجر.
                </li>
                <li>
                  نقبل المدفوعات الإلكترونية باستخدام البطاقات الائتمانية
                  وبطاقات الخصم المباشر من فيزا وماستركارد وبعملة الريال السعودي
                  (أو بعملات أخرى كما يتم الاتفاق عليه).
                </li>
              </ul>
            </div>

            <div className={styles.termsSection}>
              <h3>الخصوصية</h3>
              <p>
                تنطبق سياسة خصوصية مدارات الكون على استخدامك لهذا الموقع، وتم
                جعل شروطه جزءًا من هذه الشروط من خلال هذا المرجع.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h3>حقوق النشر</h3>
              <p>
                جميع المحتويات المدرجة أو المتاحة من خلال الموقع، مثل النصوص
                والرسومات والشعارات وأيقونات الأزرار والصور ومقاطع الفيديو
                والمقاطع الصوتية والمستندات والبيانات هي ملك لمدارات الكون.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h3>العلامات التجارية</h3>
              <p>
                بالإضافة إلى ذلك، تعد الرسومات والشعارات ورؤوس الصفحات وأيقونات
                الأزرار والنصوص البرمجية وأسماء المنتجات وأرقام طراز المنتج
                وأسماء الخدمات المضمنة أو المتاحة عبر الموقع علامات تجارية لشركة
                مدارات الكون للسياحة والسفر في المملكة العربية السعودية أو
                للشركات المصنعة التي تقوم مدارات الكون ببيع منتجاتها. لا يجوز
                استخدام العلامات التجارية لشركة مدارات الكون للسياحة والسفر فيما
                يتعلق بأي منتج أو خدمة غير مدارات الكون، بأي طريقة من المحتمل أن
                تسبب ارتباكًا، أو بأي طريقة من شأنها أن تقلل من شأن مدارات الكون
                أو تشوه سمعتها.
              </p>
            </div>

            <div className={styles.termsSection}>
              <h3>استخدام البيانات للتسويق</h3>
              <p>
                يحق للشركة استخدام البيانات التي تقدمها لنا لأغراض التسويق، بما
                في ذلك إرسال رسائل نصية أو اتصالات أخرى تتعلق بمنتجاتنا أو
                خدماتنا أو منتجات أو خدمات الشركات الشقيقة. كما يحق للشركة أيضًا
                مشاركة البيانات مع الشركات الشقيقة لأغراض التسويق.
              </p>
            </div>

            <div className={styles.culturalNote}>
              <p className={styles.closingNote}>
                نحن في شركة مدارات الكون للسفر والسياحة نلتزم بحماية خصوصيتك
                ونقدر ثقتك بنا.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </LegalLayout>
  );
}
