import { getAllTrips } from '@/lib/trips';

const createTripsSitemapIndex = async () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Fetch trips to determine how many sitemap files we need
  let totalTrips = 0;
  
  try {
    const tripsData = await getAllTrips({ per_page: 200 });
    totalTrips = tripsData.trips?.length || 0;
  } catch (error) {
    console.error('Error fetching trips count for sitemap index:', error);
  }
  
  // Calculate number of sitemap files needed (50 trips per sitemap)
  const tripsPerSitemap = 50;
  const numberOfSitemaps = Math.ceil(totalTrips / tripsPerSitemap);
  
  // Create sitemap entries for trips
  const tripSitemaps = [];
  
  // Main trips sitemap (contains static pages + first batch of trips)
  tripSitemaps.push({
    loc: `${baseUrl}/sitemap-trips.xml`,
    lastmod: currentDate
  });
  
  // Additional trip sitemaps if needed
  for (let i = 2; i <= numberOfSitemaps; i++) {
    tripSitemaps.push({
      loc: `${baseUrl}/sitemap-trips-${i}.xml`,
      lastmod: currentDate
    });
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${tripSitemaps.map(sitemap => `  <sitemap>
    <loc>${sitemap.loc}</loc>
    <lastmod>${sitemap.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
};

export default function TripsSitemapIndexXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate the trips XML sitemap index
    const sitemapIndex = await createTripsSitemapIndex();

    // Set proper headers for XML sitemap index
    res.setHeader('Content-Type', 'text/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=21600, stale-while-revalidate=43200');
    res.setHeader('X-Robots-Tag', 'noindex');
    
    res.write(sitemapIndex);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating trips sitemap index:', error);
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Internal Server Error');
    res.end();

    return {
      props: {},
    };
  }
} 