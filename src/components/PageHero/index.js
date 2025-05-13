import React from 'react';
import Container from '@/components/Container';
import Section from '@/components/Section';
import styles from '@/styles/pages/Legal.module.scss';

export default function PageHero({ title, breadcrumb, featuredImage }) {
  // Apply the hero section class
  const heroClassName = `${styles.heroSection}`;

  return (
    <Section 
      className={heroClassName} 
      heroSection
    >
      <Container>
        <div className={styles.heroContent}>
          {breadcrumb && (
            <div className={styles.heroBreadcrumb}>
              <a href="/">الرئيسية</a> / <span>{breadcrumb}</span>
            </div>
          )}
          <h1 className={styles.heroTitle}>{title}</h1>
        </div>
      </Container>
    </Section>
  );
} 