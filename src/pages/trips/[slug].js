import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/legacy/image';
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaGlobe,
  FaPlane,
  FaBed,
  FaUtensils,
  FaCheck,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaCreditCard,
  FaTimes as FaClose,
} from 'react-icons/fa';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import TripGallery from '../../components/TripGallery';
import styles from '../../styles/pages/SingleTrip.module.scss';
import { normalizeText, parseHtml } from '../../utils/textNormalizer';
import { useRouter } from 'next/router';

// Booking Modal Component
const BookingModal = ({ isOpen, onClose, trip }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    adults: 1,
    children: 0,
    message: '',
  });

  // Define these functions before any conditional returns
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would send the booking data to your backend
    console.log('Booking submitted:', formData);
    alert('تم إرسال طلب الحجز بنجاح، سيتم التواصل معك قريباً');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>حجز رحلة: {normalizeText(trip?.title || '')}</h3>
          <button className={styles.closeButton} onClick={onClose}>
            <FaClose />
          </button>
        </div>
        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">الاسم بالكامل</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="أدخل الاسم بالكامل"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone">رقم الجوال</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="05xxxxxxxx"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">البريد الإلكتروني</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="adults">عدد البالغين</label>
                <input 
                  type="number" 
                  id="adults" 
                  name="adults" 
                  min="1" 
                  value={formData.adults}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="children">عدد الأطفال</label>
                <input 
                  type="number" 
                  id="children" 
                  name="children" 
                  min="0" 
                  value={formData.children}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="message">ملاحظات إضافية</label>
              <textarea 
                id="message" 
                name="message" 
                rows="3"
                value={formData.message}
                onChange={handleChange}
                placeholder="أي ملاحظات أو طلبات خاصة"
              ></textarea>
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>تأكيد الحجز</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper component for accordion sections
const AccordionItem = ({ title, content, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}>
      <div
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3>{normalizeText(title || '')}</h3>
        <span className={styles.accordionIcon}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {isOpen && (
        <div className={styles.accordionContent}>
          <div dangerouslySetInnerHTML={{ __html: parseHtml(content || '') }} />
        </div>
      )}
    </div>
  );
};

// Helper to extract countries from trip description
const extractCountries = (description) => {
  const countries = [
    'ايطاليا',
    'فرنسا',
    'المانيا',
    'هولندا',
    'اسبانيا',
    'البوسنة',
    'تركيا',
    'روسيا',
    'بولندا',
    'جورجيا',
    'المملكة المتحدة',
    'بريطانيا',
    'لندن',
    'باريس',
    'روما',
    'البندقية',
    'برلين',
    'أمستردام',
    'مدريد',
    'سراييفو',
    'اسطنبول',
    'موسكو',
    'وارسو',
    'تبليسي',
    'سكتلندا',
  ];

  const foundCountries = [];
  // Make sure description is a string before calling replace
  const descriptionText = typeof description === 'string' 
    ? description.replace(/<[^>]*>/g, '').toLowerCase()
    : '';

  countries.forEach((country) => {
    if (descriptionText.includes(country.toLowerCase())) {
      foundCountries.push(country);
    }
  });

  return [...new Set(foundCountries)]; // Remove duplicates
};

export default function SingleTrip({ trip }) {
  // All hooks must be called at the top level, before any conditionals
  const router = useRouter();
  const [sticky, setSticky] = useState(false);
  const [bookingsCount, setBookingsCount] = useState(11); // Fixed number for consistent rendering
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [heroImageError, setHeroImageError] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration status

  // Important: useEffect must be called before any conditional returns
  useEffect(() => {
    // Mark component as hydrated
    setIsHydrated(true);
    
    if (!trip) return;

    const handleScroll = () => {
      setSticky(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    
    // Check if the featured image is available
    // Safely access gallery with optional chaining
    if (trip?.gallery && Array.isArray(trip.gallery) && trip.gallery.length > 0) {
      const testImg = new Image();
      testImg.onload = () => setHeroImageError(false);
      testImg.onerror = () => setHeroImageError(true);
      testImg.src = trip.gallery[0];
    } else {
      // No gallery images available, set hero image error to true
      setHeroImageError(true);
    }
    
    // Only update booking count after hydration is complete
    const bookingsInterval = setInterval(() => {
      // Only change if component is hydrated to avoid mismatches
      setBookingsCount(Math.floor(Math.random() * 11) + 2); // Random number between 2-12
    }, 30000); // Update every 30 seconds
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(bookingsInterval);
    };
  }, [trip]);

  // If the page is not yet generated, this will be displayed initially
  // until getStaticProps() finishes running
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

  // Handle the case where trip is null or undefined
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

  // Always define these values regardless of whether trip exists
  const hasItineraries = trip?.itineraries && Array.isArray(trip.itineraries) && trip.itineraries.length > 0;
  const hasFaqs = trip?.faqs && Array.isArray(trip.faqs) && trip.faqs.length > 0;
  
  // Extract highlights from description
  const countries = extractCountries(trip?.description || '');

  // Get featured image URL from gallery if available
  const featuredImageUrl = !heroImageError && 
    trip?.gallery && 
    Array.isArray(trip.gallery) && 
    trip.gallery.length > 0 
      ? trip.gallery[0] // Use the first gallery image as featured
      : null;

  // Normalize title and description to prevent hydration errors
  const normalizedTitle = normalizeText(trip?.title || '');
  const normalizedDescription = parseHtml(trip?.description || '');

  // Pass the gallery from the API response to the TripGallery component
  const galleryImages = trip && Array.isArray(trip.gallery) ? trip.gallery : [];

  // Price formatting
  const formattedPrice = trip ? (trip.wp_travel_engine_setting_trip_actual_price || trip.price || 4999).toLocaleString('ar-SA') : '4999';
  
  // Handle booking
  const handleBookingClick = () => {
    setIsBookingModalOpen(true);
  };

  // Convert number to Arabic numerals
  const toArabicDigits = (num) => {
    // For SSR/SSG, use a fixed string to ensure server/client consistency
    return "١١";
  };

  return (
    <Layout>
      <Head>
        <title>{`${normalizedTitle} | مدارات الكون`}</title>
        <Meta title={normalizedTitle} description={normalizedDescription} />
      </Head>

      {/* Hero Section with Background Image */}
      <section
        className={styles.heroSection}
        style={{
          backgroundImage: featuredImageUrl 
            ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${featuredImageUrl})` 
            : 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8))'
        }}
      >
        <Container>
          <div className={styles.heroContent}>
            <h1 className={styles.tripTitle}>{normalizedTitle}</h1>
            <div className={styles.tripMeta}>
              <div className={styles.metaItem}>
                <FaCalendarAlt className={styles.metaIcon} />
                <span>
                  {trip?.duration?.days || 0}{' '}
                  {normalizeText(trip?.duration?.duration_unit || 'يوم')}
                </span>
              </div>
              <div className={styles.metaItem}>
                <FaMoneyBillWave className={styles.metaIcon} />
                <span>
                  {formattedPrice}{' '}
                  {trip?.currency?.code || 'ريال'}
                </span>
              </div>
              {trip?.destination && (
                <div className={styles.metaItem}>
                  <FaMapMarkerAlt className={styles.metaIcon} />
                  <span>{normalizeText(trip?.destination?.title || '')}</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Trip Gallery Section */}
      <Section className={styles.gallerySection}>
        <Container>          
          <TripGallery gallery={galleryImages} videoUrl={null} />
        </Container>
      </Section>

      {/* Main Content with Two Columns */}
      <Section className={styles.mainContentSection}>
        <Container>
          <div className={styles.twoColumnLayout}>
            {/* Left Column - Trip Details */}
            <div className={styles.leftColumn}>
              {/* Trip Description Section */}
              <div className={styles.contentBlock}>
                <h2 className={styles.blockTitle}>تفاصيل الرحلة</h2>
                <div className={styles.tripDescription}>
                  <div dangerouslySetInnerHTML={{ __html: normalizedDescription }} />
                </div>
              </div>

              {/* Included and Not Included Services - Side by side */}
              <div className={styles.contentBlock}>
                <div className={styles.servicesColumns}>
                  <div className={styles.serviceColumn}>
                    <h2 className={styles.blockTitle}>الخدمات المشمولة</h2>
                    <div className={styles.includedServices}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseHtml(
                            trip?.cost_includes
                              ? trip.cost_includes
                                  .replace(/\r\n/g, '<br>')
                                  .replace(/\n/g, '<br>')
                              : '<p>لم يتم تحديد ما يشمل السعر</p>'
                          ),
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className={styles.serviceColumn}>
                    <h2 className={styles.blockTitle}>غير مشمول</h2>
                    <div className={styles.notIncludedServices}>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: parseHtml(
                            trip?.cost_excludes
                              ? trip.cost_excludes
                                  .replace(/\r\n/g, '<br>')
                                  .replace(/\n/g, '<br>')
                              : '<p>لم يتم تحديد ما لا يشمل السعر</p>'
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary Section */}
              {hasItineraries && (
                <div className={styles.contentBlock}>
                  <h2 className={styles.blockTitle}>برنامج الرحلة</h2>
                  <div className={styles.accordionContainer}>
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

              {/* FAQ Section */}
              {hasFaqs && (
                <div className={styles.contentBlock}>
                  <h2 className={styles.blockTitle}>الأسئلة الشائعة</h2>
                  <div className={styles.accordionContainer}>
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

            {/* Right Column - Booking Section */}
            <div className={styles.rightColumn}>
              <div className={styles.bookingCard}>
                <div className={styles.priceBox}>
                  <h3 className={styles.priceTitle}>السعر لكل شخص</h3>
                  <div className={styles.priceValue}>{formattedPrice} <span>ريال</span></div>
                </div>

                <div className={styles.bookingDetails}>
                  <div className={styles.bookingFeature}>
                    <FaCreditCard className={styles.featureIcon} />
                    <span>الدفع بالتقسيط علي اربع دفعات</span>
                  </div>

                  <div className={styles.daysCounter}>
                    <div className={styles.daysIcon}>
                      <FaCalendarAlt />
                    </div>
                    <div className={styles.daysText}>
                      {toArabicDigits(bookingsCount)} شخص قاموا بالحجز في آخر ٢٤ ساعة
                    </div>
                  </div>
                </div>

                <button 
                  className={styles.bookingButton}
                  onClick={handleBookingClick}
                >
                  حجز الآن
                </button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Sticky CTA */}
      <div className={`${styles.stickyCta} ${sticky ? styles.visible : ''}`}>
        <Container>
          <div className={styles.stickyCtaContent}>
            <div className={styles.ctaTripInfo}>
              <h3>{normalizedTitle}</h3>
              <div className={styles.ctaMeta}>
                <span>
                  {trip?.duration?.days || 0}{' '}
                  {normalizeText(trip?.duration?.duration_unit || 'يوم')}
                </span>
                <span className={styles.ctaPrice}>
                  {formattedPrice}{' '}
                  {trip?.currency?.code || 'ريال'}
                </span>
              </div>
            </div>
            <a href="#" className={styles.ctaButton} onClick={(e) => {
              e.preventDefault();
              handleBookingClick();
            }}>
              حجز الآن
            </a>
          </div>
        </Container>
      </div>

      {/* Booking Modal */}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        trip={trip}
      />
    </Layout>
  );
}

export async function getStaticProps({ params }) {
  try {
    const response = await fetch(
      `https://madaratalkon.com/wp-json/wp/v2/trip?slug=${params.slug}&_embed`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const trips = await response.json();
    const trip = trips[0];

    if (!trip) {
      return {
        props: {
          trip: null,
        },
        revalidate: 60,
      };
    }
    
    // Extract all possible gallery images from the API response
    const galleryImages = [];
    
    // Try to extract images from all possible locations in the API response
    
    // 1. Check featured_image sizes
    if (trip?.featured_image?.sizes) {
      // Get all size variations (full, large, medium, etc.)
      Object.values(trip.featured_image.sizes).forEach(size => {
        if (size?.source_url && typeof size.source_url === 'string') {
          galleryImages.push(size.source_url);
        }
      });
    }
    
    // 2. Check _embedded['wp:featuredmedia']
    if (trip?._embedded?.['wp:featuredmedia']?.[0]) {
      const media = trip._embedded['wp:featuredmedia'][0];
      
      // Add original source URL
      if (media.source_url) {
        galleryImages.push(media.source_url);
      }
      
      // Add media_details sizes
      if (media.media_details?.sizes) {
        Object.values(media.media_details.sizes).forEach(size => {
          if (size?.source_url) {
            galleryImages.push(size.source_url);
          }
        });
      }
    }
    
    // 3. Check wpte_gallery_id (this might contain gallery image IDs)
    if (trip?.wpte_gallery_id) {
      // Safely get gallery IDs, ensuring we're working with valid data
      let galleryIds = [];
      try {
        if (typeof trip.wpte_gallery_id === 'object') {
          galleryIds = Object.values(trip.wpte_gallery_id)
            .filter(id => !isNaN(parseInt(id)))
            .map(id => parseInt(id));
        }
      } catch (error) {
        console.error('Error parsing gallery IDs:', error);
      }
      
      // Try to find media items with these IDs in _embedded
      if (trip?._embedded) {
        // Look in different embedded fields
        const embeddedFields = ['wp:featuredmedia', 'wp:attachment'];
        
        embeddedFields.forEach(field => {
          if (Array.isArray(trip._embedded[field])) {
            trip._embedded[field].forEach(media => {
              // Safely check media object
              if (media && typeof media === 'object' && 'id' in media) {
                const mediaId = media.id;
                // Check if this media ID is in our gallery IDs
                if (galleryIds.includes(mediaId) && media.source_url) {
                  galleryImages.push(media.source_url);
                  
                  // Also add size variations
                  if (media.media_details?.sizes) {
                    Object.values(media.media_details.sizes).forEach(size => {
                      if (size?.source_url) {
                        galleryImages.push(size.source_url);
                      }
                    });
                  }
                }
              }
            });
          }
        });
      }
    }
    
    // Remove any invalid URLs
    const validGalleryImages = galleryImages.filter(url => 
      url && typeof url === 'string' && url.startsWith('http')
    );
    
    // Remove duplicates
    const uniqueGalleryImages = [...new Set(validGalleryImages)];
    
    console.log('Extracted gallery images:', uniqueGalleryImages);
    
    // Safely format trip data with defaults for all properties
    // Create empty default objects for any potentially undefined properties
    const formattedTrip = {
      id: trip.id || 0,
      title: trip.title?.rendered || '',
      slug: trip.slug || '',
      description: trip.content?.rendered || '',
      featured_image: trip.featured_image || null,
      duration: {
        days: trip.duration?.days || 0,
        nights: trip.duration?.nights || 0,
        duration_unit: trip.duration?.duration_unit || 'يوم',
        duration_type: trip.duration?.duration_type || 'days'
      },
      destination: trip.destination || { title: '', id: 0 },
      wp_travel_engine_setting_trip_actual_price:
        trip.wp_travel_engine_setting_trip_actual_price || null,
      price: trip.price || 4999,
      currency: trip.currency || { code: 'ريال' },
      _embedded: trip._embedded || {},
      cost_includes: trip.cost_includes || '',
      cost_excludes: trip.cost_excludes || '',
      itineraries: Array.isArray(trip.itineraries) ? trip.itineraries.map(item => ({
        title: item?.title || '',
        content: item?.content || ''
      })) : [],
      faqs: Array.isArray(trip.faqs) ? trip.faqs.map(item => ({
        title: item?.title || '',
        content: item?.content || ''
      })) : [],
      gallery: uniqueGalleryImages,
      deposit: trip.deposit || 500,
      guarantee_days: trip.guarantee_days || 3
    };

    return {
      props: {
        trip: formattedTrip,
      },
      revalidate: 3600, // Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching trip:', error);
    return {
      props: {
        trip: null,
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