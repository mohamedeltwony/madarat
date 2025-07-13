import { getPaginatedPosts } from '@/lib/posts';
import usePageMetadata from '@/hooks/use-page-metadata';

import ArchiveTemplate from '@/templates/archive';

export default function Posts({ posts, pagination }) {
  const title = `All Posts`;
  const slug = 'posts';

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: `Page ${pagination.currentPage}`,
    },
  });

  return (
    <ArchiveTemplate
      title={title}
      posts={posts}
      slug={slug}
      pagination={pagination}
      metadata={metadata}
    />
  );
}

export async function getServerSideProps({ params = {} } = {}) {
  // Site maintenance mode - redirect to coming soon page
  return {
    redirect: {
      destination: '/coming-soon',
      permanent: false,
    },
  };
}

// getStaticPaths removed - using getServerSideProps for maintenance mode
