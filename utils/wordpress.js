import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('Fetching tours with GraphQL...');
    const { data, errors } = await client.query({
      query: GET_TRIPS
    });

    if (errors) {
      console.error('GraphQL Errors in getTours:', errors);
      return [];
    }

    if (!data?.posts?.nodes) {
      console.log('No posts data found in response:', data);
      return [];
    }

    // Filter posts that have travel or adventure categories
    const tours = data.posts.nodes.filter(post => 
      post.categories?.nodes?.some(cat => 
        ['travel', 'adventure', 'البوسنة'].includes(cat.slug)
      )
    );

    console.log('Found tours:', tours.length);
    console.log('Tour data:', tours);

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
        ratingCount: parseInt(tour.acf?.ratingCount) || 0
      }
    }));
  } catch (error) {
    console.error('Error in getTours:', error);
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
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
      console.error('GraphQL Errors in getDestinations:', errors);
      return [];
    }

    if (!data?.posts?.nodes) {
      console.log('No posts data found in response:', data);
      return [];
    }

    // Filter posts that have location categories
    const destinations = data.posts.nodes.filter(post => 
      post.categories?.nodes?.some(cat => 
        ['افضل-الاماكن-السياحية-فى-شرق-اوربا', 'البوسنة'].includes(cat.slug)
      )
    );

    console.log('Found destinations:', destinations.length);
    console.log('Destination data:', destinations);

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
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
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
      console.error('GraphQL Errors in getTourBySlug:', errors);
      return null;
    }

    if (!data?.post) {
      console.log('No post found for slug:', slug);
      return null;
    }

    console.log('Found tour data:', data.post);

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
    console.error('Error in getTourBySlug:', error);
    if (error.graphQLErrors) {
      console.error('GraphQL Errors:', error.graphQLErrors);
    }
    if (error.networkError) {
      console.error('Network Error:', error.networkError);
    }
    return null;
  }
} 