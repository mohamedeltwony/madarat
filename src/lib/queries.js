import { gql } from '@apollo/client';

export const GET_TRIPS = gql`
  query GetTrips {
    trips {
      nodes {
        id
        title
        slug
        excerpt
        featuredImage {
          node {
            sourceUrl
            mediaDetails {
              sizes {
                sourceUrl
                width
                height
              }
            }
          }
        }
        tripSettings {
          duration {
            days
            nights
            durationType
          }
          price {
            amount
            currency
          }
        }
      }
    }
  }
`;
