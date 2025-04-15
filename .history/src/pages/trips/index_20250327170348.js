import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_TRIPS } from '@/lib/queries';
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

const TRIPS_PER_PAGE = 20;

export default function TripsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(router.query.page) || 1);

  const { loading, error: queryError, data, refetch } = useQuery(GET_TRIPS, {
    notifyOnNetworkStatusChange: true,
    errorPolicy: 'all',
  });

  useEffect(() => {
    if (data?.trips?.nodes) {
      setTrips(data.trips.nodes);
      setIsLoading(false);
    }
    if (queryError) {
      setError(queryError.message);
      setIsLoading(false);
    }
  }, [data, queryError]);

  const handleRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await refetch();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    router.push({
      pathname: '/trips',
      query: { page }
    }, undefined, { shallow: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate pagination indexes
  const startIndex = (currentPage - 1) * TRIPS_PER_PAGE;
  const endIndex = startIndex + TRIPS_PER_PAGE;
  const currentTrips = trips.slice(startIndex, endIndex);

  return (
    <Layout>
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
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

// This ensures we have a static page at build time
export async function getStaticProps() {
  return {
    props: {},
    // Revalidate every hour
    revalidate: 3600
  };
} 