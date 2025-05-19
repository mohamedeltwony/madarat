import { fetchAPI } from '@/lib/rest-api';

// Fallback destinations data when API fails
const fallbackDestinations = [
  {
    id: 1,
    name: 'تركيا',
    slug: 'turkey',
    description: 'اكتشف جمال تركيا مع رحلات مميزة',
    thumbnail: {
      source_url: '/images/destinations/turkey.jpg',
      sizes: {
        full: {
          source_url: '/images/destinations/turkey.jpg'
        },
        'destination-thumb-size': {
          source_url: '/images/destinations/turkey.jpg'
        }
      }
    },
    count: 12
  },
  {
    id: 2,
    name: 'جورجيا',
    slug: 'georgia',
    description: 'رحلات رائعة إلى جورجيا',
    thumbnail: {
      source_url: '/images/destinations/georgia.jpg',
      sizes: {
        full: {
          source_url: '/images/destinations/georgia.jpg'
        },
        'destination-thumb-size': {
          source_url: '/images/destinations/georgia.jpg'
        }
      }
    },
    count: 8
  },
  {
    id: 3,
    name: 'أذربيجان',
    slug: 'azerbaijan',
    description: 'استمتع بجمال أذربيجان',
    thumbnail: {
      source_url: '/images/destinations/azerbaijan.jpg',
      sizes: {
        full: {
          source_url: '/images/destinations/azerbaijan.jpg'
        },
        'destination-thumb-size': {
          source_url: '/images/destinations/azerbaijan.jpg'
        }
      }
    },
    count: 6
  },
  {
    id: 4,
    name: 'إيطاليا',
    slug: 'italy',
    description: 'رحلات مميزة إلى إيطاليا',
    thumbnail: {
      source_url: '/images/destinations/italy.jpg',
      sizes: {
        full: {
          source_url: '/images/destinations/italy.jpg'
        },
        'destination-thumb-size': {
          source_url: '/images/destinations/italy.jpg'
        }
      }
    },
    count: 5
  },
  {
    id: 5,
    name: 'البوسنة',
    slug: 'bosnia',
    description: 'استكشف جمال البوسنة الطبيعي',
    thumbnail: {
      source_url: '/images/destinations/bosnia.jpg',
      sizes: {
        full: {
          source_url: '/images/destinations/bosnia.jpg'
        },
        'destination-thumb-size': {
          source_url: '/images/destinations/bosnia.jpg'
        }
      }
    },
    count: 4
  },
  {
    id: 6,
    name: 'بولندا',
    slug: 'poland',
    description: 'رحلات إلى بولندا بأسعار مميزة',
    thumbnail: {
      source_url: '/images/destinations/poland.jpg',
      sizes: {
        full: {
          source_url: '/images/destinations/poland.jpg'
        },
        'destination-thumb-size': {
          source_url: '/images/destinations/poland.jpg'
        }
      }
    },
    count: 3
  }
];

/**
 * API route handler for /api/wp/v2/destination
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
    const { per_page, orderby, order, page, slug, _fields } = req.query;

    // Prepare params object for fetchAPI
    const params = {};
    if (per_page) params.per_page = per_page;
    if (orderby) params.orderby = orderby;
    if (order) params.order = order;
    if (page) params.page = page;
    if (slug) params.slug = slug;
    if (_fields) params._fields = _fields;
    
    // For _embed parameter
    if (req.query._embed) params._embed = true;

    // Use fetchAPI from lib/rest-api with improved error handling and caching
    const data = await fetchAPI('/wp/v2/destination', params, {
      useCache: true, 
      ttl: 3600000, // 1 hour cache
    });

    // If we got data from the API, return it
    if (data && Array.isArray(data) && data.length > 0) {
      return res.status(200).json(data);
    }
    
    // If requested specific fields, filter the fallback data
    if (_fields) {
      const fields = _fields.split(',');
      const filteredData = fallbackDestinations.map(dest => {
        const newObj = {};
        fields.forEach(field => {
          if (field === 'id') newObj.id = dest.id;
          if (field === 'name') newObj.name = dest.name;
          // Add other fields as needed
        });
        return newObj;
      });
      return res.status(200).json(filteredData);
    }
    
    // Return all fallback data
    return res.status(200).json(fallbackDestinations);
  } catch (error) {
    console.error('Error in destination API route:', error);
    
    // Return fallback data on any error
    return res.status(200).json(fallbackDestinations);
  }
} 