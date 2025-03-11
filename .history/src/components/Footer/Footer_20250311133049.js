import Link from 'next/link';

import useSite from '@/hooks/use-site';
import { postPathBySlug } from '@/lib/posts';
import { categoryPathBySlug } from '@/lib/categories';

import Section from '@/components/Section';
import Container from '@/components/Container';

import styles from './Footer.module.scss';

const Footer = () => {
  const { metadata = {}, recentPosts = [], categories = [] } = useSite();
  const { title } = metadata;

  const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
  const hasRecentCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <footer className={styles.footer}>
      <Section className={styles.footerMenu}>
        <Container>
          <div className={styles.footerGrid}>
            {/* Company Info */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>مدارات الكون</h3>
              <p className={styles.footerDescription}>
                نقدم لك دليلاً شاملاً للسفر والسياحة، من التخطيط للرحلة إلى أفضل الأماكن للزيارة والإقامة.
              </p>
              <div className={styles.footerSocial}>
                <a href="https://facebook.com" aria-label="Facebook" className={styles.socialIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="https://twitter.com" aria-label="Twitter" className={styles.socialIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
                <a href="https://instagram.com" aria-label="Instagram" className={styles.socialIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>روابط سريعة</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/about">عن الموقع</Link>
                </li>
                <li>
                  <Link href="/contact">اتصل بنا</Link>
                </li>
                <li>
                  <Link href="/packages">الرحلات</Link>
                </li>
                <li>
                  <Link href="/services">الخدمات</Link>
                </li>
                <li>
                  <Link href="/blog">المدونة</Link>
                </li>
                <li>
                  <Link href="/advanced-search">بحث متقدم</Link>
                </li>
              </ul>
            </div>
            
            {/* Destinations */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>الوجهات</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/destinations/europe">أوروبا</Link>
                </li>
                <li>
                  <Link href="/destinations/middle-east">الشرق الأوسط</Link>
                </li>
                <li>
                  <Link href="/destinations/asia">آسيا</Link>
                </li>
                <li>
                  <Link href="/destinations/americas">الأمريكتين</Link>
                </li>
                <li>
                  <Link href="/destinations/africa">أفريقيا</Link>
                </li>
                <li>
                  <Link href="/destinations/oceania">أوقيانوسيا</Link>
                </li>
              </ul>
            </div>
            
            {/* Recent Posts */}
            {hasRecentPosts && (
              <div className={styles.footerColumn}>
                <h3 className={styles.footerTitle}>أحدث المقالات</h3>
                <ul className={styles.footerLinks}>
                  {recentPosts.slice(0, 5).map((post) => {
                    const { id, slug, title } = post;
                    return (
                      <li key={id}>
                        <Link href={postPathBySlug(slug)}>{title}</Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            
            {/* Categories */}
            {hasRecentCategories && (
              <div className={styles.footerColumn}>
                <h3 className={styles.footerTitle}>التصنيفات</h3>
                <ul className={styles.footerLinks}>
                  {categories.slice(0, 5).map((category) => {
                    const { id, slug, name } = category;
                    return (
                      <li key={id}>
                        <Link href={categoryPathBySlug(slug)}>{name}</Link>
                      </li>
                    );
                  })}
                  <li>
                    <Link href="/categories" className={styles.viewAllLink}>
                      عرض جميع التصنيفات
                    </Link>
                  </li>
                </ul>
              </div>
            )}
            
            {/* Legal */}
            <div className={styles.footerColumn}>
              <h3 className={styles.footerTitle}>معلومات قانونية</h3>
              <ul className={styles.footerLinks}>
                <li>
                  <Link href="/privacy-policy">سياسة الخصوصية</Link>
                </li>
                <li>
                  <Link href="/terms-conditions">الشروط والأحكام</Link>
                </li>
                <li>
                  <Link href="/refund-policy">سياسة الاسترداد</Link>
                </li>
                <li>
                  <a href="/sitemap.xml">خريطة الموقع</a>
                </li>
                <li>
                  <a href="/feed.xml">RSS</a>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section className={styles.footerLegal}>
        <Container>
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              &copy; {new Date().getFullYear()} {title} - جميع الحقوق محفوظة
            </p>
            <p className={styles.designCredit}>
              تطوير وتصميم <a href="https://madaratalkon.com">مدارات الكون</a>
            </p>
          </div>
        </Container>
      </Section>
    </footer>
  );
};

export default Footer;
