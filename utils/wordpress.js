import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('Fetching tours with GraphQL...');
    const { data, errors } = await client.query({
      query: GET_TRIPS
    });

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return [];
    }

    if (!data?.posts?.nodes) {
      console.log('No tours data found in response:', data);
      return [];
    }

    // Filter posts that have either "travel" or "adventure" category
    const tours = data.posts.nodes.filter(post => 
      post.categories?.nodes?.some(cat => 
        cat.slug === 'travel' || cat.slug === 'adventure'
      )
    );

    console.log('Found tours:', tours.length);
    return tours.map(tour => ({
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      excerpt: tour.excerpt,
      featuredImage: tour.featuredImage,
      tripFields: {
        price: tour.acf?.price || 0,
        duration: tour.acf?.duration || '',
        location: tour.acf?.location || '',
        rating: parseFloat(tour.acf?.rating) || 0,
        ratingCount: parseInt(tour.acf?.ratingCount) || 0,
        difficulty: tour.acf?.difficulty || '',
        included: tour.acf?.included?.split('\n').filter(item => item.trim()) || [],
        notIncluded: tour.acf?.notIncluded?.split('\n').filter(item => item.trim()) || [],
        itinerary: tour.acf?.itinerary || '',
        gallery: tour.acf?.gallery?.map(img => img.sourceUrl) || []
      }
    }));
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export async function getDestinations() {
  try {
    console.log('Fetching destinations with GraphQL...');
    const { data, errors } = await client.query({
      query: GET_DESTINATIONS
    });

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return [];
    }

    if (!data?.posts?.nodes) {
      console.log('No destinations data found in response:', data);
      return [];
    }

    // Filter posts that have location categories
    const destinations = data.posts.nodes.filter(post => 
      post.categories?.nodes?.some(cat => 
        cat.slug === 'افضل-الاماكن-السياحية-فى-شرق-اوربا' || cat.slug === 'البوسنة'
      )
    );

    console.log('Found destinations:', destinations.length);
    return destinations.map(destination => ({
      id: destination.id,
      title: destination.title,
      slug: destination.slug,
      excerpt: destination.excerpt,
      featuredImage: destination.featuredImage,
      tripFields: {
        location: destination.acf?.location || '',
        rating: parseFloat(destination.acf?.rating) || 0,
        ratingCount: parseInt(destination.acf?.ratingCount) || 0
      }
    }));
  } catch (error) {
    console.error('Error in getDestinations:', error);
    return [];
  }
}

export async function getTourBySlug(slug) {
  try {
    console.log('Fetching tour by slug:', slug);
    const { data, errors } = await client.query({
      query: GET_TRIP_BY_SLUG,
      variables: { slug }
    });

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return null;
    }

    if (!data?.post) {
      console.log('No tour found for slug:', slug);
      return null;
    }

    const post = data.post;
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      categories: post.categories?.nodes || [],
      featuredImage: post.featuredImage,
      tripFields: {
        price: post.acf?.price || 0,
        duration: post.acf?.duration || '',
        location: post.acf?.location || '',
        rating: parseFloat(post.acf?.rating) || 0,
        ratingCount: parseInt(post.acf?.ratingCount) || 0,
        difficulty: post.acf?.difficulty || '',
        included: post.acf?.included?.split('\n').filter(item => item.trim()) || [],
        notIncluded: post.acf?.notIncluded?.split('\n').filter(item => item.trim()) || [],
        itinerary: post.acf?.itinerary || '',
        gallery: post.acf?.gallery?.map(img => img.sourceUrl) || []
      }
    };
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return null;
  }
} 