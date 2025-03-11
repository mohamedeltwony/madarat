import { useState, useEffect } from 'react';
import styles from './AuthorStats.module.scss';

export default function AuthorStats({ authorSlug }) {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    popularPosts: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // In a real application, this would fetch data from an API
    const fetchAuthorStats = async () => {
      try {
        // Simulate API call with a delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data for demonstration
        setStats({
          totalViews: 12450,
          totalLikes: 843,
          totalComments: 156,
          popularPosts: [
            { id: 1, title: 'أفضل الوجهات السياحية في مصر', views: 2340 },
            { id: 2, title: 'دليل السفر إلى تركيا', views: 1890 },
            { id: 3, title: 'نصائح للسفر بميزانية محدودة', views: 1560 },
          ],
          isLoading: false,
          error: null
        });
      } catch (error) {
        setStats(prevState => ({
          ...prevState,
          isLoading: false,
          error: 'حدث خطأ أثناء تحميل البيانات'
        }));
      }
    };

    fetchAuthorStats();
  }, [authorSlug]);

  if (stats.isLoading) {
    return (
      <div className={styles.statsLoading}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل الإحصائيات...</p>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className={styles.statsError}>
        <p>{stats.error}</p>
      </div>
    );
  }

  return (
    <div className={styles.statsContainer}>
      <h3 className={styles.statsTitle}>إحصائيات المؤلف</h3>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalViews.toLocaleString()}</div>
          <div className={styles.statLabel}>مشاهدات</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalLikes.toLocaleString()}</div>
          <div className={styles.statLabel}>إعجابات</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statValue}>{stats.totalComments.toLocaleString()}</div>
          <div className={styles.statLabel}>تعليقات</div>
        </div>
      </div>
      
      <div className={styles.popularPosts}>
        <h4 className={styles.popularTitle}>المقالات الأكثر شعبية</h4>
        <ul className={styles.popularList}>
          {stats.popularPosts.map(post => (
            <li key={post.id} className={styles.popularItem}>
              <span className={styles.popularName}>{post.title}</span>
              <span className={styles.popularViews}>{post.views.toLocaleString()} مشاهدة</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 