import React, { useState, useEffect } from 'react';
import styles from './TableOfContents.module.scss';
import { FiList, FiChevronDown, FiChevronUp } from '@/components/icons';

const TableOfContents = ({ headings }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const handleScroll = () => {
      const headingElements = headings.map((heading) =>
        document.getElementById(heading.id)
      );
      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const current = headingElements[i];
        if (current && current.offsetTop <= scrollPosition) {
          setActiveId(current.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call once on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Use optimized smooth scroll with offset for fixed header
      const headerOffset = 100;
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Set URL hash without jumping
      window.history.pushState(null, null, `#${id}`);
      setActiveId(id);
    }
  };

  if (!headings || headings.length === 0) {
    return null;
  }

  return (
    <div className={styles.tocContainer}>
      <div className={styles.tocHeader} onClick={() => setIsOpen(!isOpen)}>
        <div className={styles.tocTitle}>
          <FiList className={styles.tocIcon} />
          <span>محتوي المقال</span>
        </div>
        {isOpen ? (
          <FiChevronUp className={styles.toggleIcon} />
        ) : (
          <FiChevronDown className={styles.toggleIcon} />
        )}
      </div>

      {isOpen && (
        <nav className={styles.tocNav}>
          <ul className={styles.tocList}>
            {headings.map((heading, index) => (
              <li
                key={index}
                className={`${styles.tocItem} ${styles[`level${heading.level}`]} ${activeId === heading.id ? styles.active : ''}`}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => handleClick(e, heading.id)}
                  className={styles.tocLink}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TableOfContents;
