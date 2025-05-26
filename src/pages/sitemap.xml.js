const createSitemap = () => {
  const baseUrl = 'https://madaratalkon.com';
  const currentDate = new Date().toISOString();
  
  // Define different update frequencies and priorities for different page types
  const pages = [
    // Homepage - highest priority, updated daily
    {
      url: '',
      changefreq: 'daily',
      priority: '1.0',
      lastmod: currentDate
    },
    
    // Main navigation pages - high priority
    {
      url: '/destinations',
      changefreq: 'weekly',
      priority: '0.9',
      lastmod: currentDate
    },
    {
      url: '/trips',
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
    
    // Specific trip pages - high priority for SEO
    {
      url: '/turkey-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/georgia-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/azerbaijan-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/italy-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/bosnia-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/poland-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/russia-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/london-scotland-trip',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/cruise-italy-spain-france',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/trabzon-wider-north-turkey',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/international-licence-trip',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/schengen-visa-trip',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    
    // Popular destination trip pages - high priority for SEO
    {
      url: '/destinations/turkey/trips',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destinations/georgia/trips',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destinations/azerbaijan/trips',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destinations/italy/trips',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destinations/bosnia/trips',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/destinations/poland/trips',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    
    // Package category pages
    {
      url: '/packages',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/packages/honeymoon',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/packages/family',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/packages/adventure',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/packages/luxury',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/packages/budget',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/packages/religious',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/packages/medical',
      changefreq: 'weekly',
      priority: '0.7',
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
    
    // Thank you and confirmation pages
    {
      url: '/thank-you-citizen',
      changefreq: 'yearly',
      priority: '0.3',
      lastmod: currentDate
    },
    {
      url: '/thank-you-resident',
      changefreq: 'yearly',
      priority: '0.3',
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
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
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
    // Generate the XML sitemap with only Next.js pages
    const sitemap = createSitemap();

    // Set proper headers for XML sitemap
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=43200');
    res.setHeader('X-Robots-Tag', 'noindex'); // Prevent sitemap itself from being indexed
    
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
