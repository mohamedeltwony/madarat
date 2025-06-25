import React from 'react';
import Head from 'next/head';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';
import { getPageByUri } from '@/lib/pages';

import LegalLayout from '@/components/LegalLayout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import Link from 'next/link';
import styles from '@/styles/pages/Legal.module.scss';

export default function RefundPolicy({ metadata, menus, pageContent, lastUpdated }) {
  return (
    <LegalLayout>
      <Head>
        <title>سياسة الاسترداد - مدارات الكون</title>
        <meta
          name="description"
          content="سياسة الاسترداد والإلغاء الخاصة بشركة مدارات الكون للسياحة والسفر. تعرف على شروط وأحكام الاسترداد والإلغاء."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/refund-policy`} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="سياسة الاسترداد - مدارات الكون" />
        <meta property="og:description" content="سياسة الاسترداد والإلغاء الخاصة بشركة مدارات الكون للسياحة والسفر" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/refund-policy`} />
        <meta property="og:site_name" content="مدارات الكون" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="سياسة الاسترداد - مدارات الكون" />
        <meta name="twitter:description" content="سياسة الاسترداد والإلغاء الخاصة بشركة مدارات الكون للسياحة والسفر" />
      </Head>

      <PageHero
        title="سياسة الاسترداد"
        breadcrumb="سياسة الاسترداد"
        featuredImage="/images/hero-background.jpg"
      />

      <Section>
        <Container>
          <div className={styles.legalContent}>
            {lastUpdated && (
              <p className={styles.lastUpdated}>
                آخر تحديث: {new Date(lastUpdated).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
            
            {pageContent ? (
              // If we have dynamic content from WordPress, use it
              <div dangerouslySetInnerHTML={{ __html: pageContent }} />
            ) : (
              // Fallback to static content
              <>
                <div className={styles.termsIntro}>
                  <p>
                    تقدم شركة مدارات الكون للسياحة والسفر سياسة استرداد واضحة لضمان
                    حقوق عملائنا الكرام. نهدف من خلال هذه السياسة إلى توفير معلومات
                    دقيقة حول آليات وشروط الإلغاء والاسترداد.
                  </p>
                </div>

                <h2>سياسة الإلغاء والاسترداد</h2>
                <div className={styles.termsSection}>
                  <h3>السياسة العامة</h3>
                  <ul className={styles.termsList}>
                    <li>
                      تختلف سياسة الإلغاء باختلاف نوع الحجز والبرنامج السياحي، وسيتم
                      توضيحها بشكل كامل قبل عملية الحجز من قبل موظفينا.
                    </li>
                    <li>
                      في حالة رغبتك بإلغاء الحجز قبل السفر، يتم احتساب رسوم الإلغاء
                      حسب المدة المتبقية حتى موعد السفر، وتزداد نسبة الرسوم كلما
                      اقترب موعد السفر.
                    </li>
                    <li>
                      في حالة طلب الإلغاء قبل 30 يوم أو أكثر من موعد السفر، يتم خصم
                      10% من إجمالي قيمة الحجز.
                    </li>
                    <li>
                      في حالة طلب الإلغاء قبل 15-29 يوم من موعد السفر، يتم خصم 25%
                      من إجمالي قيمة الحجز.
                    </li>
                    <li>
                      في حالة طلب الإلغاء قبل 8-14 يوم من موعد السفر، يتم خصم 50% من
                      إجمالي قيمة الحجز.
                    </li>
                    <li>
                      في حالة طلب الإلغاء قبل 4-7 أيام من موعد السفر، يتم خصم 75% من
                      إجمالي قيمة الحجز.
                    </li>
                    <li>
                      في حالة طلب الإلغاء قبل أقل من 3 أيام من موعد السفر، لا يتم
                      استرداد أي مبلغ.
                    </li>
                    <li>
                      تختلف سياسة استرداد تذاكر الطيران حسب شروط وأحكام شركة
                      الطيران، وقد تكون غير قابلة للاسترداد اعتماداً على نوع
                      التذكرة.
                    </li>
                  </ul>
                </div>

                <div className={styles.termsSection}>
                  <h3>الرحلات والبرامج السياحية الخاصة</h3>
                  <ul className={styles.termsList}>
                    <li>
                      الرحلات والبرامج السياحية المخصصة حسب طلب العميل لها سياسة
                      استرداد خاصة يتم توضيحها مسبقاً عند الحجز.
                    </li>
                    <li>
                      قد تكون بعض الحجوزات غير قابلة للاسترداد نهائياً حسب العروض
                      الخاصة أو طبيعة البرنامج، وسيتم إبلاغ العميل بذلك قبل الحجز.
                    </li>
                  </ul>
                </div>

                <div className={styles.termsSection}>
                  <h3>الظروف القاهرة</h3>
                  <p>
                    في حالة الظروف القاهرة (مثل الكوارث الطبيعية، الأوبئة، قرارات
                    حكومية) التي تؤثر على إمكانية تنفيذ الرحلة أو البرنامج السياحي،
                    سيتم التعامل مع كل حالة على حدة بمرونة وفق الآتي:
                  </p>
                  <ul className={styles.termsList}>
                    <li>
                      نقدم خيار إعادة جدولة الرحلة لتاريخ لاحق دون رسوم إضافية.
                    </li>
                    <li>
                      نقدم خيار تحويل المبلغ المدفوع كرصيد لاستخدامه في حجوزات
                      مستقبلية خلال فترة محددة.
                    </li>
                    <li>
                      في بعض الحالات، يمكن استرداد كامل المبلغ أو جزء منه حسب ظروف
                      الإلغاء وتقدير الشركة.
                    </li>
                  </ul>
                </div>

                <div className={styles.termsSection}>
                  <h3>طريقة الاسترداد</h3>
                  <ul className={styles.termsList}>
                    <li>
                      يتم إرجاع المبالغ المستردة بنفس طريقة الدفع الأصلية في غضون
                      14-30 يوم عمل من تاريخ الموافقة على طلب الاسترداد.
                    </li>
                    <li>
                      للبدء بإجراءات الاسترداد، يرجى التواصل معنا عبر البريد
                      الإلكتروني أو الهاتف المذكور في صفحة الاتصال.
                    </li>
                    <li>
                      يجب تقديم طلب الاسترداد خطياً مع ذكر سبب الإلغاء ورقم الحجز
                      المرجعي.
                    </li>
                  </ul>
                </div>

                <div className={styles.culturalNote}>
                  <p>
                    نحرص دائماً على تقديم أفضل الخدمات لعملائنا الكرام، ونتعامل
                    بشفافية تامة في جميع إجراءات الحجز والاسترداد.
                  </p>
                  <p className={styles.closingNote}>
                    لأي استفسارات إضافية حول سياسة الاسترداد، يرجى التواصل مع فريق
                    خدمة العملاء.
                  </p>
                </div>
              </>
            )}

            <div className={styles.contactSection}>
              <h3>للاستفسارات والدعم</h3>
              <div className={styles.contactInfo}>
                <p>
                  <strong>البريد الإلكتروني:</strong>{' '}
                  <a href="mailto:support@madaratalkon.com">
                    support@madaratalkon.com
                  </a>
                </p>
                <p>
                  <strong>الهاتف:</strong>{' '}
                  <a href="tel:+966123456789">+966 12 345 6789</a>
                </p>
                <p>
                  <strong>ساعات العمل:</strong> الأحد - الخميس، 9:00 ص - 6:00 م
                </p>
              </div>
            </div>

            <div className={styles.relatedLinks}>
              <h3>صفحات ذات صلة</h3>
              <ul>
                <li>
                  <Link href="/terms-conditions">الشروط والأحكام</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">سياسة الخصوصية</Link>
                </li>
                <li>
                  <Link href="/legal-documents">الوثائق القانونية</Link>
                </li>
                <li>
                  <Link href="/contact">اتصل بنا</Link>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </LegalLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    // Fetch site metadata, menus, and try to get dynamic content
    const [
      { metadata },
      { menus },
      pageData
    ] = await Promise.all([
      getSiteMetadata(),
      getAllMenus(),
      getPageByUri('/refund-policy').catch(() => null) // Try to get dynamic content
    ]);

    // Construct page metadata
    const pageMetadata = {
      title: 'سياسة الاسترداد - مدارات الكون',
      description: 'سياسة الاسترداد والإلغاء الخاصة بشركة مدارات الكون للسياحة والسفر. تعرف على شروط وأحكام الاسترداد والإلغاء.',
              canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/refund-policy`,
      robots: 'index, follow',
      og: {
        title: 'سياسة الاسترداد - مدارات الكون',
        description: 'سياسة الاسترداد والإلغاء الخاصة بشركة مدارات الكون للسياحة والسفر',
        type: 'article',
                  url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/refund-policy`,
        siteName: 'مدارات الكون',
      },
      twitter: {
        card: 'summary',
        title: 'سياسة الاسترداد - مدارات الكون',
        description: 'سياسة الاسترداد والإلغاء الخاصة بشركة مدارات الكون للسياحة والسفر',
      },
    };

    // Extract content and last updated date from WordPress if available
    let pageContent = null;
    let lastUpdated = null;

    if (pageData && pageData.page) {
      pageContent = pageData.page.content;
      lastUpdated = pageData.page.modified || pageData.page.date;
      
      // Override metadata with WordPress data if available
      if (pageData.page.title) {
        pageMetadata.title = `${pageData.page.title} - مدارات الكون`;
      }
      if (pageData.page.excerpt) {
        pageMetadata.description = pageData.page.excerpt;
        pageMetadata.og.description = pageData.page.excerpt;
        pageMetadata.twitter.description = pageData.page.excerpt;
      }
    }

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        pageContent,
        lastUpdated,
      },
    };
  } catch (error) {
    console.error('Error in refund-policy getServerSideProps:', error);
    
    // Return fallback data in case of error
    const fallbackMetadata = {
      title: 'سياسة الاسترداد - مدارات الكون',
      description: 'سياسة الاسترداد والإلغاء الخاصة بشركة مدارات الكون للسياحة والسفر',
    };

    return {
      props: {
        metadata: fallbackMetadata,
        menus: [],
        pageContent: null,
        lastUpdated: null,
      },
    };
  }
}
