import { fetchAPI } from '@/lib/rest-api';

// Fallback destinations data when API fails
const fallbackDestinations = [
  {
    id: 1,
    title: 'تركيا',
    slug: 'turkey',
    description: 'اكتشف جمال تركيا مع رحلات مميزة',
    image: '/images/destinations/turkey.jpg',
    tripCount: 12
  },
  {
    id: 2,
    title: 'جورجيا',
    slug: 'georgia',
    description: 'رحلات رائعة إلى جورجيا',
    image: '/images/destinations/georgia.jpg',
    tripCount: 8
  },
  {
    id: 3,
    title: 'أذربيجان',
    slug: 'azerbaijan',
    description: 'استمتع بجمال أذربيجان',
    image: '/images/destinations/azerbaijan.jpg',
    tripCount: 6
  },
  {
    id: 4,
    title: 'إيطاليا',
    slug: 'italy',
    description: 'رحلات مميزة إلى إيطاليا',
    image: '/images/destinations/italy.jpg',
    tripCount: 5
  },
  {
    id: 5,
    title: 'البوسنة',
    slug: 'bosnia',
    description: 'استكشف جمال البوسنة الطبيعي',
    image: '/images/destinations/bosnia.jpg',
    tripCount: 4
  },
  {
    id: 6,
    title: 'بولندا',
    slug: 'poland',
    description: 'رحلات إلى بولندا بأسعار مميزة',
    image: '/images/destinations/poland.jpg',
    tripCount: 3
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
    // Fetch destinations from WordPress API
    const destinationsResponse = await fetch(
      'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?per_page=100',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Madarat-Website/1.0',
        },
        timeout: 10000, // 10 second timeout
      }
    );

    if (!destinationsResponse.ok) {
      throw new Error(`WordPress API error: ${destinationsResponse.status}`);
    }

    const destinations = await destinationsResponse.json();

    // Format destinations data to match expected structure
    const formattedDestinations = destinations.map((dest) => {
      // Get the best image URL from thumbnail sizes
      let imageUrl = null;
      if (dest.thumbnail) {
        // If destination-thumb-size exists, use it
        if (dest.thumbnail.sizes && dest.thumbnail.sizes['destination-thumb-size']) {
          imageUrl = dest.thumbnail.sizes['destination-thumb-size'].source_url;
        } 
        // Fallback to full image
        else if (dest.thumbnail.sizes && dest.thumbnail.sizes.full) {
          imageUrl = dest.thumbnail.sizes.full.source_url;
        }
        // Final fallback if no sizes are available
        else if (dest.thumbnail.source_url) {
          imageUrl = dest.thumbnail.source_url;
        }
      }

      // Parse description from rendered HTML content
      let description = '';
      if (dest.description) {
        description = dest.description;
        // Remove HTML tags if needed
        description = description.replace(/<[^>]*>?/gm, '');
      }

      return {
        id: dest.id,
        title: dest.name || '',
        slug: dest.slug || '',
        description: description || `استكشف رحلاتنا المميزة إلى ${dest.name || 'هذه الوجهة الرائعة'}`,
        image: imageUrl,
        tripCount: dest.count || 0, // Use count field for trip count
      };
    });

    res.status(200).json(formattedDestinations);

  } catch (error) {
    console.error('Error fetching destinations:', error);
    
    // Return fallback data instead of error
    res.status(200).json(fallbackDestinations);
  }
} 