/**
 * WordPress REST API utility functions
 * These functions replace the GraphQL functions with REST API equivalents
 */

const API_URL = 'https://madaratalkon.com/wp-json';

/**
 * Fetches data from WordPress REST API
 * @param {string} endpoint - The REST API endpoint
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - The API response
 */
export async function fetchAPI(endpoint, params = {}) {
  const queryParams = new URLSearchParams(params).toString();
  const url = `${API_URL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
      },
    });

    if (!response.ok) {
      throw new Error(`REST API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[REST API] Error fetching from ${url}:`, error);
    throw error;
  }
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
      description: data.description || 'موقع السفر والرحلات الأول في الوطن العربي',
      language: 'ar',
      social: {
        facebook: 'https://facebook.com/madaratalkon',
        instagram: 'https://instagram.com/madaratalkon',
        twitter: 'https://twitter.com/madaratalkon',
        youtube: 'https://youtube.com/madaratalkon'
      }
    };
  } catch (error) {
    console.error('[getSiteMetadataREST] Error:', error);
    
    // Return default values if API fails
    return {
      title: 'مدارات الكون',
      siteTitle: 'مدارات الكون',
      description: 'موقع السفر والرحلات الأول في الوطن العربي',
      language: 'ar',
      social: {
        facebook: 'https://facebook.com/madaratalkon',
        instagram: 'https://instagram.com/madaratalkon'
      }
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
      _embed: true
    });
    
    const posts = data.map(post => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      content: post.content.rendered,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0] ? {
        name: post._embedded.author[0].name,
        slug: post._embedded.author[0].slug
      } : null,
      categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0] ? {
        sourceUrl: post._embedded['wp:featuredmedia'][0].source_url
      } : null,
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
      _embed: true
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
        author: post._embedded?.author?.[0] ? {
          name: post._embedded.author[0].name,
          slug: post._embedded.author[0].slug
        } : null,
        categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug
        })) || [],
        featuredImage: post._embedded?.['wp:featuredmedia']?.[0] ? {
          sourceUrl: post._embedded['wp:featuredmedia'][0].source_url
        } : null,
      }
    };
  } catch (error) {
    console.error(`[getPostBySlugREST] Error fetching post with slug ${slug}:`, error);
    return { post: undefined };
  }
}

/**
 * Gets all categories
 */
export async function getCategoriesREST() {
  try {
    const data = await fetchAPI('/wp/v2/categories', { per_page: 100 });
    
    const categories = data.map(category => ({
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
      _embed: true 
    });
    
    const posts = data.map(post => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      modified: post.modified,
      content: post.content.rendered,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0] ? {
        name: post._embedded.author[0].name,
        slug: post._embedded.author[0].slug
      } : null,
      categories: post._embedded?.['wp:term']?.[0]?.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0] ? {
        sourceUrl: post._embedded['wp:featuredmedia'][0].source_url
      } : null,
    }));
    
    return { posts };
  } catch (error) {
    console.error(`[getPostsByCategoryREST] Error fetching posts for category ${categoryId}:`, error);
    return { posts: [] };
  }
}

/**
 * Gets all trips
 */
export async function getTripsREST() {
  try {
    const data = await fetchAPI('/wp/v2/trip', { 
      per_page: 100,
      _embed: true 
    });
    
    const trips = data.map(trip => {
      // Safely extract featuredImage - ensure it's never undefined
      let featuredImage = null;
      if (trip._embedded?.['wp:featuredmedia']?.[0]) {
        const mediaItem = trip._embedded['wp:featuredmedia'][0];
        featuredImage = {
          sourceUrl: mediaItem.source_url || null,
          mediaDetails: {
            sizes: [
              {
                sourceUrl: mediaItem.source_url || null,
                width: mediaItem.media_details?.width || 800,
                height: mediaItem.media_details?.height || 600
              }
            ]
          }
        };
      }
      
      return {
        id: trip.id,
        title: trip.title.rendered || '',
        slug: trip.slug || '',
        excerpt: trip.excerpt?.rendered || '',
        content: trip.content.rendered || '',
        featuredImage: featuredImage,
        tripSettings: {
          duration: trip.acf?.duration || { days: null, nights: null, durationType: null },
          price: trip.acf?.price || { amount: null, currency: null }
        }
      };
    });

    return { trips };
  } catch (error) {
    console.error('[getTripsREST] Error:', error);
    return { trips: [] };
  }
}
