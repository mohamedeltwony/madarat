import JsonLd from '@/components/JsonLd';
import SITE_CONFIG from '@/lib/config';
import { authorPathByName } from '@/lib/users';
import { postPathBySlug } from '@/lib/posts';
import { pagePathBySlug } from '@/lib/pages';

export function ArticleJsonLd({ 
  post = {}, 
  siteTitle = '',
  title,
  slug,
  excerpt,
  datePublished,
  dateModified,
  authorName,
  description,
  images = []
}) {
  const { homepage = '' } = SITE_CONFIG;
  
  // Support both old post object format and new individual props format
  const articleTitle = title || post.title;
  const articleSlug = slug || post.slug;
  const articleExcerpt = excerpt || description || post.excerpt;
  const articleAuthor = authorName || post.author?.name;
  const articleImages = images.length > 0 ? images : (post.featuredImage?.sourceUrl ? [post.featuredImage.sourceUrl] : []);
  
  // Handle date formatting safely
  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    
    try {
      // If it's already a Date object
      if (dateValue instanceof Date) {
        return dateValue.toISOString();
      }
      
      // If it's a string, try to parse it
      if (typeof dateValue === 'string') {
        const parsedDate = new Date(dateValue);
        if (!isNaN(parsedDate.getTime())) {
          return parsedDate.toISOString();
        }
      }
      
      return '';
    } catch (error) {
      console.warn('Error formatting date:', error);
      return '';
    }
  };
  
  const publishedDate = formatDate(datePublished || post.date);
  const modifiedDate = formatDate(dateModified || post.modified) || publishedDate;
  
  const path = postPathBySlug(articleSlug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${homepage}${path}`,
    },
    headline: articleTitle,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    description: articleExcerpt,
    image: articleImages,
    publisher: {
      '@type': 'Organization',
      name: siteTitle,
      logo: {
        '@type': 'ImageObject',
        url: `${homepage}/logo.png`,
      },
    },
  };

  if (articleAuthor) {
    jsonLd.author = {
      '@type': 'Person',
      name: articleAuthor,
    };
  }

  return <JsonLd data={jsonLd} />;
}

export function WebsiteJsonLd({ siteTitle = '' }) {
  const { homepage = '' } = SITE_CONFIG;

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
  const { homepage = '' } = SITE_CONFIG;
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
  const { homepage = '' } = SITE_CONFIG;
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
  const { homepage = '', faviconPath = '/favicon.ico' } = SITE_CONFIG;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    url: `${homepage}`,
    logo: `${homepage}${faviconPath}`,
  };

  return <JsonLd data={jsonLd} />;
}
