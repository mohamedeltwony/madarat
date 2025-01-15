import { client, GET_TRIPS, GET_DESTINATIONS, GET_TRIP_BY_SLUG } from './graphql-client';

export async function getTours() {
  try {
    console.log('🔄 Fetching tours with GraphQL...');
    const { data } = await client.query({ query: GET_TRIPS });
    console.log('📦 Raw GraphQL Response:', data);

    if (!data?.posts?.nodes) {
      console.warn('⚠️ No tours found in response');
      return [];
    }

    const tours = data.posts.nodes
      .filter(post => post.categories?.nodes?.some(cat => cat.slug === 'trips' || cat.name.toLowerCase() === 'trips'))
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage?.node?.sourceUrl || null,
        categories: post.categories?.nodes || []
      }));

    console.log('Tours data:', tours);
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
      .filter(post => post.categories?.nodes?.some(cat => cat.slug === 'destinations' || cat.name.toLowerCase() === 'destinations'))
      .map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featuredImage: post.featuredImage?.node?.sourceUrl || null,
        categories: post.categories?.nodes || []
      }));

    console.log('Destinations data:', destinations);
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
      featuredImage: data.post.featuredImage?.node?.sourceUrl || null
    };
  } catch (error) {
    console.error(`Error fetching tour with slug ${slug}:`, error);
    return null;
  }
} 