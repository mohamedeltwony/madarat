# Data Fetching

This document explains how data is fetched from WordPress using GraphQL in the Next.js WordPress Starter project.

## Overview

The project uses WPGraphQL to fetch data from WordPress and Apollo Client to handle GraphQL operations. Data is primarily fetched at build time using Next.js's `getStaticProps` and `getStaticPaths` functions.

## WPGraphQL Setup

To use this starter, your WordPress installation needs the [WPGraphQL](https://www.wpgraphql.com/) plugin installed and activated. This exposes a GraphQL API endpoint at:

```
https://your-wordpress-site.com/graphql
```

This endpoint is configured in your `.env.local` file:

```
WORDPRESS_GRAPHQL_ENDPOINT="https://your-wordpress-site.com/graphql"
```

## Data Fetching Architecture

```
┌────────────────┐    ┌────────────────┐    ┌────────────────┐
│                │    │                │    │                │
│  Data Sources  │───▶│    WPGraphQL   │───▶│  Apollo Client │
│  (WordPress)   │    │    (API)       │    │  (Next.js)     │
│                │    │                │    │                │
└────────────────┘    └────────────────┘    └────────────────┘
                                                    │
                                                    ▼
                                            ┌────────────────┐
                                            │                │
                                            │  React         │
                                            │  Components    │
                                            │                │
                                            └────────────────┘
```

## Key Data Fetching Files

### Apollo Client Setup (`src/lib/apollo-client.js`)

```javascript
import { ApolloClient, InMemoryCache } from '@apollo/client';

export function getApolloClient() {
  return new ApolloClient({
    uri: process.env.WORDPRESS_GRAPHQL_ENDPOINT,
    cache: new InMemoryCache(),
  });
}
```

### Data Fetching Modules

- `src/lib/posts.js` - Functions for fetching posts
- `src/lib/pages.js` - Functions for fetching pages
- `src/lib/categories.js` - Functions for fetching categories
- `src/lib/users.js` - Functions for fetching users/authors
- `src/lib/menus.js` - Functions for fetching menus
- `src/lib/site.js` - Functions for fetching site metadata

## Example: Fetching Posts

The `getPosts` function in `src/lib/posts.js` fetches posts from WordPress:

```javascript
export async function getPosts({ queryIncludes, ...options } = {}) {
  const apolloClient = getApolloClient();
  
  const data = await apolloClient.query({
    query: QUERY_POSTS,
    variables: {
      ...options,
    },
  });
  
  const posts = data?.data.posts.edges.map(({ node }) => node);
  
  return {
    posts,
  };
}
```

## Static Site Generation

Next.js uses `getStaticProps` and `getStaticPaths` for static site generation (SSG).

### `getStaticProps`

Used to fetch data at build time for static pages:

```javascript
// Example from src/pages/index.js
export async function getStaticProps() {
  const { posts } = await getPosts({
    queryIncludes: 'archive',
  });
  
  return {
    props: {
      posts,
    },
  };
}
```

### `getStaticPaths`

Used to specify which dynamic routes to pre-render:

```javascript
// Example from src/pages/posts/[slug].js
export async function getStaticPaths() {
  const { posts } = await getPosts({
    queryIncludes: 'archive',
  });
  
  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });
  
  return {
    paths,
    fallback: 'blocking',
  };
}
```

## GraphQL Queries

GraphQL queries are defined in the data fetching modules. For example, here's the query for fetching posts:

```javascript
const QUERY_POSTS = gql`
  query Posts($first: Int, $after: String, $where: PostObjectsConnectionWhereArgs) {
    posts(first: $first, after: $after, where: $where) {
      edges {
        node {
          id
          slug
          title
          excerpt
          date
          modified
          author {
            node {
              name
              slug
              avatar {
                url
              }
            }
          }
          categories {
            edges {
              node {
                name
                slug
              }
            }
          }
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
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
```

## Data Transformation

After fetching data from WordPress, it often needs to be transformed into a more usable format for the frontend:

```javascript
// Example transformation from src/lib/posts.js
function postPathBySlug(slug) {
  return `/posts/${slug}`;
}

function mapPostData(post = {}) {
  const data = { ...post };

  // Clean up the author object
  if (data.author) {
    data.author = {
      ...data.author.node,
    };
  }

  // Clean up the categories
  if (data.categories) {
    data.categories = data.categories.edges.map(({ node }) => {
      return {
        ...node,
      };
    });
  }

  // Clean up the featured image
  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  return data;
}
```

## Client-Side Data Fetching

While most data is fetched at build time, some dynamic features use client-side fetching:

```javascript
// Example of client-side fetching with Apollo Client
import { useQuery } from '@apollo/client';

function Posts() {
  const { loading, error, data } = useQuery(QUERY_POSTS, {
    variables: {
      first: 10,
    },
  });
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  
  return data.posts.edges.map(({ node }) => (
    <div key={node.id}>
      <h3>{node.title}</h3>
      <p>{node.excerpt}</p>
    </div>
  ));
}
```

## Caching Strategy

Next.js 15 made changes to caching behavior:

1. `fetch` requests are no longer cached by default
2. `GET` Route Handlers are no longer cached by default
3. Client navigations are no longer cached by default

This means that data fetching is more explicit about caching. In this project, most data is fetched at build time, so caching is less of a concern for the main content.

## Custom Hooks

Custom hooks are used to access data throughout the application:

- `useSite` - Access site-wide data
- `usePageMetadata` - Handle page metadata

## Search Functionality

Search functionality is implemented client-side using [Fuse.js](https://fusejs.io/) for fuzzy searching:

```javascript
// Simplified example from src/hooks/use-search.js
const { posts } = useSite();
const fuse = new Fuse(posts, {
  keys: ['title', 'excerpt', 'content'],
  threshold: 0.3,
});

function search(query) {
  const results = fuse.search(query);
  return results.map(({ item }) => item);
}
``` 