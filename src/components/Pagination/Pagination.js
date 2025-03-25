import React from 'react';
import Link from 'next/link';
import styles from './Pagination.module.scss';

const Pagination = ({ currentPage, totalPages, basePath = '' }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={styles.pagination}>
      <ul>
        {currentPage > 1 && (
          <li>
            <Link href={`${basePath}/${currentPage - 1}`}>
              السابق
            </Link>
          </li>
        )}

        {pages.map((page) => (
          <li key={page}>
            <Link
              href={`${basePath}/${page}`}
              className={page === currentPage ? styles.active : ''}
            >
              {page}
            </Link>
          </li>
        ))}

        {currentPage < totalPages && (
          <li>
            <Link href={`${basePath}/${currentPage + 1}`}>
              التالي
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Pagination;
