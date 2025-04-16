import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
// Import necessary functions if you want to display archive links here later
// import { getYearArchives } from '@/lib/posts';

// Basic placeholder component
export default function ArchivesIndex({ archives = [] }) {
  return (
    <Layout>
      <Head>
        <title>Archives - مدارات الكون</title>
        <meta name="description" content="Browse archives by year." />
      </Head>
      <Section>
        <Container>
          <h1>Archives</h1>
          <p>
            This is the main archives page. Content or links can be added here.
          </p>
          {/* Example: You could list years here if needed */}
          {/* <ul>
            {archives.map(year => (
              <li key={year}><a href={`/archives/${year}`}>{year}</a></li>
            ))}
          </ul> */}
        </Container>
      </Section>
    </Layout>
  );
}

// Optional: Add getStaticProps if you need to fetch data for this page
// export async function getStaticProps() {
//   // const { years = [] } = await getYearArchives();
//   return {
//     props: {
//       // archives: years,
//     },
//   };
// }
