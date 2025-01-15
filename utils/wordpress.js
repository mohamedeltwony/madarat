import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('🔄 Fetching tours with GraphQL...');
    const { data } = await client.query({ query: GET_TRIPS });
    console.log('📦 Raw GraphQL Response:', data);

    if (!data?.posts?.nodes) {
      console.warn('⚠️ No trips found in response');
      return [];
    }

    const tours = data.posts.nodes.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage?.node?.sourceUrl || null,
      categories: post.categories?.nodes || [],
      price: post.customFields?.price || '',
      duration: post.customFields?.duration || '',
      location: post.customFields?.location || '',
      gallery: post.customFields?.gallery ? post.customFields.gallery.split(',') : []
    }));

    console.log(`🎯 Found ${tours.length} tours with categories:`, 
      tours.map(t => ({ title: t.title, categories: t.categories.map(c => c.name) }))
    );
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

    if (!data?.posts?.nodes) {
      console.warn('⚠️ No destinations found in response');
      return [];
    }

    const destinations = data.posts.nodes
      .filter(post => post.customFields?.location)
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage?.node?.sourceUrl || null,
        categories: post.categories?.nodes || [],
        location: post.customFields?.location || '',
        gallery: post.customFields?.gallery ? post.customFields.gallery.split(',') : []
      }));

    console.log(`🎯 Found ${destinations.length} destinations with categories:`,
      destinations.map(d => ({ title: d.title, categories: d.categories.map(c => c.name) }))
    );
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

    if (!data?.post) {
      console.warn(`⚠️ No tour found with slug: ${slug}`);
      return null;
    }

    return {
      id: data.post.id,
      title: data.post.title,
      content: data.post.content,
      excerpt: data.post.excerpt,
      featuredImage: data.post.featuredImage?.node?.sourceUrl || null,
      categories: data.post.categories?.nodes || [],
      price: data.post.customFields?.price || '',
      duration: data.post.customFields?.duration || '',
      location: data.post.customFields?.location || '',
      gallery: data.post.customFields?.gallery ? data.post.customFields.gallery.split(',') : []
    };
  } catch (error) {
    console.error(`Error fetching tour with slug ${slug}:`, error);
    return null;
  }
} 