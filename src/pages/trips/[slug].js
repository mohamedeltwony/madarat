import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Layout from '../../components/Layout';
import Container from '../../components/Container';
import Section from '../../components/Section';
import styles from '../../styles/pages/SimpleTripPage.module.scss';
import { useRouter } from 'next/router';

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

export default function SingleTrip({ trip }) {
  const router = useRouter();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  
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
  const description = trip.description || '';
  const hasItineraries = trip.itineraries && Array.isArray(trip.itineraries) && trip.itineraries.length > 0;
  const hasFaqs = trip.faqs && Array.isArray(trip.faqs) && trip.faqs.length > 0;
  const featuredImage = trip.gallery && trip.gallery.length > 0 ? trip.gallery[0] : '/images/placeholder.jpg';
  const price = (trip.wp_travel_engine_setting_trip_actual_price || trip.price || 4999).toLocaleString('ar-SA');
  const handleBookNow = () => setIsBookingModalOpen(true);
  
  return (
    <Layout>
      <Head>
        <title>{title} | مدارات الكون</title>
        <meta name="description" content={description?.substring(0, 160)} />
      </Head>
      
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroImage}>
          <Image 
            src={featuredImage} 
            alt={title}
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className={styles.overlay}></div>
        </div>
        <Container>
          <div className={styles.heroContent}>
            <h1>{title}</h1>
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
      <Section>
        <Container>
          <div className={styles.mainContent}>
            {/* Left Column - Trip Details */}
            <div className={styles.tripDetails}>
              {/* Trip Description */}
              <div className={styles.contentBox}>
                <h2 className={styles.sectionTitle}>تفاصيل الرحلة</h2>
                <div dangerouslySetInnerHTML={{ __html: description }} />
              </div>
              
              {/* What's Included */}
              <div className={styles.twoColumns}>
                <div className={styles.contentBox}>
                  <h2 className={styles.sectionTitle}>الخدمات المشمولة</h2>
                  <div dangerouslySetInnerHTML={{ 
                    __html: trip.cost_includes ? 
                      trip.cost_includes.replace(/\n/g, '<br>') : 
                      '<p>لا توجد معلومات</p>' 
                  }} />
                </div>
                
                <div className={styles.contentBox}>
                  <h2 className={styles.sectionTitle}>غير مشمول</h2>
                  <div dangerouslySetInnerHTML={{ 
                    __html: trip.cost_excludes ? 
                      trip.cost_excludes.replace(/\n/g, '<br>') : 
                      '<p>لا توجد معلومات</p>' 
                  }} />
                </div>
              </div>
              
              {/* Itinerary */}
              {hasItineraries && (
                <div className={styles.contentBox}>
                  <h2 className={styles.sectionTitle}>برنامج الرحلة</h2>
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
              
              {/* FAQs */}
              {hasFaqs && (
                <div className={styles.contentBox}>
                  <h2 className={styles.sectionTitle}>الأسئلة الشائعة</h2>
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
            <div className={styles.bookingCard}>
              <div className={styles.price}>
                <h3>السعر لكل شخص</h3>
                <div className={styles.priceAmount}>
                  {price} <span>ريال</span>
                </div>
              </div>
              
              <div className={styles.bookingDetails}>
                <ul>
                  <li>تذاكر الطيران</li>
                  <li>الإقامة الفندقية</li>
                  <li>المواصلات</li>
                  <li>بعض الوجبات</li>
                </ul>
              </div>
              
              <button 
                className={styles.bookButton}
                onClick={handleBookNow}
              >
                حجز الآن
              </button>
            </div>
          </div>
        </Container>
      </Section>
      
      {/* Booking Modal would go here */}
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
      galleryImages.push(trip._embedded['wp:featuredmedia'][0].source_url);
    }
    
    // Additional gallery images if available
    if (trip?.wpte_gallery_id) {
      // The logic for extracting gallery images would go here
      // For simplicity, we're just using the featured image
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
      gallery: galleryImages.length > 0 ? galleryImages : ['/images/placeholder.jpg'],
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