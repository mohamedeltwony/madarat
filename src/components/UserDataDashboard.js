import React, { useState, useEffect } from 'react';
import { 
  userManager, 
  getUserTrackingData, 
  exportUserData, 
  clearAllUserData,
  isReturningUser,
  getUserId,
  getVisitCount
} from '@/utils/userIdentification';

const UserDataDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setIsLoading(true);
      const data = await getUserTrackingData();
      setUserData(data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const exportedData = exportUserData();
    if (exportedData) {
      const blob = new Blob([JSON.stringify(exportedData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `madarat-user-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleClearData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      clearAllUserData();
      setUserData(null);
      window.location.reload();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير متوفر';
    return new Date(dateString).toLocaleString('ar-SA');
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h3>نظرة عامة على المستخدم</h3>
      <div className="data-grid">
        <div className="data-item">
          <label>معرف المستخدم:</label>
          <span>{userData?.user_id || 'غير متوفر'}</span>
        </div>
        <div className="data-item">
          <label>مستخدم عائد:</label>
          <span>{userData?.is_returning_user ? 'نعم' : 'لا'}</span>
        </div>
        <div className="data-item">
          <label>عدد الزيارات:</label>
          <span>{userData?.visit_count || 0}</span>
        </div>
        <div className="data-item">
          <label>نوع المستخدم:</label>
          <span>{userData?.user_type || 'غير محدد'}</span>
        </div>
        <div className="data-item">
          <label>الجنسية:</label>
          <span>{userData?.nationality || 'غير محدد'}</span>
        </div>
        <div className="data-item">
          <label>عدد تفاعلات النماذج:</label>
          <span>{userData?.form_interactions_count || 0}</span>
        </div>
        <div className="data-item">
          <label>أول زيارة:</label>
          <span>{formatDate(userData?.first_visit)}</span>
        </div>
        <div className="data-item">
          <label>آخر زيارة:</label>
          <span>{formatDate(userData?.last_visit)}</span>
        </div>
      </div>
    </div>
  );

  const renderEncryptedData = () => (
    <div className="encrypted-section">
      <h3>البيانات المشفرة</h3>
      <div className="data-grid">
        <div className="data-item">
          <label>البريد الإلكتروني المشفر:</label>
          <span className="encrypted-value">
            {userData?.encrypted_email ? `${userData.encrypted_email.substring(0, 16)}...` : 'غير متوفر'}
          </span>
        </div>
        <div className="data-item">
          <label>رقم الهاتف المشفر:</label>
          <span className="encrypted-value">
            {userData?.encrypted_phone ? `${userData.encrypted_phone.substring(0, 16)}...` : 'غير متوفر'}
          </span>
        </div>
        <div className="data-item">
          <label>الاسم المشفر:</label>
          <span className="encrypted-value">
            {userData?.encrypted_name ? `${userData.encrypted_name.substring(0, 16)}...` : 'غير متوفر'}
          </span>
        </div>
        <div className="data-item">
          <label>بصمة الجهاز:</label>
          <span className="encrypted-value">
            {userData?.device_fingerprint || 'غير متوفر'}
          </span>
        </div>
      </div>
      <div className="privacy-note">
        <p><strong>ملاحظة:</strong> جميع البيانات الشخصية مشفرة باستخدام SHA-256 لحماية الخصوصية.</p>
      </div>
    </div>
  );

  const renderBehavioralData = () => (
    <div className="behavioral-section">
      <h3>البيانات السلوكية</h3>
      <div className="data-grid">
        <div className="data-item">
          <label>إجمالي الزيارات:</label>
          <span>{userData?.total_visits || 0}</span>
        </div>
        <div className="data-item">
          <label>إجمالي إرسال النماذج:</label>
          <span>{userData?.total_form_submissions || 0}</span>
        </div>
        <div className="data-item">
          <label>آخر إرسال نموذج:</label>
          <span>{formatDate(userData?.last_form_submission)}</span>
        </div>
        <div className="data-item">
          <label>اللغة المفضلة:</label>
          <span>{userData?.preferred_language || 'العربية'}</span>
        </div>
      </div>
      
      <div className="interests-section">
        <h4>الاهتمامات</h4>
        <div className="interests-list">
          {userData?.interests && userData.interests.length > 0 ? (
            userData.interests.map((interest, index) => (
              <span key={index} className="interest-tag">{interest}</span>
            ))
          ) : (
            <span>لا توجد اهتمامات محددة</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderTrackingData = () => (
    <div className="tracking-section">
      <h3>بيانات التتبع</h3>
      <div className="data-grid">
        <div className="data-item">
          <label>Facebook Browser ID:</label>
          <span>{userData?.fbp || 'غير متوفر'}</span>
        </div>
        <div className="data-item">
          <label>Facebook Click ID:</label>
          <span>{userData?.fbc || 'غير متوفر'}</span>
        </div>
        <div className="data-item">
          <label>UTM Source:</label>
          <span>{userData?.utm_source || 'غير متوفر'}</span>
        </div>
        <div className="data-item">
          <label>UTM Medium:</label>
          <span>{userData?.utm_medium || 'غير متوفر'}</span>
        </div>
        <div className="data-item">
          <label>UTM Campaign:</label>
          <span>{userData?.utm_campaign || 'غير متوفر'}</span>
        </div>
        <div className="data-item">
          <label>UTM Content:</label>
          <span>{userData?.utm_content || 'غير متوفر'}</span>
        </div>
        <div className="data-item">
          <label>UTM Term:</label>
          <span>{userData?.utm_term || 'غير متوفر'}</span>
        </div>
      </div>
    </div>
  );

  const renderFormSubmissions = () => {
    const submissions = userManager.getFormSubmissions();
    return (
      <div className="submissions-section">
        <h3>تاريخ إرسال النماذج</h3>
        {submissions.length > 0 ? (
          <div className="submissions-list">
            {submissions.map((submission, index) => (
              <div key={index} className="submission-item">
                <div className="submission-header">
                  <strong>{submission.form_name}</strong>
                  <span className="submission-date">{formatDate(submission.timestamp)}</span>
                </div>
                <div className="submission-details">
                  <span>الصفحة: {submission.page_url}</span>
                  <span>النوع: {submission.user_type}</span>
                  <span>القيمة: {submission.conversion_value} ريال</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>لا توجد نماذج مرسلة</p>
        )}
      </div>
    );
  };

  const renderVisitHistory = () => {
    const visits = userManager.getVisitHistory();
    return (
      <div className="visits-section">
        <h3>تاريخ الزيارات</h3>
        {visits.length > 0 ? (
          <div className="visits-list">
            {visits.slice(-10).reverse().map((visit, index) => (
              <div key={index} className="visit-item">
                <div className="visit-header">
                  <strong>زيارة #{visit.visitNumber}</strong>
                  <span className="visit-date">{formatDate(visit.timestamp)}</span>
                </div>
                <div className="visit-details">
                  <span>الصفحة: {visit.url}</span>
                  <span>المرجع: {visit.referrer || 'مباشر'}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>لا توجد زيارات مسجلة</p>
        )}
      </div>
    );
  };

  if (isLoading) {
    return <div className="loading">جاري تحميل بيانات المستخدم...</div>;
  }

  if (!userData) {
    return <div className="no-data">لا توجد بيانات مستخدم متاحة</div>;
  }

  return (
    <div className="user-data-dashboard" dir="rtl">
      <div className="dashboard-header">
        <h2>لوحة بيانات المستخدم</h2>
        <div className="dashboard-actions">
          <button onClick={handleExportData} className="export-btn">
            تصدير البيانات
          </button>
          <button onClick={handleClearData} className="clear-btn">
            حذف جميع البيانات
          </button>
          <button onClick={loadUserData} className="refresh-btn">
            تحديث
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={activeTab === 'overview' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('overview')}
        >
          نظرة عامة
        </button>
        <button 
          className={activeTab === 'encrypted' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('encrypted')}
        >
          البيانات المشفرة
        </button>
        <button 
          className={activeTab === 'behavioral' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('behavioral')}
        >
          السلوك
        </button>
        <button 
          className={activeTab === 'tracking' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('tracking')}
        >
          التتبع
        </button>
        <button 
          className={activeTab === 'submissions' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('submissions')}
        >
          النماذج
        </button>
        <button 
          className={activeTab === 'visits' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('visits')}
        >
          الزيارات
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'encrypted' && renderEncryptedData()}
        {activeTab === 'behavioral' && renderBehavioralData()}
        {activeTab === 'tracking' && renderTrackingData()}
        {activeTab === 'submissions' && renderFormSubmissions()}
        {activeTab === 'visits' && renderVisitHistory()}
      </div>

      <style jsx>{`
        .user-data-dashboard {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: 'Tajawal', sans-serif;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }

        .dashboard-header h2 {
          color: #0c4c44;
          margin: 0;
        }

        .dashboard-actions {
          display: flex;
          gap: 10px;
        }

        .dashboard-actions button {
          padding: 8px 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.3s;
        }

        .export-btn {
          background-color: #4CAF50;
          color: white;
        }

        .export-btn:hover {
          background-color: #45a049;
        }

        .clear-btn {
          background-color: #f44336;
          color: white;
        }

        .clear-btn:hover {
          background-color: #da190b;
        }

        .refresh-btn {
          background-color: #2196F3;
          color: white;
        }

        .refresh-btn:hover {
          background-color: #0b7dda;
        }

        .dashboard-tabs {
          display: flex;
          gap: 5px;
          margin-bottom: 20px;
          border-bottom: 1px solid #e0e0e0;
        }

        .tab {
          padding: 12px 20px;
          border: none;
          background-color: transparent;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .tab:hover {
          background-color: #f5f5f5;
        }

        .tab.active {
          border-bottom-color: #cc9c64;
          background-color: #f9f9f9;
          font-weight: bold;
        }

        .dashboard-content {
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .data-item {
          display: flex;
          justify-content: space-between;
          padding: 10px;
          background-color: #f9f9f9;
          border-radius: 5px;
          border-right: 4px solid #cc9c64;
        }

        .data-item label {
          font-weight: bold;
          color: #0c4c44;
        }

        .encrypted-value {
          font-family: monospace;
          background-color: #e8f5e8;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }

        .privacy-note {
          background-color: #e3f2fd;
          padding: 15px;
          border-radius: 5px;
          border-right: 4px solid #2196F3;
          margin-top: 15px;
        }

        .interests-section {
          margin-top: 20px;
        }

        .interests-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .interest-tag {
          background-color: #cc9c64;
          color: white;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.9em;
        }

        .submissions-list, .visits-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .submission-item, .visit-item {
          background-color: #f9f9f9;
          padding: 15px;
          margin-bottom: 10px;
          border-radius: 5px;
          border-right: 4px solid #cc9c64;
        }

        .submission-header, .visit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .submission-date, .visit-date {
          font-size: 0.9em;
          color: #666;
        }

        .submission-details, .visit-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 0.9em;
          color: #555;
        }

        .loading, .no-data {
          text-align: center;
          padding: 40px;
          font-size: 1.2em;
          color: #666;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            flex-direction: column;
            gap: 15px;
            align-items: stretch;
          }

          .dashboard-tabs {
            flex-wrap: wrap;
          }

          .data-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-actions {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default UserDataDashboard; 