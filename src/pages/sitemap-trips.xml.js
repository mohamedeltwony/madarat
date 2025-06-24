import { getAllTrips } from '@/lib/trips';

const createTripsSitemap = async () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Fetch all trips
  let trips = [];
  
  try {
    const tripsData = await getAllTrips({ first: 2000 });
    trips = tripsData.trips || [];
  } catch (error) {
    console.error('Error fetching trips for sitemap:', error);
  }
  
  // Create URLs for trips
  const tripUrls = trips.map(trip => ({
    url: `/trip/${trip.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: trip.modified || trip.date || currentDate
  }));
  
  // Add static trip-related pages
  const staticTripPages = [
    {
      url: '/trip',
      changefreq: 'daily',
      priority: '0.9',
      lastmod: currentDate
    },
    {
      url: '/book-now',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/offers',
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: currentDate
    }
  ];
  
  const allTripPages = [...staticTripPages, ...tripUrls];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allTripPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export default function TripsSitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate the trips XML sitemap
    const sitemap = await createTripsSitemap();

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
    console.error('Error generating trips sitemap:', error);
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Internal Server Error');
    res.end();

    return {
      props: {},
    };
  }
} 