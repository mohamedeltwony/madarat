import React from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>مدارات الكون - موقع السفر والرحلات الأول في الوطن العربي</title>
        <meta name="description" content="اكتشف معنا أجمل الوجهات السياحية حول العالم مع مدارات الكون" />
      </Head>

      <main>
        <h1>مدارات الكون</h1>
        <p>موقع السفر والرحلات الأول في الوطن العربي</p>
        <p>اكتشف معنا أجمل الوجهات السياحية حول العالم</p>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 1800,
  };
} 