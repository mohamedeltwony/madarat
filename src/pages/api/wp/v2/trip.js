import { fetchAPI } from '@/lib/rest-api';

// Fallback data for when the WordPress API is down
const fallbackTrips = [
  {
    id: 1,
    title: { rendered: 'رحلة تركيا المميزة' },
    slug: 'turkey-special',
    featured_image: {
      full: { source_url: '/images/destinations/turkey.jpg' }
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
      full: { source_url: '/images/destinations/georgia.jpg' }
    },
    price: 3499,
    currency: { code: 'SAR' },
    duration: { days: 8, nights: 7 },
    destination: { name: 'جورجيا' }
  },
  {
    id: 3,
    title: { rendered: 'أذربيجان الرائعة' },
    slug: 'azerbaijan-trip',
    featured_image: {
      full: { source_url: '/images/destinations/azerbaijan.jpg' }
    },
    price: 2799,
    currency: { code: 'SAR' },
    duration: { days: 6, nights: 5 },
    destination: { name: 'أذربيجان' }
  },
  {
    id: 4,
    title: { rendered: 'البوسنة الساحرة' },
    slug: 'bosnia-trip',
    featured_image: {
      full: { source_url: '/images/destinations/bosnia.jpg' }
    },
    price: 3899,
    currency: { code: 'SAR' },
    duration: { days: 9, nights: 8 },
    destination: { name: 'البوسنة' }
  }
];

/**
 * API route handler for /api/wp/v2/trip
 * This proxies requests to the WordPress API and handles errors gracefully
 */
export default async function handler(req, res) {
  // Set CORS headers to allow requests from all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get query parameters from the request
    const { trip_tag, per_page, orderby, order, page, slug } = req.query;

    // Prepare params object for fetchAPI
    const params = {};
    if (trip_tag) params.trip_tag = trip_tag;
    if (per_page) params.per_page = per_page;
    if (orderby) params.orderby = orderby;
    if (order) params.order = order;
    if (page) params.page = page;
    if (slug) params.slug = slug;
    
    // Add _embed to get featured images
    params._embed = true;

    // Use fetchAPI from lib/rest-api with improved error handling and caching
    const data = await fetchAPI('/wp/v2/trip', params, {
      useCache: true,
      ttl: 3600000, // 1 hour cache
    });

    // If we got data from the API, return it
    if (data && Array.isArray(data) && data.length > 0) {
      return res.status(200).json(data);
    }
    
    // If no data, use fallback data filtered by any parameters
    console.log('No trips found in API response, using fallback data');
    let filtered = [...fallbackTrips];
    
    // Filter by tag if needed
    if (trip_tag) {
      // Since fallback doesn't have true tags, we'll just limit the number
      // This is just mock behavior - in real API this would filter properly
      filtered = filtered.slice(0, Math.min(filtered.length, parseInt(per_page || '4')));
    }
    
    // Return filtered fallback data
    return res.status(200).json(filtered);
  } catch (error) {
    console.error('Error in trip API route:', error);
    
    // Return fallback data on any error
    return res.status(200).json(fallbackTrips);
  }
} 