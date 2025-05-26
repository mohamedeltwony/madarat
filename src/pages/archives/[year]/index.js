import { getYearArchives, getPostsByYear } from '@/lib/posts';
import { getArchiveTitle } from '@/lib/datetime';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import ArchiveNavigation from '@/components/ArchiveNavigation';
import PostCard from '@/components/PostCard';

export default function YearArchive({ posts, years, year, metadata, menus, error }) {
  const archiveTitle = getArchiveTitle({ year });

  if (error) {
    return (
      <Layout metadata={metadata} menus={menus}>
        <Section>
          <Container>
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-red-600 mb-4">عذراً، حدث خطأ</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                إعادة المحاولة
              </button>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout metadata={metadata} menus={menus}>

      <Section>
        <Container>
          <h1 className="text-3xl font-bold mb-8">Archive: {archiveTitle}</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1">
              <ArchiveNavigation years={years} activeYear={year} />
            </div>

            <div className="col-span-1 md:col-span-2">
              {posts && posts.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                  {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-100 p-8 rounded-lg text-center">
                  <p>No posts found for {archiveTitle}</p>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getStaticProps({ params = {} }) {
  const { year } = params;

  try {
    // Fetch all required data
    const [
      { posts },
      { years = [] },
      { metadata },
      { menus }
    ] = await Promise.all([
      getPostsByYear({ year }),
      getYearArchives(),
      getSiteMetadata(),
      getAllMenus()
    ]);

    // Define fallback years in case API returns empty
    const defaultYears = [
      { value: '2024', count: 10 },
      { value: '2023', count: 20 },
      { value: '2022', count: 15 }
    ];

    const archiveTitle = getArchiveTitle({ year });

    // Construct page metadata
    const pageMetadata = {
      title: `أرشيف ${archiveTitle} - مدارات الكون`,
      description: `تصفح جميع المقالات والمحتوى من عام ${year} في مدارات الكون. ${posts.length} مقالة متاحة`,
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/archives/${year}`,
      robots: 'index, follow',
      og: {
        title: `أرشيف ${archiveTitle} - مدارات الكون`,
        description: `تصفح جميع المقالات والمحتوى من عام ${year} في مدارات الكون. ${posts.length} مقالة متاحة`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/archives/${year}`,
        siteName: 'مدارات الكون',
      },
      twitter: {
        card: 'summary',
        title: `أرشيف ${archiveTitle} - مدارات الكون`,
        description: `تصفح جميع المقالات والمحتوى من عام ${year} في مدارات الكون. ${posts.length} مقالة متاحة`,
      },
    };

    return {
      props: {
        posts,
        years: years.length > 0 ? years : defaultYears,
        year,
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        error: null,
      },
      revalidate: 86400, // Revalidate every 24 hours as per plan
    };
  } catch (error) {
    console.error('Error in yearly archive getStaticProps:', error);
    
    // Fetch basic metadata for error state
    const [{ metadata }, { menus }] = await Promise.all([
      getSiteMetadata().catch(() => ({ metadata: {} })),
      getAllMenus().catch(() => ({ menus: [] })),
    ]);

    const archiveTitle = getArchiveTitle({ year });
    const pageMetadata = {
      title: `أرشيف ${archiveTitle} - مدارات الكون`,
      description: `تصفح جميع المقالات والمحتوى من عام ${year} في مدارات الكون`,
    };

    return {
      props: {
        posts: [],
        years: [
          { value: '2024', count: 10 },
          { value: '2023', count: 20 },
          { value: '2022', count: 15 }
        ],
        year,
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        error: 'حدث خطأ أثناء تحميل أرشيف المقالات. يرجى المحاولة مرة أخرى لاحقاً.',
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
}

export async function getStaticPaths() {
  const { years = [] } = await getYearArchives();
  
  // Define fallback years in case API returns empty
  const defaultYears = [
    { value: '2024', count: 10 },
    { value: '2023', count: 20 },
    { value: '2022', count: 15 }
  ];

  // Use the available years or fallback to defaults
  const yearsData = years.length > 0 ? years : defaultYears;
  
  const paths = yearsData.map((yearObj) => ({
    params: {
      year: yearObj.value.toString(),
    },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}
