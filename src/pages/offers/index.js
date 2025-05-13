import { useEffect, useState, Fragment } from 'react';
import Layout from '@/components/Layout';
import OffersList from '@/components/OffersList';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Meta from '../../components/Meta';
import { fetchAPI } from '@/lib/rest-api';
import { getSiteMetadataREST, getAllMenusREST } from '@/lib/rest-api';
import Link from 'next/link';
import styles from '@/styles/pages/Trips.module.scss';

const OFFERS_PER_PAGE = 20;
const OFFER_TAG_ID = 154;

export default function OffersPage({ initialTrips = [], initialPagination = {}, metadata, menus }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState(initialTrips);
  const [pagination, setPagination] = useState(initialPagination);
  const [currentPage, setCurrentPage] = useState(
    parseInt(router.query.page) || 1
  );

  // Fetch trips when page changes
  useEffect(() => {
    const fetchOfferTrips = async () => {
      if (!router.isReady) return;
      
      const page = parseInt(router.query.page) || 1;
      setCurrentPage(page);
      
      // Only fetch if we don't have data for this page
      if (page !== pagination.currentPage) {
        setIsLoading(true);
        setError(null);
        
        try {
          const data = await fetchAPI('/wp/v2/trip', { 
            page,
            per_page: OFFERS_PER_PAGE,
            _embed: true,
            trip_tag: OFFER_TAG_ID
          });
          
          // Extract pagination data
          const totalTrips = data._paging?.total || 0;
          const totalPages = data._paging?.totalPages || 1;
          
          // Safely transform the trips data
          const offerTrips = Array.isArray(data) ? data.map(trip => {
            // Safely extract featuredImage - ensure it's never undefined
            let featuredImage = null;
            if (trip._embedded?.['wp:featuredmedia']?.[0]) {
              const mediaItem = trip._embedded['wp:featuredmedia'][0];
              featuredImage = {
                sourceUrl: mediaItem.source_url || '/images/placeholder.jpg',
                mediaDetails: {
                  sizes: [
                    {
                      sourceUrl: mediaItem.source_url || '/images/placeholder.jpg',
                      width: mediaItem.media_details?.width || 800,
                      height: mediaItem.media_details?.height || 600
                    }
                  ]
                }
              };
            }
            
            // Extract and format trip data
            return {
              id: trip.id,
              title: trip.title?.rendered || 'رحلة بدون عنوان',
              slug: trip.slug || `trip-${trip.id}`,
              excerpt: trip.excerpt?.rendered || '',
              content: trip.content?.rendered || '',
              featuredImage: featuredImage,
              tripSettings: {
                duration: {
                  days: trip.acf?.duration?.days || trip.duration?.days || 0,
                  nights: trip.acf?.duration?.nights || trip.duration?.nights || 0,
                  durationType: trip.acf?.duration?.durationType || null
                },
                price: {
                  amount: trip.acf?.price?.amount || trip.price || 0,
                  currency: trip.acf?.price?.currency || trip.currency?.code || 'SAR'
                }
              }
            };
          }) : [];
          
          setTrips(offerTrips);
          setPagination({
            total: totalTrips,
            totalPages: totalPages,
            currentPage: page,
            perPage: OFFERS_PER_PAGE
          });
          
        } catch (err) {
          console.error("Error fetching offer trips:", err);
          setError(err.toString());
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchOfferTrips();
  }, [router.isReady, router.query.page]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const page = parseInt(router.query.page) || 1;
      const data = await fetchAPI('/wp/v2/trip', { 
        page,
        per_page: OFFERS_PER_PAGE,
        _embed: true,
        trip_tag: OFFER_TAG_ID
      });
      
      // Extract pagination data
      const totalTrips = data._paging?.total || 0;
      const totalPages = data._paging?.totalPages || 1;
      
      // Safely transform the trips data
      const offerTrips = Array.isArray(data) ? data.map(trip => {
        // Safely extract featuredImage - ensure it's never undefined
        let featuredImage = null;
        if (trip._embedded?.['wp:featuredmedia']?.[0]) {
          const mediaItem = trip._embedded['wp:featuredmedia'][0];
          featuredImage = {
            sourceUrl: mediaItem.source_url || '/images/placeholder.jpg',
            mediaDetails: {
              sizes: [
                {
                  sourceUrl: mediaItem.source_url || '/images/placeholder.jpg',
                  width: mediaItem.media_details?.width || 800,
                  height: mediaItem.media_details?.height || 600
                }
              ]
            }
          };
        }
        
        // Extract and format trip data
        return {
          id: trip.id,
          title: trip.title?.rendered || 'رحلة بدون عنوان',
          slug: trip.slug || `trip-${trip.id}`,
          excerpt: trip.excerpt?.rendered || '',
          content: trip.content?.rendered || '',
          featuredImage: featuredImage,
          tripSettings: {
            duration: {
              days: trip.acf?.duration?.days || trip.duration?.days || 0,
              nights: trip.acf?.duration?.nights || trip.duration?.nights || 0,
              durationType: trip.acf?.duration?.durationType || null
            },
            price: {
              amount: trip.acf?.price?.amount || trip.price || 0,
              currency: trip.acf?.price?.currency || trip.currency?.code || 'SAR'
            }
          }
        };
      }) : [];
      
      setTrips(offerTrips);
      setPagination({
        total: totalTrips,
        totalPages: totalPages,
        currentPage: page,
        perPage: OFFERS_PER_PAGE
      });
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    router.push(
      {
        pathname: '/offers',
        query: { page },
      },
      undefined,
      { shallow: true }
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout metadata={metadata} menus={menus}>
      <Head>
        <title>العروض السياحية | مدارات الكون</title>
        <Meta
          title="العروض السياحية | مدارات الكون"
          description="اكتشف أفضل عروضنا السياحية المميزة واستمتع بتجربة لا تُنسى بأسعار تنافسية"
        />
      </Head>

      {/* Hero Section with hardcoded image */}
      <div className={styles.tripsHeroSection} style={{ 
        backgroundImage: 'url("/images/hero-background-new.png")',
        backgroundPosition: 'center center'
      }}>
        <div className={styles.tripsHeroOverlay}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className={styles.tripsHeroContent}>
            <div className={styles.tripsHeroContentInner}>
              <h1 className={styles.tripsHeroTitle}>العروض السياحية</h1>
              <p className={styles.tripsHeroDescription}>
                اكتشف مجموعة متنوعة من العروض السياحية المميزة بأسعار تنافسية.
                باقات سفر بخدمات متكاملة وأسعار حصرية للوجهات السياحية الأكثر شعبية.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <ErrorMessage
              message="عذراً، حدث خطأ أثناء تحميل العروض. يرجى المحاولة مرة أخرى."
              error={error}
            />
            <button
              onClick={handleRetry}
              className="mt-4 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <OffersList 
            trips={trips} 
            pagination={pagination} 
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  try {
    const page = parseInt(context.query.page) || 1;
    
    // Fetch offer trips with pagination
    const data = await fetchAPI('/wp/v2/trip', { 
      page,
      per_page: OFFERS_PER_PAGE,
      _embed: true,
      trip_tag: OFFER_TAG_ID
    });
    
    // Extract pagination data
    const totalTrips = data._paging?.total || 0;
    const totalPages = data._paging?.totalPages || 1;
    
    // Safely transform the trips data
    const offerTrips = Array.isArray(data) ? data.map(trip => {
      // Safely extract featuredImage - ensure it's never undefined
      let featuredImage = null;
      if (trip._embedded?.['wp:featuredmedia']?.[0]) {
        const mediaItem = trip._embedded['wp:featuredmedia'][0];
        featuredImage = {
          sourceUrl: mediaItem.source_url || '/images/placeholder.jpg',
          mediaDetails: {
            sizes: [
              {
                sourceUrl: mediaItem.source_url || '/images/placeholder.jpg',
                width: mediaItem.media_details?.width || 800,
                height: mediaItem.media_details?.height || 600
              }
            ]
          }
        };
      }
      
      // Extract and format trip data
      return {
        id: trip.id,
        title: trip.title?.rendered || 'رحلة بدون عنوان',
        slug: trip.slug || `trip-${trip.id}`,
        excerpt: trip.excerpt?.rendered || '',
        content: trip.content?.rendered || '',
        featuredImage: featuredImage,
        tripSettings: {
          duration: {
            days: trip.acf?.duration?.days || trip.duration?.days || 0,
            nights: trip.acf?.duration?.nights || trip.duration?.nights || 0,
            durationType: trip.acf?.duration?.durationType || null
          },
          price: {
            amount: trip.acf?.price?.amount || trip.price || 0,
            currency: trip.acf?.price?.currency || trip.currency?.code || 'SAR'
          }
        }
      };
    }) : [];
    
    // Fetch layout data
    const metadata = await getSiteMetadataREST(); 
    const { menus = [] } = await getAllMenusREST();

    return {
      props: {
        initialTrips: offerTrips,
        initialPagination: {
          total: totalTrips,
          totalPages: totalPages,
          currentPage: page,
          perPage: OFFERS_PER_PAGE
        },
        metadata: metadata || {}, // Ensure metadata is never undefined
        menus: menus || []
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialTrips: [],
        initialPagination: {
          total: 0,
          totalPages: 0,
          currentPage: 1,
          perPage: OFFERS_PER_PAGE
        },
        metadata: {
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع السفر والرحلات الأول في الوطن العربي',
        },
        menus: []
      }
    };
  }
} 