/**
 * WordPress REST API utility functions
 * These functions replace the GraphQL functions with REST API equivalents
 */

const API_URL = 'https://madaratalkon.com/wp-json';

// Check if we're building the site
const IS_BUILD = process.env.NODE_ENV === 'production' && typeof window === 'undefined';
// Flag to use demo data during build
const USE_DEMO_DATA = IS_BUILD || process.env.NEXT_PUBLIC_USE_DEMO_DATA === 'true';

// In-memory cache to reduce API calls
const CACHE = {
  data: {},
  timestamp: {},
  TTL: 10 * 60 * 1000, // 10 minutes default TTL
};

/**
 * Simple in-memory cache mechanism to reduce API calls
 */
function getFromCache(key) {
  const data = CACHE.data[key];
  const timestamp = CACHE.timestamp[key] || 0;
  const now = Date.now();

  // Return cached data if it's not expired
  if (data && now - timestamp < CACHE.TTL) {
    console.log(`[CACHE] Using cached data for ${key}`);
    return data;
  }

  return null;
}

function saveToCache(key, data) {
  CACHE.data[key] = data;
  CACHE.timestamp[key] = Date.now();
}

/**
 * Fetches data from WordPress REST API
 * @param {string} endpoint - The REST API endpoint
 * @param {Object} params - Query parameters
 * @param {Object} options - Additional options like useCache, ttl
 * @returns {Promise<Object>} - The API response
 */
export async function fetchAPI(endpoint, params = {}, options = {}) {
  const { useCache = true, ttl = CACHE.TTL } = options;
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_URL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;

  // Generate cache key based on URL
  const cacheKey = `api_${url}`;

  // Try to get from cache if enabled
  if (useCache) {
    const cachedData = getFromCache(cacheKey);
    if (cachedData) return cachedData;
  }
  
  // Use mock data during build to avoid API failures
  if (USE_DEMO_DATA) {
    console.log(`[BUILD] Using mock data for ${endpoint}`);
    return getMockData(endpoint, params);
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent':
          'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
      },
      // Increase timeout for fetch to 15 seconds (from 10s)
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });

    if (!response.ok) {
      throw new Error(
        `REST API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Extract pagination information from headers
    const totalItems = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    const totalPages = parseInt(
      response.headers.get('X-WP-TotalPages') || '0',
      10
    );

    // Add pagination metadata to the response
    data._paging = {
      total: totalItems,
      totalPages: totalPages,
    };

    // Save to cache if caching is enabled
    if (useCache) {
      saveToCache(cacheKey, data);
    }

    return data;
  } catch (error) {
    console.error(`[REST API] Error fetching from ${url}:`, error);
    
    // Try to get stale data from cache even if expired
    if (useCache && CACHE.data[cacheKey]) {
      console.log(`[CACHE] Using stale cached data for ${url} due to fetch error`);
      return CACHE.data[cacheKey];
    }
    
    // Return mock data on any API failure
    return getMockData(endpoint, params);
  }
}

/**
 * Returns mock data for different endpoints during build or API failures
 */
function getMockData(endpoint, params = {}) {
  // Mock data for different endpoints
  if (endpoint === '') {
    // Site metadata
    return {
      name: 'مدارات الكون',
      description: 'موقع السفر والرحلات الأول في الوطن العربي',
    };
  }
  
  if (endpoint.includes('/wp/v2/posts')) {
    // Return empty array or mock post if slug is specified
    if (params.slug) {
      return [];
    }
    return [];
  }
  
  if (endpoint.includes('/wp/v2/categories')) {
    return [];
  }
  
  if (endpoint.includes('/wp/v2/trip')) {
    // Mock trip data
    return [
      {
        id: 1,
        title: { rendered: 'رحلة تركيا المميزة' },
        slug: 'turkey-special',
        featured_image: {
          full: { source_url: '/images/placeholder.jpg' }
        },
        price: 2999,
        currency: { code: 'SAR' },
        duration: { days: 7, nights: 6 },
        destination: { name: 'تركيا' }
      },
      {
        id: 2,
        title: { rendered: 'جورجيا السياحية' },
        slug: 'georgia-tour',
        featured_image: {
          full: { source_url: '/images/placeholder.jpg' }
        },
        price: 3499,
        currency: { code: 'SAR' },
        duration: { days: 8, nights: 7 },
        destination: { name: 'جورجيا' }
      }
    ];
  }
  
  if (endpoint.includes('/wp/v2/destination')) {
    // Mock destination data with proper image URLs
    return [
      {
        id: 1,
        name: 'تركيا',
        slug: 'turkey',
        description: 'اكتشف جمال تركيا مع رحلات مميزة',
        thumbnail: {
          source_url: '/images/destinations/turkey.jpg'
        },
        count: 12
      },
      {
        id: 2,
        name: 'جورجيا',
        slug: 'georgia',
        description: 'رحلات رائعة إلى جورجيا',
        thumbnail: {
          source_url: '/images/destinations/georgia.jpg'
        },
        count: 8
      },
      {
        id: 3,
        name: 'أذربيجان',
        slug: 'azerbaijan',
        description: 'استمتع بجمال أذربيجان',
        thumbnail: {
          source_url: '/images/destinations/azerbaijan.jpg'
        },
        count: 6
      }
    ];
  }
  
  if (endpoint.includes('/wp-api-menus/v2/menus')) {
    return [];
  }
  
  if (endpoint.includes('/archives')) {
    return { years: [] };
  }
  
  // Default empty response
  return Array.isArray(params) ? [] : {};
}

/**
 * Gets the site metadata
 */
export async function getSiteMetadataREST() {
  try {
    const data = await fetchAPI('');

    return {
      title: data.name || 'مدارات الكون',
      siteTitle: data.name || 'مدارات الكون',
      description:
        data.description || 'موقع السفر والرحلات الأول في الوطن العربي',
      language: 'ar',
      social: {
        facebook: 'https://facebook.com/madaratalkon',
        instagram: 'https://instagram.com/madaratalkon',
        twitter: 'https://twitter.com/madaratalkon',
        youtube: 'https://youtube.com/madaratalkon',
      },
    };
  } catch (error) {
    console.error('[getSiteMetadataREST] Error:', error);

    // Return default values if API fails - using local site data
    return {
      title: 'مدارات الكون',
      siteTitle: 'مدارات الكون',
      description: 'موقع السفر والرحلات الأول في الوطن العربي',
      language: 'ar',
      social: {
        facebook: 'https://facebook.com/madaratalkon',
        instagram: 'https://instagram.com/madaratalkon',
      },
    };
  }
}

/**
 * Gets all posts
 */
export async function getAllPostsREST() {
  try {
    const data = await fetchAPI('/wp/v2/posts', {
      per_page: 100,
      _embed: true,
    });

    const posts = data.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      content: post.content.rendered,
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
    console.error('[getAllPostsREST] Error:', error);
    return { posts: [] };
  }
}

/**
 * Gets post by slug
 */
export async function getPostBySlugREST(slug) {
  try {
    const posts = await fetchAPI('/wp/v2/posts', {
      slug,
      _embed: true,
    });

    if (!posts.length) {
      return { post: undefined };
    }

    const post = posts[0];

    return {
      post: {
        id: post.id,
        title: post.title.rendered,
        slug: post.slug,
        date: post.date,
        modified: post.modified,
        content: post.content.rendered,
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
      },
    };
  } catch (error) {
    console.error(
      `[getPostBySlugREST] Error fetching post with slug ${slug}:`,
      error
    );
    return { post: undefined };
  }
}

/**
 * Gets all categories
 */
export async function getCategoriesREST() {
  try {
    const data = await fetchAPI('/wp/v2/categories', { per_page: 100 });

    const categories = data.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      count: category.count,
      description: category.description,
    }));

    return { categories };
  } catch (error) {
    console.error('[getCategoriesREST] Error:', error);
    return { categories: [] };
  }
}

/**
 * Gets posts by category
 */
export async function getPostsByCategoryREST(categoryId) {
  try {
    const data = await fetchAPI('/wp/v2/posts', {
      categories: categoryId,
      per_page: 100,
      _embed: true,
    });

    const posts = data.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      content: post.content.rendered,
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
      `[getPostsByCategoryREST] Error fetching posts for category ${categoryId}:`,
      error
    );
    return { posts: [] };
  }
}

/**
 * Gets all trips
 * @param {Object} options - Pagination options
 * @param {number} options.page - Page number (default: 1)
 * @param {number} options.perPage - Items per page (default: 20)
 * @returns {Promise<Object>} - Trips data with pagination info
 */
export async function getTripsREST(options = {}) {
  const { page = 1, perPage = 20 } = options;

  try {
    // Fetch trips with pagination info in the headers
    const data = await fetchAPI('/wp/v2/trip', {
      page,
      per_page: perPage,
      _embed: true,
    });

    // Extract pagination data
    const totalTrips = data._paging?.total || 0;
    const totalPages = data._paging?.totalPages || 1;

    // Log data for debugging
    console.log(
      `[getTripsREST] Fetched ${data.length} trips, total ${totalTrips} in ${totalPages} pages`
    );

    // Safely transform the trips data
    const trips = Array.isArray(data)
      ? data.map((trip) => {
          // Debug each trip for troubleshooting
          console.log(
            `[getTripsREST] Processing trip: ${trip.id} - ${trip.title?.rendered || 'No title'}`
          );

          // Safely extract featuredImage - ensure it's never undefined
          let featuredImage = null;
          if (trip._embedded?.['wp:featuredmedia']?.[0]) {
            const mediaItem = trip._embedded['wp:featuredmedia'][0];
            featuredImage = {
              sourceUrl: mediaItem.source_url || '/images/placeholder.jpg',
              mediaDetails: {
                sizes: [
                  {
                    sourceUrl:
                      mediaItem.source_url || '/images/placeholder.jpg',
                    width: mediaItem.media_details?.width || 800,
                    height: mediaItem.media_details?.height || 600,
                  },
                ],
              },
            };
          }

          // Extract and format trip data
          return {
            id: trip.id,
            title: trip.title?.rendered || 'رحلة بدون عنوان',
            slug: trip.slug || `trip-${trip.id}`,
            excerpt: trip.excerpt?.rendered || '',
            content: trip.content?.rendered || '',
            featuredImage: featuredImage,
            tripSettings: {
              duration: {
                days: trip.acf?.duration?.days || trip.duration?.days || 0,
                nights:
                  trip.acf?.duration?.nights || trip.duration?.nights || 0,
                durationType: trip.acf?.duration?.durationType || null,
              },
              price: {
                amount: trip.acf?.price?.amount || trip.price || 0,
                currency:
                  trip.acf?.price?.currency || trip.currency?.code || 'SAR',
              },
            },
          };
        })
      : [];

    return {
      trips,
      pagination: {
        total: totalTrips,
        totalPages: totalPages,
        currentPage: page,
        perPage,
      },
    };
  } catch (error) {
    console.error('[getTripsREST] Error:', error);
    return {
      trips: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        perPage,
      },
    };
  }
}

/**
 * Gets all pages (stub implementation for compatibility)
 */
export async function getAllPagesREST() {
  console.warn(
    '[getAllPagesREST] This function is deprecated and returns dummy data.'
  );
  return { pages: [] };
}

/**
 * Gets page by URI (stub implementation for compatibility)
 */
export async function getPageByUriREST() {
  console.warn(
    '[getPageByUriREST] This function is deprecated and returns dummy data.'
  );
  return { page: null };
}

/**
 * Gets all menus (stub implementation for compatibility)
 */
export async function getAllMenusREST() {
  console.warn(
    '[getAllMenusREST] This function is deprecated and returns dummy data.'
  );
  return { menus: [] };
}
