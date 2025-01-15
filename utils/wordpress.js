import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('🔄 Fetching tours with GraphQL...');
    const { data, errors } = await client.query({
      query: GET_TRIPS
    });

    if (errors) {
      console.error('❌ GraphQL Errors in getTours:', errors);
      return [];
    }

    if (!data) {
      console.warn('⚠️ No data returned from GraphQL');
      return [];
    }

    if (!data.tours?.nodes) {
      console.warn('⚠️ No tours found in response. Data received:', data);
      return [];
    }

    const tours = data.tours.nodes;
    console.log(`✅ Found ${tours.length} tours`);
    
    // Log each tour's basic info
    tours.forEach(tour => {
      console.log(`  📍 Tour: ${tour.title}`);
      console.log(`    - Slug: ${tour.slug}`);
      console.log(`    - Price: ${tour.tourDetails?.price}`);
      console.log(`    - Duration: ${tour.tourDetails?.duration}`);
      console.log(`    - Location: ${tour.tourDetails?.location}`);
    });

    return tours.map(tour => ({
      id: tour.id,
      title: tour.title,
      slug: tour.slug,
      featuredImage: tour.featuredImage,
      tripFields: {
        price: tour.tourDetails?.price || 0,
        duration: tour.tourDetails?.duration || '',
        location: tour.tourDetails?.location || '',
        rating: parseFloat(tour.tourDetails?.rating) || 0,
        ratingCount: parseInt(tour.tourDetails?.ratingCount) || 0,
        difficulty: tour.tourDetails?.difficulty || '',
        included: tour.tourDetails?.included?.split('\n').filter(item => item.trim()) || [],
        notIncluded: tour.tourDetails?.notIncluded?.split('\n').filter(item => item.trim()) || [],
        itinerary: tour.tourDetails?.itinerary || '',
        gallery: tour.tourDetails?.gallery?.map(img => img.sourceUrl) || []
      }
    }));
  } catch (error) {
    console.error('❌ Error in getTours:', {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    return [];
  }
}

export async function getDestinations() {
  try {
    console.log('🔄 Fetching destinations with GraphQL...');
    const { data, errors } = await client.query({
      query: GET_DESTINATIONS
    });

    if (errors) {
      console.error('❌ GraphQL Errors in getDestinations:', errors);
      return [];
    }

    if (!data) {
      console.warn('⚠️ No data returned from GraphQL');
      return [];
    }

    if (!data.destinations?.nodes) {
      console.warn('⚠️ No destinations found in response. Data received:', data);
      return [];
    }

    const destinations = data.destinations.nodes;
    console.log(`✅ Found ${destinations.length} destinations`);
    
    // Log each destination's basic info
    destinations.forEach(destination => {
      console.log(`  📍 Destination: ${destination.title}`);
      console.log(`    - Slug: ${destination.slug}`);
      console.log(`    - Location: ${destination.destinationDetails?.location}`);
    });

    return destinations.map(destination => ({
      id: destination.id,
      title: destination.title,
      slug: destination.slug,
      featuredImage: destination.featuredImage,
      tripFields: {
        location: destination.destinationDetails?.location || '',
        description: destination.destinationDetails?.description || '',
        attractions: destination.destinationDetails?.attractions || [],
        image: destination.destinationDetails?.image?.sourceUrl || destination.featuredImage?.node?.sourceUrl
      }
    }));
  } catch (error) {
    console.error('❌ Error in getDestinations:', {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    return [];
  }
}

export async function getTourBySlug(slug) {
  try {
    console.log('🔄 Fetching tour by slug:', slug);
    const { data, errors } = await client.query({
      query: GET_TRIP_BY_SLUG,
      variables: { slug }
    });

    if (errors) {
      console.error('❌ GraphQL Errors in getTourBySlug:', errors);
      return null;
    }

    if (!data) {
      console.warn('⚠️ No data returned from GraphQL');
      return null;
    }

    if (!data.tour) {
      console.warn('⚠️ No tour found for slug:', slug);
      return null;
    }

    const tour = data.tour;
    console.log('✅ Found tour:', {
      title: tour.title,
      price: tour.tourDetails?.price,
      duration: tour.tourDetails?.duration,
      location: tour.tourDetails?.location
    });

    return {
      id: tour.id,
      title: tour.title,
      content: tour.content,
      featuredImage: tour.featuredImage,
      tripFields: {
        price: tour.tourDetails?.price || 0,
        duration: tour.tourDetails?.duration || '',
        location: tour.tourDetails?.location || '',
        rating: parseFloat(tour.tourDetails?.rating) || 0,
        ratingCount: parseInt(tour.tourDetails?.ratingCount) || 0,
        difficulty: tour.tourDetails?.difficulty || '',
        included: tour.tourDetails?.included?.split('\n').filter(item => item.trim()) || [],
        notIncluded: tour.tourDetails?.notIncluded?.split('\n').filter(item => item.trim()) || [],
        itinerary: tour.tourDetails?.itinerary || '',
        gallery: tour.tourDetails?.gallery?.map(img => img.sourceUrl) || []
      }
    };
  } catch (error) {
    console.error('❌ Error in getTourBySlug:', {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    return null;
  }
} 