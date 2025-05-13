import React from 'react';
import Head from 'next/head';
import LegalLayout from '@/components/LegalLayout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import BlogPosts from '@/components/BlogPosts';
import styles from '@/styles/pages/Blog.module.scss';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

export default function Blog() {
  return (
    <LegalLayout>
      <Head>
        <title>المدونة - مدارات الكون</title>
        <meta
          name="description"
          content="تصفح أحدث المقالات والمحتوى التعليمي من مدارات الكون للسياحة والسفر"
        />
      </Head>

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
          نسعى في مدارات الكون لتقديم محتوى تعليمي وإرشادي متميز يساعدك على التخطيط لرحلاتك بشكل أفضل، واكتشاف وجهات سياحية جديدة، والحصول على نصائح مفيدة من خبراء السفر والسياحة
        </p>

        {/* Blog Posts Component */}
        <BlogPosts />
      </div>
    </LegalLayout>
  );
} 