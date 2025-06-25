import { getAllTrips } from '@/lib/trips';

const createTripsSitemap = async () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Fetch all trips from WordPress REST API
  let trips = [];
  
  try {
    // Fetch all trips (109 total) 
    const tripsData = await getAllTrips({ per_page: 100 });
    trips = tripsData.trips || [];
    console.log(`[Sitemap] Fetched ${trips.length} trips from REST API`);
  } catch (error) {
    console.error('Error fetching trips for sitemap:', error);
  }
  
  // Get only first 50 trips for this sitemap (page 1)
  const tripsPage1 = trips.slice(0, 50);
  
  // Create URLs for first 50 trips ONLY - static trip pages are in main sitemap
  const tripUrls = tripsPage1.map(trip => {
    // Decode the URL-encoded slug for proper sitemap URLs
    const decodedSlug = decodeURIComponent(trip.slug);
    return {
      url: `/trip/${decodedSlug}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: trip.modified || trip.date || currentDate
    };
  });
  
  // Remove duplicates if any exist
  const uniqueTripUrls = tripUrls.filter((trip, index, self) => 
    index === self.findIndex(t => t.url === trip.url)
  );
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${uniqueTripUrls.map(page => `  <url>
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