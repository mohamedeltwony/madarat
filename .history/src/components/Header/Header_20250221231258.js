import { useState } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import styles from './Header.module.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <img src="/images/logo.png" alt="WeSeek Travel" />
        </Link>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <ul>
            <li>
              <Link href="/blog">المدونة</Link>
            </li>
            <li>
              <Link href="/destinations">الوجهات</Link>
            </li>
            <li>
              <Link href="/about">عن الموقع</Link>
            </li>
            <li>
              <Link href="/trips">الرحلات</Link>
            </li>
          </ul>
        </nav>

        <button className={styles.searchButton} aria-label="بحث">
          <FaSearch />
        </button>

        <button 
          className={`${styles.menuButton} ${isMenuOpen ? styles.active : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="القائمة"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
