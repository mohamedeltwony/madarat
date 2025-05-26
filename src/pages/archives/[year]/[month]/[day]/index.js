import { getYearArchives, getPostsByDay } from '@/lib/posts';
import { getArchiveTitle, getMonthName } from '@/lib/datetime';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import ArchiveNavigation from '@/components/ArchiveNavigation';
import PostCard from '@/components/PostCard';

export default function DayArchive({ posts, years, year, month, day, metadata, menus, error }) {
  const archiveTitle = getArchiveTitle({ year, month, day });

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
              <ArchiveNavigation
                years={years}
                activeYear={year}
                activeMonth={month}
              />

              <div className="mt-8 bg-gray-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Daily Archive</h3>
                <p>Viewing posts from {archiveTitle}</p>
                <a
                  href={`/archives/${year}/${month}`}
                  className="inline-block mt-4 text-blue-600 hover:underline"
                >
                  ← Back to {getMonthName(month)} {year}
                </a>
              </div>
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
  const { year, month, day } = params;

  try {
    // Fetch all required data
    const [
      { posts },
      { years = [] },
      { metadata },
      { menus }
    ] = await Promise.all([
      getPostsByDay({ year, month, day }),
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

    const archiveTitle = getArchiveTitle({ year, month, day });
    const monthName = getMonthName(month);

    // Construct page metadata
    const pageMetadata = {
      title: `أرشيف ${archiveTitle} - مدارات الكون`,
      description: `تصفح جميع المقالات والمحتوى من ${day} ${monthName} ${year} في مدارات الكون. ${posts.length} مقالة متاحة`,
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/archives/${year}/${month}/${day}`,
      robots: 'index, follow',
      og: {
        title: `أرشيف ${archiveTitle} - مدارات الكون`,
        description: `تصفح جميع المقالات والمحتوى من ${day} ${monthName} ${year} في مدارات الكون. ${posts.length} مقالة متاحة`,
        type: 'website',
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://madaratalkon.com'}/archives/${year}/${month}/${day}`,
        siteName: 'مدارات الكون',
      },
      twitter: {
        card: 'summary',
        title: `أرشيف ${archiveTitle} - مدارات الكون`,
        description: `تصفح جميع المقالات والمحتوى من ${day} ${monthName} ${year} في مدارات الكون. ${posts.length} مقالة متاحة`,
      },
    };

    return {
      props: {
        posts,
        years: years.length > 0 ? years : defaultYears,
        year,
        month,
        day,
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        error: null,
      },
      revalidate: 86400, // Revalidate every 24 hours as per plan
    };
  } catch (error) {
    console.error('Error in daily archive getStaticProps:', error);
    
    // Fetch basic metadata for error state
    const [{ metadata }, { menus }] = await Promise.all([
      getSiteMetadata().catch(() => ({ metadata: {} })),
      getAllMenus().catch(() => ({ menus: [] })),
    ]);

    const archiveTitle = getArchiveTitle({ year, month, day });
    const pageMetadata = {
      title: `أرشيف ${archiveTitle} - مدارات الكون`,
      description: `تصفح جميع المقالات والمحتوى من ${day} ${getMonthName(month)} ${year} في مدارات الكون`,
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
        month,
        day,
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        error: 'حدث خطأ أثناء تحميل أرشيف المقالات. يرجى المحاولة مرة أخرى لاحقاً.',
      },
      revalidate: 60, // Retry more frequently on error
    };
  }
}

export async function getStaticPaths() {
  // For performance reasons, we'll use fallback: 'blocking' 
  // and only pre-generate a minimal set of date paths
  
  return {
    paths: [],
    fallback: 'blocking',
  };
}
