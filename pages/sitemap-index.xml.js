const createSitemapIndex = () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Define all sitemaps with their purposes
  const sitemaps = [
    {
      loc: `${baseUrl}/sitemap.xml`,
      lastmod: currentDate,
      description: 'Static pages and main navigation'
    },
    {
      loc: `${baseUrl}/sitemap-posts.xml`,
      lastmod: currentDate,
      description: 'Blog posts and articles'
    },
    {
      loc: `${baseUrl}/sitemap-trips.xml`,
      lastmod: currentDate,
      description: 'Trip packages (page 1)'
    },
    {
      loc: `${baseUrl}/sitemap-trips-2.xml`,
      lastmod: currentDate,
      description: 'Trip packages (page 2)'
    },
    {
      loc: `${baseUrl}/sitemap-trips-3.xml`,
      lastmod: currentDate,
      description: 'Trip packages (page 3)'
    },
    {
      loc: `${baseUrl}/sitemap-destinations.xml`,
      lastmod: currentDate,
      description: 'Destination pages'
    }
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
};

export default function SitemapIndexXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate the XML sitemap index
    const sitemapIndex = createSitemapIndex();

    // Set proper headers for XML sitemap index
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    res.setHeader('X-Robots-Tag', 'noindex');
    
    res.write(sitemapIndex);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap index:', error);
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Internal Server Error');
    res.end();

    return {
      props: {},
    };
  }
} 