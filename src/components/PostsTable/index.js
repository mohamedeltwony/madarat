import React from 'react';
import styles from './PostsTable.module.scss';

export default function PostsTable({ posts, type = 'published' }) {
  if (!posts || posts.length === 0) {
    return <p className={styles.emptyMessage}>لا توجد مقالات حالياً</p>;
  }
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className={styles.postsTable}>
      <div className={styles.tableHeader}>
        <div className={styles.tableCell}>العنوان</div>
        
        {type === 'published' && (
          <>
            <div className={styles.tableCell}>التاريخ</div>
            <div className={styles.tableCell}>المشاهدات</div>
            <div className={styles.tableCell}>التعليقات</div>
          </>
        )}
        
        {type === 'drafts' && (
          <div className={styles.tableCell}>آخر تعديل</div>
        )}
        
        <div className={styles.tableCell}>الإجراءات</div>
      </div>
      
      {posts.map(post => (
        <div key={post.id} className={styles.tableRow}>
          <div className={styles.tableCell}>{post.title}</div>
          
          {type === 'published' && (
            <>
              <div className={styles.tableCell}>{formatDate(post.date)}</div>
              <div className={styles.tableCell}>{post.views}</div>
              <div className={styles.tableCell}>{post.comments}</div>
            </>
          )}
          
          {type === 'drafts' && (
            <div className={styles.tableCell}>{formatDate(post.lastEdited)}</div>
          )}
          
          <div className={styles.tableCell}>
            <div className={styles.postActions}>
              <button className={styles.actionLink}>تعديل</button>
              
              {type === 'published' && (
                <button className={styles.actionLink}>إحصائيات</button>
              )}
              
              {type === 'drafts' && (
                <>
                  <button className={styles.actionLink}>نشر</button>
                  <button className={styles.actionLink}>حذف</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 