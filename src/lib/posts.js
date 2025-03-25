import { getApolloClient } from '@/lib/apollo-client';
import { gql } from '@apollo/client';
import client from './apollo-client';

import { updateUserAvatar } from '@/lib/users';
import { sortObjectsByDate } from '@/lib/datetime';

import {
  QUERY_ALL_POSTS_INDEX,
  QUERY_ALL_POSTS_ARCHIVE,
  QUERY_ALL_POSTS,
  QUERY_POST_BY_SLUG,
  QUERY_POSTS_BY_AUTHOR_SLUG_INDEX,
  QUERY_POSTS_BY_AUTHOR_SLUG_ARCHIVE,
  QUERY_POSTS_BY_AUTHOR_SLUG,
  QUERY_POSTS_BY_CATEGORY_ID_INDEX,
  QUERY_POSTS_BY_CATEGORY_ID_ARCHIVE,
  QUERY_POSTS_BY_CATEGORY_ID,
  QUERY_POST_SEO_BY_SLUG,
  QUERY_POST_PER_PAGE,
  QUERY_DRAFT_POSTS,
  QUERY_POSTS_BY_YEAR,
  QUERY_POSTS_BY_MONTH,
  QUERY_POSTS_BY_DAY,
} from '@/data/posts';

/**
 * postPathBySlug
 */

export function postPathBySlug(slug) {
  return `/posts/${slug}`;
}

/**
 * getPostBySlug
 */

export async function getPostBySlug(slug) {
  const { data } = await client.query({
    query: gql`
      query PostBySlug($slug: String!) {
        postBy(slug: $slug) {
          id
          title
          slug
          date
          content
          excerpt
          featuredImage {
            node {
              sourceUrl
            }
          }
          author {
            node {
              name
              slug
              description
              avatar {
                url
              }
            }
          }
          categories {
            nodes {
              name
              slug
            }
          }
          tags {
            nodes {
              name
              slug
            }
          }
        }
      }
    `,
    variables: { slug },
  });

  return data.postBy;
}

/**
 * getAllPosts
 */

const allPostsIncludesTypes = {
  all: QUERY_ALL_POSTS,
  archive: QUERY_ALL_POSTS_ARCHIVE,
  index: QUERY_ALL_POSTS_INDEX,
};

export async function getAllPosts() {
  const { data } = await client.query({
    query: gql`
      query AllPosts {
        posts(first: 100) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                slug
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
  });

  return data.posts.nodes;
}

/**
 * getPostsByAuthorSlug
 */

const postsByAuthorSlugIncludesTypes = {
  all: QUERY_POSTS_BY_AUTHOR_SLUG,
  archive: QUERY_POSTS_BY_AUTHOR_SLUG_ARCHIVE,
  index: QUERY_POSTS_BY_AUTHOR_SLUG_INDEX,
};

export async function getPostsByAuthorSlug({ slug, ...options }) {
  const { queryIncludes = 'index' } = options;

  const apolloClient = getApolloClient();

  let postData;

  try {
    postData = await apolloClient.query({
      query: postsByAuthorSlugIncludesTypes[queryIncludes],
      variables: {
        slug,
      },
    });
  } catch (e) {
    console.log(
      `[posts][getPostsByAuthorSlug] Failed to query post data: ${e.message}`
    );
    throw e;
  }

  const posts = postData?.data.posts.edges.map(({ node = {} }) => node);

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
  };
}

/**
 * getPostsByCategoryId
 */

const postsByCategoryIdIncludesTypes = {
  all: QUERY_POSTS_BY_CATEGORY_ID,
  archive: QUERY_POSTS_BY_CATEGORY_ID_ARCHIVE,
  index: QUERY_POSTS_BY_CATEGORY_ID_INDEX,
};

export async function getPostsByCategoryId({ categoryId, ...options }) {
  const { queryIncludes = 'index' } = options;

  const apolloClient = getApolloClient();

  let postData;

  try {
    postData = await apolloClient.query({
      query: postsByCategoryIdIncludesTypes[queryIncludes],
      variables: {
        categoryId,
      },
    });
  } catch (e) {
    console.log(
      `[posts][getPostsByCategoryId] Failed to query post data: ${e.message}`
    );
    throw e;
  }

  const posts = postData?.data.posts.edges.map(({ node = {} }) => node);

  return {
    posts: Array.isArray(posts) && posts.map(mapPostData),
  };
}

/**
 * getRecentPosts
 */

export async function getRecentPosts({ count, ...options }) {
  const { posts } = await getAllPosts(options);
  const sorted = sortObjectsByDate(posts);
  return {
    posts: sorted.slice(0, count),
  };
}

/**
 * sanitizeExcerpt
 */

export function sanitizeExcerpt(excerpt) {
  if (typeof excerpt !== 'string') {
    throw new Error(
      `Failed to sanitize excerpt: invalid type ${typeof excerpt}`
    );
  }

  let sanitized = excerpt;

  // If the theme includes [...] as the more indication, clean it up to just ...

  sanitized = sanitized.replace(/\s?\[&hellip;\]/, '&hellip;');

  // If after the above replacement, the ellipsis includes 4 dots, it's
  // the end of a setence

  sanitized = sanitized.replace('....', '.');
  sanitized = sanitized.replace('.&hellip;', '.');

  // If the theme is including a "Continue..." link, remove it

  sanitized = sanitized.replace(/\w*<a class="more-link".*<\/a>/, '');

  return sanitized;
}

/**
 * mapPostData
 */

export function mapPostData(post = {}) {
  const data = { ...post };

  // Clean up the author object to avoid someone having to look an extra
  // level deeper into the node

  if (data.author) {
    data.author = {
      ...data.author.node,
    };
  }

  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  if (data.author?.avatar) {
    data.author.avatar = updateUserAvatar(data.author.avatar);
  }

  // Clean up the categories to make them more easy to access

  if (data.categories) {
    data.categories = data.categories.edges.map(({ node }) => {
      return {
        ...node,
      };
    });
  }

  // Clean up the featured image to make them more easy to access

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  return data;
}

/**
 * getRelatedPosts
 */

export async function getRelatedPosts(categories, postId, count = 5) {
  if (!Array.isArray(categories) || categories.length === 0) return;

  let related = {
    category: categories && categories.shift(),
  };

  if (related.category) {
    const { posts } = await getPostsByCategoryId({
      categoryId: related.category.databaseId,
      queryIncludes: 'archive',
    });

    const filtered = posts.filter(({ postId: id }) => id !== postId);
    const sorted = sortObjectsByDate(filtered);

    related.posts = sorted.map((post) => ({
      title: post.title,
      slug: post.slug,
    }));
  }

  if (!Array.isArray(related.posts) || related.posts.length === 0) {
    const relatedPosts = await getRelatedPosts(categories, postId, count);
    related = relatedPosts || related;
  }

  if (Array.isArray(related.posts) && related.posts.length > count) {
    return related.posts.slice(0, count);
  }

  return related;
}

/**
 * sortStickyPosts
 */

export function sortStickyPosts(posts) {
  return [...posts].sort((post) => (post.isSticky ? -1 : 1));
}

/**
 * getPostsPerPage
 */

export async function getPostsPerPage() {
  //If POST_PER_PAGE is defined at next.config.js
  if (process.env.POSTS_PER_PAGE) {
    console.warn(
      'You are using the deprecated POST_PER_PAGE variable. Use your WordPress instance instead to set this value ("Settings" > "Reading" > "Blog pages show at most").'
    );
    return Number(process.env.POSTS_PER_PAGE);
  }

  try {
    const apolloClient = getApolloClient();

    const { data } = await apolloClient.query({
      query: QUERY_POST_PER_PAGE,
    });

    return Number(data.allSettings.readingSettingsPostsPerPage);
  } catch (e) {
    console.log(`Failed to query post per page data: ${e.message}`);
    throw e;
  }
}

/**
 * getPageCount
 */

export async function getPagesCount(posts, postsPerPage) {
  const _postsPerPage = postsPerPage ?? (await getPostsPerPage());
  return Math.ceil(posts.length / _postsPerPage);
}

/**
 * getPaginatedPosts
 */

export async function getPaginatedPosts(page = 1, perPage = 10) {
  const { data } = await client.query({
    query: gql`
      query PaginatedPosts($page: Int!, $perPage: Int!) {
        posts(where: { offsetPagination: { offset: $page, size: $perPage } }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                slug
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
          pageInfo {
            offsetPagination {
              total
            }
          }
        }
      }
    `,
    variables: { page: (page - 1) * perPage, perPage },
  });

  return {
    posts: data.posts.nodes,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(data.posts.pageInfo.offsetPagination.total / perPage),
    },
  };
}

/**
 * getDraftPosts
 */
export async function getDraftPosts(options = {}) {
  const { queryIncludes = 'index' } = options;

  const apolloClient = getApolloClient();

  try {
    const data = await apolloClient.query({
      query: QUERY_DRAFT_POSTS,
    });

    const posts = data?.data.posts.edges.map(({ node = {} }) => node);

    return {
      posts: Array.isArray(posts) && posts.map(mapPostData),
    };
  } catch (e) {
    console.log(
      `[posts][getDraftPosts] Failed to query draft posts data: ${e.message}`
    );
    throw e;
  }
}

/**
 * getPostsByYear
 */
export async function getPostsByYear({ year }) {
  const apolloClient = getApolloClient();

  try {
    const data = await apolloClient.query({
      query: QUERY_POSTS_BY_YEAR,
      variables: {
        year: parseInt(year),
      },
    });

    const posts = data?.data.posts.edges.map(({ node = {} }) => node);

    return {
      posts: Array.isArray(posts) && posts.map(mapPostData),
    };
  } catch (e) {
    console.log(
      `[posts][getPostsByYear] Failed to query posts by year: ${e.message}`
    );
    throw e;
  }
}

/**
 * getPostsByMonth
 */
export async function getPostsByMonth({ year, month }) {
  const apolloClient = getApolloClient();

  try {
    const data = await apolloClient.query({
      query: QUERY_POSTS_BY_MONTH,
      variables: {
        year: parseInt(year),
        month: parseInt(month),
      },
    });

    const posts = data?.data.posts.edges.map(({ node = {} }) => node);

    return {
      posts: Array.isArray(posts) && posts.map(mapPostData),
    };
  } catch (e) {
    console.log(
      `[posts][getPostsByMonth] Failed to query posts by month: ${e.message}`
    );
    throw e;
  }
}

/**
 * getPostsByDay
 */
export async function getPostsByDay({ year, month, day }) {
  const apolloClient = getApolloClient();

  try {
    const data = await apolloClient.query({
      query: QUERY_POSTS_BY_DAY,
      variables: {
        year: parseInt(year),
        month: parseInt(month),
        day: parseInt(day),
      },
    });

    const posts = data?.data.posts.edges.map(({ node = {} }) => node);

    return {
      posts: Array.isArray(posts) && posts.map(mapPostData),
    };
  } catch (e) {
    console.log(
      `[posts][getPostsByDay] Failed to query posts by day: ${e.message}`
    );
    throw e;
  }
}

/**
 * getYearArchives
 * Gets all years that have posts
 */
export async function getYearArchives() {
  const { posts } = await getAllPosts({
    queryIncludes: 'index',
  });

  // Get unique years from post dates
  const years = [
    ...new Set(posts.map((post) => new Date(post.date).getFullYear())),
  ].sort((a, b) => b - a); // Sort descending

  return years;
}

export async function getPostsByCategory(category) {
  const { data } = await client.query({
    query: gql`
      query PostsByCategory($category: String!) {
        posts(where: { categoryName: $category }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                slug
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
    variables: { category },
  });

  return data.posts.nodes;
}

export async function getPostsByAuthor(author) {
  const { data } = await client.query({
    query: gql`
      query PostsByAuthor($author: String!) {
        posts(where: { authorName: $author }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                slug
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
    variables: { author },
  });

  return data.posts.nodes;
}

export async function getPostsByTag(tag) {
  const { data } = await client.query({
    query: gql`
      query PostsByTag($tag: String!) {
        posts(where: { tag: $tag }) {
          nodes {
            id
            title
            slug
            date
            excerpt
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                slug
              }
            }
            categories {
              nodes {
                name
                slug
              }
            }
            tags {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    `,
    variables: { tag },
  });

  return data.posts.nodes;
}
