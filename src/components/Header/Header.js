import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FaSearch,
  FaChevronDown,
  FaBars,
  FaTimes,
  FaArrowLeft,
  FaPhoneAlt,
  FaUserTie,
  FaCommentDots,
} from 'react-icons/fa';
import Logo from '../Logo';
import styles from './Header.module.scss';
import LocalizedLink from '../LocalizedLink';
import { AnimatedBorderButton } from '../UI';
import Image from 'next/image';

const Header = ({ menus }) => {
  const router = useRouter();
  const { pathname } = router;
  const isHomePage = pathname === '/';
  const isTripPage =
    (pathname.includes('/trips/') && pathname !== '/trips') ||
    pathname === '/book-now' ||
    pathname.includes('-trip') ||
    pathname === '/generic-trip' ||
    pathname === '/international-licence-trip' ||
    pathname === '/schengen-visa-trip' ||
    pathname === '/bosnia-trip' ||
    pathname === '/georgia-trip' ||
    pathname === '/azerbaijan-trip' ||
    pathname === '/poland-trip' ||
    pathname === '/italy-trip' ||
    pathname === '/russia-trip' ||
    pathname === '/turkey-trip' ||
    pathname === '/trabzon-wider-north-turkey' ||
    pathname === '/cruise-italy-spain-france' ||
    pathname === '/london-scotland-trip';

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [isCompact, setIsCompact] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const inactivityTimer = useRef(null);
  const navRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        navRef.current &&
        !navRef.current.contains(event.target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // Check if we're on a mobile device on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992); // Use the same breakpoint as $breakpoint-medium
    };

    checkMobile(); // Initial check
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // On mobile, force expanded menu
  useEffect(() => {
    if (isMobile) {
      setIsCompact(false);
    }
  }, [isMobile]);

  // Handle scroll effect for transparent header on all pages
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset || 0;
    if (scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Call once to set initial state
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
    };
  }, [handleScroll]);

  // Auto-collapse header after 10 seconds of inactivity when expanded (desktop only)
  useEffect(() => {
    if (!isCompact && !isMobile) {
      const resetTimer = () => {
        clearTimeout(inactivityTimer.current);
        inactivityTimer.current = setTimeout(() => setIsCompact(true), 10000);
      };
      // Listen for mousemove, keydown, click on header
      const events = ['mousemove', 'keydown', 'click', 'touchstart'];
      events.forEach((event) => document.addEventListener(event, resetTimer));
      resetTimer();
      return () => {
        clearTimeout(inactivityTimer.current);
        events.forEach((event) =>
          document.removeEventListener(event, resetTimer)
        );
      };
    }
  }, [isCompact, isMobile]);

  // Prevent body scrolling when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close any open dropdowns when toggling menu
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const toggleCompact = () => {
    // Only allow toggling on desktop
    if (!isMobile) {
      setIsCompact(!isCompact);
    }
  };

  // Get CTA button dropdown items
  const getCtaDropdownItems = () => {
    const allItems = [
      {
        label: 'احجز رحلتك الآن',
        icon: <FaUserTie size={14} />,
        onClick: () => router.push('/book-now'),
      },
      {
        label: 'اتصل بنا',
        icon: <FaPhoneAlt size={14} />,
        onClick: () => window.location.href = 'tel:920034019',
      },
      {
        label: 'ملاحظات وشكاوى',
        icon: <FaCommentDots size={14} />,
        onClick: () => router.push('/contact'),
      },
    ];

    // Filter out phone number option on trip pages
    if (isTripPage) {
      return allItems.filter(item => item.label !== 'اتصل بنا');
    }

    return allItems;
  };

  // Apply appropriate classes based on page type and scroll state
  const headerClassName = `${styles.header} \
    ${isHomePage ? styles.homeHeader : styles.transparentHeader} \
    ${isTripPage ? styles.tripHeader : ''} \
    ${scrolled ? styles.scrolled : ''} \
    ${!isCompact ? styles.expanded : ''}`;

  // For trip pages, use a simplified header with just logo and hamburger menu
  if (isTripPage) {
    const headerClasses = `${styles.header} ${styles.tripHeader} ${scrolled ? styles.scrolled : ''}`;
    
    return (
      <header className={headerClasses}>
        <div className={styles.container}>
          <div className={styles.logo}>
            <LocalizedLink href="/">
              <Logo />
            </LocalizedLink>
          </div>

          <div className={styles.tripHeaderActions}>
            {/* Call to Action Button - only on desktop */}
            {!isMobile && (
              <AnimatedBorderButton
                text="تواصل مع مستشارك السياحي"
                variant="transparent"
                dropdownItems={getCtaDropdownItems()}
              />
            )}

            <button
              ref={menuButtonRef}
              className={styles.menuButton}
              onClick={toggleMenu}
              aria-label="Toggle navigation menu"
              style={{ marginRight: !isMobile ? '10px' : '0' }}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>

          {/* Sidebar Navigation for Trip Pages */}
          <div
            ref={navRef}
            className={`${styles.tripNav} ${isMenuOpen ? styles.active : ''}`}
          >
            <div className={styles.sidebarHeader}>
              <div className={styles.logo}>
                <LocalizedLink href="/">
                  <Logo />
                </LocalizedLink>
              </div>
              <button
                className={styles.closeButton}
                onClick={toggleMenu}
                aria-label="Close navigation menu"
              >
                <FaTimes />
              </button>
            </div>

            <ul className={styles.sidebarMenu}>
              <li className={styles.sidebarMenuItem}>
                <LocalizedLink
                  href="/book-now"
                  className={styles.sidebarMenuLink}
                >
                  احجز خدمة
                </LocalizedLink>
              </li>
              <li className={styles.sidebarMenuItem}>
                <div
                  className={`${styles.sidebarMenuLink} ${activeDropdown === 'trips' ? styles.active : ''}`}
                  onClick={() => toggleDropdown('trips')}
                >
                  <span>الرحلات</span>
                  <FaChevronDown className={styles.dropdownIcon} />
                </div>
                {activeDropdown === 'trips' && (
                  <ul className={styles.sidebarSubmenu}>
                    <li><LocalizedLink href="/trips">جميع الرحلات</LocalizedLink></li>
                  </ul>
                )}
              </li>
              <li className={styles.sidebarMenuItem}>
                <div
                  className={`${styles.sidebarMenuLink} ${activeDropdown === 'destinations' ? styles.active : ''}`}
                  onClick={() => toggleDropdown('destinations')}
                >
                  <span>الوجهات</span>
                  <FaChevronDown className={styles.dropdownIcon} />
                </div>
                {activeDropdown === 'destinations' && (
                  <ul className={styles.sidebarSubmenu}>
                    <li><LocalizedLink href="/destinations">جميع الوجهات</LocalizedLink></li>
                    <li><LocalizedLink href="/destinations/europe">أوروبا</LocalizedLink></li>
                    <li><LocalizedLink href="/destinations/middle-east">الشرق الأوسط</LocalizedLink></li>
                    <li><LocalizedLink href="/destinations/asia">آسيا</LocalizedLink></li>
                    <li><LocalizedLink href="/destinations/americas">الأمريكتين</LocalizedLink></li>
                    <li><LocalizedLink href="/destinations/africa">أفريقيا</LocalizedLink></li>
                  </ul>
                )}
              </li>
              <li className={styles.sidebarMenuItem}>
                <LocalizedLink href="/blog" className={styles.sidebarMenuLink}>
                  المقالات
                </LocalizedLink>
              </li>
              <li className={styles.sidebarMenuItem}>
                <LocalizedLink href="/about" className={styles.sidebarMenuLink}>
                  من نحن
                </LocalizedLink>
              </li>
              <li className={styles.sidebarMenuItem}>
                <LocalizedLink href="/contact" className={styles.sidebarMenuLink}>
                  تواصل معنا
                </LocalizedLink>
              </li>
              
              {/* CTA Button positioned after menu items */}
              <li className={styles.sidebarCta}>
                <AnimatedBorderButton
                  text="تواصل مع مستشارك السياحي"
                  variant="gold"
                  dropdownItems={getCtaDropdownItems()}
                />
              </li>
            </ul>
          </div>

          {/* Overlay */}
          {isMenuOpen && (
            <div className={styles.overlay} onClick={toggleMenu}></div>
          )}
        </div>
      </header>
    );
  }

  // Regular header for non-trip pages (now with transparent styling)
  return (
    <header className={headerClassName}>
      <div
        className={styles.container}
        style={
          isCompact && !isMobile
            ? { maxWidth: 'fit-content', transition: 'max-width 0.3s' }
            : {}
        }
      >
        <div className={styles.logo}>
          <LocalizedLink href="/">
            <Logo />
          </LocalizedLink>
        </div>

        {/* Mobile Menu Button - only visible on mobile */}
        <button
          ref={menuButtonRef}
          className={styles.mobileMenuButton}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <nav
          ref={navRef}
          className={`${styles.nav} ${isMenuOpen ? styles.active : ''}`}
        >
          <ul
            className={styles.mainMenu}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: '0.95rem',
            }}
          >
            {/* Critical items (always visible) */}
            <li className={styles.menuItem}>
              <LocalizedLink href="/book-now" className={styles.menuLink}>
                احجز خدمة
              </LocalizedLink>
            </li>
            <li className={styles.menuItem}>
              <LocalizedLink href="/trips" className={styles.menuLink}>
                الرحلات
              </LocalizedLink>
            </li>

            {/* Expanded menu items (visible when expanded or on mobile) */}
            {(!isCompact || isMobile) && (
              <>
                <li className={styles.menuItem}>
                  <LocalizedLink
                    href="/destinations"
                    className={styles.menuLink}
                  >
                    الوجهات
                  </LocalizedLink>
                </li>
                <li className={styles.menuItem}>
                  <LocalizedLink href="/blog" className={styles.menuLink}>
                    المقالات
                  </LocalizedLink>
                </li>
                <li className={styles.menuItem}>
                  <LocalizedLink href="/about" className={styles.menuLink}>
                    من نحن
                  </LocalizedLink>
                </li>
                <li className={styles.menuItem}>
                  <LocalizedLink href="/contact" className={styles.menuLink}>
                    تواصل معنا
                  </LocalizedLink>
                </li>
              </>
            )}

            {/* Call to Action Button */}
            <li className={`${styles.menuItem} ${styles.ctaMenuItem}`}>
              <AnimatedBorderButton
                text="تواصل مع مستشارك السياحي"
                variant={scrolled ? 'gold' : 'transparent'}
                dropdownItems={getCtaDropdownItems()}
              />
            </li>

            {/* Collapse header back to compact when expanded - right side, white icon - desktop only */}
            {!isCompact && !isMobile && (
              <li
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={toggleCompact}
              >
                <FaArrowLeft
                  size={20}
                  className={`${styles.arrowIcon} ${styles.arrowIconExpanded}`}
                />
              </li>
            )}

            {/* Expand arrow for compact mode - left side, white icon - desktop only */}
            {isCompact && !isMobile && (
              <li
                style={{
                  marginLeft: 8,
                  marginRight: 8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={toggleCompact}
              >
                <FaArrowLeft
                  size={20}
                  className={`${styles.arrowIcon} ${styles.arrowIconHint}`}
                />
              </li>
            )}
          </ul>
        </nav>

        {/* Mobile Menu Close Button - only visible when menu is open on mobile */}
        {isMenuOpen && (
          <button
            className={styles.mobileSidebarClose}
            onClick={toggleMenu}
            aria-label="Close navigation menu"
          >
            <FaTimes />
          </button>
        )}

        {/* Overlay */}
        {isMenuOpen && (
          <div className={styles.overlay} onClick={toggleMenu}></div>
        )}
      </div>
    </header>
  );
};

export default Header;
