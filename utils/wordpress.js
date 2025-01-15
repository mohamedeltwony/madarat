import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('🔄 Starting getTours function...');
    const { data } = await client.query({
      query: GET_TRIPS
    });

    if (!data?.allTrips) {
      console.warn('⚠️ No trips found in response');
      return [];
    }

    return data.allTrips.map(trip => ({
      id: trip.id,
      title: trip.title,
      slug: trip.slug || '',
      excerpt: trip.excerpt || '',
      content: trip.content || '',
      tripFields: {
        price: '',
        duration: '',
        location: '',
        difficulty: '',
        gallery: [],
        itinerary: '',
        included: '',
        notIncluded: ''
      }
    }));
  } catch (error) {
    console.error('❌ Error in getTours:', error);
    return [];
  }
}

export async function getDestinations() {
  try {
    console.log('🔄 Fetching destinations with GraphQL...');
    const { data, errors } = await client.query({ query: GET_DESTINATIONS });
    
    if (errors) {
      console.error('❌ GraphQL Errors:', errors);
      return [];
    }

    console.log('🌍 Raw GraphQL Response:', data);

    if (!data?.posts?.nodes) {
      console.warn('⚠️ No posts found in response');
      return [];
    }

    // Filter for posts that look like destinations based on their categories
    const destinations = data.posts.nodes
      .filter(post => {
        const categories = post.categories?.nodes || [];
        const categoryNames = categories.map(c => c.name.toLowerCase());
        const categorySlugs = categories.map(c => c.slug.toLowerCase());
        
        // Log all categories found
        console.log(`📑 Categories for post "${post.title}":`, categoryNames);
        
        // Check if any category matches destination-related terms
        return categoryNames.some(name => 
          name.includes('destination') || 
          name.includes('location') || 
          name.includes('place') ||
          name.includes('الوجهات')
        ) || categorySlugs.some(slug => 
          slug.includes('destination') || 
          slug.includes('location') || 
          slug.includes('place')
        );
      })
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage?.node?.sourceUrl || null,
        categories: post.categories?.nodes || []
      }));

    console.log(`🎯 Found ${destinations.length} destinations`);
    return destinations;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return [];
  }
}

export async function getTourBySlug(id) {
  try {
    const { data, errors } = await client.query({
      query: GET_TRIP_BY_SLUG,
      variables: { id }
    });

    if (errors) {
      console.error('❌ GraphQL Errors:', errors);
      return null;
    }

    if (!data?.trip) {
      console.warn(`⚠️ No trip found with id: ${id}`);
      return null;
    }

    return {
      id: data.trip.id,
      title: data.trip.title,
      content: data.trip.content || '',
      excerpt: data.trip.excerpt || '',
      tripFields: {
        price: data.trip.tripFields?.price || '',
        duration: data.trip.tripFields?.duration || '',
        location: data.trip.tripFields?.location || '',
        difficulty: data.trip.tripFields?.difficulty || '',
        gallery: data.trip.tripFields?.gallery || [],
        itinerary: data.trip.tripFields?.itinerary || '',
        included: data.trip.tripFields?.included || '',
        notIncluded: data.trip.tripFields?.notIncluded || ''
      }
    };
  } catch (error) {
    console.error(`Error fetching trip with id ${id}:`, error);
    return null;
  }
} 