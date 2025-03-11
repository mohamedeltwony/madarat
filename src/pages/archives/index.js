import { getYearArchives } from '@/lib/posts';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import ArchiveNavigation from '@/components/ArchiveNavigation';
import Meta from '@/components/Meta';

export default function Archives({ years }) {
  const { metadata } = usePageMetadata({
    metadata: {
      title: 'Archives',
      description: 'Browse all content by date',
    },
  });

  return (
    <Layout>
      <Meta
        title={metadata.title}
        description={metadata.description}
      />

      <Section>
        <Container>
          <h1 className="text-3xl font-bold mb-8">Archives</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <ArchiveNavigation years={years} />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <div className="bg-gray-100 p-8 rounded-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Browse Archives by Year</h2>
                <p className="mb-6">Select a year from the navigation to browse posts from that time period.</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {years.map(year => (
                    <a 
                      key={year} 
                      href={`/archives/${year}`}
                      className="bg-white py-3 px-4 rounded-md shadow hover:shadow-md transition-shadow"
                    >
                      <span className="text-lg font-medium">{year}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps() {
  const years = await getYearArchives();

  return {
    props: {
      years,
    },
  };
} 