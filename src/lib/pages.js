import { getAllPagesREST, getPageByUriREST } from '@/lib/rest-api';

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
  return getPageByUriREST(uri);
}

/**
 * getAllPages
 */

export async function getAllPages() {
  return getAllPagesREST();
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
