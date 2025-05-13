import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Destinations.module.scss';
import Section from '@/components/Section';
import Container from '@/components/Container';

const destinations = [
  {
    id: 1,
    name: 'تركيا',
    slug: 'turkey',
    image: '/images/destinations/turkey.jpg',
    tripCount: 12,
  },
  {
    id: 2,
    name: 'جورجيا',
    slug: 'georgia',
    image: '/images/destinations/georgia.jpg',
    tripCount: 8,
  },
  {
    id: 3,
    name: 'إيطاليا',
    slug: 'italy',
    image: '/images/destinations/italy.jpg',
    tripCount: 5,
  },
  {
    id: 4,
    name: 'لندن',
    slug: 'london',
    image: '/images/destinations/london.jpg',
    tripCount: 3,
  },
  {
    id: 5,
    name: 'أذربيجان',
    slug: 'azerbaijan',
    image: '/images/destinations/azerbaijan.jpg',
    tripCount: 6,
  },
  {
    id: 6,
    name: 'البوسنة',
    slug: 'bosnia',
    image: '/images/destinations/bosnia.jpg',
    tripCount: 4,
  },
];

const Destinations = () => {
  return (
    <div>
      <div>
        <h2>وجهات مميزة</h2>
        <p>اكتشف أجمل الوجهات السياحية حول العالم مع مدارات الكون</p>
      </div>
      <div className={styles.destinationsGrid}>
        {destinations.map((destination) => (
          <Link href={`/destinations/${destination.slug}`} key={destination.id}>
            <div className={styles.destinationImageWrapper}>
              <div className={styles.destinationImage}>
                <Image
                  src={destination.image}
                  alt={destination.name}
                  width={400}
                  height={300}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
              <div className={styles.destinationOverlay}></div>
            </div>
            <div className={styles.destinationInfo}>
              <h3>{destination.name}</h3>
              <span>
                {destination.tripCount}{' '}
                {destination.tripCount > 1 ? 'رحلات' : 'رحلة'}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className={styles.viewAllContainer}>
        <Link href="/destinations" className={styles.viewAllButton}>
          عرض جميع الوجهات
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default Destinations;
