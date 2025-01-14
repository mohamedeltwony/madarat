import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.WORDPRESS_GRAPHQL_URL,
  cache: new InMemoryCache(),
});

export const GET_TRIPS = gql`
  query GetTrips($first: Int, $after: String) {
    trips(first: $first, after: $after) {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
        tripFields {
          price
          duration
          location
          difficulty
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_DESTINATIONS = gql`
  query GetDestinations {
    destinations {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_ACTIVITIES = gql`
  query GetActivities {
    activities {
      nodes {
        id
        title
        slug
        featuredImage {
          node {
            sourceUrl
          }
        }
      }
    }
  }
`;

export const GET_TRIP_BY_SLUG = gql`
  query GetTripBySlug($slug: String!) {
    tripBy(slug: $slug) {
      id
      title
      content
      featuredImage {
        node {
          sourceUrl
        }
      }
      tripFields {
        price
        duration
        location
        difficulty
        gallery {
          sourceUrl
        }
        itinerary
        included
        notIncluded
      }
      activities {
        nodes {
          id
          title
          slug
        }
      }
      tags {
        nodes {
          id
          name
          slug
        }
      }
    }
  }
`; 