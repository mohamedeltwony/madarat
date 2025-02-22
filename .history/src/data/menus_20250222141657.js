import { gql } from '@apollo/client';

export const QUERY_ALL_MENUS = gql`
  query AllMenus {
    menus {
      edges {
        node {
          id
          menuId
          name
          locations
          menuItems {
            edges {
              node {
                id
                parentId
                label
                path
                target
                title
              }
            }
          }
        }
      }
    }
  }
`;
