const createDestinationsSitemap = () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Define individual destination pages ONLY - main /destination page is in main sitemap
  const destinationPages = [
    // Popular destinations - high priority for SEO
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
    {
      url: '/destination/russia',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/destination/spain',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/destination/france',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/destination/united-kingdom',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/destination/scotland',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    
    // Regional destination pages
    {
      url: '/destination/europe',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/destination/middle-east',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/destination/asia',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/destination/americas',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/destination/africa',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate
    },
    {
      url: '/destination/oceania',
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: currentDate
    }
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${destinationPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export default function DestinationsSitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate the destinations XML sitemap
    const sitemap = createDestinationsSitemap();

    // Set proper headers for XML sitemap
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=43200');
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
    console.error('Error generating destinations sitemap:', error);
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Internal Server Error');
    res.end();

    return {
      props: {},
    };
  }
} 