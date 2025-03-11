import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import SparkleButton from '@/components/UI/SparkleButton';
import styles from '@/styles/pages/Home.module.scss';
import UIStyles from '@/components/UI/UI.module.scss';

export default function LandingPage() {
  const [showForm, setShowForm] = useState(false);
  
  const handleShowForm = () => {
    setShowForm(true);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    alert('شكراً لك! سنتواصل معك قريباً.');
    setShowForm(false);
  };
  
  return (
    <div className={styles.container} dir="rtl">
      <Head>
        <title>مدارات | الصفحة الرئيسية</title>
        <meta name="description" content="موقع مدارات - منصة للمحتوى العربي المميز" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              مرحباً بك في <span className={styles.highlight}>مدارات</span>
            </h1>
            <p className={styles.description}>
              منصة متكاملة تقدم محتوى عربي مميز يثري معرفتك ويلهم إبداعك
            </p>
            <div className={styles.buttonContainer}>
              <SparkleButton onClick={handleShowForm}>
                اشترك الآن
              </SparkleButton>
            </div>
          </div>
        </section>
        
        {/* Bento Box Grid */}
        <section className={styles.bentoSection}>
          <h2 className={styles.sectionTitle}>خدماتنا المميزة</h2>
          
          <div className={UIStyles.bentoGrid}>
            {/* Feature 1 - Large Card */}
            <div className={`${UIStyles.glassCard} ${UIStyles.bentoItem} ${UIStyles.large}`}>
              <div className={styles.bentoContent}>
                <div className={styles.bentoIcon}>
                  <Image 
                    src="https://placehold.co/100x100/f8a100/ffffff?text=خدمة" 
                    alt="خدمة مميزة" 
                    width={100} 
                    height={100} 
                  />
                </div>
                <h3>مكتبة محتوى شاملة</h3>
                <p>
                  أكثر من 1000 مقال ومحتوى متميز في مختلف المجالات الإبداعية والفكرية وتطوير الذات
                </p>
                <SparkleButton>استكشف المحتوى</SparkleButton>
              </div>
            </div>
            
            {/* Feature 2 - Regular Card */}
            <div className={`${UIStyles.glassCard} ${UIStyles.bentoItem}`}>
              <div className={styles.bentoContent}>
                <div className={styles.bentoIcon}>
                  <Image 
                    src="https://placehold.co/100x100/00a1f8/ffffff?text=خدمة" 
                    alt="خدمة مميزة" 
                    width={80} 
                    height={80} 
                  />
                </div>
                <h3>استشارات متخصصة</h3>
                <p>
                  فريق من الخبراء في مجالات متنوعة لمساعدتك في رحلة النجاح
                </p>
              </div>
            </div>
            
            {/* Feature 3 - Regular Card */}
            <div className={`${UIStyles.glassCard} ${UIStyles.bentoItem}`}>
              <div className={styles.bentoContent}>
                <div className={styles.bentoIcon}>
                  <Image 
                    src="https://placehold.co/100x100/a100f8/ffffff?text=خدمة" 
                    alt="خدمة مميزة" 
                    width={80} 
                    height={80} 
                  />
                </div>
                <h3>ورش عمل تفاعلية</h3>
                <p>
                  ورش عمل أسبوعية للتعلم وتطوير المهارات بأسلوب عملي وفعال
                </p>
              </div>
            </div>
            
            {/* Feature 4 - Wide Card */}
            <div className={`${UIStyles.glassCard} ${UIStyles.bentoItem} ${UIStyles.wide}`}>
              <div className={styles.bentoContent}>
                <div className={styles.bentoIcon}>
                  <Image 
                    src="https://placehold.co/100x100/f80032/ffffff?text=خدمة" 
                    alt="خدمة مميزة" 
                    width={80} 
                    height={80} 
                  />
                </div>
                <h3>تدريب متخصص</h3>
                <p>
                  برامج تدريبية مصممة خصيصاً لتطوير مهاراتك واحترافيتك في مجال تخصصك
                </p>
              </div>
            </div>
            
            {/* Feature 5 - Tall Card */}
            <div className={`${UIStyles.glassCard} ${UIStyles.bentoItem} ${UIStyles.tall}`}>
              <div className={styles.bentoContent}>
                <div className={styles.bentoIcon}>
                  <Image 
                    src="https://placehold.co/100x100/00f88c/ffffff?text=خدمة" 
                    alt="خدمة مميزة" 
                    width={80} 
                    height={80} 
                  />
                </div>
                <h3>مجتمع مدارات</h3>
                <p>
                  انضم إلى مجتمع من المبدعين والمفكرين لتبادل الخبرات والأفكار والتعاون في مشاريع إبداعية
                </p>
                <SparkleButton>انضم للمجتمع</SparkleButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Lead Form Popup */}
      {showForm && (
        <div className={styles.formOverlay}>
          <div className={`${UIStyles.glassCard} ${styles.formContainer}`}>
            <button className={styles.closeButton} onClick={() => setShowForm(false)}>
              ×
            </button>
            <h3>انضم إلينا الآن</h3>
            <p>اترك بياناتك ليصلك كل جديد</p>
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="name">الاسم الكامل</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="أدخل اسمك الكامل"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="phone">رقم الهاتف</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="أدخل رقم هاتفك"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email">البريد الإلكتروني</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="أدخل بريدك الإلكتروني"
                  required
                />
              </div>
              
              <div className={styles.formActions}>
                <SparkleButton type="submit" fullWidth>
                  إرسال
                </SparkleButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 