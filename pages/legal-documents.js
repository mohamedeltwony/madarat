import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import LegalLayout from '@/components/LegalLayout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import PageHero from '@/components/PageHero';
import styles from '@/styles/pages/Legal.module.scss';
import { FaTimes } from 'react-icons/fa';

export default function LegalDocuments() {
  // Paths to the legal document images
  const taxCertificateThumbnail = 'https://drive.google.com/thumbnail?id=1pcPm83fBpPhVa7pJbGDIJM2hOtuW2jos&sz=w800';
  const taxCertificateFullUrl = 'https://drive.google.com/file/d/1pcPm83fBpPhVa7pJbGDIJM2hOtuW2jos/view?usp=sharing';
  const commercialRegisterThumbnail = 'https://drive.google.com/thumbnail?id=1_N7raN714JBT-ZZFe5ElBUhGwoQxuJxk&sz=w800';
  const commercialRegisterFullUrl = 'https://drive.google.com/file/d/1_N7raN714JBT-ZZFe5ElBUhGwoQxuJxk/view?usp=sharing';
  const travelLicensePath = '/images/travel-licence.webp';

  // State for lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');
  const [lightboxAlt, setLightboxAlt] = useState('');

  // Function to open lightbox
  const openLightbox = (imageSrc, alt) => {
    setLightboxImage(imageSrc);
    setLightboxAlt(alt);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when lightbox is open
  };

  // Function to close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  return (
    <LegalLayout>
      <Head>
        <title>الأوراق القانونية - مدارات الكون</title>
        <meta
          name="description"
          content="الأوراق والمستندات القانونية الخاصة بشركة مدارات الكون للسياحة والسفر"
        />
        <link rel="canonical" href="https://madaratalkon.sa/legal-documents" />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content="الأوراق القانونية - مدارات الكون" />
        <meta property="og:description" content="الأوراق والمستندات القانونية الخاصة بشركة مدارات الكون للسياحة والسفر" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://madaratalkon.sa/legal-documents" />
        <meta property="og:site_name" content="مدارات الكون" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="الأوراق القانونية - مدارات الكون" />
        <meta name="twitter:description" content="الأوراق والمستندات القانونية الخاصة بشركة مدارات الكون للسياحة والسفر" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="مدارات الكون" />
      </Head>

      <PageHero
        title="الأوراق القانونية"
        breadcrumb="الأوراق القانونية"
        featuredImage="/images/hero-background.jpg"
      />

      <Section>
        <Container>
          <div className={styles.legalContent}>
            <h2>الوثائق القانونية والتراخيص</h2>
            <div className={styles.termsIntro}>
              <p>
                فيما يلي الأوراق والمستندات القانونية الخاصة بشركة مدارات الكون
                للسياحة والسفر، بما في ذلك السجل التجاري وترخيص السياحة وشهادة
                الضريبة. انقر على أي مستند لعرضه بالحجم الكامل.
              </p>
            </div>

            <div className={styles.documentsGrid}>
              {/* Commercial Register */}
              <div className={styles.documentCard}>
                <h3 className={styles.documentTitle}>السجل التجاري</h3>
                <div
                  className={styles.documentImageContainer}
                  onClick={() =>
                    openLightbox(
                      commercialRegisterThumbnail,
                      'السجل التجاري - مدارات الكون'
                    )
                  }
                >
                  <Image
                    src={commercialRegisterThumbnail}
                    alt="السجل التجاري - مدارات الكون"
                    width={800}
                    height={1130}
                    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                    quality={100}
                  />
                </div>
              </div>

              {/* Travel License */}
              <div className={styles.documentCard}>
                <h3 className={styles.documentTitle}>ترخيص السياحة</h3>
                <div
                  className={styles.documentImageContainer}
                  onClick={() =>
                    openLightbox(
                      travelLicensePath,
                      'ترخيص السياحة - مدارات الكون'
                    )
                  }
                >
                  <Image
                    src={travelLicensePath}
                    alt="ترخيص السياحة - مدارات الكون"
                    width={800}
                    height={1130}
                    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                    quality={100}
                  />
                </div>
              </div>

              {/* Tax Certificate */}
              <div className={styles.documentCard}>
                <h3 className={styles.documentTitle}>شهادة الضريبة</h3>
                <div
                  className={styles.documentImageContainer}
                  onClick={() =>
                    openLightbox(
                      taxCertificateThumbnail,
                      'شهادة الضريبة - مدارات الكون'
                    )
                  }
                >
                  <Image
                    src={taxCertificateThumbnail}
                    alt="شهادة الضريبة - مدارات الكون"
                    width={800}
                    height={1130}
                    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                    quality={100}
                  />
                </div>
              </div>
            </div>

            <div className={styles.legalNote}>
              <p>
                جميع المستندات المذكورة أعلاه سارية المفعول وتم استخراجها وفقاً
                للأنظمة واللوائح المعمول بها في المملكة العربية السعودية. لمزيد
                من المعلومات أو استفسارات حول المستندات القانونية، يرجى{' '}
                <Link href="/contact">الاتصال بنا</Link>.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <div className={styles.lightboxContent}>
            <button className={styles.lightboxClose} onClick={closeLightbox}>
              <FaTimes />
            </button>
            <img
              src={lightboxImage}
              alt={lightboxAlt}
              className={styles.lightboxImage}
              onClick={(e) => e.stopPropagation()}
            />
            {/* Show PDF link if this is a Google Drive document */}
            {lightboxImage.includes('drive.google.com') && (
              <div className={styles.lightboxPdfLink}>
                <a 
                  href={
                    lightboxImage.includes('1_N7raN714JBT-ZZFe5ElBUhGwoQxuJxk') 
                      ? commercialRegisterFullUrl 
                      : taxCertificateFullUrl
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.lightboxPdfButton}
                  onClick={(e) => e.stopPropagation()}
                >
                  📄 عرض PDF كاملاً أو تحميل
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </LegalLayout>
  );
}
