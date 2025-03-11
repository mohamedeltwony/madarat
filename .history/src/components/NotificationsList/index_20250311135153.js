import React, { useState, useEffect } from 'react';
import styles from './NotificationsList.module.scss';

export default function NotificationsList({ authorSlug }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        // This is a mock API call - in a real app, you would fetch from your API
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock notifications data
        const mockNotifications = [
          {
            id: 1,
            type: 'comment',
            content: 'محمد علي علق على مقالتك "أفضل الوجهات السياحية في مصر"',
            date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            isRead: false,
          },
          {
            id: 2,
            type: 'like',
            content: 'أعجب 5 أشخاص بمقالتك "دليل السفر إلى تركيا"',
            date: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
            isRead: false,
          },
          {
            id: 3,
            type: 'system',
            content: 'تم نشر مقالتك "نصائح للسفر بميزانية محدودة" بنجاح',
            date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
            isRead: true,
          },
          {
            id: 4,
            type: 'comment',
            content: 'فاطمة حسن علقت على مقالتك "أفضل الوجهات السياحية في مصر"',
            date: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
            isRead: true,
          },
        ];
        
        setNotifications(mockNotifications);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('حدث خطأ أثناء تحميل الإشعارات');
        setIsLoading(false);
      }
    };
    
    fetchNotifications();
  }, [authorSlug]);
  
  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
  };
  
  if (isLoading) {
    return (
      <div className={styles.notificationsLoading}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل الإشعارات...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className={styles.notificationsError}>
        <p>{error}</p>
      </div>
    );
  }
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  const formatDate = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'منذ أقل من ساعة';
    if (diffInHours < 24) return `منذ ${diffInHours} ${diffInHours === 1 ? 'ساعة' : 'ساعات'}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} ${diffInDays === 1 ? 'يوم' : 'أيام'}`;
    
    return date.toLocaleDateString('ar-EG');
  };
  
  return (
    <div className={styles.notificationsContainer}>
      <div className={styles.notificationsHeader}>
        <h3 className={styles.notificationsTitle}>الإشعارات</h3>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className={styles.markAllRead}>
            تحديد الكل كمقروء
          </button>
        )}
      </div>
      
      {notifications.length === 0 ? (
        <p className={styles.emptyMessage}>لا توجد إشعارات جديدة</p>
      ) : (
        <div className={styles.notificationsList}>
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`${styles.notificationItem} ${notification.isRead ? styles.read : styles.unread}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className={styles.notificationIcon}>
                {notification.type === 'comment' && <span>💬</span>}
                {notification.type === 'like' && <span>❤️</span>}
                {notification.type === 'system' && <span>🔔</span>}
              </div>
              <div className={styles.notificationContent}>
                <p className={styles.notificationText}>{notification.content}</p>
                <span className={styles.notificationDate}>{formatDate(notification.date)}</span>
              </div>
              {!notification.isRead && <div className={styles.unreadDot}></div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 