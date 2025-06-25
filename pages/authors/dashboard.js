import { useState } from 'react';
import { useRouter } from 'next/router';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';
import { getPostsByAuthorSlug } from '@/lib/posts';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import AuthorStats from '@/components/AuthorStats';
import AuthorContributions from '@/components/AuthorContributions';
import PostsTable from '@/components/PostsTable';
import NotificationsList from '@/components/NotificationsList';
import Image from 'next/legacy/image';
import Link from 'next/link';
import styles from '@/styles/pages/AuthorDashboard.module.scss';

export default function AuthorDashboard({ 
  metadata, 
  menus, 
  author, 
  recentPosts, 
  draftPosts, 
  isAuthenticated,
  error 
}) {
  const router = useRouter();

  if (error) {
    return (
      <Layout metadata={metadata} menus={menus}>
        <Header>
          <Container>
            <h1>لوحة تحكم المؤلف</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className={styles.actionButton}
              >
                إعادة المحاولة
              </button>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout metadata={metadata} menus={menus}>
        <Header>
          <Container>
            <h1>لوحة تحكم المؤلف</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.authContainer}>
              <div className={styles.authMessage}>
                <h2>يجب تسجيل الدخول للوصول إلى لوحة التحكم</h2>
                <p>يرجى تسجيل الدخول للوصول إلى لوحة تحكم المؤلف وإدارة مقالاتك.</p>
                <div className={styles.authActions}>
                  <Link href="/login" className={styles.actionButton}>
                    تسجيل الدخول
                  </Link>
                  <Link href="/register" className={styles.actionButton}>
                    إنشاء حساب جديد
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout metadata={metadata} menus={menus}>
      <Header>
        <Container>
          <div className={styles.dashboardHeader}>
            <h1>لوحة تحكم المؤلف</h1>
            {author && (
              <div className={styles.authorInfo}>
                <div className={styles.avatarContainer}>
                  <Image
                    src={author.avatar || 'https://via.placeholder.com/60'}
                    alt={`صورة ${author.name}`}
                    width={60}
                    height={60}
                    layout="fixed"
                  />
                </div>
                <div className={styles.authorMeta}>
                  <h2 className={styles.authorName}>{author.name}</h2>
                  <p className={styles.postCount}>{author.postCount} مقالة</p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Header>

      <Section>
        <Container>
          <div className={styles.dashboardGrid}>
            <div className={styles.mainContent}>
              <div className={styles.dashboardActions}>
                <Link href="/posts/new" className={styles.actionButton}>
                  <span className={styles.actionIcon}>+</span>
                  إنشاء مقالة جديدة
                </Link>
                <Link
                  href="/authors/edit-profile"
                  className={styles.actionButton}
                >
                  <span className={styles.actionIcon}>✎</span>
                  تعديل الملف الشخصي
                </Link>
              </div>

              {author && <NotificationsList authorSlug={author.slug} />}

              <div className={styles.postsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>المقالات الأخيرة</h3>
                  {author && (
                    <Link
                      href={`/authors/${author.slug}`}
                      className={styles.viewAllLink}
                    >
                      عرض الكل
                    </Link>
                  )}
                </div>

                {recentPosts && recentPosts.length > 0 ? (
                  <div className={styles.postsGrid}>
                    {recentPosts.map((post) => (
                      <div key={post.id} className={styles.postCard}>
                        <h4 className={styles.postTitle}>
                          <Link href={`/posts/${post.slug}`}>
                            {post.title}
                          </Link>
                        </h4>
                        <div className={styles.postMeta}>
                          <span className={styles.postDate}>
                            {new Date(post.date).toLocaleDateString('ar-EG')}
                          </span>
                          <span className={styles.postViews}>
                            {post.views || 0} مشاهدة
                          </span>
                          <span className={styles.postComments}>
                            {post.comments || 0} تعليق
                          </span>
                        </div>
                        <div className={styles.postActions}>
                          <Link 
                            href={`/posts/${post.slug}/edit`}
                            className={styles.editLink}
                          >
                            تعديل
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p>لم تقم بنشر أي مقالات بعد.</p>
                    <Link href="/posts/new" className={styles.actionButton}>
                      إنشاء مقالة جديدة
                    </Link>
                  </div>
                )}
              </div>

              {draftPosts && draftPosts.length > 0 && (
                <div className={styles.draftsSection}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>المسودات</h3>
                  </div>
                  <div className={styles.draftsGrid}>
                    {draftPosts.map((draft) => (
                      <div key={draft.id} className={styles.draftCard}>
                        <h4 className={styles.draftTitle}>{draft.title}</h4>
                        <div className={styles.draftMeta}>
                          <span className={styles.lastEdited}>
                            آخر تعديل: {new Date(draft.lastEdited).toLocaleDateString('ar-EG')}
                          </span>
                        </div>
                        <div className={styles.draftActions}>
                          <Link 
                            href={`/posts/${draft.id}/edit`}
                            className={styles.editLink}
                          >
                            متابعة التحرير
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.sidebar}>
              {author && (
                <>
                  <AuthorStats 
                    authorId={author.id}
                    postCount={author.postCount}
                    totalViews={author.totalViews || 0}
                    totalComments={author.totalComments || 0}
                  />
                  <AuthorContributions authorSlug={author.slug} />
                </>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    // Check authentication - In a real app, this would check session/JWT
    // For now, we'll simulate authentication check
    const { req } = context;
    const isAuthenticated = checkAuthentication(req);
    
    if (!isAuthenticated) {
      // Fetch basic metadata for unauthenticated users
      const [{ metadata }, { menus }] = await Promise.all([
        getSiteMetadata(),
        getAllMenus(),
      ]);

      const pageMetadata = {
        title: 'لوحة تحكم المؤلف - مدارات الكون',
        description: 'إدارة المقالات والإحصائيات الخاصة بك',
        robots: 'noindex, nofollow', // Don't index dashboard pages
      };

      return {
        props: {
          metadata: { ...metadata, ...pageMetadata },
          menus: menus || [],
          author: null,
          recentPosts: [],
          draftPosts: [],
          isAuthenticated: false,
          error: null,
        },
      };
    }

    // Get current user info - In a real app, this would come from session
    const currentUser = getCurrentUser(req);
    
    if (!currentUser) {
      throw new Error('User not found');
    }

    // Fetch user-specific data
    const [
      { metadata },
      { menus },
      { posts: recentPosts }
    ] = await Promise.all([
      getSiteMetadata(),
      getAllMenus(),
      getPostsByAuthorSlug({ slug: currentUser.slug, first: 10 })
    ]);

    // Mock draft posts - In a real app, this would fetch from API
    const draftPosts = [
      {
        id: 'draft-1',
        title: 'أفضل الفنادق في دبي',
        lastEdited: new Date().toISOString(),
      },
      {
        id: 'draft-2',
        title: 'تجربتي في السفر إلى المغرب',
        lastEdited: new Date(Date.now() - 86400000).toISOString(),
      },
    ];

    const pageMetadata = {
      title: 'لوحة تحكم المؤلف - مدارات الكون',
      description: 'إدارة المقالات والإحصائيات الخاصة بك',
      robots: 'noindex, nofollow', // Don't index dashboard pages
    };

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        author: {
          id: currentUser.id,
          name: currentUser.name,
          slug: currentUser.slug,
          description: currentUser.description || 'كاتب ومحرر محتوى متخصص في السفر والسياحة',
          avatar: currentUser.avatar || 'https://via.placeholder.com/150',
          postCount: recentPosts?.length || 0,
          totalViews: currentUser.totalViews || 0,
          totalComments: currentUser.totalComments || 0,
        },
        recentPosts: recentPosts || [],
        draftPosts,
        isAuthenticated: true,
        error: null,
      },
    };
  } catch (error) {
    console.error('Error in dashboard getServerSideProps:', error);
    
    // Fetch basic metadata for error state
    const [{ metadata }, { menus }] = await Promise.all([
      getSiteMetadata().catch(() => ({ metadata: {} })),
      getAllMenus().catch(() => ({ menus: [] })),
    ]);

    const pageMetadata = {
      title: 'لوحة تحكم المؤلف - مدارات الكون',
      description: 'إدارة المقالات والإحصائيات الخاصة بك',
      robots: 'noindex, nofollow',
    };

    return {
      props: {
        metadata: { ...metadata, ...pageMetadata },
        menus: menus || [],
        author: null,
        recentPosts: [],
        draftPosts: [],
        isAuthenticated: false,
        error: 'حدث خطأ أثناء تحميل البيانات. يرجى المحاولة مرة أخرى.',
      },
    };
  }
}

// Helper functions for authentication - In a real app, these would be more sophisticated
function checkAuthentication(req) {
  // Mock authentication check
  // In a real app, this would check JWT token, session, etc.
  const authHeader = req.headers.authorization;
  const sessionCookie = req.cookies.session;
  
  // For demo purposes, return true if any auth indicator is present
  return !!(authHeader || sessionCookie);
}

function getCurrentUser(req) {
  // Mock user data - In a real app, this would decode JWT or fetch from session
  return {
    id: 1,
    name: 'محمد أحمد',
    slug: 'mohamed-ahmed',
    description: 'كاتب ومحرر محتوى متخصص في السفر والسياحة',
    avatar: 'https://via.placeholder.com/150',
    totalViews: 15420,
    totalComments: 89,
  };
}
