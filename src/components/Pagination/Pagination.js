import Link from 'next/link';
import { FiChevronRight } from '@/components/icons';
import styles from './Pagination.module.scss';

const Pagination = ({ currentPage = 1, pagesCount, basePath }) => {
  const prevPage = currentPage - 1;
  const nextPage = currentPage + 1;

  return (
    <nav
      className={styles.nav}
      role="navigation"
      aria-label="Pagination Navigation"
    >
      <ul className={styles.pages}>
        {Array.from({ length: pagesCount }).map((_, i) => {
          const pageNumber = i + 1;
          const isCurrentPage = currentPage === pageNumber;

          if (isCurrentPage) {
            return (
              <li key={pageNumber}>
                <span
                  className={styles.active}
                  aria-label={`Current Page, Page ${pageNumber}`}
                  aria-current="true"
                >
                  {pageNumber}
                </span>
              </li>
            );
          }

          return (
            <li key={pageNumber}>
              <Link
                href={`${basePath}/page/${pageNumber}/`}
                aria-label={`Goto Page ${pageNumber}`}
              >
                <span>{pageNumber}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {nextPage <= pagesCount && (
        <Link
          href={`${basePath}/page/${nextPage}/`}
          aria-label="Goto Next Page"
        >
          Next <FiChevronRight />
        </Link>
      )}
    </nav>
  );
};

export default Pagination;
