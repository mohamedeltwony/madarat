import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import usePageMetadata from '@/hooks/use-page-metadata';

import Layout from '@/components/Layout';
import Header from '@/components/Header';
import Section from '@/components/Section';
import Container from '@/components/Container';
import AuthorStats from '@/components/AuthorStats';
import AuthorContributions from '@/components/AuthorContributions';
import PostsTable from '@/components/PostsTable';
import Image from 'next/legacy/image';
import Link from 'next/link';
import styles from '@/styles/pages/AuthorDashboard.module.scss';

export default function AuthorDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  
  // Mock authentication - in a real app, this would check if the user is logged in
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Simulate checking authentication
    const checkAuth = () => {
      // This is a mock - in a real app, you would check if the user is logged in
      // For demo purposes, we'll just set it to true after a delay
      setTimeout(() => {
        setIsAuthenticated(true);
        
        // Mock loading author data
        setAuthor({
          name: 'محمد أحمد',
          slug: 'mohamed-ahmed',
          description: 'كاتب ومحرر محتوى متخصص في السفر والسياحة',
          avatar: 'https://via.placeholder.com/150',
          postCount: 24
        });
        
        // Mock recent posts
        setRecentPosts([
          { id: 1, title: 'أفضل الوجهات السياحية في مصر', date: '2023-03-15', views: 2340, comments: 15 },
          { id: 2, title: 'دليل السفر إلى تركيا', date: '2023-02-28', views: 1890, comments: 8 },
          { id: 3, title: 'نصائح للسفر بميزانية محدودة', date: '2023-02-10', views: 1560, comments: 12 },
        ]);
        
        // Mock draft posts
        setDraftPosts([
          { id: 4, title: 'أفضل الفنادق في دبي', lastEdited: '2023-03-20' },
          { id: 5, title: 'تجربتي في السفر إلى المغرب', lastEdited: '2023-03-18' },
        ]);
        
        setIsLoading(false);
      }, 1000);
    };
    
    checkAuth();
  }, []);
  
  const { metadata } = usePageMetadata({
    metadata: {
      title: 'لوحة تحكم المؤلف',
      description: 'إدارة المقالات والإحصائيات الخاصة بك',
    },
  });
  
  if (!isAuthenticated || isLoading) {
    return (
      <Layout metadata={metadata}>
        <Header>
          <Container>
            <h1>لوحة تحكم المؤلف</h1>
          </Container>
        </Header>
        <Section>
          <Container>
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>جاري التحميل...</p>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }
  
  return (
    <Layout metadata={metadata}>
      <Header>
        <Container>
          <div className={styles.dashboardHeader}>
            <h1>لوحة تحكم المؤلف</h1>
            <div className={styles.authorInfo}>
              <div className={styles.avatarContainer}>
                <Image
                  src={author.avatar}
                  alt={`صورة ${author.name}`}
                  width={60}
                  height={60}
                  layout="fixed"
                  className={styles.avatar}
                />
              </div>
              <div className={styles.authorMeta}>
                <h2 className={styles.authorName}>{author.name}</h2>
                <p className={styles.postCount}>{author.postCount} مقالة</p>
              </div>
            </div>
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
                <Link href="/authors/edit-profile" className={styles.actionButton}>
                  <span className={styles.actionIcon}>✎</span>
                  تعديل الملف الشخصي
                </Link>
              </div>
              
              <div className={styles.postsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>المقالات الأخيرة</h3>
                  <Link href={`/authors/${author.slug}`} className={styles.viewAllLink}>
                    عرض الكل
                  </Link>
                </div>
                
                <PostsTable posts={recentPosts} type="published" />
              </div>
              
              <div className={styles.postsSection}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>المسودات</h3>
                  <Link href="/drafts" className={styles.viewAllLink}>
                    عرض الكل
                  </Link>
                </div>
                
                <PostsTable posts={draftPosts} type="drafts" />
              </div>
            </div>
            
            <div className={styles.sidebar}>
              <AuthorStats authorSlug={author.slug} />
              <AuthorContributions authorSlug={author.slug} />
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
} 