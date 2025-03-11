import { gql } from '@apollo/client';

export const QUERY_ALL_CATEGORIES = gql`
  query AllCategories {
    categories(first: 10000, where: { contentTypes: ["trip"] }) {
      edges {
        node {
          databaseId
          description
          id
          name
          slug
          parent {
            node {
              id
              name
              slug
            }
          }
          children {
            edges {
              node {
                id
                name
                slug
              }
              }
            }
          posts {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const QUERY_CATEGORY_BY_SLUG = gql`
  query CategoryBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      databaseId
      description
      id
      name
      slug
      parent {
        node {
          id
          name
          slug
        }
      }
      children {
        edges {
          node {
            id
            name
            slug
          }
        }
      }
      posts(where: { contentTypes: ["trip"] }) {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

export const QUERY_CATEGORY_SEO_BY_SLUG = gql`
  query CategorySEOBySlug($slug: ID!) {
    category(id: $slug, idType: SLUG) {
      id
      seo {
        canonical
        metaDesc
        metaRobotsNofollow
        metaRobotsNoindex
        opengraphAuthor
        opengraphDescription
        opengraphTitle
        opengraphType
        title
        twitterDescription
        twitterTitle
      }
    }
  }
`;
