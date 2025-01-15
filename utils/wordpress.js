import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours(page = 1) {
  try {
    const { data } = await client.query({
      query: GET_TRIPS,
      variables: {
        first: 10,
        after: null // For pagination
      }
    });
    return data.posts.nodes;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export async function getDestinations() {
  try {
    const { data } = await client.query({
      query: GET_DESTINATIONS
    });
    
    return data.posts.nodes.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      imageSrc: post.featuredImage?.node?.sourceUrl || '/img/placeholder.jpg',
      location: post.tripFields?.location || '',
      rating: parseFloat(post.tripFields?.rating) || 4.5,
      ratingCount: parseInt(post.tripFields?.ratingCount) || 0,
      price: parseFloat(post.tripFields?.price) || 0,
      duration: post.tripFields?.duration || '3 Days'
    }));
  } catch (error) {
    console.error('Error in getDestinations:', error);
    return [];
  }
}

export async function getTourBySlug(slug) {
  try {
    const { data } = await client.query({
      query: GET_TRIP_BY_SLUG,
      variables: { slug }
    });
    
    const post = data.post;
    if (!post) return null;
    
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      description: post.content,
      itinerary: post.tripFields?.itinerary || '',
      inclusions: post.tripFields?.included?.split('\n').filter(item => item.trim()) || [],
      exclusions: post.tripFields?.notIncluded?.split('\n').filter(item => item.trim()) || [],
      image: post.featuredImage?.node?.sourceUrl || '/img/placeholder.jpg',
      price: parseFloat(post.tripFields?.price) || 0,
      rating: parseFloat(post.tripFields?.rating) || 0,
      ratingCount: parseInt(post.tripFields?.ratingCount) || 0,
      location: post.tripFields?.location || '',
      duration: post.tripFields?.duration || '',
      gallery: post.tripFields?.gallery?.map(img => img.sourceUrl) || []
    };
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return null;
  }
} 