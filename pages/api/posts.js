/**
 * API route to fetch posts with optional filtering
 */
export default async function handler(req, res) {
  const { method, query } = req;

  if (method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Extract filters from query
  const { category, slug, authorSlug, page = '1', search } = query;

  try {
    // Build API URL with appropriate parameters
    let apiUrl = 'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/posts?_embed=true';

    // Add pagination
    apiUrl += `&per_page=20&page=${page}`;

    // Add category filter if provided
    if (category) {
      apiUrl += `&categories=${category}`;
    }

    // Add author filter if provided
    if (authorSlug) {
      // First get the author ID from the slug
      const authorsResponse = await fetch(
        `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/users?slug=${authorSlug}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent':
              'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
          },
        }
      );

      if (authorsResponse.ok) {
        const authorsData = await authorsResponse.json();
        if (authorsData.length > 0) {
          apiUrl += `&author=${authorsData[0].id}`;
        }
      }
    }

    // Add search query if provided
    if (search) {
      apiUrl += `&search=${encodeURIComponent(search)}`;
    }

    // Add slug filter if provided
    if (slug) {
      apiUrl += `&slug=${slug}`;
    }

    // Fetch posts
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    // Get pagination info from headers
    const totalPosts = parseInt(response.headers.get('x-wp-total') || '0');
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');

    // Parse JSON response
    const data = await response.json();

    // Map posts to the expected format
    const posts = data.map((post) => ({
      id: post.id,
      databaseId: post.id,
      title: post.title.rendered || '',
      slug: post.slug || '',
      date: post.date || '',
      modified: post.modified || '',
      excerpt: post.excerpt?.rendered || '',
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name || '',
            slug: post._embedded.author[0].slug || '',
            avatar: {
              url: post._embedded.author[0].avatar_urls?.[96] || '',
            },
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          databaseId: cat.id,
          name: cat.name || '',
          slug: cat.slug || '',
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url || null,
          }
        : null,
    }));

    // Return formatted response
    return res.status(200).json({
      posts,
      pagination: {
        currentPage: parseInt(page),
        pagesCount: totalPages,
        postsCount: totalPosts,
      },
    });
  } catch (error) {
    console.error('API route error:', error);
    return res
      .status(500)
      .json({ message: error.message || 'An error occurred fetching posts' });
  }
}
