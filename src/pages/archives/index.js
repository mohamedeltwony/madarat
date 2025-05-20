import React from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import { getYearArchives } from '@/lib/posts';
import { getSiteMetadata } from '@/lib/metadata';
import { getAllMenus } from '@/lib/menus';

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

export async function getStaticProps() {
  // Use try/catch to handle potential errors in API calls
  let metadata = {};
  let menus = [];
  let years = [];
  
  try {
    // Attempt to get site metadata
    const siteMetadata = await getSiteMetadata();
    metadata = siteMetadata?.metadata || {};
  } catch (error) {
    console.error('Error fetching site metadata:', error);
    // Use empty metadata object on error
  }
  
  try {
    // Attempt to get menus
    const menuData = await getAllMenus();
    menus = menuData?.menus || [];
  } catch (error) {
    console.error('Error fetching menus:', error);
    // Use empty menus array on error
  }
  
  try {
    // Attempt to get year archives
    const archiveData = await getYearArchives();
    years = archiveData?.years || [];
  } catch (error) {
    console.error('Error fetching year archives:', error);
    // Will fall back to default years defined below
  }
  
  // Define fallback years in case API returns empty
  const defaultYears = [
    { value: '2024', count: 10 },
    { value: '2023', count: 20 },
    { value: '2022', count: 15 }
  ];

  return {
    props: {
      years: years.length > 0 ? years : defaultYears,
      metadata,
      menus,
    },
  };
}
