import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaWhatsapp,
  FaClock,
  FaEnvelope,
  FaPaperPlane,
  FaDirections,
  FaStar,
  FaHome,
  FaBuilding,
  FaInfoCircle,
  FaCalendar,
  FaArrowRight,
  FaCompass,
  FaEye,
  FaUsers,
  FaGlobe,
  FaRoute,
  FaPlane,
  FaHeart,
} from 'react-icons/fa';
import styles from '@/styles/pages/About.module.scss';

export default function About() {
  // Breadcrumb data
  const breadcrumbs = [
    { id: 'home', title: 'الرئيسية', uri: '/' },
    { id: 'about', title: 'عن الشركة', uri: null },
  ];

  return (
    <>
      <Head>
        <title>عن مدارات الكون - شركة السياحة والسفر الرائدة في السعودية</title>
        <meta
          name="description"
          content="تعرف على مدارات الكون للسياحة والسفر - شركة سعودية رائدة في تنظيم الرحلات حول العالم. نقدم تجارب سفر فريدة ومخصصة تلبي كافة احتياجاتك."
        />
        <meta property="og:title" content="عن مدارات الكون - شركة السياحة والسفر الرائدة في السعودية" />
        <meta property="og:description" content="تعرف على مدارات الكون للسياحة والسفر - شركة سعودية رائدة في تنظيم الرحلات حول العالم. نقدم تجارب سفر فريدة ومخصصة تلبي كافة احتياجاتك مع خبرة سنوات في مجال السياحة والسفر." />
        <meta property="og:url" content="https://madaratalkon.com/about" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://madaratalkon.com/images/about-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="عن مدارات الكون - شركة السياحة والسفر الرائدة في السعودية" />
        <meta name="twitter:description" content="تعرف على مدارات الكون للسياحة والسفر - شركة سعودية رائدة في تنظيم الرحلات حول العالم." />
      </Head>

      <SEO
        title="عن مدارات الكون - شركة السياحة والسفر الرائدة في السعودية"
        description="تعرف على مدارات الكون للسياحة والسفر - شركة سعودية رائدة في تنظيم الرحلات حول العالم. نقدم تجارب سفر فريدة ومخصصة تلبي كافة احتياجاتك."
        keywords="مدارات الكون, شركة سياحة, السفر السعودية, رحلات, سياحة"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'عن الشركة', url: '/about' }
        ]}
      />

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <div className={styles.heroContent}>
          <h1>عن الشركة</h1>
          <p>تعرف على رحلتنا وقصة نجاحنا</p>
        </div>
      </div>

      {/* Breadcrumb Section */}
      <div className={styles.breadcrumbSection}>
        <div className={styles.breadcrumbContainer}>
          <ul className={styles.breadcrumbList}>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.id} className={styles.breadcrumbItem}>
                {crumb.uri ? (
                  <Link href={crumb.uri} className={styles.breadcrumbLink}>
                    {index === 0 ? (
                      <FaHome className={styles.homeIcon} />
                    ) : (
                      crumb.title
                    )}
                  </Link>
                ) : (
                  <span className={styles.breadcrumbCurrent}>
                    {crumb.title}
                  </span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className={styles.breadcrumbSeparator}>/</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.aboutContainer}>
        <h2 className={styles.mainTitle}>اكتشف الكون مع مدارات الكون</h2>

        <div className={styles.bentoContainer}>
          {/* Intro Box */}
          <div className={`${styles.bentoBox} ${styles.introBox}`}>
            <h2>مغامرات لا تنتهي!</h2>
            <div className={styles.subtitleWrapper}>
              <h3>رحــلات لا تنسى!</h3>
            </div>
          </div>

          {/* About Box */}
          <div className={`${styles.bentoBox} ${styles.aboutBox}`}>
            <h3>
              <FaBuilding style={{ marginLeft: '8px' }} />
              من نحن
            </h3>
            <p>
              مدارات الكون للسياحة والسفر هي شركة سعودية رائدة ومتميزة في مجال
              تنظيم الرحلات حول العالم، حيث نضع بين يديك تجربة سفر فريدة تلبي
              كافة احتياجاتك ورغباتك. إن شغفنا بالسياحة يدفعنا لتقديم خدمات
              مبتكرة، مع التركيز على أدق التفاصيل لضمان رحلة لا تُنسى.
            </p>
            <p>
              نحن ندرك أن السفر هو أكثر من مجرد الانتقال من مكان إلى آخر؛ إنه
              رحلة نحو اكتشاف الذات والتواصل مع العالم من حولنا. لذلك، نعمل بجد
              على تقديم خيارات متنوعة تناسب كافة الأذواق، سواء كنت تبحث عن
              مغامرات مثيرة، أو استرخاء على شواطئ جميلة، أو استكشاف المدن
              التاريخية.
            </p>
          </div>

          {/* Vision Box */}
          <div className={`${styles.bentoBox} ${styles.visionBox}`}>
            <h3>
              <FaEye style={{ marginLeft: '8px' }} />
              رؤيتنا
            </h3>
            <p>
              نسعى لأن نكون الخيار الأول في عالم السياحة والسفر، من خلال تقديم
              تجارب سفر مبتكرة ومخصصة تلبي تطلعات كل مسافر. نؤمن أن كل رحلة هي
              فرصة لاكتشاف الثقافات الجديدة والعيش لحظات استثنائية.
            </p>
          </div>

          {/* Mission Box */}
          <div className={`${styles.bentoBox} ${styles.missionBox}`}>
            <h3>
              <FaCompass style={{ marginLeft: '8px' }} />
              مهمتنا
            </h3>
            <p>
              نحن ملتزمون بتحويل كل رحلة إلى تجربة فريدة تتجاوز توقعات عملائنا.
              نهدف إلى خلق لحظات مميزة لا تُنسى، بحيث تترك كل تجربة أثرًا عميقًا
              في قلبك. يعمل فريقنا المتخصص بشغف على ترتيب كل التفاصيل، من
              التخطيط إلى التنفيذ، مما يضمن لك راحة البال والاستمتاع بكل لحظة.
            </p>
          </div>

          {/* Experience Box */}
          <div className={`${styles.bentoBox} ${styles.experienceBox}`}>
            <h3>
              <FaUsers style={{ marginLeft: '8px' }} />
              خبرتنا
            </h3>
            <p>
              تمتد خبرتنا في مدارات الكون لسنوات طويلة في مجال السياحة والسفر،
              حيث نجمع بين المعرفة العميقة بأفضل الوجهات السياحية العالمية وفهم
              احتياجات المسافر العربي. فريقنا من المتخصصين يجمع بين الخبرة
              المحلية والدولية لتقديم تجارب سفر استثنائية تناسب جميع الأذواق
              والميزانيات.
            </p>
          </div>

          {/* Journey Box */}
          <div className={`${styles.bentoBox} ${styles.journeyBox}`}>
            <h3>
              <FaRoute style={{ marginLeft: '8px' }} />
              رحلتنا
            </h3>
            <p>
              مع مدارات الكون، سنفتح لك أبواباً جديدة نحو عالم من الاحتمالات
              اللانهائية. انضم إلينا، ودعنا نساعدك على جعل رحلتك القادمة تجربة
              لا تُنسى، مليئة بالذكريات الجميلة والمغامرات الرائعة التي تتجاوز
              حدود الخيال وتبقى محفورة في ذاكرتك للأبد.
            </p>
          </div>

          {/* Contact Box */}
          <div className={`${styles.bentoBox} ${styles.contactBox}`}>
            <h3>تواصل معنا</h3>
            <p>هل أنت مستعد لبدء مغامرتك القادمة؟ فريقنا في انتظارك!</p>
            <Link href="/contact" className={styles.contactButton}>
              تواصل معنا الآن{' '}
              <FaArrowRight
                style={{ marginRight: '5px', transform: 'rotate(180deg)' }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}
