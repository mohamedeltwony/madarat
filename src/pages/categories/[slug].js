import { getCategoryBySlug } from '@/lib/categories';
import { getPostsByCategoryId } from '@/lib/posts';
import usePageMetadata from '@/hooks/use-page-metadata';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';
import { generateSEOTitle, generateSEODescription } from '@/utils/seo-helpers';
import Head from 'next/head';

import ArchiveTemplate from '@/templates/archive';
import Title from '@/components/Title';

export default function Category({ category, posts, siteMetadata, menus }) {
  const { name, description, slug } = category;

  // Generate optimized SEO title for category using enhanced helper
  const optimizedTitle = generateSEOTitle({
    title: name || '',
    type: 'category',
    extras: { postsCount: posts?.length || 0 }
  });

  // Generate meta description for category using enhanced helper
  const optimizedDescription = generateSEODescription({
    title: name || '',
    type: 'category',
    description: description || '',
    extras: { postsCount: posts?.length || 0 }
  });

  // Generate keywords for category
  const generateKeywords = () => {
    const baseKeywords = [name, 'مدارات الكون', 'سياحة', 'سفر', 'مقالات'];
    
    // Add related keywords based on category name
    if (name && name.includes('البوسنة')) {
      baseKeywords.push('البوسنة والهرسك', 'سراييفو', 'رحلات البوسنة');
    } else if (name && name.includes('تركيا')) {
      baseKeywords.push('اسطنبول', 'رحلات تركيا', 'السياحة في تركيا');
    } else if (name && name.includes('السياحة')) {
      baseKeywords.push('وجهات سياحية', 'عروض سفر', 'حجز رحلات');
    }
    
    return baseKeywords.join(', ');
  };

  const { metadata } = usePageMetadata({
    metadata: {
      ...category,
      title: optimizedTitle,
      description: optimizedDescription,
    },
  });

  // Override metadata for better SEO
  metadata.title = optimizedTitle;
  metadata.description = optimizedDescription;
  metadata.og.title = optimizedTitle;
  metadata.og.description = optimizedDescription;
  metadata.twitter.title = optimizedTitle;
  metadata.twitter.description = optimizedDescription;

  return (
    <>
      <Head>
        <title>{optimizedTitle}</title>
        <meta name="description" content={optimizedDescription} />
        <meta name="keywords" content={generateKeywords()} />
        
        {/* Open Graph */}
        <meta property="og:title" content={optimizedTitle} />
        <meta property="og:description" content={optimizedDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://madaratalkon.sa/categories/${slug}`} />
        <meta property="og:site_name" content="مدارات الكون" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={optimizedTitle} />
        <meta name="twitter:description" content={optimizedDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://madaratalkon.sa/categories/${slug}`} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="مدارات الكون" />
      </Head>
      
      <ArchiveTemplate
        title={name}
        Title={<Title title={name} />}
        posts={posts}
        slug={slug}
        metadata={metadata}
        siteMetadata={siteMetadata}
        menus={menus}
      />
    </>
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
