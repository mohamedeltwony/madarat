import { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import usePageMetadata from '@/hooks/use-page-metadata';
import useSearch from '@/hooks/use-search';
import ArchiveTemplate from '@/templates/archive';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';

export default function Search({ siteMetadata, menus }) {
  const { query, results, search } = useSearch();
  const title = 'Search';
  const slug = 'search';

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    search({
      query: params.get('q'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { metadata } = usePageMetadata({
    metadata: {
      title,
      description: `Search results for ${query}`,
    },
  });

  return (
    <>
      <Helmet>
        <meta name="robots" content="noindex" />
      </Helmet>
      <ArchiveTemplate
        title={title}
        posts={results}
        slug={slug}
        metadata={metadata}
        siteMetadata={siteMetadata}
        menus={menus}
      />
    </>
  );
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
  // Fetch layout data (metadata and menus)
  const { metadata } = await getSiteMetadata();
  const { menus } = await getAllMenus();

  // Sanitize data to remove undefined values
  const sanitizedMetadata = JSON.parse(JSON.stringify(metadata || {}));
  const sanitizedMenus = JSON.parse(JSON.stringify(menus || {}));

  return {
    props: {
      siteMetadata: sanitizedMetadata,
      menus: sanitizedMenus
    },
    // Add ISR with a reasonable revalidation period
    revalidate: 600 // Revalidate every 10 minutes
  };
}
