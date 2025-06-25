import { getAllPosts } from '@/lib/posts';
import { getAllPages } from '@/lib/pages';
import { getAllTrips } from '@/lib/trips';

const createSitemap = async () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Fetch dynamic content
  let posts = [];
  let pages = [];
  let trips = [];
  
  try {
    const [postsData, pagesData, tripsData] = await Promise.all([
      getAllPosts({ first: 1000 }).catch(() => ({ posts: [] })),
      getAllPages().catch(() => ({ pages: [] })),
      getAllTrips({ first: 1000 }).catch(() => ({ trips: [] }))
    ]);
    
    posts = postsData.posts || [];
    pages = pagesData.pages || [];
    trips = tripsData.trips || [];
  } catch (error) {
    console.error('Error fetching dynamic content for sitemap:', error);
  }
  
  // Define static pages with priorities and change frequencies
  const staticPages = [
    // Homepage - highest priority, updated daily
    {
      url: '',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: currentDate
    },
    
    // Main navigation pages - high priority
    {
      url: '/destination',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: currentDate
    },
    {
      url: '/trip',
      changefreq: 'weekly', 
      priority: '0.9',
      lastmod: currentDate
    },
    {
      url: '/book-now',
      changefreq: 'monthly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/offers',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    
    // About and contact pages
    {
      url: '/about',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/contact',
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/feedback',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    
    // Blog and content pages
    {
      url: '/blog',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/posts',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/categories',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/authors',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: currentDate
    },
    {
      url: '/search',
      changefreq: 'monthly',
      priority: '0.4',
      lastmod: currentDate
    },
    
    // Utility pages
    {
      url: '/sitemap',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: currentDate
    },
    
    // Popular destination pages - high priority for SEO
    {
      url: '/destination/turkey',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destination/georgia',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destination/azerbaijan',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destination/italy',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destination/bosnia',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destination/poland',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    
    // Service pages
    {
      url: '/services',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/services/visa',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/services/flights',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/services/hotels',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/services/transportation',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/services/cruises',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/accommodation',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    },
    
    // Legal and policy pages - lowest priority, rarely updated
    {
      url: '/privacy-policy',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: currentDate
    },
    {
      url: '/terms-conditions',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: currentDate
    },
    {
      url: '/refund-policy',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: currentDate
    },
    {
      url: '/legal-documents',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: currentDate
    }
  ];
  
  // Create dynamic URLs for posts
  const postUrls = posts.map(post => ({
    url: `/posts/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: post.modified || post.date || currentDate
  }));
  
  // Create dynamic URLs for pages
  const pageUrls = pages.map(page => ({
    url: page.uri || `/${page.slug}`,
    changefreq: 'monthly',
    priority: '0.5',
    lastmod: page.modified || page.date || currentDate
  }));
  
  // Create dynamic URLs for trips
  const tripUrls = trips.map(trip => ({
    url: `/trip/${trip.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: trip.modified || trip.date || currentDate
  }));
  
  // Combine all URLs
  const allPages = [
    ...staticPages,
    ...postUrls,
    ...pageUrls,
    ...tripUrls,
  ];
  
  // Remove duplicates and invalid URLs
  const uniquePages = allPages.filter((page, index, self) => 
    index === self.findIndex(p => p.url === page.url) && 
    page.url !== undefined && 
    page.url !== null
  );
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniquePages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export default function SitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate the XML sitemap with dynamic content
    const sitemap = await createSitemap();

    // Set proper headers for XML sitemap with optimized caching
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    
    // Cache for 6 hours, allow stale for 12 hours for better performance
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=43200');
    
    // Prevent sitemap itself from being indexed
    res.setHeader('X-Robots-Tag', 'noindex');
    
    // Add ETag for better caching
    const etag = Buffer.from(sitemap).toString('base64').slice(0, 16);
    res.setHeader('ETag', `"${etag}"`);
    
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return proper error response
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Internal Server Error');
    res.end();

    return {
      props: {},
    };
  }
}
