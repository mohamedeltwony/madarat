import { getApolloClient } from 'lib/apollo-client';

// GraphQL queries for trips
export const QUERY_ALL_TRIPS = `
  query AllTrips($first: Int, $after: String) {
    trips(first: $first, after: $after) {
      edges {
        node {
          id
          title
          slug
          excerpt
          content
          date
          modified
          featuredImage {
            node {
              sourceUrl
              altText
              mediaDetails {
                width
                height
              }
            }
          }
          tripDetails {
            price
            duration
            destination
            includes
            excludes
            itinerary
          }
          seo {
            title
            metaDesc
            focuskw
            metaKeywords
            opengraphTitle
            opengraphDescription
            opengraphImage {
              sourceUrl
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const QUERY_TRIP_BY_SLUG = `
  query TripBySlug($slug: String!) {
    tripBy(slug: $slug) {
      id
      title
      slug
      excerpt
      content
      date
      modified
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      tripDetails {
        price
        duration
        destination
        includes
        excludes
        itinerary
        gallery {
          sourceUrl
          altText
        }
      }
      seo {
        title
        metaDesc
        focuskw
        metaKeywords
        opengraphTitle
        opengraphDescription
        opengraphImage {
          sourceUrl
        }
      }
    }
  }
`;

/**
 * Get all trips via REST API
 */
export async function getAllTrips({ first = 100, per_page = 100 } = {}) {
  try {
    // Use REST API endpoint for trips
    const response = await fetch(`https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?per_page=${per_page}&_fields=id,title,slug,date,modified,status,link,excerpt`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const tripsData = await response.json();
    
    // Filter only published trips and format them
    const trips = tripsData
      .filter(trip => trip.status === 'publish')
      .map(trip => ({
        id: trip.id,
        title: trip.title?.rendered || trip.title,
        slug: trip.slug,
        date: trip.date,
        modified: trip.modified,
        excerpt: trip.excerpt?.rendered || trip.excerpt,
        link: trip.link
      }));

    return {
      trips,
    };
  } catch (error) {
    console.error('Error fetching trips via REST API:', error);
    
    // Fallback to GraphQL if REST API fails
    try {
      const apolloClient = getApolloClient();
      const { data } = await apolloClient.query({
        query: QUERY_ALL_TRIPS,
        variables: {
          first,
        },
      });

      const trips = data?.trips?.edges?.map(({ node }) => ({
        ...node,
        featuredImage: node.featuredImage?.node,
      })) || [];

      return {
        trips,
      };
    } catch (fallbackError) {
      console.error('Error with GraphQL fallback:', fallbackError);
      return {
        trips: [],
      };
    }
  }
}

/**
 * Get trip by slug
 */
export async function getTripBySlug(slug) {
  const apolloClient = getApolloClient();

  try {
    const { data } = await apolloClient.query({
      query: QUERY_TRIP_BY_SLUG,
      variables: {
        slug,
      },
    });

    const trip = data?.tripBy;

    if (!trip) {
      return null;
    }

    return {
      ...trip,
      featuredImage: trip.featuredImage?.node,
    };
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}

/**
 * Get trip paths for static generation
 */
export async function getTripPaths() {
  const { trips } = await getAllTrips();

  const paths = trips.map((trip) => ({
    params: {
      slug: trip.slug,
    },
  }));

  return paths;
}

/**
 * Get related trips based on destination or category
 */
export async function getRelatedTrips(currentTripId, destination) {
  const { trips } = await getAllTrips();

  // Filter out current trip and find related ones
  const relatedTrips = trips
    .filter(trip => trip.id !== currentTripId)
    .filter(trip => {
      // Match by destination if available
      if (destination && trip.tripDetails?.destination) {
        return trip.tripDetails.destination.toLowerCase().includes(destination.toLowerCase());
      }
      return true;
    })
    .slice(0, 3); // Limit to 3 related trips

  return relatedTrips;
}

/**
 * Get featured trips (can be used for homepage)
 */
export async function getFeaturedTrips(limit = 6) {
  const { trips } = await getAllTrips();

  // For now, return the most recent trips
  // You can modify this logic based on your WordPress setup
  return trips.slice(0, limit);
} 