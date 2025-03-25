import { getPaginatedPosts } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';

const createSitemap = (posts = [], categories = []) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url>
        <loc>https://madaratalkon.com</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      <url>
        <loc>https://madaratalkon.com/posts</loc>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
      </url>
      ${categories
        .map((category) => {
          return `
        <url>
          <loc>https://madaratalkon.com/categories/${category.slug}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`;
        })
        .join('')}
      ${posts
        .map((post) => {
          return `
        <url>
          <loc>https://madaratalkon.com/posts/${post.slug}</loc>
          <lastmod>${post.modified || post.date}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>`;
        })
        .join('')}
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

    // Generate the XML sitemap with the posts and categories data
    const sitemap = createSitemap(posts, categories);

    res.setHeader('Content-Type', 'text/xml');
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
