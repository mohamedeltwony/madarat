import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/legacy/image';
import styles from './BentoDestinations.module.scss';

const destinations = [
  {
    id: 1,
    title: 'أوروبا',
    slug: 'europe',
    description: 'اكتشف جمال القارة الأوروبية وثقافتها الغنية',
    image: '/images/destinations/europe.jpg',
  },
  {
    id: 2,
    title: 'آسيا',
    slug: 'asia',
    description: 'استكشف التنوع الثقافي والطبيعي في آسيا',
    image: '/images/destinations/asia.jpg',
  },
  {
    id: 3,
    title: 'الشرق الأوسط',
    slug: 'middle-east',
    description: 'تعرف على تاريخ وحضارة الشرق الأوسط',
    image: '/images/destinations/middle-east.jpg',
  },
];

const BentoDestinations = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className={styles.bentoGrid}>
      {destinations.map((destination) => (
        <Link
          key={destination.id}
          href={`/destinations/${destination.slug}`}
          className={`${styles.bentoItem} ${
            hoveredId === destination.id ? styles.hovered : ''
          }`}
          onMouseEnter={() => setHoveredId(destination.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className={styles.imageWrapper}>
            <img
              src={destination.image}
              alt={destination.title}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{destination.title}</h3>
            <p className={styles.description}>{destination.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BentoDestinations;
