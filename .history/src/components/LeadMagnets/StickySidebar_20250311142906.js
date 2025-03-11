import React from 'react';
import styles from './LeadMagnets.module.scss';
import LeadForm from './LeadForm';

export default function StickySidebar() {
  return (
    <div className={styles.stickySidebar}>
      <div className={styles.sidebarContent}>
        <div className={styles.sidebarImageContainer}>
          <img 
            src="https://placehold.co/300x150/E1F5FE/0288d1?text=تواصل+معنا&font=Tajawal" 
            alt="تواصل معنا" 
            className={styles.sidebarImage}
          />
        </div>
        
        <LeadForm 
          title="هل تريد استشارة مجانية؟"
          subtitle="اترك بياناتك وسنتصل بك في أقرب وقت ممكن"
          buttonText="أحصل على استشارة مجانية"
          formStyle="sidebarForm"
        />
      </div>
    </div>
  );
} 