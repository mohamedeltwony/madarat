import { getPaginatedPosts } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';

const createSitemap = (posts = [], categories = [], trips = [], destinations = []) => {
  const baseUrl = 'https://madaratalkon.com';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
            xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
      <!-- Homepage -->
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      
      <!-- Main Pages -->
      <url>
        <loc>${baseUrl}/posts</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${baseUrl}/destinations</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${baseUrl}/trips</loc>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
        <lastmod>${new Date().toISOString()}</lastmod>
      </url>
      <url>
        <loc>${baseUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      <url>
        <loc>${baseUrl}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>
      
      <!-- Categories -->
      ${categories
        .map((category) => {
          return `
        <url>
          <loc>${baseUrl}/categories/${category.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
          <lastmod>${category.modified || new Date().toISOString()}</lastmod>
        </url>`;
        })
        .join('')}
        
      <!-- Blog Posts -->
      ${posts
        .map((post) => {
          const imageTag = post.featuredImage?.sourceUrl ? `
        <image:image>
          <image:loc>${post.featuredImage.sourceUrl}</image:loc>
          <image:title>${post.title}</image:title>
          <image:caption>${post.excerpt || post.title}</image:caption>
        </image:image>` : '';
          
          return `
        <url>
          <loc>${baseUrl}/posts/${post.slug}</loc>
          <lastmod>${post.modified || post.date}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.8</priority>${imageTag}
        </url>`;
        })
        .join('')}
        
      <!-- Trip Pages -->
      ${trips
        .map((trip) => {
          const imageTag = trip.featuredImage?.sourceUrl ? `
        <image:image>
          <image:loc>${trip.featuredImage.sourceUrl}</image:loc>
          <image:title>${trip.title}</image:title>
          <image:caption>${trip.excerpt || trip.title}</image:caption>
        </image:image>` : '';
          
          return `
        <url>
          <loc>${baseUrl}/trips/${trip.slug}</loc>
          <lastmod>${trip.modified || trip.date}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>${imageTag}
        </url>`;
        })
        .join('')}
        
      <!-- Destination Pages -->
      ${destinations
        .map((destination) => {
          const imageTag = destination.featuredImage?.sourceUrl ? `
        <image:image>
          <image:loc>${destination.featuredImage.sourceUrl}</image:loc>
          <image:title>${destination.title}</image:title>
          <image:caption>${destination.excerpt || destination.title}</image:caption>
        </image:image>` : '';
          
          return `
        <url>
          <loc>${baseUrl}/destinations/${destination.slug}</loc>
          <lastmod>${destination.modified || destination.date}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>${imageTag}
        </url>`;
        })
        .join('')}
        
      <!-- Legal Pages -->
      <url>
        <loc>${baseUrl}/privacy-policy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
      </url>
      <url>
        <loc>${baseUrl}/terms-conditions</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
      </url>
      <url>
        <loc>${baseUrl}/refund-policy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
      </url>
    </urlset>`;
};

export default function SitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Fetch all posts
    const { posts = [] } = await getPaginatedPosts({
      queryIncludes: 'archive',
    });

    // Fetch all categories
    const categories = await getAllCategories();

    // TODO: Add functions to fetch trips and destinations from WordPress
    // For now, we'll use empty arrays but you should implement these functions
    const trips = []; // await getAllTrips();
    const destinations = []; // await getAllDestinations();

    // Generate the XML sitemap with all data
    const sitemap = createSitemap(posts, categories, trips, destinations);

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.write('Error generating sitemap');
    res.end();

    return {
      props: {},
    };
  }
}
