// Define API URL constant
const API_URL = 'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2';

import { updateUserAvatar } from '@/lib/users';
import { sortObjectsByDate } from '@/lib/datetime';

/**
 * postPathBySlug
 */

export function postPathBySlug(slug) {
  return `/posts/${slug}`;
}

/**
 * getPostBySlug
 */

export async function getPostBySlug(slug) {
  try {
    const response = await fetch(`${API_URL}/posts?slug=${slug}&_embed=1`);

    if (!response.ok) {
      throw new Error(`Failed to fetch post: ${response.status}`);
    }

    const posts = await response.json();

    // The API returns an array, but we only want the first matching post
    const post = posts.length > 0 ? posts[0] : null;

    if (!post) {
      return { post: null };
    }

    // Format the post data
    return {
      post: {
        id: post.id,
        title: post.title.rendered,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered,
        date: post.date,
        modified: post.modified,
        slug: post.slug,
        featuredImage: post.featured_media
          ? {
              sourceUrl:
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
              altText:
                post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
            }
          : null,
        categories:
          post._embedded?.['wp:term']?.[0]?.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
          })) || [],
        author: post._embedded?.['author']?.[0]
          ? {
              id: post._embedded['author'][0].id,
              name: post._embedded['author'][0].name,
              slug: post._embedded['author'][0].slug,
              avatar: {
                url: post._embedded['author'][0].avatar_urls?.[96] || '',
              },
            }
          : null,
        og: {
          title: post.yoast_head_json?.og_title || post.title.rendered,
          description:
            post.yoast_head_json?.og_description || post.excerpt.rendered,
          image: post.yoast_head_json?.og_image?.[0]?.url || '',
        },
      },
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return { post: null };
  }
}

/**
 * getAllPosts
 */

export async function getAllPosts(options = {}) {
  try {
    const response = await fetch(`${API_URL}/posts?per_page=100&_embed`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
      },
    });

    if (!response.ok) {
      console.error(`[getAllPosts] HTTP error ${response.status}`);
      return { posts: [] };
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      databaseId: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
            avatar: {
              url: post._embedded.author[0].avatar_urls?.[96] || '',
            },
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          databaseId: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
      isSticky: post.sticky,
    }));

    return { posts };
  } catch (error) {
    console.error('[getAllPosts] Error:', error);
    return { posts: [] };
  }
}

/**
 * getPostsByAuthorSlug
 */

export async function getPostsByAuthorSlug({ slug, ...options }) {
  try {
    const response = await fetch(
      `${API_URL}/posts?author_name=${slug}&per_page=100&_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      console.error(`[getPostsByAuthorSlug] HTTP error ${response.status}`);
      return { posts: [] };
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      databaseId: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
            avatar: {
              url: post._embedded.author[0].avatar_urls?.[96] || '',
            },
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          databaseId: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
      isSticky: post.sticky,
    }));

    return { posts };
  } catch (error) {
    console.error(
      `[getPostsByAuthorSlug] Failed to query post data: ${error.message}`
    );
    return { posts: [] };
  }
}

/**
 * getPostsByCategoryId
 */

export async function getPostsByCategoryId({ categoryId, ...options }) {
  try {
    const response = await fetch(
      `${API_URL}/posts?categories=${categoryId}&per_page=100&_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      console.error(`[getPostsByCategoryId] HTTP error ${response.status}`);
      return { posts: [] };
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      databaseId: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
            avatar: {
              url: post._embedded.author[0].avatar_urls?.[96] || '',
            },
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          databaseId: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
      isSticky: post.sticky,
    }));

    return { posts };
  } catch (error) {
    console.error(
      `[getPostsByCategoryId] Failed to query post data: ${error.message}`
    );
    console.error(`[getRecentPosts] Error:`, error);
    return { posts: [] };
  }
}

/**
 * sanitizeExcerpt
 */

export function sanitizeExcerpt(excerpt) {
  if (typeof excerpt !== 'string') {
    throw new Error(
      `Failed to sanitize excerpt: invalid type ${typeof excerpt}`
    );
  }

  let sanitized = excerpt;

  // If the theme includes [...] as the more indication, clean it up to just ...

  sanitized = sanitized.replace(/\s?\[&hellip;\]/, '&hellip;');

  // If after the above replacement, the ellipsis includes 4 dots, it's
  // the end of a setence

  sanitized = sanitized.replace('....', '.');
  sanitized = sanitized.replace('.&hellip;', '.');

  // If the theme is including a "Continue..." link, remove it

  sanitized = sanitized.replace(/\w*<a class="more-link".*<\/a>/, '');

  return sanitized;
}

/**
 * mapPostData
 */

export function mapPostData(post = {}) {
  const data = { ...post };

  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node

  if (data.author) {
    data.author = {
      ...data.author.node,
    };
  }

  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  if (data.author?.avatar) {
    data.author.avatar = updateUserAvatar(data.author.avatar);
  }

  // Clean up the categories to make them more easy to access

  if (data.categories) {
    data.categories = data.categories.edges.map(({ node }) => {
      return {
        ...node,
      };
    });
  }

  // Clean up the featured image to make them more easy to access

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  return data;
}

/**
 * getRelatedPosts
 */

export async function getRelatedPosts(categories, postId, count = 3) {
  if (!categories || categories.length === 0) {
    return { posts: [] };
  }

  try {
    // Use the first category for related posts
    const mainCategory = categories[0];

    const url = `${API_URL}/posts?categories=${mainCategory.id}&exclude=${postId}&per_page=${count}&_embed=1`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch related posts: ${response.status}`);
    }

    const postsData = await response.json();

    // Format the posts data
    const posts = postsData.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      date: post.date,
      slug: post.slug,
      featuredImage: post.featured_media
        ? {
            sourceUrl:
              post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
          }
        : null,
    }));

    return {
      category: mainCategory,
      posts,
    };
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return { posts: [] };
  }
}

/**
 * sortStickyPosts
 */

export function sortStickyPosts(posts) {
  return [...posts].sort((post) => (post.isSticky ? -1 : 1));
}

/**
 * getPostsPerPage
 */

export async function getPostsPerPage() {
  //If POST_PER_PAGE is defined at next.config.js
  if (process.env.POSTS_PER_PAGE) {
    console.warn(
      'You are using the deprecated POST_PER_PAGE variable. Use your WordPress instance instead to set this value ("Settings" > "Reading" > "Blog pages show at most").'
    );
    return Number(process.env.POSTS_PER_PAGE);
  }

  // Return default value since /settings endpoint requires authentication
  // WordPress default is typically 10 posts per page
  return 10;
}

/**
 * getPageCount
 */

export async function getPagesCount(posts, postsPerPage) {
  const _postsPerPage = postsPerPage ?? (await getPostsPerPage());
  return Math.ceil(posts.length / _postsPerPage);
}

/**
 * getPaginatedPosts
 */

export async function getPaginatedPosts({ currentPage = 1, ...options } = {}) {
  const { posts } = await getAllPosts(options);
  const postsPerPage = await getPostsPerPage();
  const pagesCount = await getPagesCount(posts, postsPerPage);

  let page = Number(currentPage);

  if (typeof page === 'undefined' || isNaN(page)) {
    page = 1;
  } else if (page > pagesCount) {
    return {
      posts: [],
      pagination: {
        currentPage: undefined,
        pagesCount,
      },
    };
  }

  const offset = postsPerPage * (page - 1);
  const sortedPosts = sortStickyPosts(posts);
  return {
    posts: sortedPosts.slice(offset, offset + postsPerPage),
    pagination: {
      currentPage: page,
      pagesCount,
    },
  };
}

/**
 * getDraftPosts
 */
export async function getDraftPosts(options = {}) {
  try {
    // Note: WordPress REST API typically requires proper authentication
    // to access draft posts, which is challenging from a client-side app.
    // This is a limited implementation, and in a production environment,
    // you would likely need to use a server-side proxy or authentication.

    const response = await fetch(
      `${API_URL}/posts?status=draft&per_page=100&_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch draft posts: ${response.status}`);
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      databaseId: post.id,
      title: post.title.rendered || 'Untitled Draft',
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
    }));

    return { posts };
  } catch (error) {
    console.error(
      `[getDraftPosts] Failed to query draft posts data: ${error.message}`
    );
    return { posts: [] };
  }
}

/**
 * getPostsByYear
 */
export async function getPostsByYear({ year } = {}) {
  try {
    const response = await fetch(
      `${API_URL}/posts?after=${year}-01-01T00:00:00&before=${parseInt(year) + 1}-01-01T00:00:00&per_page=100&_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      console.error(`[getPostsByYear] HTTP error ${response.status}`);
      return { posts: [] };
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      content: post.content.rendered,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
            avatar: {
              url: post._embedded.author[0].avatar_urls?.[96] || '',
            },
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
    }));

    return { posts };
  } catch (error) {
    console.error(
      `[getPostsByYear] Error fetching posts for year ${year}:`,
      error
    );
    return { posts: [] };
  }
}

/**
 * getPostsByMonth
 */
export async function getPostsByMonth({ year, month }) {
  try {
    // Construct a date range for the month
    const startDate = `${year}-${month.padStart(2, '0')}-01T00:00:00`;
    const lastDay = new Date(year, month, 0).getDate(); // Get last day of month
    const endDate = `${year}-${month.padStart(2, '0')}-${lastDay}T23:59:59`;

    const response = await fetch(
      `${API_URL}/posts?after=${startDate}&before=${endDate}&per_page=100&_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      console.error(`[getPostsByMonth] HTTP error ${response.status}`);
      return { posts: [] };
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      databaseId: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
            avatar: {
              url: post._embedded.author[0].avatar_urls?.[96] || '',
            },
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          databaseId: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
    }));

    return { posts };
  } catch (error) {
    console.error(
      `[getPostsByMonth] Error fetching posts for ${year}/${month}:`,
      error
    );
    return { posts: [] };
  }
}

/**
 * getPostsByDay
 */
export async function getPostsByDay({ year, month, day }) {
  try {
    // Format dates for API query
    const startDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T00:00:00`;
    const endDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59:59`;

    const response = await fetch(
      `${API_URL}/posts?after=${startDate}&before=${endDate}&per_page=100&_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      console.error(`[getPostsByDay] HTTP error ${response.status}`);
      return { posts: [] };
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      databaseId: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
            avatar: {
              url: post._embedded.author[0].avatar_urls?.[96] || '',
            },
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          databaseId: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
    }));

    return { posts };
  } catch (error) {
    console.error(
      `[getPostsByDay] Error fetching posts for ${year}/${month}/${day}:`,
      error
    );
    return { posts: [] };
  }
}

/**
 * getPostBySlugREST
 */
export async function getPostBySlugREST(slug) {
  try {
    const response = await fetch(`${API_URL}/posts?slug=${slug}&_embed=1`);

    if (!response.ok) {
      console.error(`[getPostBySlugREST] HTTP error ${response.status}`);
      return { post: null };
    }

    const posts = await response.json();

    // The API returns an array, but we only want the first matching post
    const post = posts.length > 0 ? posts[0] : null;

    if (!post) {
      return { post: null };
    }

    // Format the post data
    return {
      post: {
        id: post.id,
        title: post.title.rendered,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered,
        date: post.date,
        modified: post.modified,
        slug: post.slug,
        featuredImage: post.featured_media
          ? {
              sourceUrl:
                post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '',
              altText:
                post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || '',
            }
          : null,
        categories:
          post._embedded?.['wp:term']?.[0]?.map((category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
          })) || [],
        author: post._embedded?.['author']?.[0]
          ? {
              id: post._embedded['author'][0].id,
              name: post._embedded['author'][0].name,
              slug: post._embedded['author'][0].slug,
              avatar: {
                url: post._embedded['author'][0].avatar_urls?.[96] || '',
              },
            }
          : null,
        og: {
          title: post.yoast_head_json?.og_title || post.title.rendered,
          description:
            post.yoast_head_json?.og_description || post.excerpt.rendered,
          image: post.yoast_head_json?.og_image?.[0]?.url || '',
        },
      },
    };
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return { post: null };
  }
}

/**
 * getPostsAndPagination
 */
export async function getPostsAndPagination({
  page = 1,
  perPage = 20,
  categoryId = null,
  authorSlug = null,
} = {}) {
  try {
    // Build query parameters
    let queryParams = `per_page=${perPage}&page=${page}&_embed=true`;

    // Add category filter if provided
    if (categoryId) {
      queryParams += `&categories=${categoryId}`;
    }

    // Add author filter if provided
    if (authorSlug) {
      // First get the author ID from the slug
      let authorId = null;
      try {
        const authorsResponse = await fetch(
          `${API_URL}/users?slug=${authorSlug}`,
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
            authorId = authorsData[0].id;
          }
        }
      } catch (error) {
        console.error('[getPostsAndPagination] Error fetching author:', error);
      }

      // Add author filter if we found an ID
      if (authorId) {
        queryParams += `&author=${authorId}`;
      }
    }

    // Fetch posts with the built query
    const response = await fetch(`${API_URL}/posts?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
      },
    });

    if (!response.ok) {
      console.error(`[getPostsAndPagination] HTTP error ${response.status}`);
      return { posts: [], pagination: { currentPage: 1, pagesCount: 1 } };
    }

    // Extract pagination info from headers
    const totalPosts = parseInt(response.headers.get('x-wp-total') || '0');
    const totalPages = parseInt(response.headers.get('x-wp-totalpages') || '1');

    // Get the posts data
    const data = await response.json();

    // Map the response to the expected format
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

    return {
      posts,
      pagination: {
        currentPage: page,
        pagesCount: totalPages,
        postsCount: totalPosts,
        postsPerPage: perPage,
      },
    };
  } catch (error) {
    console.error('[getPostsAndPagination] Error:', error);
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        pagesCount: 1,
        postsCount: 0,
        postsPerPage: perPage,
      },
    };
  }
}

/**
 * getRecentPosts - compatibility implementation
 */
export async function getRecentPosts({ count = 5 } = {}) {
  try {
    const { posts } = await getAllPosts();
    const recentPosts = posts
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, count);

    return { posts: recentPosts };
  } catch (error) {
    console.error('[getRecentPosts] Error:', error);
    return { posts: [] };
  }
}

/**
 * Get all posts for generating static paths
 * @param {number} count - Number of posts to fetch
 * @returns {Promise<Array>} - Array of post slugs
 */
export async function getAllPostSlugs(count = 100) {
  try {
    const response = await fetch(
      `${API_URL}/posts?per_page=${count}&_fields=slug`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch post slugs: ${response.status}`);
    }

    const posts = await response.json();

    return posts.map((post) => ({
      params: {
        slug: post.slug,
      },
    }));
  } catch (error) {
    console.error('Error fetching all post slugs:', error);
    return [];
  }
}

/**
 * Get year archives data - STUB
 */
export async function getYearArchives() {
  // Return empty years array
  return { years: [] };
}
