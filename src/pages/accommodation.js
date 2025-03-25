import { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from 'components/Layout';
import Header from 'components/Header';
import Hero from 'components/Hero';
import styles from 'styles/Accommodation.module.scss';

const accommodations = [
  {
    id: 1,
    title: 'أين تقيم في بورنيو: دليل للمسافرين لأول مرة',
    excerpt:
      'بورنيو، ثالث أكبر جزيرة في العالم، مقسمة بين ثلاث دول: ماليزيا وإندونيسيا وبروناي...',
    image: '/images/borneo.jpg',
    slug: 'where-to-stay-in-borneo',
  },
  {
    id: 2,
    title: 'أين تقيم في صباح: مناطقي وفنادقي المفضلة',
    excerpt: 'صباح هي واحدة من أكثر الأماكن شعبية للسفر والإقامة في بورنيو...',
    image: '/images/sabah.jpg',
    slug: 'where-to-stay-in-sabah',
  },
  {
    id: 3,
    title: 'أين تقيم في سانداكان: أفضل المناطق والفنادق',
    excerpt:
      'سانداكان معروفة كبوابة شرق صباح للحياة البرية والغابات المطيرة...',
    image: '/images/sandakan.jpg',
    slug: 'where-to-stay-in-sandakan',
  },
  {
    id: 4,
    title: 'أين تقيم في سيمبورنا: أفضل البنغلو والفنادق',
    excerpt: 'سيمبورنا قد تكون مدينة ساحلية صغيرة في صباح، ماليزيا...',
    image: '/images/semporna.jpg',
    slug: 'where-to-stay-in-semporna',
  },
];

export default function Accommodation() {
  useEffect(() => {
    document.documentElement.dir = 'rtl';
  }, []);

  return (
    <Layout>
      <Head>
        <title>أماكن الإقامة - WeSeek Travel</title>
        <meta
          name="description"
          content="اكتشف أفضل الفنادق وأماكن الإقامة في الوجهات التي زرتها"
        />
      </Head>

      <Hero
        title="أماكن الإقامة"
        description="اكتشف أفضل الفنادق وأماكن الإقامة في الوجهات التي زرتها. من النزل الرخيصة إلى المنتجعات الفاخرة، هذه الأدلة ستساعدك في تخطيط مكان إقامتك."
        backgroundImage="/images/hero-accommodation.jpg"
      />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.breadcrumbs}>
            <Link href="/">الرئيسية</Link> / <span>أماكن الإقامة</span>
          </div>

          <div className={styles.grid}>
            {accommodations.map((accommodation) => (
              <article key={accommodation.id} className={styles.card}>
                <Link href={`/accommodation/${accommodation.slug}`}>
                  <div className={styles.cardImage}>
                    <img src={accommodation.image} alt={accommodation.title} />
                  </div>
                  <div className={styles.cardContent}>
                    <h2>{accommodation.title}</h2>
                    <p>{accommodation.excerpt}</p>
                    <button className={styles.readMore}>اقرأ المزيد</button>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
