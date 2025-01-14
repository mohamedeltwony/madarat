import axios from 'axios';

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://app.madaratalkon.com/wp-json/wp/v2';
const DEFAULT_PLACEHOLDER = '/img/placeholder.jpg';

const api = axios.create({
  baseURL: WORDPRESS_API_URL,
});

export async function getTours(page = 1) {
  try {
    const response = await api.get(`/trip?page=${page}&per_page=10&_embed`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export async function getTourBySlug(slug) {
  try {
    const encodedSlug = encodeURIComponent(slug);
    console.log('=== Fetching tour data ===');
    console.log('API URL:', `${WORDPRESS_API_URL}/trip?slug=${encodedSlug}&_embed`);
    
    const response = await axios.get(`${WORDPRESS_API_URL}/trip?slug=${encodedSlug}&_embed`);
    console.log('API Response status:', response.status);
    console.log('API Response headers:', response.headers);
    
    if (response.data && response.data.length > 0) {
      const trip = response.data[0];
      
      // Log raw API response
      console.log('=== RAW WORDPRESS API RESPONSE ===');
      console.log('Trip data:', JSON.stringify(trip, null, 2));
      console.log('ACF fields:', trip.acf);
      console.log('Content rendered:', trip.content?.rendered);
      console.log('Itinerary field:', trip.itinerary);
      console.log('ACF itinerary:', trip.acf?.itinerary);
      console.log('ACF itinerary_content:', trip.acf?.itinerary_content);
      
      // Get the itinerary content
      let itineraryHtml = '';
      
      // First try to get itinerary from ACF field
      if (trip.acf?.itinerary_content) {
        console.log('Using ACF itinerary_content');
        itineraryHtml = trip.acf.itinerary_content;
      }
      // Then try ACF itinerary field
      else if (trip.acf?.itinerary) {
        console.log('Using ACF itinerary');
        itineraryHtml = trip.acf.itinerary;
      }
      // Then try itinerary field
      else if (trip.itinerary) {
        console.log('Using main itinerary field');
        itineraryHtml = typeof trip.itinerary === 'string' ? trip.itinerary : JSON.stringify(trip.itinerary);
      }
      // Finally try content field
      else if (trip.content?.rendered) {
        console.log('Using content.rendered field');
        itineraryHtml = trip.content.rendered;
      }
      
      // Log the final itinerary HTML
      console.log('=== FINAL ITINERARY HTML ===');
      console.log('Type:', typeof itineraryHtml);
      console.log('Length:', itineraryHtml.length);
      console.log('Content:', itineraryHtml);
      
      return {
        id: trip.id,
        title: trip.title?.rendered,
        content: trip.content?.rendered,
        description: trip.description || trip.content?.rendered,
        itinerary: itineraryHtml,
        inclusions: trip.cost_includes?.split('\n').filter(item => item.trim()) || [],
        exclusions: trip.cost_excludes?.split('\n').filter(item => item.trim()) || [],
        // Add featured image URL
        image: trip._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_PLACEHOLDER,
        // Add ACF fields
        price: parseFloat(trip.acf?.price) || 0,
        rating: parseFloat(trip.acf?.rating) || 0,
        ratingCount: parseInt(trip.acf?.rating_count) || 0,
        location: trip.acf?.location || '',
        duration: trip.acf?.duration || '',
        gallery: trip.acf?.gallery || [],
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      headers: error.response?.headers,
      data: error.response?.data
    });
    return null;
  }
}

export async function getAllDestinations() {
  try {
    const response = await api.get('/destination?per_page=100');
    console.log('Raw destination response:', JSON.stringify(response.data, null, 2));
    
    return response.data.map(destination => {
      // Get the thumbnail details
      const thumbnail = destination.thumbnail;
      console.log(`Destination ${destination.name} thumbnail:`, thumbnail);
      
      // Get the best available image URL
      let mediaUrl = null;
      
      if (thumbnail) {
        // Try to get the full size image first
        if (thumbnail.sizes?.full?.source_url) {
          mediaUrl = thumbnail.sizes.full.source_url;
        }
        // Fallback to destination-thumb-size which is optimized for destinations
        else if (thumbnail.sizes?.['destination-thumb-size']?.source_url) {
          mediaUrl = thumbnail.sizes['destination-thumb-size'].source_url;
        }
        // Fallback to medium size
        else if (thumbnail.sizes?.medium?.source_url) {
          mediaUrl = thumbnail.sizes.medium.source_url;
        }
      }
      
      console.log(`Destination ${destination.name} final mediaUrl:`, mediaUrl || 'Using placeholder');
      
      return {
        id: destination.id,
        name: destination.name,
        slug: destination.slug,
        description: destination.description,
        count: destination.count,
        imageSrc: mediaUrl || DEFAULT_PLACEHOLDER,
        featured: destination.acf?.is_featured || false
      };
    });
  } catch (error) {
    console.error('Error fetching destinations:', error.response?.data || error.message);
    return [];
  }
}

export async function getDestinationBySlug(slug) {
  try {
    const response = await api.get(`/destination?slug=${slug}`);
    const destination = response.data[0];
    
    if (!destination) return null;

    // Fetch trips for this destination
    const tripsResponse = await api.get(`/trip?destination=${destination.id}&_embed`);
    const trips = tripsResponse.data;

    return {
      id: destination.id,
      name: destination.name,
      slug: destination.slug,
      description: destination.description,
      imageSrc: destination._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_PLACEHOLDER,
      featured: destination.acf?.is_featured || false,
      trips: trips.map(trip => ({
        id: trip.id,
        title: trip.title.rendered,
        excerpt: trip.excerpt?.rendered,
        imageSrc: trip._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_PLACEHOLDER,
        price: parseFloat(trip.acf?.price) || 0,
        duration: trip.acf?.duration || extractDurationFromTitle(trip.title.rendered) || '3 Days',
        slug: trip.slug
      }))
    };
  } catch (error) {
    console.error('Error fetching destination:', error);
    return null;
  }
}

export async function getDestinations() {
  try {
    const response = await api.get('/trip?_embed&per_page=100');
    
    return response.data.map(trip => ({
      id: trip.id,
      title: trip.title.rendered,
      description: trip.content.rendered,
      imageSrc: trip._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_PLACEHOLDER,
      location: trip.acf?.location || trip.title.rendered,
      rating: parseFloat(trip.acf?.rating) || 4.5,
      ratingCount: parseInt(trip.acf?.rating_count) || 0,
      price: parseFloat(trip.acf?.price) || 0,
      duration: trip.acf?.duration || extractDurationFromTitle(trip.title.rendered) || '3 Days',
      slug: trip.slug,
      excerpt: trip.excerpt?.rendered || '',
      itinerary: trip.content?.rendered || '',
      featured: trip.sticky || false
    }));
  } catch (error) {
    console.error('Error in getDestinations:', error);
    return [];
  }
}

function extractDurationFromTitle(title) {
  const durationMatch = title.match(/(\d+)\s*(days|ايام|يوم)/i);
  if (durationMatch) {
    return `${durationMatch[1]} Days`;
  }
  return null;
}

export async function getBlogs(page = 1) {
  try {
    const response = await api.get(`/posts?page=${page}&per_page=10&_embed`);
    return response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
}

export async function checkWordPressEndpoints() {
  try {
    const response = await api.get('/');
    console.log('Available WordPress routes:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error checking WordPress endpoints:', error);
    return null;
  }
}

export function setAuthToken(token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
} 