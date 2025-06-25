import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { getSiteMetadata } from '@/lib/site';
import { getAllMenus } from '@/lib/menus';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaMoneyBillWave, 
  FaChevronDown, 
  FaChevronUp, 
  FaClock, 
  FaPassport, 
  FaLanguage, 
  FaPlane,
  FaInfoCircle,
  FaHotel,
  FaCar,
  FaUtensils,
  FaUserTie,
  FaCamera,
  FaTicketAlt,
  FaMedkit,
  FaPhoneAlt,
  FaTimesCircle,
  FaShoppingBag,
  FaWineGlassAlt,
  FaGift,
  FaCreditCard,
  FaGoogle,
  FaEnvelope,
  FaUser
} from 'react-icons/fa';
import Layout from '@/components/Layout';
import Container from '@/components/Container';
import Section from '@/components/Section';
import styles from '@/styles/pages/SimpleTripPage.module.scss';
import { getTripConfig, getSnapchatTripData } from '@/data/trips';
import { getUserDataFromSources, storeLastVisitedTrip } from '@/utils/snapchatTracking';
import { useRouter } from 'next/router';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import jwt_decode from 'jwt-decode';
import TripForm from '@/components/TripForm';
import { trackSnapchatViewContent } from '@/utils/snapchatTracking';
import { decodeHtmlEntitiesSafe } from '@/lib/util';

// Function to decode HTML entities using enhanced utility
const decodeHtmlEntities = (text) => {
  return decodeHtmlEntitiesSafe(text);
};

// Simple accordion component
const AccordionItem = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className={styles.accordionItem}>
      <div 
        className={styles.accordionHeader} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>{title}</h3>
        <span>{isOpen ? <FaChevronUp /> : <FaChevronDown />}</span>
      </div>
      {isOpen && (
        <div className={styles.accordionContent} 
          dangerouslySetInnerHTML={{ __html: content }} 
        />
      )}
    </div>
  );
};

// Gallery component
const TripGallery = ({ images }) => {
  const [index, setIndex] = useState(-1);

  if (!images || images.length === 0) {
    return null;
  }

  // We need at least one image for the gallery
  const featuredImage = images[0];
  
  // The rest of the images for the grid (up to 4)
  let gridImages = images.slice(1, 5);
  
  // Only show the grid if we have additional images beyond the featured image
  const hasAdditionalImages = gridImages.length > 0;
  
  // All images for the lightbox
  const allImages = images;

  return (
    <div className={styles.galleryContainer}>
      <div className={styles.galleryRow}>
        {/* Large featured image - left side */}
        <div className={styles.galleryMainCol}>
          <div className={styles.galleryMainImage} onClick={() => setIndex(0)}>
            <Image
              src={featuredImage.src}
              alt={featuredImage.alt || "Trip featured image"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.galleryImage}
              loading="eager"
              priority
            />
            <div className={styles.imageOverlay}>
              <span className={styles.viewIcon}><i className="bi bi-eye"></i></span>
            </div>
          </div>
        </div>

        {/* Grid of smaller images - right side - only show if we have additional images */}
        {hasAdditionalImages && (
          <div className={styles.galleryGridCol}>
            <div className={styles.galleryGrid}>
              {gridImages.map((image, idx) => {
                // If this is the third image (index 2) and we have more than 4 total images
                const isViewMoreButton = idx === 2 && images.length > 5;

                return (
                  <div key={idx} className={styles.galleryGridItem}>
                    <div 
                      className={`${styles.galleryImgWrap} ${isViewMoreButton ? styles.active : ''}`}
                      onClick={() => isViewMoreButton ? setIndex(0) : setIndex(idx + 1)}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt || "Trip gallery image"}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className={styles.galleryImage}
                        loading="lazy"
                      />
                      <div className={styles.imageOverlay}>
                        {isViewMoreButton ? (
                          <button className={styles.viewMoreBtn}>
                            <i className="bi bi-plus-lg"></i> View More Images
                          </button>
                        ) : (
                          <span className={styles.viewIcon}><i className="bi bi-eye"></i></span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Lightbox
        open={index >= 0}
        index={index}
        close={() => setIndex(-1)}
        slides={allImages.map(image => ({ src: image.src, alt: image.alt }))}
        plugins={[Thumbnails, Zoom, Fullscreen, Slideshow]}
        carousel={{
          finite: images.length <= 5
        }}
        thumbnails={{
          position: "bottom"
        }}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 2
        }}
      />
    </div>
  );
};

// Simplified contact form component
const ContactForm = ({ price }) => {
  const [isLoading, setIsLoading] = useState(false);
  const installmentAmount = Math.ceil(price / 4);

  return (
    <div className={styles.contactForm}>
      <div className={styles.installmentInfo}>
        <FaCreditCard className={styles.installmentIcon} />
        <h3>الدفع بالتقسيط على أربع دفعات</h3>
        <div className={styles.installmentAmount}>
          <span>{installmentAmount.toLocaleString('en-US')}</span> ريال / شهرياً
        </div>
      </div>

      <button 
        className={styles.submitButton}
        onClick={() => window.location.href = '/contact'}
        disabled={isLoading}
      >
        اضغط هنا وسيتواصل معك مستشارك السياحي
      </button>
    </div>
  );
};

export default function SingleTrip({ trip, metadata, menus }) {
  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingCardExpanded, setIsBookingCardExpanded] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasShownHint, setHasShownHint] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState({ left: 0, width: 0 });
  
  // Add touch handling for mobile booking card
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // JavaScript-based sticky implementation
  useEffect(() => {
    const handleScroll = () => {
      const sidebarElement = document.querySelector(`.${styles.sidebarContent}`);
      const mainContentElement = document.querySelector(`.${styles.mainContent}`);
      
      if (!sidebarElement || !mainContentElement) return;
      
      const mainContentRect = mainContentElement.getBoundingClientRect();
      
      // Check if we're on desktop (width >= 992px)
      if (window.innerWidth >= 992) {
        // Capture the original position when not sticky
        if (!isSticky) {
          const sidebarRect = sidebarElement.getBoundingClientRect();
          setSidebarPosition({
            left: sidebarRect.left,
            width: sidebarRect.width
          });
        }
        
        // Calculate when to start sticking
        const shouldStick = mainContentRect.top <= 32; // 2rem = 32px
        
        if (shouldStick !== isSticky) {
          setIsSticky(shouldStick);
        }
      } else {
        // Reset for mobile
        if (isSticky) {
          setIsSticky(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial check
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isSticky]);

  // Handle scroll position and hint visibility
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (position / pageHeight) * 100;
      
      setScrollPosition(position);

      // Show hint if scrolled 30% and hasn't been shown before
      if (scrollPercentage > 30 && !hasShownHint) {
        setShowHint(true);
        setHasShownHint(true);
        
        // Hide hint after 3 seconds
        setTimeout(() => {
          setShowHint(false);
        }, 3000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasShownHint]);

  // Show hint after 5 seconds if user hasn't scrolled
  useEffect(() => {
    if (!hasShownHint) {
      const timer = setTimeout(() => {
        setShowHint(true);
        setHasShownHint(true);
        
        // Hide hint after 3 seconds
        setTimeout(() => {
          setShowHint(false);
        }, 3000);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [hasShownHint]);

  // Handle scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle touch events for the booking card
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > 50;
    const isDownSwipe = distance < -50;

    if (isUpSwipe && !isBookingCardExpanded) {
      setIsBookingCardExpanded(true);
    } else if (isDownSwipe && isBookingCardExpanded) {
      setIsBookingCardExpanded(false);
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  // Close expanded card when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const bookingCard = document.querySelector(`.${styles.bookingCard}`);
      if (bookingCard && !bookingCard.contains(e.target) && isBookingCardExpanded) {
        setIsBookingCardExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isBookingCardExpanded]);

  // Track Snapchat VIEW_CONTENT event on page load
  useEffect(() => {
    if (!trip || !getSnapchatTripData(trip.slug)) return;
    
    // Store this trip visit for dynamic pricing detection
    if (trip?.slug) {
      storeLastVisitedTrip(trip.slug);
    }
    
    const trackViewContent = async () => {
      const userData = getUserDataFromSources(router);
      
      await trackSnapchatViewContent({
        userData,
        ...getSnapchatTripData(trip.slug)
      });
    };
    
    // Track after a short delay to ensure page is loaded
    const timer = setTimeout(trackViewContent, 1000);
    return () => clearTimeout(timer);
  }, [trip?.slug, router]);

  // Handle form success - redirect to thank you pages
  const handleFormSuccess = ({ processedPhone, externalId, leadEventId, nationality, email, name, firstName, lastName }) => {
    const thankYouUrl = nationality === 'مواطن' ? '/thank-you-citizen' : '/thank-you-resident';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (processedPhone) queryParams.set('phone', processedPhone);
    if (email) queryParams.set('email', email);
    if (name) queryParams.set('name', name);
    if (firstName) queryParams.set('firstName', firstName);
    if (lastName) queryParams.set('lastName', lastName);
    if (externalId) queryParams.set('external_id', externalId);
    if (leadEventId) queryParams.set('eventId', leadEventId);
    
    // Add trip source for proper tracking
    queryParams.set('trip_source', trip?.slug || 'generic-trip');
    
    // Construct the full redirect URL
    const redirectUrl = `${thankYouUrl}?${queryParams.toString()}`;
    
    console.log(`Redirecting to: ${redirectUrl}`);
    
    // Use window.location.href for reliable redirect
    window.location.href = redirectUrl;
  };

  // Show loading state during fallback
  if (router.isFallback) {
    return (
      <Layout>
        <Section>
          <Container>
            <div className={styles.loading}>
              <h2>جاري تحميل الرحلة...</h2>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }
  
  // Handle case where trip is not found
  if (!trip) {
    return (
      <Layout>
        <Section>
          <Container>
            <div className={styles.error}>
              <h2>عذراً، لم نجد الرحلة</h2>
              <p>الرحلة التي تبحث عنها غير موجودة</p>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }
  
  // Safe access to properties with fallbacks
  const rawTitle = trip?.title || '';
  const title = decodeHtmlEntitiesSafe(rawTitle);
  const description = trip?.description || '';
  const hasItineraries = trip?.itineraries && Array.isArray(trip.itineraries) && trip.itineraries.length > 0;
  const hasFaqs = trip?.faqs && Array.isArray(trip.faqs) && trip.faqs.length > 0;
  const featuredImage = trip?.gallery && trip.gallery.length > 0 ? trip.gallery[0].src : '/images/placeholder.jpg';
  const price = (trip?.wp_travel_engine_setting_trip_actual_price || trip?.price || 4999).toLocaleString('en-US');
  const handleBookNow = () => setIsBookingModalOpen(true);
  
  // Generate optimized SEO title for trip
  const generateTripSEOTitle = () => {
    // Start with the decoded title, ensuring we have a proper fallback
    let seoTitle = title || trip?.title || 'رحلة سياحية مميزة';
    
    // Clean the title from any remaining HTML entities and extra spaces
    seoTitle = seoTitle.replace(/&[^;]+;/g, '').replace(/\s+/g, ' ').trim();
    
    // If title is still empty or just whitespace, use a meaningful fallback
    if (!seoTitle || seoTitle.length === 0) {
      // Try to create a title from destination + duration
      const destinationName = trip?.destination?.title || trip?.destination?.name || trip?.destination || '';
      const durationText = trip?.duration?.days ? `${trip.duration.days} أيام` : '';
      
      if (destinationName && durationText) {
        seoTitle = `رحلة ${destinationName} ${durationText}`;
      } else if (destinationName) {
        seoTitle = `رحلة ${destinationName}`;
      } else {
        seoTitle = 'رحلة سياحية مميزة';
      }
    }
    
    // Add destination context if available and not already included
    const destinationName = trip?.destination?.title || trip?.destination?.name || trip?.destination || '';
    if (destinationName && !seoTitle.includes(destinationName)) {
      seoTitle = `${seoTitle} - ${destinationName}`;
    }
    
    // Add duration if available and not already included
    const durationText = trip?.duration?.days ? `${trip.duration.days} أيام` : '';
    if (durationText && !seoTitle.includes(durationText)) {
      seoTitle = `${seoTitle} ${durationText}`;
    }
    
    // Add brand name if not already included
    if (!seoTitle.includes('مدارات الكون')) {
      seoTitle = `${seoTitle} | مدارات الكون`;
    }
    
    // Ensure optimal length (max 60 characters for Arabic SEO)
    if (seoTitle.length > 60) {
      const parts = seoTitle.split(' | ');
      if (parts[0].length > 45) {
        parts[0] = parts[0].substring(0, 42) + '...';
      }
      seoTitle = parts.join(' | ');
    }
    
    return seoTitle;
  };

  // Generate meta description for trip
  const generateTripDescription = () => {
    // If we have a description, clean it and use it
    if (description && description.trim().length > 0) {
      const cleanDesc = description.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim();
      if (cleanDesc.length > 0) {
        return cleanDesc.length > 155 ? cleanDesc.substring(0, 152) + '...' : cleanDesc;
      }
    }
    
    // Build description from available data
    const tripTitle = title || trip?.title || '';
    const cleanTripTitle = tripTitle.replace(/&[^;]+;/g, '').trim();
    
    let desc = `احجز رحلة ${cleanTripTitle || 'سياحية مميزة'}`;
    
    // Add destination information
    const destinationName = trip?.destination?.title || trip?.destination?.name || trip?.destination || '';
    if (destinationName) {
      desc += ` إلى ${destinationName}`;
    }
    
    // Add duration information
    const durationDays = trip?.duration?.days;
    if (durationDays) {
      desc += ` لمدة ${durationDays} أيام`;
    }
    
    // Add price information
    const tripPrice = trip?.wp_travel_engine_setting_trip_actual_price || trip?.price;
    if (tripPrice) {
      desc += ` بسعر ${tripPrice.toLocaleString('en-US')} ريال`;
    }
    
    desc += ' مع مدارات الكون. أفضل العروض السياحية والخدمات المتميزة.';
    
    return desc.length > 155 ? desc.substring(0, 152) + '...' : desc;
  };

  // Generate keywords for trip
  const generateTripKeywords = () => {
    const keywords = ['مدارات الكون', 'رحلات سياحية', 'حجز رحلة', 'عروض سفر'];
    
    // Add destination-related keywords
    const destinationName = trip?.destination?.title || trip?.destination?.name || trip?.destination || '';
    if (destinationName) {
      keywords.push(destinationName, `رحلات ${destinationName}`, `السياحة في ${destinationName}`);
    }
    
    // Add cleaned trip title
    const cleanTitle = title || trip?.title || '';
    if (cleanTitle) {
      const cleanedTitle = cleanTitle.replace(/&[^;]+;/g, '').trim();
      if (cleanedTitle && cleanedTitle.length > 0) {
        keywords.push(cleanedTitle);
      }
    }
    
    // Add relevant travel keywords
    keywords.push('سياحة', 'سفر', 'عطلات', 'إجازات', 'فنادق', 'طيران', 'باكج سياحي', 'برنامج سياحي');
    
    // Remove duplicates and empty keywords (ensure all are strings)
    const uniqueKeywords = [...new Set(keywords.filter(keyword => 
      keyword && typeof keyword === 'string' && keyword.trim().length > 0
    ))];
    
    return uniqueKeywords.join(', ');
  };

  return (
    <Layout metadata={metadata} menus={menus}>
      {/* Comprehensive SEO Head Section */}
      <Head>
        <title>{generateTripSEOTitle()}</title>
        <meta name="description" content={generateTripDescription()} />
        <meta name="keywords" content={generateTripKeywords()} />
        
        {/* Open Graph */}
        <meta property="og:title" content={generateTripSEOTitle()} />
        <meta property="og:description" content={generateTripDescription()} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://madaratalkon.sa/trip/${trip.slug}`} />
        <meta property="og:image" content={trip?.gallery?.[0]?.src || featuredImage || '/images/default-trip.jpg'} />
        <meta property="og:site_name" content="مدارات الكون" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={generateTripSEOTitle()} />
        <meta name="twitter:description" content={generateTripDescription()} />
        <meta name="twitter:image" content={trip?.gallery?.[0]?.src || featuredImage || '/images/default-trip.jpg'} />
        
        {/* Product/Trip Specific Meta */}
        <meta name="product:price:amount" content={trip?.wp_travel_engine_setting_trip_actual_price || trip?.price || '4999'} />
        <meta name="product:price:currency" content="SAR" />
        <meta name="product:availability" content="InStock" />
        
        {/* Location Meta */}
        {(trip?.destination?.title || trip?.destination?.name || trip?.destination) && (
          <meta name="geo.placename" content={trip?.destination?.title || trip?.destination?.name || trip?.destination} />
        )}
        
        {/* Canonical URL */}
        <link rel="canonical" href={`https://madaratalkon.sa/trip/${trip.slug}`} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="مدارات الكون" />
      </Head>
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroImage}>
          <Image 
            src={featuredImage} 
            alt={title || trip?.title || 'رحلة سياحية مميزة'}
            fill
            sizes="100vw"
            quality={90} 
            priority
          />
          <div className={styles.overlay}></div>
        </div>
        <Container>
          <div className={styles.heroContent}>
            <h1>{title || 'رحلة سياحية مميزة'}</h1>
            <div className={styles.tripInfo}>
              <div className={styles.infoItem}>
                <FaCalendarAlt />
                <span>{trip.duration?.days || 0} {trip.duration?.duration_unit || 'يوم'}</span>
              </div>
              <div className={styles.infoItem}>
                <FaMoneyBillWave />
                <span>{price} {trip.currency?.code || 'ريال'}</span>
              </div>
              {(trip?.destination?.title || trip?.destination?.name || trip?.destination) && (
                <div className={styles.infoItem}>
                  <FaMapMarkerAlt />
                  <span>{trip?.destination?.title || trip?.destination?.name || trip?.destination}</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </div>
      
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Left Column - Trip Details */}
        <div className={styles.tripDetails}>
          {/* Main Description Box */}
          <div className={`${styles.bentoBox} ${styles.mainDescription}`}>
            <div className={styles.decorativeCircle}></div>
            <div className={styles.decorativeDots}></div>
            <h2 className={styles.sectionTitle}>
              نبذة عن الرحلة
              <span className={styles.titleLine}></span>
            </h2>
            <div className={styles.tripDescription} dangerouslySetInnerHTML={{ __html: description }} />
          </div>

          {/* Services Grid */}
          <div className={styles.bentoGrid}>
            {/* Included Services Box */}
            <div className={`${styles.bentoBox} ${styles.includedServices}`}>
              <h2 className={styles.sectionTitle}>
                الخدمات المشمولة
                <span className={styles.titleLine}></span>
              </h2>
              <div className={styles.includedList}>
                {trip.cost_includes ? (
                  <ul>
                    {trip.cost_includes.split('\n').map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>لا توجد معلومات</p>
                )}
              </div>
            </div>

            {/* Excluded Services Box */}
            <div className={`${styles.bentoBox} ${styles.excludedServices}`}>
              <h2 className={styles.sectionTitle}>
                غير مشمول
                <span className={styles.titleLine}></span>
              </h2>
              <div className={styles.excludedList}>
                {trip.cost_excludes ? (
                  <ul>
                    {trip.cost_excludes.split('\n').map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>لا توجد معلومات</p>
                )}
              </div>
            </div>
          </div>

          {/* Itinerary Box */}
          {hasItineraries && (
            <div className={`${styles.bentoBox} ${styles.itineraryBox}`}>
              <h2 className={styles.sectionTitle}>
                برنامج الرحلة
                <span className={styles.titleLine}></span>
              </h2>
              <div className={styles.accordion}>
                {trip.itineraries.map((day, index) => (
                  <AccordionItem
                    key={index}
                    title={`اليوم ${index + 1}: ${day.title || ''}`}
                    content={day.content || ''}
                    defaultOpen={index === 0}
                  />
                ))}
              </div>
            </div>
          )}

          {/* FAQs Box */}
          {hasFaqs && (
            <div className={`${styles.bentoBox} ${styles.faqBox}`}>
              <h2 className={styles.sectionTitle}>
                الأسئلة الشائعة
                <span className={styles.titleLine}></span>
              </h2>
              <div className={styles.accordion}>
                {trip.faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    title={faq.title || ''}
                    content={faq.content || ''}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Booking Card */}
        <div 
          className={`${styles.sidebarContent} ${isSticky ? styles.sticky : ''}`}
          style={isSticky ? {
            left: `${sidebarPosition.left}px`,
            width: `${sidebarPosition.width}px`
          } : {}}
        >
          <div 
            className={`${styles.bookingCard} ${isBookingCardExpanded ? styles.expanded : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={`${styles.price} ${showHint ? styles.showHint : ''}`}
              onClick={() => {
                setIsBookingCardExpanded(!isBookingCardExpanded);
                setShowHint(false);
              }}
            >
              <h3>السعر لكل شخص</h3>
              <div className={styles.priceAmount}>
                {price} <span>ريال</span>
              </div>
              <div className={styles.priceHint}>اضغط هنا</div>
            </div>
            
            <div className={styles.installmentInfo}>
              <FaCreditCard className={styles.installmentIcon} />
              <h3>الدفع بالتقسيط على أربع دفعات</h3>
              <div className={styles.installmentAmount}>
                <span>{Math.ceil(parseInt(price.replace(/,/g, '')) / 4).toLocaleString('en-US')}</span> ريال / شهرياً
              </div>
            </div>

            <TripForm 
              fields={[
                {
                  name: 'phone',
                  label: 'الجوال',
                  type: 'tel',
                  required: true,
                  autoComplete: 'tel',
                  floatingLabel: true,
                  showCountryCode: true,
                },
                {
                  name: 'name',
                  label: 'الاسم الكامل (اختياري)',
                  type: 'text',
                  required: false,
                  autoComplete: 'name',
                  floatingLabel: true,
                },
                {
                  name: 'email',
                  label: 'البريد الإلكتروني (اختياري)',
                  type: 'email',
                  required: false,
                  autoComplete: 'email',
                  floatingLabel: true,
                },
              ]}
              zapierConfig={{
                endpoint: '/api/zapier-proxy',
                extraPayload: {
                  destination: title || trip?.title || 'رحلة سياحية',
                  tripName: trip?.slug || 'dynamic-trip',
                  price: parseInt(price.replace(/,/g, '')) || 0,
                },
              }}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      </div>
      
      {/* Trip Gallery */}
      {trip.gallery && trip.gallery.length > 0 && (
        <div className={styles.galleryWrapper}>
          <TripGallery images={trip.gallery} />
        </div>
      )}
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    console.log('Fetching trip with slug:', params.slug);
    
    // Fetch metadata and menus in parallel with trip data
    const [
      metadata,
      { menus }
    ] = await Promise.all([
      getSiteMetadata(),
      getAllMenus()
    ]);
    
    // Try multiple variations of the slug
    const originalSlug = params.slug;
    const encodedSlug = encodeURIComponent(params.slug);
    const decodedSlug = decodeURIComponent(params.slug);
    
    let trips = [];
    let response;
    
    // Try with encoded slug first
    try {
      console.log('Trying encoded slug:', encodedSlug);
      response = await fetch(
        `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?slug=${encodedSlug}&_embed`
      );
      if (response.ok) {
        trips = await response.json();
        console.log('Found trips with encoded slug:', trips.length);
      }
    } catch (error) {
      console.log('Error with encoded slug:', error.message);
    }
    
    // If no trips found, try with original slug
    if (trips.length === 0) {
      try {
        console.log('Trying original slug:', originalSlug);
        response = await fetch(
          `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?slug=${originalSlug}&_embed`
        );
        if (response.ok) {
          trips = await response.json();
          console.log('Found trips with original slug:', trips.length);
        }
      } catch (error) {
        console.log('Error with original slug:', error.message);
      }
    }
    
    // If still no trips found, try with decoded slug
    if (trips.length === 0 && decodedSlug !== originalSlug) {
      try {
        console.log('Trying decoded slug:', decodedSlug);
        response = await fetch(
          `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?slug=${decodedSlug}&_embed`
        );
        if (response.ok) {
          trips = await response.json();
          console.log('Found trips with decoded slug:', trips.length);
        }
      } catch (error) {
        console.log('Error with decoded slug:', error.message);
      }
    }

    const trip = trips[0];

    if (!trip) {
      // Clean metadata to remove undefined values
      const cleanMetadata = JSON.parse(JSON.stringify(metadata || {}));

      return {
        props: {
          trip: null,
          metadata: cleanMetadata,
          menus: menus || [],
        },
        revalidate: 60,
      };
    }
    
    // Extract all possible gallery images from the API response
    const galleryImages = [];
    
    console.log('Trip featured media:', trip?.featured_media);
    console.log('Trip embedded featuredmedia:', trip?._embedded?.['wp:featuredmedia']);
    console.log('Trip featured_image:', trip?.featured_image);
    
    // Featured image from embedded data
    if (trip?._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      console.log('Adding featured image from embedded data');
      galleryImages.push({
        src: trip._embedded['wp:featuredmedia'][0].source_url,
        alt: trip._embedded['wp:featuredmedia'][0]?.alt_text || trip.title?.rendered || 'Trip image'
      });
    }
    
    // Fetch attachment images using the wp:attachment endpoint
    if (trip?._links?.['wp:attachment']?.[0]?.href) {
      try {
        console.log('Fetching attachments from:', trip._links['wp:attachment'][0].href);
        const attachmentResponse = await fetch(trip._links['wp:attachment'][0].href);
        if (attachmentResponse.ok) {
          const attachments = await attachmentResponse.json();
          console.log('Found attachments:', attachments.length);
          
          // Add all attachment images to the gallery
          for (const attachment of attachments) {
            if (attachment?.source_url && (attachment.media_type === 'image' || attachment.type === 'image' || attachment.mime_type?.startsWith('image/'))) {
              // Avoid duplicating the featured image
              const isDuplicate = galleryImages.some(img => img.src === attachment.source_url);
              if (!isDuplicate) {
                console.log('Adding attachment image:', attachment.source_url);
                galleryImages.push({
                  src: attachment.source_url,
                  alt: attachment.alt_text || `${trip.title?.rendered || 'Trip'} - Gallery image`
                });
              }
            }
          }
        }
      } catch (attachmentError) {
        console.error('Error fetching trip attachments:', attachmentError);
      }
    }
    
    // If no gallery images found, try to get images from ACF or other custom fields
    if (galleryImages.length <= 1 && trip?.acf) {
      console.log('Checking ACF fields for gallery images');
      // Check for common ACF gallery field names
      const possibleGalleryFields = ['gallery', 'trip_gallery', 'images', 'photo_gallery'];
      
      for (const fieldName of possibleGalleryFields) {
        if (trip.acf[fieldName] && Array.isArray(trip.acf[fieldName])) {
          console.log(`Found ACF gallery field: ${fieldName}`);
          for (const image of trip.acf[fieldName]) {
            if (image?.url || image?.source_url) {
              const imageUrl = image.url || image.source_url;
              const isDuplicate = galleryImages.some(img => img.src === imageUrl);
              if (!isDuplicate) {
                galleryImages.push({
                  src: imageUrl,
                  alt: image.alt || `${trip.title?.rendered || 'Trip'} - Gallery image`
                });
              }
            }
          }
        }
      }
    }
    
    // If still no images found, check if featured_image object has image data
    if (galleryImages.length === 0 && trip?.featured_image?.sizes?.large?.source_url) {
      console.log('Adding fallback from featured_image object');
      galleryImages.push({
        src: trip.featured_image.sizes.large.source_url,
        alt: trip.title?.rendered || 'Trip image'
      });
    }
    
    // Final fallback: Use a placeholder or don't show gallery
    if (galleryImages.length === 0) {
      console.log('No gallery images found for trip:', trip.id);
    }
    
    console.log('Final gallery images count:', galleryImages.length);
    
    // Format trip data with safe defaults
    const formattedTrip = {
      id: trip.id || 0,
      title: trip.title?.rendered || 'رحلة سياحية',
      slug: trip.slug || '',
      description: trip.content?.rendered || '',
      featured_image: trip.featured_image || null,
      duration: {
        days: trip.duration?.days || 0,
        nights: trip.duration?.nights || 0,
        duration_unit: trip.duration?.duration_unit || 'يوم',
      },
      destination: trip.destination || null,
      price: trip.price || 4999,
      wp_travel_engine_setting_trip_actual_price: trip.wp_travel_engine_setting_trip_actual_price || null,
      currency: trip.currency || { code: 'ريال' },
      cost_includes: trip.cost_includes || '',
      cost_excludes: trip.cost_excludes || '',
      itineraries: Array.isArray(trip.itineraries) ? 
        trip.itineraries.map(item => ({
          title: item?.title || '',
          content: item?.content || ''
        })) : [],
      faqs: Array.isArray(trip.faqs) ? 
        trip.faqs.map(item => ({
          title: item?.title || '',
          content: item?.content || ''
        })) : [],
      gallery: galleryImages.length > 0 ? galleryImages : [],
      wpte_gallery_id: trip.wpte_gallery_id || {},
    };

    // Clean metadata to remove undefined values
    const cleanMetadata = JSON.parse(JSON.stringify(metadata || {}));

    return {
      props: {
        trip: formattedTrip,
        metadata: cleanMetadata,
        menus: menus || [],
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching trip:', error);
    
    // Fetch basic metadata for error state
    const [metadata, { menus }] = await Promise.all([
      getSiteMetadata().catch(() => ({})),
      getAllMenus().catch(() => ({ menus: [] })),
    ]);
    
    // Clean metadata to remove undefined values
    const cleanMetadata = JSON.parse(JSON.stringify(metadata || {}));

    return {
      props: {
        trip: null,
        metadata: cleanMetadata,
        menus: menus || [],
      },
      revalidate: 60,
    };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
} 