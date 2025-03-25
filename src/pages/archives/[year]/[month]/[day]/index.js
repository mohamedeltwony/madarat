import { getYearArchives, getPostsByDay } from '@/lib/posts';
import { getArchiveTitle, getMonthName } from '@/lib/datetime';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import ArchiveNavigation from '@/components/ArchiveNavigation';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';

export default function DayArchive({ posts, years, year, month, day }) {
  const archiveTitle = getArchiveTitle({ year, month, day });

  const { metadata } = usePageMetadata({
    metadata: {
      title: `Archive: ${archiveTitle}`,
      description: `Browse all content from ${getMonthName(month)} ${day}, ${year}`,
    },
  });

  return (
    <Layout>
      <Meta title={metadata.title} description={metadata.description} />

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

export async function getServerSideProps({ params = {} }) {
  const { year, month, day } = params;

  const { posts } = await getPostsByDay({
    year,
    month,
    day,
  });

  const years = await getYearArchives();

  // Using server-side rendering for daily archives
  // This provides better performance as we don't need to generate
  // static pages for every possible day, which would be too many
  return {
    props: {
      posts,
      years,
      year,
      month,
      day,
    },
  };
}
