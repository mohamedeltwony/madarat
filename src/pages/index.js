import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import BentoPosts from '@/components/BentoPosts';
import BentoDestinations from '@/components/BentoDestinations';
import styles from '@/styles/Home.module.scss';

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  return (
    <Layout>
      <Head>
        <title>مدارات - رحلات سياحية مميزة</title>
        <meta
          name="description"
          content="اكتشف أجمل الوجهات السياحية مع مدارات. نقدم رحلات مميزة وتجارب فريدة."
        />
      </Head>

      <Container>
        <Section>
          <div className={styles.hero}>
            <h1>اكتشف العالم مع مدارات</h1>
            <p>رحلات مميزة وتجارب لا تنسى</p>
          </div>
        </Section>

        <Section>
          <h2>وجهات مميزة</h2>
          <BentoDestinations />
        </Section>

        <Section>
          <h2>آخر المقالات</h2>
          <BentoPosts />
        </Section>

        <Section>
          <div className={styles.cta}>
            <h2>ابدأ رحلتك معنا</h2>
            <p>اشترك في نشرتنا البريدية للحصول على أحدث العروض والوجهات</p>
            <button onClick={() => setShowForm(true)}>اشترك الآن</button>
          </div>
        </Section>
      </Container>
    </Layout>
  );
}
