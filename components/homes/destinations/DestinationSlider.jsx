"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { getDestinations } from "@/utils/wordpress";
import Image from "next/image";
import Link from "next/link";

// Initialize Swiper modules
SwiperCore.use([Navigation, Pagination]);

export default function DestinationSlider() {
  const [showSwiper, setShowSwiper] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        console.log('Fetching destinations...');
        const data = await getDestinations();
        console.log('Destinations data:', data);
        setDestinations(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setError(error.message);
      } finally {
        setLoading(false);
        setShowSwiper(true);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <div className="layout-pt-xl layout-pb-xl text-center">
        <div className="container">
          <div className="text-18">Loading destinations...</div>
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
              Popular Destinations
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href={"/destinations"}
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
            {showSwiper && destinations.length > 0 && (
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
                className="destinationSlider"
              >
                {destinations.map((destination) => (
                  <SwiperSlide key={destination.id}>
                    <Link
                      href={`/destinations/${destination.slug}`}
                      className="destinationCard -type-1 d-block rounded-12"
                    >
                      <div className="destinationCard__image">
                        <Image
                          width={300}
                          height={200}
                          src={destination.featuredImage?.node?.sourceUrl || '/img/placeholder.jpg'}
                          alt={destination.title}
                          className="rounded-12 js-lazy"
                        />
                      </div>

                      <div className="destinationCard__content px-20 py-20">
                        <h4 className="text-18 fw-500 text-dark-1">{destination.title}</h4>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
            
            {showSwiper && destinations.length === 0 && (
              <div className="text-center py-50">
                <div className="text-18">No destinations found.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 