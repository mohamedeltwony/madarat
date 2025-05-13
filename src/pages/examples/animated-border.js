import React from 'react';
import Head from 'next/head';
import { FaArrowRight, FaChevronDown } from 'react-icons/fa';
import { AnimatedBorderButton } from '../../components/UI';
import styles from '../../styles/pages/Examples.module.scss';

const AnimatedBorderExample = () => {
  return (
    <>
      <Head>
        <title>مثال - زر بحدود متحركة | مدارات الكون</title>
      </Head>

      <div className={styles.container}>
        <h1>أمثلة على أزرار بحدود متحركة</h1>

        <section className={styles.section}>
          <h2>أنواع الأزرار المختلفة</h2>

          <div className={styles.variantSection}>
            <h3>زر عادي (للخلفيات الداكنة)</h3>
            <div className={styles.buttonExample}>
              <AnimatedBorderButton
                text="زر بحدود متحركة"
                onClick={() => alert('تم النقر على الزر!')}
                variant="default"
              />
            </div>
          </div>

          <div className={styles.variantSection}>
            <h3>زر شفاف (للخلفيات الداكنة)</h3>
            <div className={`${styles.buttonExample} ${styles.darkBackground}`}>
              <AnimatedBorderButton
                text="زر شفاف"
                onClick={() => alert('تم النقر على الزر!')}
                variant="transparent"
              />
            </div>
          </div>

          <div className={styles.variantSection}>
            <h3>زر ذهبي (للخلفيات الفاتحة)</h3>
            <div
              className={`${styles.buttonExample} ${styles.lightBackground}`}
            >
              <AnimatedBorderButton
                text="زر ذهبي"
                onClick={() => alert('تم النقر على الزر!')}
                variant="gold"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>زر مع أيقونة</h2>

          <div className={styles.variantExamples}>
            <div className={styles.buttonExample}>
              <AnimatedBorderButton
                text="اكتشف المزيد"
                icon={<FaArrowRight />}
                onClick={() => alert('تم النقر على الزر!')}
                variant="default"
              />
            </div>

            <div className={`${styles.buttonExample} ${styles.darkBackground}`}>
              <AnimatedBorderButton
                text="اكتشف المزيد"
                icon={<FaArrowRight />}
                onClick={() => alert('تم النقر على الزر!')}
                variant="transparent"
              />
            </div>

            <div
              className={`${styles.buttonExample} ${styles.lightBackground}`}
            >
              <AnimatedBorderButton
                text="اكتشف المزيد"
                icon={<FaArrowRight />}
                onClick={() => alert('تم النقر على الزر!')}
                variant="gold"
              />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>زر بقائمة منسدلة</h2>

          <div className={styles.variantExamples}>
            <div className={styles.buttonExample}>
              <AnimatedBorderButton
                text="تواصل مع مستشارك السياحي"
                variant="default"
                dropdownItems={[
                  {
                    label: 'إتصل في مستشارك',
                    onClick: () => alert('سيتم الاتصال بمستشارك السياحي'),
                  },
                  {
                    label: 'للحجز سجل رقمك',
                    onClick: () => alert('سيتم تسجيل رقمك للحجز'),
                  },
                  {
                    label: 'شكوى أو ملاحظات',
                    onClick: () => alert('سيتم تسجيل شكواك أو ملاحظاتك'),
                  },
                ]}
              />
            </div>

            <div className={`${styles.buttonExample} ${styles.darkBackground}`}>
              <AnimatedBorderButton
                text="تواصل مع مستشارك السياحي"
                variant="transparent"
                dropdownItems={[
                  {
                    label: 'إتصل في مستشارك',
                    onClick: () => alert('سيتم الاتصال بمستشارك السياحي'),
                  },
                  {
                    label: 'للحجز سجل رقمك',
                    onClick: () => alert('سيتم تسجيل رقمك للحجز'),
                  },
                  {
                    label: 'شكوى أو ملاحظات',
                    onClick: () => alert('سيتم تسجيل شكواك أو ملاحظاتك'),
                  },
                ]}
              />
            </div>

            <div
              className={`${styles.buttonExample} ${styles.lightBackground}`}
            >
              <AnimatedBorderButton
                text="تواصل مع مستشارك السياحي"
                variant="gold"
                dropdownItems={[
                  {
                    label: 'إتصل في مستشارك',
                    onClick: () => alert('سيتم الاتصال بمستشارك السياحي'),
                  },
                  {
                    label: 'للحجز سجل رقمك',
                    onClick: () => alert('سيتم تسجيل رقمك للحجز'),
                  },
                  {
                    label: 'شكوى أو ملاحظات',
                    onClick: () => alert('سيتم تسجيل شكواك أو ملاحظاتك'),
                  },
                ]}
              />
            </div>
          </div>
          <p>حرك مؤشر الماوس فوق الزر لرؤية القائمة المنسدلة</p>
        </section>

        <section className={styles.section}>
          <h2>زر رابط</h2>

          <div className={styles.variantExamples}>
            <div className={styles.buttonExample}>
              <AnimatedBorderButton
                text="رابط داخلي"
                href="/"
                variant="default"
              />
            </div>

            <div className={`${styles.buttonExample} ${styles.darkBackground}`}>
              <AnimatedBorderButton
                text="رابط داخلي"
                href="/"
                variant="transparent"
              />
            </div>

            <div
              className={`${styles.buttonExample} ${styles.lightBackground}`}
            >
              <AnimatedBorderButton text="رابط داخلي" href="/" variant="gold" />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>تخصيص شكل الحدود</h2>

          <div className={styles.variantExamples}>
            <div className={styles.buttonExample}>
              <AnimatedBorderButton
                text="حدود دائرية"
                borderRadius="30px"
                onClick={() => alert('تم النقر على الزر!')}
                variant="default"
              />
            </div>

            <div className={`${styles.buttonExample} ${styles.darkBackground}`}>
              <AnimatedBorderButton
                text="حدود دائرية"
                borderRadius="30px"
                onClick={() => alert('تم النقر على الزر!')}
                variant="transparent"
              />
            </div>

            <div
              className={`${styles.buttonExample} ${styles.lightBackground}`}
            >
              <AnimatedBorderButton
                text="حدود دائرية"
                borderRadius="30px"
                onClick={() => alert('تم النقر على الزر!')}
                variant="gold"
              />
            </div>
          </div>

          <div className={styles.variantExamples} style={{ marginTop: '20px' }}>
            <div className={styles.buttonExample}>
              <AnimatedBorderButton
                text="سرعة رسم الحدود"
                animationDuration="3s"
                onClick={() => alert('تم النقر على الزر!')}
                variant="default"
              />
            </div>

            <div className={`${styles.buttonExample} ${styles.darkBackground}`}>
              <AnimatedBorderButton
                text="سرعة رسم الحدود"
                animationDuration="3s"
                onClick={() => alert('تم النقر على الزر!')}
                variant="transparent"
              />
            </div>

            <div
              className={`${styles.buttonExample} ${styles.lightBackground}`}
            >
              <AnimatedBorderButton
                text="سرعة رسم الحدود"
                animationDuration="3s"
                onClick={() => alert('تم النقر على الزر!')}
                variant="gold"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AnimatedBorderExample;
