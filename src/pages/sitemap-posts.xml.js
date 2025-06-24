import { getAllPosts } from '@/lib/posts';

const createPostsSitemap = async () => {
  const baseUrl = 'https://madaratalkon.sa';
  const currentDate = new Date().toISOString();
  
  // Fetch all posts
  let posts = [];
  
  try {
    const postsData = await getAllPosts({ first: 2000 });
    posts = postsData.posts || [];
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
  }
  
  // Create URLs for posts
  const postUrls = posts.map(post => ({
    url: `/posts/${post.slug}`,
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: post.modified || post.date || currentDate
  }));
  
  // Add static blog-related pages
  const staticBlogPages = [
    {
      url: '/blog',
      changefreq: 'daily',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/posts',
      changefreq: 'daily',
      priority: '0.8',
      lastmod: currentDate
    },
    {
      url: '/categories',
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: currentDate
    },
    {
      url: '/authors',
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: currentDate
    }
  ];
  
  const allBlogPages = [...staticBlogPages, ...postUrls];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allBlogPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
};

export default function PostsSitemapXml() {
  return null;
}

export async function getServerSideProps({ res }) {
  try {
    // Generate the posts XML sitemap
    const sitemap = await createPostsSitemap();

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
    console.error('Error generating posts sitemap:', error);
    
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain');
    res.write('Internal Server Error');
    res.end();

    return {
      props: {},
    };
  }
} 