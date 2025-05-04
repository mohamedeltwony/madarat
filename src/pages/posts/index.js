import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import useSite from '@/hooks/use-site';

import { getAllCategories } from '@/lib/categories';
import { getPostsAndPagination } from '@/lib/posts';
import { getSiteMetadataREST, getAllMenusREST } from '@/lib/rest-api';

import Layout from '@/components/Layout';
import Main from '@/components/Main';
import Archive from '@/components/Archive';
import Container from '@/components/Container';
import MorphPosts from '@/components/MorphPosts';
import FeaturedImage from '@/components/FeaturedImage';
import Post from '@/components/Post';
import Pagination from '@/components/Pagination';
import Head from 'next/head';
import Script from 'next/script';
import { sanitizeExcerpt } from '@/lib/util';

export default function Posts({ posts, pagination, categories, metadata, menus }) {
  const router = useRouter();
  const { asPath } = router;

  const { category, query = '' } = router?.query;

  // // Ensure we're using the same posts from props that were provided
  // // during static site generation
  const [postsList, setPostsList] = useState(posts);

  // Update postsList when posts from props change
  useEffect(() => {
    setPostsList(posts);
  }, [posts]);

  // When the user changes the category or search query, we need to update the list of posts
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!category && !query) return;
      setLoading(true);
      setError(null);

      try {
        let url = '/api/posts?';
        if (category) url += `category=${encodeURIComponent(category)}&`;
        if (query) url += `query=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch posts');
        
        const { posts: fetchedPosts } = await response.json();
        setPostsList(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category, query]);

  const categoryId = categories.find((cat) => cat.slug === category)?.id;
  
  let title = metadata.title;
  let subtitle = metadata.description;

  if (category) {
    const categoryData = categories.find((cat) => cat.slug === category);
    if (categoryData) {
      title = categoryData.name;
      subtitle = `${subtitle} - ${title}`;
    }
  }

  return (
    <Layout menus={menus}>
      <Head>
        <title>المقالات - مدارات الكون</title>
        <meta
          name="description"
          content="اكتشف أحدث المقالات حول السفر والسياحة والترحال والوجهات السياحية المميزة"
        />
        <link rel="canonical" href="https://madaratalkon.com/posts" />
      </Head>

      <div className='ar'>
        <Container>
          {loading && <div>جاري التحميل...</div>}
          {error && <div>{error}</div>}
          
          {!loading && !error && (
            <>
              <MorphPosts 
                title="المقالات" 
                desc="استكشف أحدث المقالات المميزة من مدارات الكون"
                posts={postsList} 
              />
              {pagination && (
                <Pagination
                  currentPage={pagination?.currentPage}
                  pagesCount={pagination?.pagesCount}
                  basePath="/posts"
                />
              )}
            </>
          )}
        </Container>
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Get all posts
    const { posts = [], pagination = {} } = await getPostsAndPagination({
      perPage: 20,
      page: 1
    });

    // Get all categories
    const { categories = [] } = await getAllCategories();

    // Get site metadata from local data instead of API call
    const { siteMetadata } = await import('@/data/site');
    const metadata = siteMetadata || { 
      title: 'مدارات الكون',
      siteTitle: 'مدارات الكون',
      description: 'موقع مدارات الكون'
    };

    // Use local menu data instead of API call
    const menus = [];

    return {
      props: {
        posts,
        pagination,
        categories,
        metadata,
        menus
      },
      // Increase revalidation period for better performance
      revalidate: 3600 // Revalidate every hour
    };
  } catch (error) {
    console.error('Error in getStaticProps', error);
    return {
      props: {
        posts: [],
        pagination: { 
          currentPage: 1, 
          pagesCount: 1,
          postsCount: 0,
          postsPerPage: 20
        },
        categories: [],
        metadata: { 
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع مدارات الكون'
        },
        menus: []
      },
      // Even with errors, revalidate after a shorter period
      revalidate: 300 // Try again in 5 minutes if there was an error
    };
  }
} 