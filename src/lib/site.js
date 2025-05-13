import { getSiteMetadataREST } from '@/lib/rest-api';
import { decodeHtmlEntities, removeExtraSpaces } from '@/lib/util';

/**
 * getSiteMetadata
 */

export async function getSiteMetadata() {
  return getSiteMetadataREST();
}

/**
 * Default metadata values
 */

export const defaultMetadata = {
  title: 'مدارات الكون',
  siteTitle: 'مدارات الكون',
  description: 'موقع السفر والرحلات الأول في الوطن العربي',
};

/**
 * constructMetadata
 */

export function constructMetadata(source = {}) {
  const { title, description, ...rest } = source;

  return {
    title:
      removeExtraSpaces(decodeHtmlEntities(title)) || defaultMetadata.title,
    description:
      removeExtraSpaces(decodeHtmlEntities(description)) ||
      defaultMetadata.description,
    ...rest,
  };
}

export function helmetSettingsFromMetadata(metadata = {}) {
  const { title, description, canonical, robots, og, twitter } = metadata;

  return {
    title,
    description,
    ...(canonical && {
      link: [
        {
          rel: 'canonical',
          href: canonical,
        },
      ],
    }),
    ...(robots && {
      meta: [
        {
          name: 'robots',
          content: robots,
        },
      ],
    }),
    ...(og && {
      meta: [
        {
          property: 'og:title',
          content: og.title || title,
        },
        {
          property: 'og:description',
          content: og.description || description,
        },
        {
          property: 'og:type',
          content: og.type,
        },
        {
          property: 'og:url',
          content: og.url,
        },
        {
          property: 'og:site_name',
          content: og.siteName,
        },
        {
          property: 'og:image',
          content: og.image?.url,
        },
      ],
    }),
    ...(twitter && {
      meta: [
        {
          name: 'twitter:card',
          content: twitter.card,
        },
        {
          name: 'twitter:creator',
          content: twitter.creator,
        },
        {
          name: 'twitter:description',
          content: twitter.description || description,
        },
        {
          name: 'twitter:title',
          content: twitter.title || title,
        },
      ],
    }),
  };
}

/**
 * constructPageMetadata
 */

export function constructPageMetadata(
  defaultMetadata = {},
  pageMetadata = {},
  options = {}
) {
  const { title, description } = pageMetadata;
  const url = options.router?.asPath;
  const pathname = options.router?.pathname;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  const isHome = pathname === '/' || pathname === '/[[...slug]]';
  let pageTitle = title || defaultMetadata.title;

  if (!isHome && defaultMetadata.siteTitle) {
    pageTitle = `${pageTitle} - ${defaultMetadata.siteTitle}`;
  }

  return {
    canonical:
      pageMetadata.canonical ||
      (url && `${options.homepage || basePath}${url}`),
    description: description || defaultMetadata.description,
    og: {
      description:
        pageMetadata.og?.description ||
        description ||
        defaultMetadata.og?.description,
      image: pageMetadata.og?.image || defaultMetadata.og?.image,
      title: pageMetadata.og?.title || pageTitle,
      type: pageMetadata.og?.type || 'website',
      url:
        pageMetadata.og?.url ||
        (url && `${options.homepage || basePath}${url}`),
      siteName: pageMetadata.og?.siteName || defaultMetadata.siteTitle,
    },
    robots: pageMetadata.robots || null,
    title: pageTitle,
    twitter: {
      card: pageMetadata.twitter?.card || 'summary_large_image',
      creator: pageMetadata.twitter?.creator || '@madaratalkon',
      description:
        pageMetadata.twitter?.description ||
        description ||
        defaultMetadata.twitter?.description,
      image: pageMetadata.twitter?.image || defaultMetadata.twitter?.image,
      title: pageMetadata.twitter?.title || pageTitle,
    },
  };
}
