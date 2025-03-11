import Link from 'next/link';
import { getMonthName } from '@/lib/datetime';

const ArchiveNavigation = ({ years, activeYear, activeMonth }) => {
  return (
    <nav className="archive-navigation mb-8">
      <h2 className="text-xl font-bold mb-4">Archive Navigation</h2>
      
      <div className="years-list">
        {years && years.map((year) => (
          <div key={year} className="mb-4">
            <h3 className={`text-lg font-semibold ${activeYear === year.toString() ? 'text-blue-600' : ''}`}>
              <Link href={`/archives/${year}`}>
                <span className="hover:underline">{year}</span>
              </Link>
            </h3>
            
            {activeYear === year.toString() && (
              <ul className="months-list pl-4 mt-2">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <li 
                    key={month} 
                    className={`mb-1 ${activeMonth === month.toString() ? 'text-blue-600 font-semibold' : ''}`}
                  >
                    <Link href={`/archives/${year}/${month.toString().padStart(2, '0')}`}>
                      <span className="hover:underline">{getMonthName(month)}</span>
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