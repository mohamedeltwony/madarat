import { useState } from 'react';
import Link from 'next/link';
import styles from './BentoPosts.module.scss';

const posts = [
  {
    id: 1,
    title: 'أفضل 10 وجهات سياحية في أوروبا',
    slug: 'top-10-destinations-in-europe',
    excerpt: 'اكتشف أجمل المدن والمعالم السياحية في القارة الأوروبية',
    image: '/images/posts/europe-destinations.jpg',
  },
  {
    id: 2,
    title: 'دليلك الشامل للسفر إلى آسيا',
    slug: 'complete-guide-to-asia',
    excerpt: 'كل ما تحتاج معرفته عن السفر إلى القارة الآسيوية',
    image: '/images/posts/asia-guide.jpg',
  },
  {
    id: 3,
    title: 'نصائح مهمة للسفر بميزانية محدودة',
    slug: 'budget-travel-tips',
    excerpt: 'تعرف على أفضل الطرق للسفر بتكلفة منخفضة',
    image: '/images/posts/budget-travel.jpg',
  },
];

export default function BentoPosts() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className={styles.bentoGrid}>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/blog/${post.slug}`}
          className={`${styles.bentoItem} ${
            hoveredId === post.id ? styles.hovered : ''
          }`}
          onMouseEnter={() => setHoveredId(post.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className={styles.imageWrapper}>
            <img
              src={post.image}
              alt={post.title}
              className={styles.image}
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>{post.title}</h3>
            <p className={styles.excerpt}>{post.excerpt}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
