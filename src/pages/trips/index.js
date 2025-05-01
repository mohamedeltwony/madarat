import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import TripCard from '@/components/TripCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Container from '../../components/Container';
import Section from '../../components/Section';
import Meta from '../../components/Meta';
import styles from '../../styles/pages/Trips.module.scss';
import { getTripsREST } from '@/lib/rest-api';
import { getSiteMetadataREST, getAllMenusREST } from '@/lib/rest-api';

const TRIPS_PER_PAGE = 20;

export default function TripsPage({ initialTrips = [], metadata, menus }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState(initialTrips);
  const [currentPage, setCurrentPage] = useState(
    parseInt(router.query.page) || 1
  );

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { trips: fetchedTrips } = await getTripsREST();
      setTrips(fetchedTrips);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
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

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * TRIPS_PER_PAGE;
  const endIndex = startIndex + TRIPS_PER_PAGE;
  const currentTrips = trips.slice(startIndex, endIndex);

  return (
    <Layout metadata={metadata} menus={menus}>
      <Head>
        <title>الرحلات السياحية | مدارات الكون</title>
        <Meta
          title="الرحلات السياحية | مدارات الكون"
          description="اكتشف رحلاتنا السياحية المميزة واستمتع بتجربة لا تُنسى في أجمل الأماكن حول العالم"
        />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">الرحلات المتاحة</h1>

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

        {!isLoading && !error && trips.length === 0 && (
          <div className="text-center text-gray-600">
            لا توجد رحلات متاحة حالياً
          </div>
        )}

        {!isLoading && !error && trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {trips.length > TRIPS_PER_PAGE && (
          <div className="flex justify-center mt-8">
            {Array.from({ length: Math.ceil(trips.length / TRIPS_PER_PAGE) }).map((_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`mx-1 px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  try {
    // Fetch trips
    const { trips = [] } = await getTripsREST();
    
    // Fetch layout data
    const metadata = await getSiteMetadataREST(); 
    const { menus = [] } = await getAllMenusREST();

    return {
      props: {
        initialTrips: trips,
        metadata: metadata || {}, // Ensure metadata is never undefined
        menus: menus || []
      },
      revalidate: 60, // Revalidate every 60 seconds
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      props: {
        initialTrips: [],
        metadata: {
          title: 'مدارات الكون',
          siteTitle: 'مدارات الكون',
          description: 'موقع السفر والرحلات الأول في الوطن العربي',
        },
        menus: []
      },
      revalidate: 60
    };
  }
}
