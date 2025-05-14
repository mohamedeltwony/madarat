import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
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
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import styles from '../../styles/pages/SimpleTripPage.module.scss';
import { useRouter } from 'next/router';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import jwt_decode from 'jwt-decode';

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
  if (!text) return '';
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
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
  // If we don't have enough images, we'll pad the array with duplicates
  // but only for display purposes
  let gridImages = images.slice(1, 5);
  
  // If we have fewer than 4 grid images, duplicate the last one to fill the grid
  // but only if we have at least one grid image
  if (gridImages.length > 0 && gridImages.length < 4) {
    const lastImage = gridImages[gridImages.length - 1];
    while (gridImages.length < 4) {
      gridImages.push({...lastImage});
    }
  } else if (gridImages.length === 0) {
    // If we have no grid images, use the featured image
    gridImages = [
      {...featuredImage},
      {...featuredImage},
      {...featuredImage},
      {...featuredImage}
    ];
  }
  
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

        {/* Grid of smaller images - right side */}
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
          <span>{installmentAmount.toLocaleString('ar-SA')}</span> ريال / شهرياً
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

// Add this before the SingleTrip component
const TripForm = ({ tripTitle, price }) => {
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    nationality: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can handle the form submission
    console.log('Form submitted:', { ...formData, tripTitle });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form className={styles.tripForm} onSubmit={handleSubmit}>
      <div className={`${styles.formGroup} ${styles.phoneGroup}`}>
        <label htmlFor="phone" className={styles.formLabel}>الجوال</label>
        <div className={styles.phoneInput}>
          <input
            type="tel"
            id="phone"
            className={styles.formInput}
            name="phone"
            placeholder=" "
            autoComplete="tel"
            required
            value={formData.phone}
            onChange={handleChange}
          />
          <span className={styles.countryCode}>+966</span>
        </div>
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          id="name"
          className={styles.formInput}
          name="name"
          placeholder=" "
          autoComplete="name"
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="name" className={styles.formLabel}>الاسم الكامل (اختياري)</label>
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          id="email"
          className={styles.formInput}
          name="email"
          placeholder=" "
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
        />
        <label htmlFor="email" className={styles.formLabel}>البريد الإلكتروني (اختياري)</label>
      </div>

      <div className={`${styles.formGroup} ${styles.nationalityGroup}`}>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="nationality"
              required
              value="مواطن"
              checked={formData.nationality === "مواطن"}
              onChange={handleChange}
            />
            <span>مواطن</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="nationality"
              required
              value="مقيم"
              checked={formData.nationality === "مقيم"}
              onChange={handleChange}
            />
            <span>مقيم</span>
          </label>
        </div>
      </div>

      <div className={styles.formActions}>
        <button className={styles.sparkleButton} type="submit" dir="auto">
          <div className={styles.buttonGlow}></div>
          <span className={styles.buttonContent}>
            <div></div>
            <span>اضغط هنا وارسل بياناتك وبيتواصل معاك واحد من متخصصين السياحة عندنا</span>
          </span>
        </button>
      </div>
    </form>
  );
};

export default function SingleTrip({ trip }) {
  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingCardExpanded, setIsBookingCardExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Add touch handling for mobile booking card
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

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
  const title = trip.title || '';
  const decodedTitle = typeof window !== 'undefined' ? decodeHtmlEntities(title) : title;
  const description = trip.description || '';
  const hasItineraries = trip.itineraries && Array.isArray(trip.itineraries) && trip.itineraries.length > 0;
  const hasFaqs = trip.faqs && Array.isArray(trip.faqs) && trip.faqs.length > 0;
  const featuredImage = trip.gallery && trip.gallery.length > 0 ? trip.gallery[0].src : '/images/placeholder.jpg';
  const price = (trip.wp_travel_engine_setting_trip_actual_price || trip.price || 4999).toLocaleString('ar-SA');
  const handleBookNow = () => setIsBookingModalOpen(true);
  
  return (
    <Layout>
      <Head>
        <title>{decodedTitle} | مدارات الكون</title>
        <meta name="description" content={description?.substring(0, 160)} />
      </Head>
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroImage}>
          <Image 
            src={featuredImage} 
            alt={decodedTitle}
            fill
            sizes="100vw"
            quality={90} 
            priority
          />
          <div className={styles.overlay}></div>
        </div>
        <Container>
          <div className={styles.heroContent}>
            <h1 dangerouslySetInnerHTML={{ __html: title }}></h1>
            <div className={styles.tripInfo}>
              <div className={styles.infoItem}>
                <FaCalendarAlt />
                <span>{trip.duration?.days || 0} {trip.duration?.duration_unit || 'يوم'}</span>
              </div>
              <div className={styles.infoItem}>
                <FaMoneyBillWave />
                <span>{price} {trip.currency?.code || 'ريال'}</span>
              </div>
              {trip.destination && (
                <div className={styles.infoItem}>
                  <FaMapMarkerAlt />
                  <span>{trip.destination.title || ''}</span>
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
        <div className={styles.sidebarContent}>
          <div 
            className={`${styles.bookingCard} ${isBookingCardExpanded ? styles.expanded : ''}`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className={styles.price}
              onClick={() => setIsBookingCardExpanded(!isBookingCardExpanded)}
            >
              <h3>السعر لكل شخص</h3>
              <div className={styles.priceAmount}>
                {price} <span>ريال</span>
              </div>
            </div>
            
            <div className={styles.installmentInfo}>
              <FaCreditCard className={styles.installmentIcon} />
              <h3>الدفع بالتقسيط على أربع دفعات</h3>
              <div className={styles.installmentAmount}>
                <span>{Math.ceil(parseInt(price.replace(/,/g, '')) / 4).toLocaleString('ar-SA')}</span> ريال / شهرياً
              </div>
            </div>

            <TripForm 
              tripTitle={decodedTitle}
              price={price}
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
    
    // Featured image
    if (trip?._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      galleryImages.push({
        src: trip._embedded['wp:featuredmedia'][0].source_url,
        alt: trip._embedded['wp:featuredmedia'][0]?.alt_text || trip.title?.rendered || 'Trip image'
      });
    }
    
    // Additional gallery images if available
    if (trip?.wpte_gallery_id) {
      // Process gallery image IDs
      const galleryIds = Object.entries(trip.wpte_gallery_id)
        .filter(([key, value]) => !isNaN(parseInt(key)) && value)
        .map(([_, value]) => value);

      // Fetch all media items for the gallery
      if (galleryIds.length > 0) {
        // In a production environment, we would fetch each media item individually
        // or use a batch endpoint if available
        for (const id of galleryIds) {
          try {
            const mediaResponse = await fetch(`https://madaratalkon.com/wp-json/wp/v2/media/${id}`);
            if (mediaResponse.ok) {
              const media = await mediaResponse.json();
              
              // Add the media to our gallery
              if (media?.source_url) {
                galleryImages.push({
                  src: media.source_url,
                  alt: media.alt_text || `${trip.title?.rendered || 'Trip'} - Gallery image`
                });
              }
            }
          } catch (mediaError) {
            console.error(`Error fetching media item ${id}:`, mediaError);
            
            // Fallback to using a constructed URL if the media endpoint fails
            galleryImages.push({
              src: `https://madaratalkon.com/wp-content/uploads/2025/04/gallery-${id}.jpg`,
              alt: `${trip.title?.rendered || 'Trip'} - Gallery image ${id}`
            });
          }
        }
      }
    }
    
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