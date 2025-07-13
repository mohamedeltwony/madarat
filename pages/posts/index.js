import { getPaginatedPosts } from '@/lib/posts';
import usePageMetadata from '@/hooks/use-page-metadata';

import ArchiveTemplate from '@/templates/archive';

export default function Posts({ posts, pagination }) {
  const title = `جميع المقالات`;
  const slug = 'posts';

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: 'تصفح جميع مقالات مدارات الكون حول السياحة والسفر واكتشف أجمل الوجهات السياحية حول العالم',
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

export async function getServerSideProps() {
  // Site maintenance mode - redirect to coming soon page
  return {
    redirect: {
      destination: '/coming-soon',
      permanent: false,
    },
  };
} 