import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('🔄 Fetching tours with GraphQL...');
    const { data, errors } = await client.query({ query: GET_TRIPS });
    
    if (errors) {
      console.error('❌ GraphQL Errors:', errors);
      return [];
    }

    console.log('📦 Raw GraphQL Response:', data);

    if (!data?.posts?.nodes) {
      console.warn('⚠️ No posts found in response');
      return [];
    }

    // Filter for posts that look like tours based on their categories
    const tours = data.posts.nodes
      .filter(post => {
        const categories = post.categories?.nodes || [];
        const categoryNames = categories.map(c => c.name.toLowerCase());
        const categorySlugs = categories.map(c => c.slug.toLowerCase());
        
        // Log all categories found
        console.log(`📑 Categories for post "${post.title}":`, categoryNames);
        
        // Check if any category matches tour-related terms
        return categoryNames.some(name => 
          name.includes('tour') || 
          name.includes('trip') || 
          name.includes('رحلات') ||
          name === 'travel'
        ) || categorySlugs.some(slug => 
          slug.includes('tour') || 
          slug.includes('trip') || 
          slug.includes('travel')
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

export async function getTourBySlug(slug) {
  try {
    const { data, errors } = await client.query({
      query: GET_TRIP_BY_SLUG,
      variables: { slug }
    });

    if (errors) {
      console.error('❌ GraphQL Errors:', errors);
      return null;
    }

    if (!data?.post) {
      console.warn(`⚠️ No post found with slug: ${slug}`);
      return null;
    }

    return {
      id: data.post.id,
      title: data.post.title,
      content: data.post.content,
      excerpt: data.post.excerpt,
      featuredImage: data.post.featuredImage?.node?.sourceUrl || null,
      categories: data.post.categories?.nodes || []
    };
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    return null;
  }
} 