/**
 * WordPress API utility functions for fetching data from WordPress REST API
 */

// Base WordPress API URL
const WP_API_URL = 'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2';

/**
 * Fetches destinations from WordPress API
 * @param {Object} options - Fetch options
 * @param {number} options.perPage - Number of destinations per page
 * @param {number} options.page - Page number
 * @returns {Promise<Array>} - Array of destinations
 */
export async function fetchDestinations({ perPage = 100, page = 1 } = {}) {
  try {
    const response = await fetch(
      `${WP_API_URL}/destination?per_page=${perPage}&page=${page}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch destinations: ${response.status}`);
    }

    const destinations = await response.json();
    
    // Format destinations for frontend use
    return destinations.map((dest) => ({
      id: dest.id,
      title: dest.name,
      description: dest.description || '',
      slug: dest.slug,
      count: dest.count || 0,
      // Try to get image from different possible fields
      image: dest.acf?.featured_image?.url || 
             (dest.yoast_head_json?.og_image && dest.yoast_head_json.og_image[0]?.url) ||
             '/images/placeholder.jpg',
    }));
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

/**
 * Fetches a single destination by slug
 * @param {string} slug - Destination slug
 * @returns {Promise<Object>} - Destination data
 */
export async function fetchDestinationBySlug(slug) {
  try {
    const response = await fetch(`${WP_API_URL}/destination?slug=${slug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch destination: ${response.status}`);
    }

    const destinations = await response.json();
    
    if (!destinations.length) {
      return null;
    }
    
    const dest = destinations[0];
    return {
      id: dest.id,
      title: dest.name,
      description: dest.description || '',
      slug: dest.slug,
      count: dest.count || 0,
      image: dest.acf?.featured_image?.url || 
             (dest.yoast_head_json?.og_image && dest.yoast_head_json.og_image[0]?.url) ||
             '/images/placeholder.jpg',
    };
  } catch (error) {
    console.error(`Error fetching destination by slug "${slug}":`, error);
    return null;
  }
}

/**
 * Fetches trips from WordPress API
 * @param {Object} options - Fetch options
 * @param {number} options.perPage - Number of trips per page
 * @param {number} options.page - Page number
 * @param {number} options.destinationId - Filter trips by destination ID
 * @param {number} options.tagId - Filter trips by tag ID
 * @returns {Promise<Array>} - Array of trips
 */
export async function fetchTrips({ perPage = 10, page = 1, destinationId, tagId } = {}) {
  try {
    let url = `${WP_API_URL}/trip?per_page=${perPage}&page=${page}`;
    
    // Add filters if provided
    if (destinationId) {
      url += `&destination=${destinationId}`;
    }
    
    if (tagId) {
      url += `&trip_tag=${tagId}`;
    }
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch trips: ${response.status}`);
    }

    const trips = await response.json();
    const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
    const total = parseInt(response.headers.get('X-WP-Total') || '0', 10);
    
    // Format trips for frontend use
    const formattedTrips = trips.map((trip) => ({
      id: trip.id,
      title: trip.title?.rendered || '',
      excerpt: trip.excerpt?.rendered || '',
      content: trip.content?.rendered || '',
      slug: trip.slug,
      date: trip.date,
      modified: trip.modified,
      // Try to get featured image URL from different possible fields
      featuredImage: trip.acf?.featured_image?.url || 
                    (trip.yoast_head_json?.og_image && trip.yoast_head_json.og_image[0]?.url) ||
                    '/images/placeholder.jpg',
      // Format trip details from ACF fields if available
      price: trip.acf?.price || null,
      duration: trip.acf?.duration || null,
      location: trip.acf?.location || null,
      // Get trip images if available
      images: trip.acf?.gallery?.map(img => img.url) || [],
      // Get permalink
      permalink: trip.link || `#`,
    }));
    
    return {
      trips: formattedTrips,
      pagination: {
        totalPages,
        total,
        currentPage: page,
      }
    };
  } catch (error) {
    console.error('Error fetching trips:', error);
    return {
      trips: [],
      pagination: {
        totalPages: 1,
        total: 0,
        currentPage: page,
      }
    };
  }
}

/**
 * Fetches a single trip by ID
 * @param {number} id - Trip ID
 * @returns {Promise<Object>} - Trip data
 */
export async function fetchTripById(id) {
  try {
    const response = await fetch(`${WP_API_URL}/trip/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch trip: ${response.status}`);
    }

    const trip = await response.json();
    
    return {
      id: trip.id,
      title: trip.title?.rendered || '',
      excerpt: trip.excerpt?.rendered || '',
      content: trip.content?.rendered || '',
      slug: trip.slug,
      date: trip.date,
      modified: trip.modified,
      featuredImage: trip.acf?.featured_image?.url || 
                    (trip.yoast_head_json?.og_image && trip.yoast_head_json.og_image[0]?.url) ||
                    '/images/placeholder.jpg',
      price: trip.acf?.price || null,
      duration: trip.acf?.duration || null,
      location: trip.acf?.location || null,
      images: trip.acf?.gallery?.map(img => img.url) || [],
      permalink: trip.link || `#`,
    };
  } catch (error) {
    console.error(`Error fetching trip by ID "${id}":`, error);
    return null;
  }
}

/**
 * Fetches trips by tag from WordPress API
 * @param {number} tagId - Tag ID to filter trips
 * @param {Object} options - Fetch options
 * @returns {Promise<Array>} - Array of trips
 */
export async function fetchTripsByTag(tagId, { perPage = 10, page = 1 } = {}) {
  return fetchTrips({ perPage, page, tagId });
}

/**
 * Fetches offered trips (trips with tag ID 154)
 * @param {Object} options - Fetch options
 * @returns {Promise<Array>} - Array of offer trips
 */
export async function fetchOfferTrips({ perPage = 10, page = 1 } = {}) {
  return fetchTripsByTag(154, { perPage, page });
}

/**
 * Fetches all trip tags from WordPress API
 * @returns {Promise<Array>} - Array of trip tags
 */
export async function fetchTripTags() {
  try {
    const response = await fetch(`${WP_API_URL}/trip_tag?per_page=100`);

    if (!response.ok) {
      throw new Error(`Failed to fetch trip tags: ${response.status}`);
    }

    const tags = await response.json();
    
    return tags.map((tag) => ({
      id: tag.id,
      name: tag.name,
      slug: tag.slug,
      count: tag.count || 0,
    }));
  } catch (error) {
    console.error('Error fetching trip tags:', error);
    return [];
  }
} 