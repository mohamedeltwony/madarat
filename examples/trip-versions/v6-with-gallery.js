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
  FaEye, // Added for gallery
} from 'react-icons/fa';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import styles from '../../styles/pages/SingleTrip.module.scss';

// Import TripGallery (this would be imported from the actual component)
const TripGallery = ({ gallery = [], videoUrl = null }) => {
  const [isClient, setIsClient] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Log the received gallery props to help with debugging
  useEffect(() => {
    console.log('Gallery images received:', gallery);
  }, [gallery]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Normalize gallery data - ensure all items are valid strings
  const normalizeGalleryItem = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (item.url) return item.url;
    if (item.source_url) return item.source_url;
    return null;
  };

  // Make sure gallery is an array with valid items (strings or objects with URL)
  const validGallery = Array.isArray(gallery)
    ? gallery.map(normalizeGalleryItem).filter(Boolean)
    : [];

  // If there's no gallery data, don't render the component
  if (validGallery.length === 0) {
    console.log('No valid gallery items found, not rendering gallery');
    return null;
  }

  console.log('Valid gallery images:', validGallery);

  // Process gallery items
  const mainImage = validGallery[0];
  const smallImages = validGallery.slice(1);

  // Handle image load errors
  const handleImageError = (index) => {
    console.error(
      `Failed to load image at index ${index}:`,
      index === 0 ? mainImage : smallImages[index - 1]
    );
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // ImageFallback component for when images fail to load
  const ImageFallback = ({ className }) => (
    <div className={`gallery-image-fallback ${className || ''}`}>
      {isClient && <FaEye className="fallback-icon" />}
      <span>الصورة غير متوفرة</span>
    </div>
  );

  // Simplified gallery view for demo purposes
  return (
    <div className="trip-gallery-container">
      <div className="gallery-row">
        {/* Main Image */}
        {mainImage && (
          <div className="main-image-column">
            <div className="gallery-image-wrap">
              <div
                style={{ position: 'relative', width: '100%', height: '300px' }}
              >
                {!imageErrors[0] ? (
                  <Image
                    src={mainImage}
                    alt="Trip main image"
                    layout="fill"
                    objectFit="cover"
                    priority
                    onError={() => handleImageError(0)}
                  />
                ) : (
                  <ImageFallback className="main-image-fallback" />
                )}
              </div>
              {isClient && !imageErrors[0] && (
                <button
                  className="view-button"
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                  aria-label="عرض الصورة في المعرض"
                >
                  <FaEye />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Small Images */}
        {smallImages.length > 0 && (
          <div className="small-images-column">
            <div className="small-images-grid">
              {smallImages.slice(0, 4).map((image, index) => (
                <div
                  key={`gallery-img-${index}`}
                  className="small-image-container"
                >
                  <div className="gallery-image-wrap">
                    <div
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '150px',
                      }}
                    >
                      {!imageErrors[index + 1] ? (
                        <Image
                          src={image}
                          alt={`Trip gallery image ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          onError={() => handleImageError(index + 1)}
                        />
                      ) : (
                        <ImageFallback className="small-image-fallback" />
                      )}
                    </div>
                    {isClient && !imageErrors[index + 1] && (
                      <button
                        className="view-button"
                        onClick={() => {
                          setLightboxIndex(index + 1);
                          setLightboxOpen(true);
                        }}
                        aria-label={`عرض الصورة رقم ${index + 2} في المعرض`}
                      >
                        <FaEye />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isClient && lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-content">
            <img src={validGallery[lightboxIndex]} alt="Enlarged gallery image" />
          </div>
        </div>
      )}
      <style jsx>{`
        .trip-gallery-container {
          width: 100%;
          margin-bottom: 3rem;
          direction: rtl;
        }
        .gallery-row {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          align-items: stretch;
        }
        .main-image-column {
          flex: 1 1 calc(50% - 1.5rem);
          min-width: 300px;
        }
        .small-images-column {
          flex: 1 1 calc(50% - 1.5rem);
          min-width: 300px;
          display: flex;
          height: 100%;
        }
        .small-images-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-gap: 0.75rem;
          width: 100%;
          height: 100%;
        }
        .gallery-image-wrap {
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 150px;
          border-radius: 8px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }
        .gallery-image-wrap:hover .view-button {
          opacity: 1;
        }
        .view-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.85);
          color: #333;
          border: none;
          border-radius: 50px;
          padding: 0.6rem;
          width: 3rem;
          height: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .gallery-image-fallback {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f7f7f7;
          color: #666;
          text-align: center;
          padding: 1rem;
        }
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .lightbox-content {
          max-width: 90vw;
          max-height: 90vh;
        }
        .lightbox-content img {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
        }
      `}</style>
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
        <h3>{title}</h3>
        <span className={styles.accordionIcon}>
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </span>
      </div>
      {isOpen && (
        <div className={styles.accordionContent}>
          <div dangerouslySetInnerHTML={{ __html: content }} />
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
  const descriptionText = description.replace(/<[^>]*>/g, '').toLowerCase();

  countries.forEach((country) => {
    if (descriptionText.includes(country.toLowerCase())) {
      foundCountries.push(country);
    }
  });

  return [...new Set(foundCountries)]; // Remove duplicates
};

export default function SingleTrip({ trip }) {
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const hasItineraries = trip.itineraries && trip.itineraries.length > 0;
  const hasFaqs = trip.faqs && trip.faqs.length > 0;

  // Extract highlights from description
  const countries = extractCountries(trip.description);

  // Get featured image URL
  const featuredImageUrl =
    trip.featured_image?.sizes?.large?.source_url ||
    trip._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    trip.featured_media_url ||
    '/images/trip-placeholder.svg';

  // Demo gallery images
  const galleryImages = [
    featuredImageUrl,
    '/images/trip-placeholder-1.jpg',
    '/images/trip-placeholder-2.jpg',
    '/images/trip-placeholder-3.jpg',
    '/images/trip-placeholder-4.jpg'
  ];

  return (
    <Layout>
      <Head>
        <title>{trip.title} | مدارات الكون</title>
        <Meta title={trip.title} description={trip.description} />
      </Head>

      {/* Hero Section with Background Image */}
      <section
        className={styles.heroSection}
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)), url(${featuredImageUrl})`,
        }}
      >
        <Container>
          <div className={styles.heroContent}>
            <h1 className={styles.tripTitle}>{trip.title}</h1>
            <div className={styles.tripMeta}>
              <div className={styles.metaItem}>
                <FaCalendarAlt className={styles.metaIcon} />
                <span>
                  {trip.duration?.days || 0}{' '}
                  {trip.duration?.duration_unit || 'يوم'}
                </span>
              </div>
              <div className={styles.metaItem}>
                <FaMoneyBillWave className={styles.metaIcon} />
                <span>
                  {trip.wp_travel_engine_setting_trip_actual_price ||
                    trip.price ||
                    'السعر غير متوفر'}{' '}
                  {trip.currency?.code || 'SAR'}
                </span>
              </div>
              {trip.destination && (
                <div className={styles.metaItem}>
                  <FaMapMarkerAlt className={styles.metaIcon} />
                  <span>{trip.destination.title}</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Trip Gallery Section - NEW */}
      <Section className={styles.gallerySection}>
        <Container>
          <div className={styles.sectionTitle}>
            <h2>معرض الصور</h2>
          </div>
          
          <TripGallery gallery={galleryImages} videoUrl={null} />
        </Container>
      </Section>

      {/* Trip Overview Section */}
      <Section className={styles.overviewSection}>
        <Container>
          <div className={styles.sectionTitle}>
            <h2>نظرة عامة على الرحلة</h2>
          </div>

          <div className={styles.overviewContent}>
            <div className={styles.overviewDescription}>
              <div dangerouslySetInnerHTML={{ __html: trip.description }} />
            </div>

            <div className={styles.highlights}>
              <h3>أبرز المعالم</h3>
              <div className={styles.highlightsGrid}>
                {countries.map((country, idx) => (
                  <div key={idx} className={styles.highlightItem}>
                    <FaGlobe className={styles.highlightIcon} />
                    <span>{country}</span>
                  </div>
                ))}
                <div className={styles.highlightItem}>
                  <FaPlane className={styles.highlightIcon} />
                  <span>
                    رحلة {trip.duration?.days || 0}{' '}
                    {trip.duration?.duration_unit || 'يوم'}
                  </span>
                </div>
                <div className={styles.highlightItem}>
                  <FaBed className={styles.highlightIcon} />
                  <span>إقامة فندقية</span>
                </div>
                <div className={styles.highlightItem}>
                  <FaUtensils className={styles.highlightIcon} />
                  <span>وجبات فاخرة</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Itinerary Section with Accordion */}
      {hasItineraries && (
        <Section
          className={`${styles.contentSection} ${styles.itinerarySection}`}
        >
          <Container>
            <div className={styles.sectionTitle}>
              <h2>برنامج الرحلة</h2>
            </div>

            <div className={styles.accordionContainer}>
              {trip.itineraries.map((day, index) => (
                <AccordionItem
                  key={index}
                  title={`اليوم ${index + 1}: ${day.title}`}
                  content={day.content}
                  defaultOpen={index === 0} // Open first day by default
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Cost Information Section */}
      <Section className={`${styles.contentSection} ${styles.costSection}`}>
        <Container>
          <div className={styles.sectionTitle}>
            <h2>تفاصيل التكلفة</h2>
          </div>

          <div className={styles.costColumns}>
            <div className={styles.costColumn}>
              <div className={styles.costHeader}>
                <FaCheck className={styles.costIcon} />
                <h3>السعر يشمل</h3>
              </div>
              <div className={styles.costContent}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: trip.cost_includes
                      ? trip.cost_includes
                          .replace(/\r\n/g, '<br>')
                          .replace(/\n/g, '<br>')
                      : '<p>لم يتم تحديد ما يشمل السعر</p>',
                  }}
                />
              </div>
            </div>

            <div className={styles.costColumn}>
              <div className={styles.costHeader}>
                <FaTimes className={styles.costIcon} />
                <h3>السعر لا يشمل</h3>
              </div>
              <div className={styles.costContent}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: trip.cost_excludes
                      ? trip.cost_excludes
                          .replace(/\r\n/g, '<br>')
                          .replace(/\n/g, '<br>')
                      : '<p>لم يتم تحديد ما لا يشمل السعر</p>',
                  }}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* FAQ Section with Accordion */}
      {hasFaqs && (
        <Section className={`${styles.contentSection} ${styles.faqSection}`}>
          <Container>
            <div className={styles.sectionTitle}>
              <h2>الأسئلة الشائعة</h2>
            </div>

            <div className={styles.accordionContainer}>
              {trip.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  title={faq.title}
                  content={faq.content}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Sticky CTA */}
      <div className={`${styles.stickyCta} ${sticky ? styles.visible : ''}`}>
        <Container>
          <div className={styles.stickyCtaContent}>
            <div className={styles.ctaTripInfo}>
              <h3>{trip.title}</h3>
              <div className={styles.ctaMeta}>
                <span>
                  {trip.duration?.days || 0}{' '}
                  {trip.duration?.duration_unit || 'يوم'}
                </span>
                <span className={styles.ctaPrice}>
                  {trip.wp_travel_engine_setting_trip_actual_price ||
                    trip.price ||
                    'السعر غير متوفر'}{' '}
                  {trip.currency?.code || 'SAR'}
                </span>
              </div>
            </div>
            <a href="#" className={styles.ctaButton}>
              احجز الآن
            </a>
          </div>
        </Container>
      </div>
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

    // Format trip data
    const formattedTrip = {
      id: trip.id,
      title: trip.title?.rendered || '',
      slug: trip.slug || '',
      description: trip.content?.rendered || '',
      featured_image: trip.featured_image || null,
      duration: trip.duration || null,
      destination:
        trip._embedded?.['wp:term']?.[0]?.taxonomy === 'destination'
          ? {
              id: trip._embedded['wp:term'][0].id || null,
              title: trip._embedded['wp:term'][0].name || '',
              slug: trip._embedded['wp:term'][0].slug || '',
            }
          : null,
      wp_travel_engine_setting_trip_actual_price:
        trip.wp_travel_engine_setting_trip_actual_price || null,
      price: trip.price || null,
      currency: trip.currency || null,
      _embedded: trip._embedded || null,
      cost_includes: trip.cost_includes || '',
      cost_excludes: trip.cost_excludes || '',
      itineraries: trip.itineraries || [],
      faqs: trip.faqs || [],
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