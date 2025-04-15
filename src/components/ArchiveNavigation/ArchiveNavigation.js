import Link from 'next/link';
import { getMonthName } from '@/lib/datetime';
import styles from './ArchiveNavigation.module.scss';

const ArchiveNavigation = ({ years, activeYear, activeMonth }) => {
  return (
    <nav className={styles.archiveNavigation}>
      <h2>Archive Navigation</h2>

      <div>
        {years &&
          years.map((year) => (
            <div key={year} className="mb-4">
              <Link
                href={`/archives/${year}`}
                className={`${styles.yearLink} ${activeYear === year.toString() ? styles.active : ''}`}
              >
                {year}
              </Link>

              {activeYear === year.toString() && (
                <ul className={styles.monthsList}>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <li key={month}>
                      <Link
                        href={`/archives/${year}/${month.toString().padStart(2, '0')}`}
                        className={`${styles.monthLink} ${activeMonth === month.toString() ? styles.active : ''}`}
                      >
                        {getMonthName(month)}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
      </div>
    </nav>
  );
};

export default ArchiveNavigation;
