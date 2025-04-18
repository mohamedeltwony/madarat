'use client';

import { useEffect, useState } from 'react';
import { client, GET_TRIPS } from '@/utils/graphql-client';
import Image from 'next/image';
import Link from 'next/link';
import Pagination from '../common/Pagination';

export default function Tours() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageInfo, setPageInfo] = useState({
    hasNextPage: false,
    endCursor: null
  });

  useEffect(() => {
    async function fetchTours() {
      setLoading(true);
      setError(null);
      try {
        console.log('GraphQL URL:', process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL);
        const { data, errors } = await client.query({
          query: GET_TRIPS,
          variables: { first: 9 }
        });
        
        console.log('GraphQL Response:', { data, errors });
        
        if (errors) {
          throw new Error(errors.map(e => e.message).join(', '));
        }

        if (!data?.posts?.nodes) {
          throw new Error('No posts data in response');
        }

        setTours(data.posts.nodes);
        setPageInfo(data.posts.pageInfo);
      } catch (error) {
        console.error('Error fetching tours:', error);
        console.error('Error details:', {
          message: error.message,
          networkError: error.networkError?.result,
          graphQLErrors: error.graphQLErrors,
          stack: error.stack
        });
        setError(error.message);
      }
      setLoading(false);
    }
    fetchTours();
  }, []);

  const loadMore = async () => {
    if (!pageInfo.hasNextPage) return;

    try {
      const { data } = await client.query({
        query: GET_TRIPS,
        variables: { 
          first: 9,
          after: pageInfo.endCursor
        }
      });

      setTours([...tours, ...data.posts.nodes]);
      setPageInfo(data.posts.pageInfo);
    } catch (error) {
      console.error('Error loading more tours:', error);
    }
  };

  if (loading) {
    return <div>Loading tours...</div>;
  }

  if (error) {
    return <div>Error loading tours: {error}</div>;
  }

  if (!tours.length) {
    return <div>No tours found. Please check the WordPress GraphQL configuration.</div>;
  }

  return (
    <>
      <div className="row y-gap-30">
        {tours.map((tour) => (
          <div key={tour.id} className="col-lg-4 col-sm-6">
            <Link 
              href={`/tours/${tour.slug}`}
              className="tourCard -type-1 rounded-4 hover-shadow-1"
            >
              <div className="tourCard__image">
                <Image
                  width={400}
                  height={300}
                  className="rounded-4 col-12 js-lazy"
                  src={tour.featuredImage?.node?.sourceUrl || '/img/placeholder.jpg'}
                  alt={tour.title}
                />
              </div>
              <div className="tourCard__content mt-10">
                <div className="text-14 lh-14 text-light-1 mb-5">
                  {tour.tripFields?.location}
                </div>
                <h4 className="tourCard__title text-dark-1 text-18 lh-16 fw-500">
                  {tour.title}
                </h4>
                <div className="text-14 lh-14 text-light-1 mt-5">
                  {tour.tripFields?.duration}
                </div>
                <div className="tourCard__price mt-5">
                  <div className="text-14 text-light-1">From</div>
                  <div className="text-22 lh-12 fw-600 text-dark-1">
                    ${tour.tripFields?.price}
                  </div>
                </div>
                {tour.tripFields?.difficulty && (
                  <div className="text-14 lh-14 text-light-1 mt-5">
                    Difficulty: {tour.tripFields.difficulty}
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      {pageInfo.hasNextPage && (
        <div className="d-flex justify-center mt-30">
          <button 
            className="button -md -outline-accent-1 text-accent-1"
            onClick={loadMore}
          >
            Load More
          </button>
        </div>
      )}
    </>
  );
} 