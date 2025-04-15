import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Link from 'next/link';

import styles from '@/styles/pages/Sitemap.module.scss';

export default function Sitemap() {
  const { metadata } = usePageMetadata({
    metadata: {
      title: 'خريطة الموقع',
      description: 'استعرض كامل هيكل موقع مدارات الكون وجميع الصفحات والأقسام',
    },
  });

  return (
    <Layout metadata={metadata}>
      <Header>
        <Container>
          <h1>خريطة الموقع</h1>
          <p>استعرض كامل هيكل موقع مدارات الكون وجميع الصفحات والأقسام</p>
        </Container>
      </Header>

      <Section>
        <Container>
          <div className={styles.sitemapGrid}>
            {/* Home Page Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>الصفحة الرئيسية</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/">الصفحة الرئيسية</Link>
                </li>
              </ul>
            </div>
            
            {/* Destinations Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>الوجهات</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/destinations">جميع الوجهات</Link>
                  <ul>
                    <li><Link href="/destinations/europe">أوروبا</Link></li>
                    <li><Link href="/destinations/middle-east">الشرق الأوسط</Link></li>
                    <li><Link href="/destinations/asia">آسيا</Link></li>
                    <li><Link href="/destinations/americas">الأمريكتين</Link></li>
                    <li><Link href="/destinations/africa">أفريقيا</Link></li>
                    <li><Link href="/destinations/oceania">أوقيانوسيا</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            {/* Packages Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>الرحلات</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/packages">جميع الرحلات</Link>
                  <ul>
                    <li><Link href="/packages/honeymoon">رحلات شهر العسل</Link></li>
                    <li><Link href="/packages/family">رحلات عائلية</Link></li>
                    <li><Link href="/packages/adventure">رحلات المغامرة</Link></li>
                    <li><Link href="/packages/luxury">رحلات فاخرة</Link></li>
                    <li><Link href="/packages/budget">رحلات اقتصادية</Link></li>
                    <li><Link href="/packages/religious">رحلات دينية</Link></li>
                    <li><Link href="/packages/medical">السياحة العلاجية</Link></li>
                  </ul>
                </li>
                <li>
                  <span className={styles.categoryTitle}>فئات مدة الرحلة</span>
                  <ul>
                    <li><Link href="/packages/weekend-getaways">رحلات نهاية الأسبوع (2-3 أيام)</Link></li>
                    <li><Link href="/packages/short-trips">رحلات قصيرة (4-6 أيام)</Link></li>
                    <li><Link href="/packages/standard-vacations">إجازات قياسية (7-10 أيام)</Link></li>
                    <li><Link href="/packages/extended-holidays">عطلات ممتدة (11-15 يوم)</Link></li>
                    <li><Link href="/packages/long-term-travel">سفر طويل الأمد (16+ يوم)</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            {/* Services Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>الخدمات</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/services">جميع الخدمات</Link>
                  <ul>
                    <li><Link href="/services/visa">خدمات التأشيرة</Link></li>
                    <li><Link href="/services/flights">حجز الطيران</Link></li>
                    <li><Link href="/services/hotels">حجز الفنادق</Link></li>
                    <li><Link href="/services/transportation">خدمات النقل</Link></li>
                    <li><Link href="/services/cruises">رحلات بحرية</Link></li>
                  </ul>
                </li>
              </ul>
            </div>
            
            {/* Blog Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>المدونة</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/blog">المدونة</Link>
                </li>
                <li>
                  <Link href="/categories">التصنيفات</Link>
                </li>
                <li>
                  <Link href="/archives">الأرشيف</Link>
                </li>
                <li>
                  <Link href="/authors">الكتّاب</Link>
                </li>
              </ul>
            </div>
            
            {/* About Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>عن الموقع</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/about">عن الموقع</Link>
                </li>
                <li>
                  <Link href="/about/company">معلومات الشركة</Link>
                </li>
                <li>
                  <Link href="/about/team">فريق العمل</Link>
                </li>
                <li>
                  <Link href="/about/testimonials">آراء العملاء</Link>
                </li>
                <li>
                  <Link href="/about/partnerships">الشراكات</Link>
                </li>
                <li>
                  <Link href="/about/careers">الوظائف</Link>
                </li>
              </ul>
            </div>
            
            {/* Contact Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>الاتصال</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/contact">اتصل بنا</Link>
                </li>
                <li>
                  <Link href="/support">الدعم الفني</Link>
                </li>
                <li>
                  <Link href="/faq">الأسئلة الشائعة</Link>
                </li>
              </ul>
            </div>
            
            {/* User Account Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>حساب المستخدم</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/login">تسجيل الدخول</Link>
                </li>
                <li>
                  <Link href="/register">إنشاء حساب</Link>
                </li>
              </ul>
            </div>
            
            {/* Legal Pages */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>صفحات قانونية</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/privacy-policy">سياسة الخصوصية</Link>
                </li>
                <li>
                  <Link href="/terms-conditions">الشروط والأحكام</Link>
                </li>
                <li>
                  <Link href="/refund-policy">سياسة الاسترداد</Link>
                </li>
              </ul>
            </div>
            
            {/* Search & Resources */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>البحث والمصادر</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/advanced-search">البحث المتقدم</Link>
                </li>
                <li>
                  {/* Replaced <a> with <Link> for internal navigation */}
                  <Link href="/sitemap.xml">Sitemap XML</Link> 
                </li>
                <li>
                  <a href="/feed.xml">RSS</a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}