import JsonLd from '@/components/JsonLd';
import config from '../../package.json';

import { authorPathByName } from '@/lib/users';
import { postPathBySlug } from '@/lib/posts';
import { pagePathBySlug } from '@/lib/pages';

export function ArticleJsonLd({ post = {}, siteTitle = '' }) {
  const { homepage = '' } = config;
  const {
    title,
    slug,
    excerpt,
    date,
    author,
    categories,
    modified,
    featuredImage,
  } = post;
  const path = postPathBySlug(slug);
  const datePublished = !!date && new Date(date);
  const dateModified = !!modified && new Date(modified);

  /** TODO - As image is a recommended field,
   * we should set this to the image URL when implemented.
   */

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${homepage}${path}`,
    },
    headline: title,
    datePublished: datePublished ? datePublished.toISOString() : '',
    dateModified: dateModified
      ? dateModified.toISOString()
      : (datePublished?.toISOString() ?? ''),
    description: excerpt,
    image: featuredImage?.sourceUrl ? [featuredImage.sourceUrl] : [],
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${homepage}/logo.png`,
      },
    },
  };

  if (author) {
    jsonLd.author = {
      '@type': 'Person',
      name: author.name,
    };
  }

  return <JsonLd data={jsonLd} />;
}

export function WebsiteJsonLd({ siteTitle = '' }) {
  const { homepage = '' } = config;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteTitle,
    url: homepage,
    copyrightYear: new Date().getFullYear(),
    potentialAction: {
      '@type': 'SearchAction',
      target: `${homepage}/search/?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return <JsonLd data={jsonLd} />;
}

export function WebpageJsonLd({
  title = '',
  description = '',
  siteTitle = '',
  slug = '',
}) {
  const { homepage = '' } = config;
  const path = pagePathBySlug(slug);

  const jsonLd = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: title,
    description: description,
    url: `${homepage}${path}`,
    publisher: {
      '@type': 'ProfilePage',
      name: siteTitle,
    },
  };

  return <JsonLd data={jsonLd} />;
}

export function AuthorJsonLd({ author = {} }) {
  const { homepage = '' } = config;
  const { name, avatar, description } = author;
  const path = authorPathByName(name);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: name,
    image: avatar?.url,
    url: `${homepage}${path}`,
    description: description,
  };

  return <JsonLd data={jsonLd} />;
}

export function LogoJsonLd() {
  const { homepage = '', faviconPath = '/favicon.ico' } = config;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: `${homepage}`,
    logo: `${homepage}${faviconPath}`,
  };

  return <JsonLd data={jsonLd} />;
}
