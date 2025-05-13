import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import { getAllCategories } from '@/lib/categories';
import { getSiteMetadataREST, getAllMenusREST } from '@/lib/rest-api';
import styles from '@/styles/pages/Categories.module.scss';

export default function Categories({ categories, metadata, menus }) {
  return (
    <Layout menus={menus}>
      <Head>
        <title>الفئات - مدارات الكون</title>
        <meta
          name="description"
          content="استعرض فئات المقالات المختلفة في موقع مدارات الكون للسفر والسياحة"
        />
        <link rel="canonical" href="https://madaratalkon.com/categories" />
      </Head>

      <div className="ar">
        <Container>
          <h1 className={styles.title}>فئات المقالات</h1>
          <p className={styles.description}>
            استكشف مجموعة متنوعة من الموضوعات والفئات
          </p>

          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link
                href={`/posts?category=${category.slug}`}
                key={category.id}
                className={styles.categoryCard}
              >
                <h2>{category.name}</h2>
                <p>{category.count} مقالة</p>
                {category.description && (
                  <p className={styles.description}>{category.description}</p>
                )}
              </Link>
            ))}
          </div>
        </Container>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Get all categories
    const { categories = [] } = await getAllCategories();

    // Sort by post count descending
    const sortedCategories = [...categories].sort((a, b) => b.count - a.count);

    // Get site metadata
    const metadata = (await getSiteMetadataREST()) || {
      title: 'مدارات الكون',
      siteTitle: 'مدارات الكون',
      description: 'موقع مدارات الكون',
    };

    // Get menus
    const { menus = [] } = await getAllMenusREST();

    return {
      props: {
        categories: sortedCategories,
        metadata,
        menus,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps', error);
    return {
      props: {
        categories: [],
        metadata: {
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع مدارات الكون',
        },
        menus: [],
      },
      revalidate: 60,
    };
  }
}
