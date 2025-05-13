import { Helmet } from 'react-helmet';
import { useEffect, useState } from 'react';
import { FaTwitter, FaFacebook, FaLinkedin, FaWhatsapp, FaShare } from 'react-icons/fa';

import {
  getPostBySlug,
  getRecentPosts,
  getRelatedPosts,
  postPathBySlug,
} from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';
import { formatDate } from 'lib/datetime';
import { ArticleJsonLd } from 'lib/json-ld';
import { helmetSettingsFromMetadata } from 'lib/site';
import { extractHeadings, addHeadingIds } from 'lib/headings';
import { fixInternalLinks, processHeadingAnchors } from 'lib/fixWpLinks';
import useSite from 'hooks/use-site';
import usePageMetadata from 'hooks/use-page-metadata';

import Layout from 'components/Layout';
import Section from 'components/Section';
import Container from 'components/Container';
import Content from 'components/Content';
import PostHeader from 'components/PostHeader';
import PostSidebar from 'components/PostSidebar';
import TableOfContents from 'components/TableOfContents';
import Link from 'next/link';

import styles from 'styles/pages/Post.module.scss';

export default function Post({ post, socialImage, related, recentPosts }) {
  const [shareUrl, setShareUrl] = useState('');
  const [headings, setHeadings] = useState([]);
  const [processedContent, setProcessedContent] = useState('');
  
  const {
    title,
    metaTitle,
    description,
    content,
    date,
    author,
    categories,
    modified,
    featuredImage,
    isSticky = false,
  } = post;

  const { metadata: siteMetadata = {}, homepage } = useSite();
  
  useEffect(() => {
    setShareUrl(window.location.href);
    
    // Process content to add IDs to headings
    if (content) {
      try {
        const contentWithIds = addHeadingIds(content);
        setProcessedContent(contentWithIds);
        
        // Extract headings for table of contents
        const extractedHeadings = extractHeadings(content);
        setHeadings(extractedHeadings);
      } catch (error) {
        console.error('Error processing content:', error);
        setProcessedContent(content);
      }
    }
  }, [content]);
  
  // Fix links after content is rendered
  useEffect(() => {
    if (processedContent) {
      // Use setTimeout to ensure DOM is fully rendered
      setTimeout(() => {
        fixInternalLinks();
        processHeadingAnchors();
      }, 100);
    }
  }, [processedContent]);

  if (!post.og) {
    post.og = {};
  }

  post.og.imageUrl = `${homepage}${socialImage}`;
  post.og.imageSecureUrl = post.og.imageUrl;
  post.og.imageWidth = 2000;
  post.og.imageHeight = 1000;

  const { metadata } = usePageMetadata({
    metadata: {
      ...post,
      title: metaTitle,
      description:
        description || post.og?.description || `Read more about ${title}`,
    },
  });

  if (process.env.WORDPRESS_PLUGIN_SEO !== true) {
    metadata.title = `${title} - ${siteMetadata.title}`;
    metadata.og.title = metadata.title;
    metadata.twitter.title = metadata.title;
  }

  const helmetSettings = helmetSettingsFromMetadata(metadata);
  
  // Function to share on social media
  const handleShare = (platform) => {
    let shareLink = '';
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodedTitle} ${encodedUrl}`;
        break;
      default:
        // Native share API if available
        if (navigator.share) {
          navigator.share({
            title: title,
            url: shareUrl
          });
          return;
        }
        // Fallback to copy to clipboard
        navigator.clipboard.writeText(shareUrl);
        alert('تم نسخ الرابط!');
        return;
    }
    
    window.open(shareLink, '_blank', 'width=600,height=400');
  };

  return (
    <Layout>
      <Helmet {...helmetSettings} />
      <ArticleJsonLd post={post} siteTitle={siteMetadata.title} />

      <PostHeader
        title={title}
        featuredImage={featuredImage}
        categories={categories}
        author={author}
        date={date}
        useHeroLayout={!!featuredImage}
      />

      <Container>
        <div className={styles.postLayout}>
          <div className={styles.mainContent}>
            <Content>
              {headings.length > 0 && (
                <TableOfContents headings={headings} />
              )}
              
              <div
                className={styles.content}
                dangerouslySetInnerHTML={{
                  __html: processedContent || content,
                }}
              />
              
              {/* Social Sharing */}
              <div className={styles.socialSharing}>
                <div className={styles.shareText}>مشاركة المقال</div>
                <div className={styles.shareButtons}>
                  <button 
                    className={`${styles.shareButton} ${styles.twitter}`}
                    onClick={() => handleShare('twitter')}
                    aria-label="Share on Twitter"
                  >
                    <FaTwitter />
                  </button>
                  <button 
                    className={`${styles.shareButton} ${styles.facebook}`}
                    onClick={() => handleShare('facebook')}
                    aria-label="Share on Facebook"
                  >
                    <FaFacebook />
                  </button>
                  <button 
                    className={`${styles.shareButton} ${styles.linkedin}`}
                    onClick={() => handleShare('linkedin')}
                    aria-label="Share on LinkedIn"
                  >
                    <FaLinkedin />
                  </button>
                  <button 
                    className={`${styles.shareButton} ${styles.whatsapp}`}
                    onClick={() => handleShare('whatsapp')}
                    aria-label="Share on WhatsApp"
                  >
                    <FaWhatsapp />
                  </button>
                  <button 
                    className={styles.shareButton}
                    onClick={() => handleShare('copy')}
                    aria-label="Copy link"
                  >
                    <FaShare />
                  </button>
                </div>
              </div>
              
              {/* Author Box */}
              {author && (
                <div className={styles.authorBox}>
                  {author.avatar?.url ? (
                    <img 
                      src={author.avatar.url} 
                      alt={author.name}
                      className={styles.authorImage}
                    />
                  ) : (
                    <div className={styles.authorImagePlaceholder}>{author.name[0]}</div>
                  )}
                  <div className={styles.authorInfo}>
                    <h3 className={styles.authorName}>{author.name}</h3>
                    <p className={styles.authorBio}>كاتب ومتخصص في مجال السياحة والسفر، يقدم نصائح وإرشادات مفيدة للمسافرين العرب حول العالم.</p>
                    <div className={styles.authorSocial}>
                      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                        <FaTwitter />
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                        <FaFacebook />
                      </a>
                      <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <FaLinkedin />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </Content>

            <Section className={styles.postFooter}>
              <p className={styles.postModified}>
                آخر تحديث في {formatDate(modified)}.
              </p>
              
              {/* Related Posts with Enhanced Design */}
              {Array.isArray(related?.posts) && related.posts.length > 0 && (
                <div className={styles.relatedPosts}>
                  {related.title?.name ? (
                    <h3>
                      المزيد من {' '}
                      <Link href={related.title.link}>
                        {related.title.name}
                      </Link>
                    </h3>
                  ) : (
                    <h3>مقالات ذات صلة</h3>
                  )}
                  
                  <div className={styles.relatedGrid}>
                    {related.posts.map((relatedPost) => (
                      <div key={relatedPost.title} className={styles.relatedItem}>
                        {relatedPost.featuredImage && (
                          <img 
                            src={relatedPost.featuredImage.sourceUrl} 
                            alt={relatedPost.title}
                            className={styles.relatedImage}
                          />
                        )}
                        <div className={styles.relatedContent}>
                          <h4 className={styles.relatedTitle}>
                            <Link href={postPathBySlug(relatedPost.slug)}>
                              {relatedPost.title}
                            </Link>
                          </h4>
                          {relatedPost.excerpt && (
                            <div 
                              className={styles.relatedExcerpt}
                              dangerouslySetInnerHTML={{
                                __html: relatedPost.excerpt,
                              }}
                            />
                          )}
                          <div className={styles.relatedMeta}>
                            {relatedPost.date && new Date(relatedPost.date).toString() !== 'Invalid Date' ? 
                              formatDate(relatedPost.date) : ''}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Section>
          </div>

          <PostSidebar post={post} recentPosts={recentPosts} />
        </div>
      </Container>
    </Layout>
  );
}

export async function getStaticProps({ params = {} } = {}) {
  const { post } = await getPostBySlug(params?.slug);

  if (!post) {
    return {
      props: {},
      notFound: true,
    };
  }

  const { categories, databaseId: postId } = post;

  // Get recent posts for sidebar
  const { posts: recentPosts } = await getRecentPosts({
    count: 4, 
    exclude: [postId]
  });

  const props = {
    post,
    socialImage: `${process.env.OG_IMAGE_DIRECTORY}/${params?.slug}.png`,
    recentPosts: Array.isArray(recentPosts) ? recentPosts : [],
  };

  const { category: relatedCategory, posts: relatedPosts } =
    (await getRelatedPosts(categories, postId)) || {};
  const hasRelated =
    relatedCategory && Array.isArray(relatedPosts) && relatedPosts.length;

  if (hasRelated) {
    props.related = {
      posts: relatedPosts,
      title: {
        name: relatedCategory.name || null,
        link: categoryPathBySlug(relatedCategory.slug),
      },
    };
  }

  return {
    props,
  };
}

export async function getStaticPaths() {
  // Only render the most recent posts to avoid spending unecessary time
  // querying every single post from WordPress

  // Tip: this can be customized to use data or analytitcs to determine the
  // most popular posts and render those instead

  const { posts } = await getRecentPosts({
    count: process.env.POSTS_PRERENDER_COUNT, // Update this value in next.config.js!
    queryIncludes: 'index',
  });

  const paths = posts
    .filter(({ slug }) => typeof slug === 'string')
    .map(({ slug }) => ({
      params: {
        slug,
      },
    }));

  return {
    paths,
    fallback: 'blocking',
  };
}
