const createSitemapIndex = () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Define different sitemap files for better organization
  const sitemaps = [
    {
      loc: `${baseUrl}/sitemap.xml`,
      lastmod: currentDate,
      priority: 1.0
    },
    {
      loc: `${baseUrl}/sitemap-posts.xml`,
      lastmod: currentDate,
      priority: 0.8
    },
    {
      loc: `${baseUrl}/sitemap-trips.xml`,
      lastmod: currentDate,
      priority: 0.9
    },
    {
      loc: `${baseUrl}/sitemap-destinations.xml`,
      lastmod: currentDate,
      priority: 0.9
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