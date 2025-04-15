import { useState } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import Logo from '../Logo';
import styles from './Header.module.scss';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <ul>
            <li>
              <Link href="/blog" legacyBehavior>
                <a>المدونة</a>
              </Link>
            </li>
            <li>
              <Link href="/destinations" legacyBehavior>
                <a>الوجهات</a>
              </Link>
            </li>
            <li>
              <Link href="/about" legacyBehavior>
                <a>عن الموقع</a>
              </Link>
            </li>
            <li>
              <Link href="/trips" legacyBehavior>
                <a>الرحلات</a>
              </Link>
            </li>
          </ul>
        </nav>

        <button
          className={styles.searchButton}
          onClick={handleSearchToggle}
          aria-label="بحث"
        >
          <FaSearch />
          <span className="sr-only">Toggle Search</span>
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
