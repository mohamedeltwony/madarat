import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('🔄 Fetching tours with GraphQL...');
    const { data } = await client.query({ query: GET_TRIPS });
    console.log('📦 Raw GraphQL Response:', data);

    if (!data?.trips?.nodes) {
      console.warn('⚠️ No trips found in response');
      return [];
    }

    const tours = data.trips.nodes.map(trip => ({
      id: trip.id,
      title: trip.title,
      slug: trip.slug,
      excerpt: trip.excerpt,
      content: trip.content,
      featuredImage: trip.featuredImage?.node?.sourceUrl || null,
      price: trip.tripFields?.price || '',
      duration: trip.tripFields?.duration || '',
      location: trip.tripFields?.location || '',
      gallery: trip.tripFields?.gallery?.map(img => img.sourceUrl) || []
    }));

    console.log(`🎯 Found ${tours.length} tours`);
    return tours;
  } catch (error) {
    console.error('Error fetching tours:', error);
    return [];
  }
}

export async function getDestinations() {
  try {
    console.log('🔄 Fetching destinations with GraphQL...');
    const { data } = await client.query({ query: GET_DESTINATIONS });
    console.log('🌍 Raw GraphQL Response:', data);

    if (!data?.trips?.nodes) {
      console.warn('⚠️ No destinations found in response');
      return [];
    }

    const destinations = data.trips.nodes
      .filter(trip => trip.tripFields?.location)
      .map(trip => ({
        id: trip.id,
        title: trip.title,
        slug: trip.slug,
        excerpt: trip.excerpt,
        content: trip.content,
        featuredImage: trip.featuredImage?.node?.sourceUrl || null,
        location: trip.tripFields?.location || '',
        gallery: trip.tripFields?.gallery?.map(img => img.sourceUrl) || []
      }));

    console.log(`🎯 Found ${destinations.length} destinations`);
    return destinations;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export async function getTourBySlug(slug) {
  try {
    const { data } = await client.query({
      query: GET_TRIP_BY_SLUG,
      variables: { slug }
    });

    if (!data?.trip) {
      console.warn(`⚠️ No tour found with slug: ${slug}`);
      return null;
    }

    return {
      id: data.trip.id,
      title: data.trip.title,
      content: data.trip.content,
      excerpt: data.trip.excerpt,
      featuredImage: data.trip.featuredImage?.node?.sourceUrl || null,
      price: data.trip.tripFields?.price || '',
      duration: data.trip.tripFields?.duration || '',
      location: data.trip.tripFields?.location || '',
      gallery: data.trip.tripFields?.gallery?.map(img => img.sourceUrl) || []
    };
  } catch (error) {
    console.error(`Error fetching tour with slug ${slug}:`, error);
    return null;
  }
} 