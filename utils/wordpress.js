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

    // Filter posts that have either "tours" or "رحلات" category
    const tours = data.posts.nodes.filter(post => 
      post.categories?.nodes?.some(cat => 
        cat.slug === 'tours' || cat.slug === 'رحلات'
      )
    );

    console.log('Found tours:', tours.length);
    return tours.map(tour => ({
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      excerpt: tour.excerpt,
      featuredImage: tour.featuredImage,
      tripFields: tour.tripFields || {
        price: 0,
        duration: '',
        location: '',
        rating: 0,
        ratingCount: 0,
        difficulty: '',
        included: [],
        notIncluded: [],
        itinerary: '',
        gallery: []
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

    // Filter posts that have either "destinations" or "الوجهات" category
    const destinations = data.posts.nodes.filter(post => 
      post.categories?.nodes?.some(cat => 
        cat.slug === 'destinations' || cat.slug === 'الوجهات'
      )
    );

    console.log('Found destinations:', destinations.length);
    return destinations.map(destination => ({
      id: destination.id,
      title: destination.title,
      slug: destination.slug,
      excerpt: destination.excerpt,
      featuredImage: destination.featuredImage,
      tripFields: destination.tripFields || {
        location: '',
        rating: 0,
        ratingCount: 0
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
      tripFields: post.tripFields || {
        price: 0,
        duration: '',
        location: '',
        rating: 0,
        ratingCount: 0,
        difficulty: '',
        included: [],
        notIncluded: [],
        itinerary: '',
        gallery: []
      }
    };
  } catch (error) {
    console.error('Error fetching tour by slug:', error);
    return null;
  }
} 