import { getApolloClient } from '@/lib/apollo-client';

import parameterize from 'parameterize';

import {
  QUERY_ALL_USERS,
  QUERY_USER_BY_SLUG,
  QUERY_ALL_USERS_SEO,
} from '@/data/users';

// const ROLES_AUTHOR = ['author', 'administrator'];

/**
 * postPathBySlug
 */

export function authorPathBySlug(slug) {
  return `/authors/${slug}`;
}

/**
 * getUserBySlug
 */

export async function getUserBySlug(slug) {
  const { users } = await getAllUsers();

  const user = users.find((user) => user.slug === slug);

  return {
    user,
  };
}

/**
 * authorPathByName
 */

export function authorPathByName(name) {
  return `/authors/${parameterize(name)}`;
}

/**
 * getUserByNameSlug
 */

export async function getUserByNameSlug(slug) {
  try {
    const response = await fetch(
      `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/users?slug=${slug}`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const data = await response.json();

    if (data.length === 0) {
      return { user: undefined };
    }

    const author = data[0];

    return {
      user: {
        id: author.id,
        name: author.name,
        slug: author.slug,
        description: author.description,
        avatar: {
          url: author.avatar_urls?.[96] || '',
        },
      },
    };
  } catch (error) {
    console.error(
      `[getUserByNameSlug] Error fetching user with slug ${slug}:`,
      error
    );
    return { user: undefined };
  }
}

/**
 * userSlugByName
 */

export function userSlugByName(name) {
  return parameterize(name);
}

/**
 * getAllUsers
 */

export async function getAllUsers() {
  try {
    const response = await fetch(
      'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/users',
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.status}`);
    }

    const data = await response.json();

    const users = data.map((user) => ({
      id: user.id,
      name: user.name || '',
      slug: user.slug || '',
      description: user.description || '',
      avatar: {
        url: user.avatar_urls?.[96] || '',
      },
      roles: user.roles || [],
      // Add additional fields as needed
    }));

    return { users };
  } catch (error) {
    console.error('[getAllUsers] Error:', error);
    return { users: [] };
  }
}

/**
 * getAllAuthors
 */

export async function getAllAuthors() {
  try {
    const response = await fetch(
      'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/users',
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch authors: ${response.status}`);
    }

    const data = await response.json();

    const authors = data.map((author) => ({
      id: author.id,
      name: author.name || '',
      slug: author.slug || '',
      description: author.description || '',
      avatar: {
        url: author.avatar_urls?.[96] || '',
      },
    }));

    return { authors };
  } catch (error) {
    console.error('[getAllAuthors] Error:', error);
    return { authors: [] };
  }
}

/**
 * mapUserData
 */

export function mapUserData(user) {
  return {
    ...user,
    roles: user.roles || [],
    avatar: user.avatar && updateUserAvatar(user.avatar),
  };
}

/**
 * updateUserAvatar
 */

export function updateUserAvatar(avatar) {
  // The URL by default that comes from Gravatar / WordPress is not a secure
  // URL. This ends up redirecting to https, but it gives mixed content warnings
  // as the HTML shows it as http. Replace the url to avoid those warnings
  // and provide a secure URL by default

  return {
    ...avatar,
    url: avatar.url?.replace('http://', 'https://'),
  };
}

export async function getPostsByAuthorSlug({ slug, ...options }) {
  try {
    const response = await fetch(
      `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/posts?author_name=${slug}&_embed`,
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent':
            'Mozilla/5.0 (compatible; MadaratBot/1.0; +https://madaratalkon.com)',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch posts for author: ${response.status}`);
    }

    const data = await response.json();

    const posts = data.map((post) => ({
      id: post.id,
      title: post.title.rendered,
      slug: post.slug,
      date: post.date,
      content: post.content.rendered,
      excerpt: post.excerpt?.rendered,
      author: post._embedded?.author?.[0]
        ? {
            name: post._embedded.author[0].name,
            slug: post._embedded.author[0].slug,
          }
        : null,
      categories:
        post._embedded?.['wp:term']?.[0]?.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })) || [],
      featuredImage: post._embedded?.['wp:featuredmedia']?.[0]
        ? {
            sourceUrl: post._embedded['wp:featuredmedia'][0].source_url,
          }
        : null,
    }));

    return { posts };
  } catch (error) {
    console.error(
      `[getPostsByAuthorSlug] Error fetching posts for author ${slug}:`,
      error
    );
    return { posts: [] };
  }
}
