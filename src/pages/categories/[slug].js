import { getCategoryBySlug } from '@/lib/categories';
import { getPostsByCategoryId } from '@/lib/posts';
import usePageMetadata from '@/hooks/use-page-metadata';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';

import ArchiveTemplate from '@/templates/archive';
import Title from '@/components/Title';

export default function Category({ category, posts, siteMetadata, menus }) {
  const { name, description, slug } = category;

  const { metadata } = usePageMetadata({
    metadata: {
      ...category,
      description:
        description ||
        category.og?.description ||
        `Read ${posts.length} posts from ${name}`,
    },
  });

  return (
    <ArchiveTemplate
      title={name}
      Title={<Title title={name} />}
      posts={posts}
      slug={slug}
      metadata={metadata}
      siteMetadata={siteMetadata}
      menus={menus}
    />
  );
}

export async function getStaticProps({ params = {} } = {}) {
  // Fetch layout data
  const { metadata } = await getSiteMetadata();
  const { menus } = await getAllMenus();

  const { category } = await getCategoryBySlug(params?.slug);

  if (!category) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { posts } = await getPostsByCategoryId({
    categoryId: category.databaseId,
    queryIncludes: 'archive',
  });

  // Sanitize data to remove undefined values
  const sanitizedMetadata = JSON.parse(JSON.stringify(metadata || {}));
  const sanitizedMenus = JSON.parse(JSON.stringify(menus || {}));
  const sanitizedCategory = JSON.parse(JSON.stringify(category || {}));
  const sanitizedPosts = JSON.parse(JSON.stringify(posts || []));

  return {
    props: {
      category: sanitizedCategory,
      posts: sanitizedPosts,
      siteMetadata: sanitizedMetadata,
      menus: sanitizedMenus,
    },
    // Add ISR with a reasonable revalidation period
    revalidate: 600, // Revalidate every 10 minutes
  };
}

export async function getStaticPaths() {
  // By default, we don't render any Category pages as
  // we're considering them non-critical pages

  // To enable pre-rendering of Category pages:

  // 1. Add import to the top of the file
  //
  // import { getAllCategories, getCategoryBySlug } from 'lib/categories';

  // 2. Uncomment the below
  //
  // const { categories } = await getAllCategories();

  // const paths = categories.map((category) => {
  //   const { slug } = category;
  //   return {
  //     params: {
  //       slug,
  //     },
  //   };
  // });

  // 3. Update `paths` in the return statement below to reference the `paths` constant above

  return {
    paths: [],
    fallback: 'blocking',
  };
}
