"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import Stars from "@/components/common/Stars";
import { getTours } from "@/utils/wordpress";
import Image from "next/image";
import Link from "next/link";

// Initialize Swiper modules
SwiperCore.use([Navigation, Pagination]);

export default function TourSlderOne() {
  const [showSwiper, setShowSwiper] = useState(false);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        console.log('Fetching tours...');
        const data = await getTours();
        console.log('Tours data:', data);
        setTours(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching tours:', error);
        setError(error.message);
      } finally {
        setLoading(false);
        setShowSwiper(true);
      }
    };

    fetchTours();
  }, []);

  if (loading) {
    return (
      <div className="layout-pt-xl layout-pb-xl text-center">
        <div className="container">
          <div className="text-18">Loading tours...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="layout-pt-xl layout-pb-xl text-center">
        <div className="container">
          <div className="text-18 text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <section className="layout-pt-xl layout-pb-xl relative">
      <div className="sectionBg -w-1530 rounded-12 bg-light-1"></div>

      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30 md:text-24">
              Top Trending Tours
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href={"/tours"}
              data-aos="fade-right"
              data-aos-delay=""
              className="buttonArrow d-flex items-center"
            >
              <span>See all</span>
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </Link>
          </div>
        </div>

        <div className="relative pt-40 sm:pt-20">
          <div className="overflow-hidden pb-30">
            {showSwiper && tours.length > 0 && (
              <Swiper
                spaceBetween={30}
                navigation={true}
                pagination={{
                  clickable: true
                }}
                breakpoints={{
                  500: {
                    slidesPerView: 1
                  },
                  768: {
                    slidesPerView: 2
                  },
                  1024: {
                    slidesPerView: 3
                  },
                  1200: {
                    slidesPerView: 4
                  }
                }}
                className="tourSlider"
              >
                {tours.map((tour) => (
                  <SwiperSlide key={tour.id}>
                    <Link
                      href={`/tours/${tour.slug}`}
                      className="tourCard -type-1 py-10 px-10 border-1 rounded-12 bg-white -hover-shadow"
                    >
                      <div className="tourCard__header">
                        <div className="tourCard__image ratio ratio-28:20">
                          <Image
                            width={421}
                            height={301}
                            src={tour.featuredImage?.node?.sourceUrl || '/img/placeholder.jpg'}
                            alt={tour.title}
                            className="img-ratio rounded-12"
                          />
                        </div>

                        <button className="tourCard__favorite">
                          <i className="icon-heart"></i>
                        </button>
                      </div>

                      <div className="tourCard__content px-10 pt-10">
                        <div className="tourCard__location d-flex items-center text-13 text-light-2">
                          <i className="icon-pin d-flex text-16 text-light-2 mr-5"></i>
                          {tour.tripFields?.location}
                        </div>

                        <h3 className="tourCard__title text-16 fw-500 mt-5">
                          <span>{tour.title}</span>
                        </h3>

                        <div className="tourCard__rating d-flex items-center text-13 mt-5">
                          <div className="d-flex x-gap-5">
                            <Stars star={tour.tripFields?.rating || 0} />
                          </div>

                          <span className="text-dark-1 ml-10">
                            {tour.tripFields?.rating || 0} ({tour.tripFields?.ratingCount || 0})
                          </span>
                        </div>

                        <div className="d-flex justify-between items-center border-1-top text-13 text-dark-1 pt-10 mt-10">
                          <div className="d-flex items-center">
                            <i className="icon-clock text-16 mr-5"></i>
                            {tour.tripFields?.duration}
                          </div>

                          <div>
                            From <span className="text-16 fw-500">${tour.tripFields?.price || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            
            {showSwiper && tours.length === 0 && (
              <div className="text-center py-50">
                <div className="text-18">No tours found.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
