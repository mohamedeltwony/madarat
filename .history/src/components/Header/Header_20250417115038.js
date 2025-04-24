import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import Logo from '../Logo';
import styles from './Header.module.scss';

const Header = () => {
  const router = useRouter(); // Get router instance
  const { pathname } = router; // Get current pathname
  const isHomePage = pathname === '/'; // Check if it's the homepage

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  // Conditionally apply a class for homepage styling
  const headerClassName = `${styles.header} ${isHomePage ? styles.homeHeader : ''}`;

  return (
    <header className={headerClassName}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <nav className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}>
          <ul className={styles.mainMenu}>
            {/* Destinations Dropdown */}
            <li className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${activeDropdown === 'destinations' ? styles.active : ''}`}
                onClick={() => toggleDropdown('destinations')}
              >
                <span>الوجهات</span>
                <FaChevronDown className={styles.dropdownIcon} />
              </div>
              {activeDropdown === 'destinations' && (
                <ul className={styles.dropdown}>
                  <li>
                    <Link href="/destinations" legacyBehavior>
                      <a>جميع الوجهات</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/trips" legacyBehavior>
                      <a>جميع الرحلات</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/europe" legacyBehavior>
                      <a>أوروبا</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/middle-east" legacyBehavior>
                      <a>الشرق الأوسط</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/asia" legacyBehavior>
                      <a>آسيا</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/americas" legacyBehavior>
                      <a>الأمريكتين</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/africa" legacyBehavior>
                      <a>أفريقيا</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations/oceania" legacyBehavior>
                      <a>أوقيانوسيا</a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Packages Dropdown */}
            <li className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${activeDropdown === 'packages' ? styles.active : ''}`}
                onClick={() => toggleDropdown('packages')}
              >
                <span>الرحلات</span>
                <FaChevronDown className={styles.dropdownIcon} />
              </div>
              {activeDropdown === 'packages' && (
                <ul className={styles.dropdown}>
                  <li>
                    <Link href="/packages" legacyBehavior>
                      <a>جميع الرحلات</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages/honeymoon" legacyBehavior>
                      <a>رحلات شهر العسل</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages/family" legacyBehavior>
                      <a>رحلات عائلية</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages/adventure" legacyBehavior>
                      <a>رحلات المغامرة</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages/luxury" legacyBehavior>
                      <a>رحلات فاخرة</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages/budget" legacyBehavior>
                      <a>رحلات اقتصادية</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/packages/religious" legacyBehavior>
                      <a>رحلات دينية</a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Services Dropdown */}
            <li className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${activeDropdown === 'services' ? styles.active : ''}`}
                onClick={() => toggleDropdown('services')}
              >
                <span>الخدمات</span>
                <FaChevronDown className={styles.dropdownIcon} />
              </div>
              {activeDropdown === 'services' && (
                <ul className={styles.dropdown}>
                  <li>
                    <Link href="/services" legacyBehavior>
                      <a>جميع الخدمات</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/visa" legacyBehavior>
                      <a>خدمات التأشيرة</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/flights" legacyBehavior>
                      <a>حجز الطيران</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/hotels" legacyBehavior>
                      <a>حجز الفنادق</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/transportation" legacyBehavior>
                      <a>خدمات النقل</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/services/cruises" legacyBehavior>
                      <a>رحلات بحرية</a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Blog Link */}
            <li className={styles.menuItem}>
              <Link href="/blog" legacyBehavior>
                <a className={styles.menuLink}>المدونة</a>
              </Link>
            </li>

            {/* Explore Dropdown */}
            <li className={styles.menuItem}>
              <div
                className={`${styles.menuLink} ${activeDropdown === 'explore' ? styles.active : ''}`}
                onClick={() => toggleDropdown('explore')}
              >
                <span>استكشف</span>
                <FaChevronDown className={styles.dropdownIcon} />
              </div>
              {activeDropdown === 'explore' && (
                <ul className={styles.dropdown}>
                  <li>
                    <Link href="/archives" legacyBehavior>
                      <a>الأرشيف</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/authors" legacyBehavior>
                      <a>الكتّاب</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/advanced-search" legacyBehavior>
                      <a>بحث متقدم</a>
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* About Link */}
            <li className={styles.menuItem}>
              <Link href="/about" legacyBehavior>
                <a className={styles.menuLink}>عن الموقع</a>
              </Link>
            </li>

            {/* Contact Link */}
            <li className={styles.menuItem}>
              <Link href="/contact" legacyBehavior>
                <a className={styles.menuLink}>اتصل بنا</a>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.headerActions}>
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
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className={styles.searchOverlay}>
          <div className={styles.searchContainer}>
            <form
              action="/advanced-search"
              method="get"
              className={styles.searchForm}
            >
              <input
                type="text"
                name="q"
                placeholder="ابحث عن وجهات، رحلات، مقالات..."
                className={styles.searchInput}
                autoFocus
              />
              <button type="submit" className={styles.searchSubmit}>
                <FaSearch />
              </button>
            </form>
            <button className={styles.closeSearch} onClick={handleSearchToggle}>
              &times;
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
