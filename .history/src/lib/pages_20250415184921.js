import { getApolloClient } from '@/lib/apollo-client';

import {
  QUERY_ALL_PAGES_INDEX,
  QUERY_ALL_PAGES_ARCHIVE,
  QUERY_ALL_PAGES,
  QUERY_PAGE_BY_URI,
  QUERY_PAGE_SEO_BY_URI,
} from '@/data/pages';

/**
 * pagePathBySlug
 */

export function pagePathBySlug(slug) {
  return `/${slug}`;
}

/**
 * getPageByUri
 */

export async function getPageByUri(uri) {
  const apolloClient = getApolloClient();
  const apiHost = new URL(process.env.WORDPRESS_GRAPHQL_ENDPOINT).host;

  let pageData;
  let seoData;

  try {
    pageData = await apolloClient.query({
      query: QUERY_PAGE_BY_URI,
      variables: {
        uri,
      },
    });
  } catch (e) {
    console.log(
      `[pages][getPageByUri] Failed to query page data for URI ${uri}: ${e.message}`
    );
    return { page: undefined };
  }

  if (!pageData?.data.page) {
    console.log(`[pages][getPageByUri] No page data found for URI ${uri}`);
    return { page: undefined };
  }

  // Use mapPageData to shape the data
  const page = [pageData?.data.page].map(mapPageData)[0];

  // If the SEO plugin is enabled, look up the data
  // and apply it to the default settings

  if (process.env.WORDPRESS_PLUGIN_SEO === true) {
    try {
      seoData = await apolloClient.query({
        query: QUERY_PAGE_SEO_BY_URI,
        variables: {
          uri,
        },
      });
    } catch (e) {
      console.log(
        `[pages][getPageByUri] Failed to query SEO plugin for URI ${uri}: ${e.message}`
      );
      console.log(
        'Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.'
      );
      // Continue without SEO data instead of throwing
    }

    if (seoData?.data?.page?.seo) {
      const { seo = {} } = seoData.data.page;

      page.metaTitle = seo.title;
      page.description = seo.metaDesc;
      page.readingTime = seo.readingTime;

      if (seo.canonical && !seo.canonical.includes(apiHost)) {
        page.canonical = seo.canonical;
      }

      page.og = {
        author: seo.opengraphAuthor,
        description: seo.opengraphDescription,
        image: seo.opengraphImage,
        modifiedTime: seo.opengraphModifiedTime,
        publishedTime: seo.opengraphPublishedTime,
        publisher: seo.opengraphPublisher,
        title: seo.opengraphTitle,
        type: seo.opengraphType,
      };

      page.robots = {
        nofollow: seo.metaRobotsNofollow,
        noindex: seo.metaRobotsNoindex,
      };

      page.twitter = {
        description: seo.twitterDescription,
        image: seo.twitterImage,
        title: seo.twitterTitle,
      };
    }
  }

  return {
    page, // This now includes the mapped ancestors
  };
}

/**
 * getAllPages
 */

const allPagesIncludesTypes = {
  all: QUERY_ALL_PAGES,
  archive: QUERY_ALL_PAGES_ARCHIVE,
  index: QUERY_ALL_PAGES_INDEX,
};

export async function getAllPages(options = {}) {
  const { queryIncludes = 'index' } = options;

  const apolloClient = getApolloClient();

  const data = await apolloClient.query({
    query: allPagesIncludesTypes[queryIncludes],
  });

  const pages = data?.data.pages.edges
    .map(({ node = {} }) => node)
    .map(mapPageData);

  return {
    pages,
  };
}

/**
 * getTopLevelPages
 */

export async function getTopLevelPages(options) {
  const { pages } = await getAllPages(options);

  const navPages = pages.filter(({ parent }) => parent === null);

  // Order pages by menuOrder
  navPages.sort((a, b) => parseFloat(a.menuOrder) - parseFloat(b.menuOrder));

  return navPages;
}

/**
 * mapPageData
 */

export function mapPageData(page = {}) {
  const data = { ...page };

  if (data.featuredImage) {
    data.featuredImage = data.featuredImage.node;
  }

  if (data.parent) {
    data.parent = data.parent.node;
  }

  if (data.children) {
    data.children = data.children.edges.map(({ node }) => node);
  }

  // Map ancestors to a simpler format for breadcrumbs
  if (data.ancestors) {
    // The ancestors query returns nodes, so we map them directly
    // It also returns them in the correct order (top-level parent first)
    data.ancestors = data.ancestors.nodes.map((node) => ({
      id: node.id,
      title: node.title,
      uri: node.uri,
    }));
  } else {
    // Ensure ancestors is always an array, even if null/undefined from GraphQL
    data.ancestors = [];
  }

  return data;
}

/**
 * getBreadcrumbsByUri
 */

// This function is no longer needed if we use page.ancestors directly
// Keeping it here for now, but it should be removed later if the refactor works.
export function getBreadcrumbsByUri(uri, pages) {
  const breadcrumbs = [];
  const uriSegments = uri.split('/').filter((segment) => segment !== '');

  // We don't want to show the current page in the breadcrumbs, so pop off
  // the last chunk before we start

  uriSegments.pop();

  // Work through each of the segments, popping off the last chunk and finding the related
  // page to gather the metadata for the breadcrumbs

  do {
    const breadcrumb = pages.find(
      (page) => page.uri === `/${uriSegments.join('/')}/`
    );

    // If the breadcrumb is the active page, we want to pass udefined for the uri to
    // avoid the breadcrumbs being rendered as a link, given it's the current page

    if (breadcrumb) {
      breadcrumbs.push({
        id: breadcrumb.id,
        title: breadcrumb.title,
        uri: breadcrumb.uri,
      });
    }

    uriSegments.pop();
  } while (uriSegments.length > 0);

  // When working through the segments, we're doing so from the lowest child to the parent
  // which means the parent will be at the end of the array. We need to reverse to show
  // the correct order for breadcrumbs

  breadcrumbs.reverse();

  return breadcrumbs;
}
