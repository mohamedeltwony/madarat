import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';
import { getAllPosts } from '@/lib/posts';
import { getAllPages } from '@/lib/pages';
import { getAllTrips } from '@/lib/trips';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import Link from 'next/link';

import styles from '@/styles/pages/Sitemap.module.scss';

export default function Sitemap({ metadata, menus, posts, pages, trips }) {
  return (
    <Layout metadata={metadata} menus={menus}>
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

            {/* Dynamic Pages Section */}
            {pages && pages.length > 0 && (
              <div className={styles.sitemapSection}>
                <h2 className={styles.sectionTitle}>الصفحات</h2>
                <ul className={styles.sitemapList}>
                  {pages.map((page) => (
                    <li key={page.id}>
                      <Link href={page.uri || `/${page.slug}`}>
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Destinations Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>الوجهات</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/destination">جميع الوجهات</Link>
                  <ul>
                    <li>
                                              <Link href="/destination/europe">أوروبا</Link>
                    </li>
                    <li>
                                              <Link href="/destination/middle-east">الشرق الأوسط</Link>
                      </li>
                      <li>
                        <Link href="/destination/asia">آسيا</Link>
                      </li>
                      <li>
                        <Link href="/destination/americas">الأمريكتين</Link>
                      </li>
                      <li>
                        <Link href="/destination/africa">أفريقيا</Link>
                      </li>
                      <li>
                        <Link href="/destination/oceania">أوقيانوسيا</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            {/* Dynamic Trips Section */}
            {trips && trips.length > 0 && (
              <div className={styles.sitemapSection}>
                <h2 className={styles.sectionTitle}>الرحلات</h2>
                <ul className={styles.sitemapList}>
                  <li>
                    <Link href="/trip">جميع الرحلات</Link>
                    <ul>
                      {trips.slice(0, 20).map((trip) => (
                        <li key={trip.id}>
                          <Link href={`/trip/${trip.slug}`}>
                            {trip.title}
                          </Link>
                        </li>
                      ))}
                      {trips.length > 20 && (
                        <li>
                          <Link href="/trip">
                            ... و {trips.length - 20} رحلة أخرى
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                </ul>
              </div>
            )}

            {/* Packages Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>فئات الرحلات</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/packages">جميع الرحلات</Link>
                  <ul>
                    <li>
                      <Link href="/packages/honeymoon">رحلات شهر العسل</Link>
                    </li>
                    <li>
                      <Link href="/packages/family">رحلات عائلية</Link>
                    </li>
                    <li>
                      <Link href="/packages/adventure">رحلات المغامرة</Link>
                    </li>
                    <li>
                      <Link href="/packages/luxury">رحلات فاخرة</Link>
                    </li>
                    <li>
                      <Link href="/packages/budget">رحلات اقتصادية</Link>
                    </li>
                    <li>
                      <Link href="/packages/religious">رحلات دينية</Link>
                    </li>
                    <li>
                      <Link href="/packages/medical">السياحة العلاجية</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <span className={styles.categoryTitle}>فئات مدة الرحلة</span>
                  <ul>
                    <li>
                      <Link href="/packages/weekend-getaways">
                        رحلات نهاية الأسبوع (2-3 أيام)
                      </Link>
                    </li>
                    <li>
                      <Link href="/packages/short-trips">
                        رحلات قصيرة (4-6 أيام)
                      </Link>
                    </li>
                    <li>
                      <Link href="/packages/standard-vacations">
                        إجازات قياسية (7-10 أيام)
                      </Link>
                    </li>
                    <li>
                      <Link href="/packages/extended-holidays">
                        عطلات ممتدة (11-15 يوم)
                      </Link>
                    </li>
                    <li>
                      <Link href="/packages/long-term-travel">
                        سفر طويل الأمد (16+ يوم)
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>



            {/* Dynamic Blog Section */}
            {posts && posts.length > 0 && (
              <div className={styles.sitemapSection}>
                <h2 className={styles.sectionTitle}>المدونة</h2>
                <ul className={styles.sitemapList}>
                  <li>
                    <Link href="/blog">المدونة</Link>
                    <ul>
                      {posts.slice(0, 15).map((post) => (
                        <li key={post.id}>
                          <Link href={`/posts/${post.slug}`}>
                            {post.title}
                          </Link>
                        </li>
                      ))}
                      {posts.length > 15 && (
                        <li>
                          <Link href="/blog">
                            ... و {posts.length - 15} مقالة أخرى
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>

                  <li>
                    <Link href="/archives">الأرشيف</Link>
                  </li>
                  <li>
                    <Link href="/authors">الكتّاب</Link>
                  </li>
                </ul>
              </div>
            )}

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
              <h2 className={styles.sectionTitle}>التواصل</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/contact">اتصل بنا</Link>
                </li>
                <li>
                  <Link href="/feedback">ملاحظاتك</Link>
                </li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className={styles.sitemapSection}>
              <h2 className={styles.sectionTitle}>الشروط والأحكام</h2>
              <ul className={styles.sitemapList}>
                <li>
                  <Link href="/terms-conditions">الشروط والأحكام</Link>
                </li>
                <li>
                  <Link href="/privacy-policy">سياسة الخصوصية</Link>
                </li>
                <li>
                  <Link href="/refund-policy">سياسة الاسترداد</Link>
                </li>
                <li>
                  <Link href="/legal-documents">الوثائق القانونية</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.sitemapFooter}>
            <p>
              آخر تحديث: {new Date().toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p>
              إجمالي الصفحات: {(pages?.length || 0) + (posts?.length || 0) + (trips?.length || 0) + 20}
            </p>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    // Fetch all required data server-side
    const [
      { metadata },
      { menus },
      { posts },
      { pages },
      { trips }
    ] = await Promise.all([
      getSiteMetadata(),
      getAllMenus(),
      getAllPosts({ first: 50 }), // Limit to recent posts for sitemap
      getAllPages(),
      getAllTrips({ first: 30 }) // Limit to recent trips for sitemap
    ]);

    // Construct page metadata
    const pageMetadata = {
      title: 'خريطة الموقع - مدارات الكون',
      description: 'استعرض كامل هيكل موقع مدارات الكون وجميع الصفحات والأقسام المتاحة',
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/sitemap`,
      robots: 'index, follow',
      og: {
        title: 'خريطة الموقع - مدارات الكون',
        description: 'استعرض كامل هيكل موقع مدارات الكون وجميع الصفحات والأقسام المتاحة',
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.sa'}/sitemap`,
        siteName: 'مدارات الكون',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'خريطة الموقع - مدارات الكون',
        description: 'استعرض كامل هيكل موقع مدارات الكون وجميع الصفحات والأقسام المتاحة',
      },
    };

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        posts: posts || [],
        pages: pages || [],
        trips: trips || [],
      },
    };
  } catch (error) {
    console.error('Error in sitemap getServerSideProps:', error);
    
    // Return fallback data in case of error
    return {
      props: {
        metadata: {
          title: 'خريطة الموقع - مدارات الكون',
          description: 'استعرض كامل هيكل موقع مدارات الكون وجميع الصفحات والأقسام المتاحة',
        },
        menus: [],
        posts: [],
        pages: [],
        trips: [],
      },
    };
  }
}
