import React, { useState, useEffect } from 'react';
import LocalizedLink from '../LocalizedLink';
import styles from './Breadcrumb.module.scss';
import dynamic from 'next/dynamic';

// Dynamically import icons to avoid SSR issues
const FaChevronLeft = dynamic(
  () => import('react-icons/fa').then((mod) => mod.FaChevronLeft),
  { ssr: false }
);

const Breadcrumb = ({ items = [] }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <nav className={styles.breadcrumb} aria-label="breadcrumb">
      <ol className={styles.breadcrumbList}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li
              key={`breadcrumb-${index}`}
              className={`${styles.breadcrumbItem} ${isLast ? styles.active : ''}`}
            >
              {isLast ? (
                <span className={styles.breadcrumbText}>{item.label}</span>
              ) : (
                <LocalizedLink
                  href={item.href}
                  className={styles.breadcrumbLink}
                >
                  {item.label}
                </LocalizedLink>
              )}

              {!isLast && isClient && (
                <FaChevronLeft className={styles.breadcrumbSeparator} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
