import { useState } from 'react';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import styles from '@/styles/Accommodation.module.scss';

export default function Accommodation() {
  const [selectedType, setSelectedType] = useState('all');

  const accommodations = [
    {
      id: 1,
      type: 'hotel',
      name: 'فندق الريتز كارلتون',
      location: 'دبي، الإمارات العربية المتحدة',
      price: '1000',
      rating: 5,
      image: '/images/accommodations/ritz.jpg',
    },
    {
      id: 2,
      type: 'resort',
      name: 'منتجع أتلانتس النخلة',
      location: 'دبي، الإمارات العربية المتحدة',
      price: '1500',
      rating: 5,
      image: '/images/accommodations/atlantis.jpg',
    },
    {
      id: 3,
      type: 'apartment',
      name: 'شقق داون تاون الفندقية',
      location: 'دبي، الإمارات العربية المتحدة',
      price: '500',
      rating: 4,
      image: '/images/accommodations/downtown.jpg',
    },
  ];

  const filteredAccommodations =
    selectedType === 'all'
      ? accommodations
      : accommodations.filter((acc) => acc.type === selectedType);

  return (
    <Layout>
      <Container>
        <Section>
          <h1 className={styles.title}>أماكن الإقامة</h1>
          <div className={styles.filters}>
            <button
              className={`${styles.filterButton} ${
                selectedType === 'all' ? styles.active : ''
              }`}
              onClick={() => setSelectedType('all')}
            >
              الكل
            </button>
            <button
              className={`${styles.filterButton} ${
                selectedType === 'hotel' ? styles.active : ''
              }`}
              onClick={() => setSelectedType('hotel')}
            >
              فنادق
            </button>
            <button
              className={`${styles.filterButton} ${
                selectedType === 'resort' ? styles.active : ''
              }`}
              onClick={() => setSelectedType('resort')}
            >
              منتجعات
            </button>
            <button
              className={`${styles.filterButton} ${
                selectedType === 'apartment' ? styles.active : ''
              }`}
              onClick={() => setSelectedType('apartment')}
            >
              شقق فندقية
            </button>
          </div>
          <div className={styles.grid}>
            {filteredAccommodations.map((accommodation) => (
              <div key={accommodation.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className={styles.image}
                  />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.name}>{accommodation.name}</h3>
                  <p className={styles.location}>{accommodation.location}</p>
                  <div className={styles.details}>
                    <span className={styles.price}>
                      {accommodation.price} درهم / ليلة
                    </span>
                    <span className={styles.rating}>
                      {Array.from({ length: accommodation.rating }).map((_, i) => (
                        <span key={i} className={styles.star}>
                          ⭐
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Container>
    </Layout>
  );
}
