import { useState, useEffect } from 'react';
import styles from './AuthorContributions.module.scss';

export default function AuthorContributions({ authorSlug }) {
  const [contributions, setContributions] = useState({
    isLoading: true,
    error: null,
    data: [],
  });

  useEffect(() => {
    // In a real application, this would fetch data from an API
    const fetchContributions = async () => {
      try {
        // Simulate API call with a delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // Mock data for demonstration
        const mockData = [
          { month: 'يناير', count: 5 },
          { month: 'فبراير', count: 3 },
          { month: 'مارس', count: 7 },
          { month: 'أبريل', count: 2 },
          { month: 'مايو', count: 4 },
          { month: 'يونيو', count: 6 },
          { month: 'يوليو', count: 8 },
          { month: 'أغسطس', count: 5 },
          { month: 'سبتمبر', count: 3 },
          { month: 'أكتوبر', count: 4 },
          { month: 'نوفمبر', count: 2 },
          { month: 'ديسمبر', count: 1 },
        ];

        setContributions({
          isLoading: false,
          error: null,
          data: mockData,
        });
      } catch (error) {
        setContributions({
          isLoading: false,
          error: 'حدث خطأ أثناء تحميل البيانات',
          data: [],
        });
      }
    };

    fetchContributions();
  }, [authorSlug]);

  if (contributions.isLoading) {
    return (
      <div className={styles.contributionsLoading}>
        <div className={styles.spinner}></div>
        <p>جاري تحميل المساهمات...</p>
      </div>
    );
  }

  if (contributions.error) {
    return (
      <div className={styles.contributionsError}>
        <p>{contributions.error}</p>
      </div>
    );
  }

  // Find the maximum contribution count to calculate relative heights
  const maxCount = Math.max(...contributions.data.map((item) => item.count));

  return (
    <div className={styles.contributionsContainer}>
      <h3 className={styles.contributionsTitle}>مساهمات المؤلف</h3>

      <div className={styles.contributionsChart}>
        {contributions.data.map((item, index) => {
          // Calculate the height percentage based on the count relative to max
          const heightPercentage = (item.count / maxCount) * 100;

          return (
            <div key={index} className={styles.chartColumn}>
              <div
                className={styles.chartBar}
                style={{ height: `${heightPercentage}%` }}
                title={`${item.count} مقالات`}
              ></div>
              <div className={styles.chartLabel}>{item.month}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.contributionsSummary}>
        <p>
          إجمالي المقالات هذا العام:{' '}
          <strong>
            {contributions.data.reduce((sum, item) => sum + item.count, 0)}
          </strong>
        </p>
      </div>
    </div>
  );
}
