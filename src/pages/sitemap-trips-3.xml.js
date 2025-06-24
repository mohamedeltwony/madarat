import { getAllTrips } from '@/lib/trips';

const createTripsPage3Sitemap = async () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Fetch all trips from WordPress REST API
  let trips = [];
  
  try {
    const tripsData = await getAllTrips({ per_page: 200 });
    trips = tripsData.trips || [];
    console.log(`[Sitemap-3] Fetched ${trips.length} trips from REST API`);
  } catch (error) {
    console.error('Error fetching trips for sitemap page 3:', error);
  }
  
  // Get trips 101+ (page 3 - remaining trips)
  const startIndex = 100;
  const tripsPage3 = trips.slice(startIndex);
  
  // Create URLs for trips page 3 with proper URL decoding
  const tripUrls = tripsPage3.map(trip => {
    // Decode the URL-encoded slug for proper sitemap URLs
    const decodedSlug = decodeURIComponent(trip.slug);
    return {
      url: `/trip/${decodedSlug}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: trip.modified || trip.date || currentDate
    };
  });
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tripUrls.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export default function TripsPage3SitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate the trips page 3 XML sitemap
    const sitemap = await createTripsPage3Sitemap();

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
    console.error('Error generating trips page 3 sitemap:', error);
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Internal Server Error');
    res.end();

    return {
      props: {},
    };
  }
} 