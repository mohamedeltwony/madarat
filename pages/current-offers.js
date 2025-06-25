import React from 'react';
import Head from 'next/head';
import LegalLayout from '@/components/LegalLayout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import OfferTrips from '@/components/OfferTrips';
import styles from '@/styles/pages/Legal.module.scss';

export default function CurrentOffers() {
  return (
    <LegalLayout>
      <Head>
        <title>العروض الحالية - مدارات الكون</title>
        <meta
          name="description"
          content="استكشف العروض الحالية والباقات المميزة من مدارات الكون للسياحة والسفر"
        />
        <link rel="canonical" href="https://madaratalkon.sa/current-offers" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="العروض الحالية - مدارات الكون" />
        <meta property="og:description" content="استكشف العروض الحالية والباقات المميزة من مدارات الكون للسياحة والسفر" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://madaratalkon.sa/current-offers" />
        <meta property="og:site_name" content="مدارات الكون" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="العروض الحالية - مدارات الكون" />
        <meta name="twitter:description" content="استكشف العروض الحالية والباقات المميزة من مدارات الكون للسياحة والسفر" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="مدارات الكون" />
      </Head>

      <PageHero
        title="العروض الحالية"
        breadcrumb="العروض الحالية"
        featuredImage="/images/hero-background.jpg"
      />

      <Section>
        <Container>
          <div className={styles.contentContainer}>
            <p className={styles.pageIntro}>
              اكتشف أحدث العروض المميزة من مدارات الكون للسياحة والسفر. نقدم لك
              باقات سفر متنوعة بأسعار تنافسية لوجهات مختلفة حول العالم.
            </p>

            {/* Current Offers Component */}
            <OfferTrips />
          </div>
        </Container>
      </Section>
    </LegalLayout>
  );
}
