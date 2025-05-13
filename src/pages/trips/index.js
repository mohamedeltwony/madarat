import { useEffect, useState, Fragment } from 'react';
import Layout from '@/components/Layout';
import AllTrips from '@/components/AllTrips';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Meta from '../../components/Meta';
import { getTripsREST } from '@/lib/rest-api';
import { getSiteMetadataREST, getAllMenusREST } from '@/lib/rest-api';
import Link from 'next/link';
import styles from '@/styles/pages/Trips.module.scss';

const TRIPS_PER_PAGE = 20;

export default function TripsPage({
  initialTrips = [],
  initialPagination = {},
  metadata,
  menus,
}) {
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
    const fetchTrips = async () => {
      if (!router.isReady) return;

      const page = parseInt(router.query.page) || 1;
      setCurrentPage(page);

      // Only fetch if we don't have data for this page
      if (page !== pagination.currentPage) {
        setIsLoading(true);
        setError(null);

        try {
          const { trips: fetchedTrips, pagination: newPagination } =
            await getTripsREST({
              page,
              perPage: TRIPS_PER_PAGE,
            });

          setTrips(fetchedTrips);
          setPagination(newPagination);
        } catch (err) {
          console.error('Error fetching trips:', err);
          setError(err.toString());
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchTrips();
  }, [router.isReady, router.query.page, pagination.currentPage]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const page = parseInt(router.query.page) || 1;
      const { trips: fetchedTrips, pagination: newPagination } =
        await getTripsREST({
          page,
          perPage: TRIPS_PER_PAGE,
        });

      setTrips(fetchedTrips);
      setPagination(newPagination);
    } catch (err) {
      setError(err.toString());
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    router.push(
      {
        pathname: '/trips',
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
        <title>الرحلات السياحية | مدارات الكون</title>
        <Meta
          title="الرحلات السياحية | مدارات الكون"
          description="اكتشف رحلاتنا السياحية المميزة واستمتع بتجربة لا تُنسى في أجمل الأماكن حول العالم"
        />
      </Head>

      {/* Hero Section with hardcoded image */}
      <div
        className={styles.tripsHeroSection}
        style={{
          backgroundImage: 'url("/images/hero-background-new.png")',
          backgroundPosition: 'center center',
        }}
      >
        <div className={styles.tripsHeroOverlay}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className={styles.tripsHeroContent}>
            <div className={styles.tripsHeroContentInner}>
              <h1 className={styles.tripsHeroTitle}>الرحلات السياحية</h1>
              <p className={styles.tripsHeroDescription}>
                اكتشف مجموعة متنوعة من الرحلات السياحية المميزة إلى أجمل الوجهات
                حول العالم. نقدم لك تجارب سفر فريدة بأسعار تنافسية وخدمات عالية
                الجودة.
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
              message="عذراً، حدث خطأ أثناء تحميل الرحلات. يرجى المحاولة مرة أخرى."
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
          <AllTrips
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

    // Fetch trips with pagination
    const { trips = [], pagination = {} } = await getTripsREST({
      page,
      perPage: TRIPS_PER_PAGE,
    });

    // Fetch layout data
    const metadata = await getSiteMetadataREST();
    const { menus = [] } = await getAllMenusREST();

    return {
      props: {
        initialTrips: trips,
        initialPagination: pagination,
        metadata: metadata || {}, // Ensure metadata is never undefined
        menus: menus || [],
      },
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
          perPage: TRIPS_PER_PAGE,
        },
        metadata: {
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع السفر والرحلات الأول في الوطن العربي',
        },
        menus: [],
      },
    };
  }
}
