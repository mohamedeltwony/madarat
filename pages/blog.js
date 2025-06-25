import React from 'react';
import Head from 'next/head';
import LegalLayout from '@/components/LegalLayout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import BlogPosts from '@/components/BlogPosts';
import SEO from '@/components/SEO';
import styles from '@/styles/pages/Blog.module.scss';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function Blog() {
  return (
    <LegalLayout>
      <Head>
        <title>مدونة مدارات الكون - نصائح السفر والسياحة والوجهات المميزة</title>
        <meta
          name="description"
          content="تصفح أحدث المقالات والنصائح حول السفر والسياحة من خبراء مدارات الكون. اكتشف الوجهات المميزة، نصائح التخطيط للرحلات، وأفضل العروض السياحية حول العالم."
        />
        <meta property="og:title" content="مدونة مدارات الكون - نصائح السفر والسياحة والوجهات المميزة" />
        <meta property="og:description" content="تصفح أحدث المقالات والنصائح حول السفر والسياحة من خبراء مدارات الكون. اكتشف الوجهات المميزة، نصائح التخطيط للرحلات، وأفضل العروض السياحية حول العالم." />
        <meta property="og:url" content="https://madaratalkon.sa/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://madaratalkon.sa/images/blog-og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="مدونة مدارات الكون - نصائح السفر والسياحة" />
        <meta name="twitter:description" content="تصفح أحدث المقالات والنصائح حول السفر والسياحة من خبراء مدارات الكون." />
      </Head>

      <SEO
        title="مدونة مدارات الكون - نصائح السفر والسياحة والوجهات المميزة"
        description="تصفح أحدث المقالات والنصائح حول السفر والسياحة من خبراء مدارات الكون. اكتشف الوجهات المميزة، نصائح التخطيط للرحلات، وأفضل العروض السياحية حول العالم."
        keywords="مدونة السفر, نصائح سياحية, مدارات الكون, مقالات سفر, وجهات سياحية"
        breadcrumbs={[
          { name: 'الرئيسية', url: '/' },
          { name: 'المدونة', url: '/blog' }
        ]}
      />

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>مدونة مدارات الكون</h1>
          <p className={styles.heroSubtitle}>
            أحدث المقالات والنصائح حول السفر والسياحة والوجهات المميزة
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.contentContainer}>
        <p className={styles.pageIntro}>
          نسعى في مدارات الكون لتقديم محتوى تعليمي وإرشادي متميز يساعدك على
          التخطيط لرحلاتك بشكل أفضل، واكتشاف وجهات سياحية جديدة، والحصول على
          نصائح مفيدة من خبراء السفر والسياحة
        </p>

        {/* Blog Posts Component */}
        <BlogPosts />
      </div>
    </LegalLayout>
  );
}
