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
          <h2>زر عادي</h2>
          <div className={styles.buttonExample}>
            <AnimatedBorderButton
              text="زر بحدود متحركة"
              onClick={() => alert('تم النقر على الزر!')}
            />
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>زر مع أيقونة</h2>
          <div className={styles.buttonExample}>
            <AnimatedBorderButton
              text="اكتشف المزيد"
              icon={<FaArrowRight />}
              onClick={() => alert('تم النقر على الزر!')}
            />
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>زر رابط داخلي</h2>
          <div className={styles.buttonExample}>
            <AnimatedBorderButton
              text="الذهاب إلى الصفحة الرئيسية"
              href="/"
            />
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>زر رابط خارجي</h2>
          <div className={styles.buttonExample}>
            <AnimatedBorderButton
              text="زيارة موقع جوجل"
              href="https://www.google.com"
              external={true}
            />
          </div>
        </section>
        
        <section className={styles.section}>
          <h2>زر بقائمة منسدلة</h2>
          <div className={styles.buttonExample}>
            <AnimatedBorderButton 
              text="تواصل مع مستشارك السياحي" 
              dropdownItems={[
                { 
                  label: "إتصل في مستشارك",
                  onClick: () => alert('سيتم الاتصال بمستشارك السياحي')
                },
                { 
                  label: "للحجز سجل رقمك",
                  onClick: () => alert('سيتم تسجيل رقمك للحجز')
                },
                { 
                  label: "شكوى أو ملاحظات",
                  onClick: () => alert('سيتم تسجيل شكواك أو ملاحظاتك')
                }
              ]}
            />
          </div>
          <p>حرك مؤشر الماوس فوق الزر لرؤية القائمة المنسدلة</p>
        </section>
        
        <section className={styles.section}>
          <h2>تخصيص شكل الحدود</h2>
          <div className={styles.buttonExample}>
            <AnimatedBorderButton
              text="حدود دائرية"
              borderRadius="30px"
              onClick={() => alert('تم النقر على الزر!')}
            />
          </div>
          <div className={styles.buttonExample}>
            <AnimatedBorderButton
              text="سرعة رسم الحدود"
              animationDuration="3s"
              onClick={() => alert('تم النقر على الزر!')}
            />
          </div>
        </section>
      </div>
    </>
  );
};

export default AnimatedBorderExample; 