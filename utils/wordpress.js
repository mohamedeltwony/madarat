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

    if (!data?.posts?.nodes) {
      console.warn('⚠️ No tours found in response');
      return [];
    }

    const posts = data.posts.nodes;
    console.log(`✅ Found ${posts.length} tours`);
    
    // Log each tour's basic info
    posts.forEach(post => {
      console.log(`  📍 Tour: ${post.title}`);
      console.log(`    - Slug: ${post.slug}`);
      console.log(`    - Categories: ${post.categories.nodes.map(cat => cat.name).join(', ')}`);
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      categories: post.categories.nodes,
      tripFields: {
        // Extract trip details from content/excerpt if needed
        price: extractPriceFromContent(post.content),
        duration: extractDurationFromContent(post.content),
        location: extractLocationFromContent(post.content),
        rating: 5, // Default rating
        ratingCount: 1, // Default rating count
        difficulty: 'Medium', // Default difficulty
        included: [], // Can be extracted from content if needed
        notIncluded: [], // Can be extracted from content if needed
        itinerary: post.content, // Use full content as itinerary
        gallery: post.featuredImage ? [post.featuredImage.node.sourceUrl] : []
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

    if (!data?.posts?.nodes) {
      console.warn('⚠️ No destinations found in response');
      return [];
    }

    const posts = data.posts.nodes;
    console.log(`✅ Found ${posts.length} destinations`);
    
    // Log each destination's basic info
    posts.forEach(post => {
      console.log(`  📍 Destination: ${post.title}`);
      console.log(`    - Slug: ${post.slug}`);
      console.log(`    - Categories: ${post.categories.nodes.map(cat => cat.name).join(', ')}`);
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      categories: post.categories.nodes,
      tripFields: {
        location: extractLocationFromContent(post.content),
        description: post.excerpt || '',
        attractions: [], // Can be extracted from content if needed
        image: post.featuredImage?.node?.sourceUrl
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

    if (!data?.post) {
      console.warn('⚠️ No tour found for slug:', slug);
      return null;
    }

    const post = data.post;
    console.log('✅ Found tour:', {
      title: post.title,
      categories: post.categories.nodes.map(cat => cat.name).join(', ')
    });

    return {
      id: post.id,
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      featuredImage: post.featuredImage,
      categories: post.categories.nodes,
      tripFields: {
        price: extractPriceFromContent(post.content),
        duration: extractDurationFromContent(post.content),
        location: extractLocationFromContent(post.content),
        rating: 5, // Default rating
        ratingCount: 1, // Default rating count
        difficulty: 'Medium', // Default difficulty
        included: [], // Can be extracted from content if needed
        notIncluded: [], // Can be extracted from content if needed
        itinerary: post.content, // Use full content as itinerary
        gallery: post.featuredImage ? [post.featuredImage.node.sourceUrl] : []
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

// Helper functions to extract information from content
function extractPriceFromContent(content) {
  // Add logic to extract price from content
  return 0;
}

function extractDurationFromContent(content) {
  // Add logic to extract duration from content
  return '';
}

function extractLocationFromContent(content) {
  // Add logic to extract location from content
  return '';
} 