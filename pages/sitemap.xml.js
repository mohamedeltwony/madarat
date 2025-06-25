import { getAllPosts } from '@/lib/posts';
import { getAllPages } from '@/lib/pages';
import { getAllTrips } from '@/lib/trips';

const createSitemap = async () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Define ONLY static pages - no dynamic content that appears in other sitemaps
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
    
    // Blog and content pages (main pages only, not individual posts)
    {
      url: '/blog',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/authors',
      changefreq: 'monthly',
      priority: '0.5',
      lastmod: currentDate
    },
    
    // Utility pages
    {
      url: '/sitemap',
      changefreq: 'monthly',
      priority: '0.5',
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
  
  // NOTE: Removed all dynamic content (posts, trips, destination pages) 
  // as they are now handled by specialized sitemaps to eliminate duplications
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
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
    // Generate the XML sitemap with static content only
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
