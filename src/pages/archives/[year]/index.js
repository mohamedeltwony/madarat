import { getYearArchives, getPostsByYear } from '@/lib/posts';
import { getArchiveTitle } from '@/lib/datetime';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import ArchiveNavigation from '@/components/ArchiveNavigation';
import PostCard from '@/components/PostCard';
import Meta from '@/components/Meta';

export default function YearArchive({ posts, years, year }) {
  const archiveTitle = getArchiveTitle({ year });

  const { metadata } = usePageMetadata({
    metadata: {
      title: `Archive: ${archiveTitle}`,
      description: `Browse all content from ${year}`,
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

  const { posts } = await getPostsByYear({
    year,
  });

  const years = await getYearArchives();

  return {
    props: {
      posts,
      years,
      year,
    },
  };
}

export async function getStaticPaths() {
  const years = await getYearArchives();

  const paths = years.map((year) => {
    return {
      params: {
        year: year.toString(),
      },
    };
  });

  return {
    paths,
    fallback: 'blocking',
  };
}
