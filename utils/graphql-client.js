import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

export const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL || 'https://madaratalkon.com/graphql',
  cache: new InMemoryCache(),
});

export const GET_TRIPS = gql`
  query GetTrips($first: Int, $after: String) {
    posts(first: $first, after: $after, where: { postType: "trip" }) {
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
    posts(where: { postType: "destination" }) {
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
    posts(where: { postType: "activity" }) {
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
    post(id: $slug, idType: SLUG) {
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