"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { useEffect, useState } from "react";
import { getAllDestinations } from "@/utils/wordpress";
import Image from "next/image";
import Link from "next/link";

// Initialize Swiper modules
SwiperCore.use([Navigation, Pagination]);

export default function DestinationSlider() {
  const [showSwiper, setShowSwiper] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await getAllDestinations();
        console.log('Destinations data:', data);
        setDestinations(data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      } finally {
        setLoading(false);
        setShowSwiper(true);
      }
    };

    fetchDestinations();
  }, []);

  const handleImageError = (e) => {
    e.target.src = '/img/placeholder.jpg';
  };

  if (loading) {
    return (
      <div className="layout-pt-xl layout-pb-xl text-center">
        <div className="container">
          <div className="text-18">Loading destinations...</div>
        </div>
      </div>
    );
  }

  return (
    <section className="layout-pt-xl layout-pb-xl relative">
      <div className="container">
        <div className="row justify-between items-end y-gap-10">
          <div className="col-auto">
            <h2 data-aos="fade-up" data-aos-delay="" className="text-30 md:text-24">
              Popular Destinations
            </h2>
          </div>

          <div className="col-auto">
            <Link
              href="/destinations"
              data-aos="fade-right"
              data-aos-delay=""
              className="buttonArrow d-flex items-center"
            >
              <span>See all destinations</span>
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
                      className="tourCard -type-1 rounded-12 position-relative"
                    >
                      <div className="tourCard__image">
                        <div className="ratio ratio-28:20">
                          <Image
                            width={421}
                            height={301}
                            src={destination.imageSrc}
                            alt={destination.name}
                            className="img-ratio rounded-12 object-cover"
                            onError={handleImageError}
                            priority
                          />
                        </div>
                      </div>

                      <div className="tourCard__content px-20 pt-20 pb-20 bg-white rounded-12">
                        <h3 className="tourCard__title text-18 fw-500">
                          <span>{destination.name}</span>
                        </h3>

                        <div className="text-14 text-light-2 mt-5">
                          {destination.count} {destination.count === 1 ? 'Trip' : 'Trips'} Available
                        </div>

                        {destination.description && (
                          <div className="text-14 mt-5 text-light-2 line-clamp-2"
                            dangerouslySetInnerHTML={{ __html: destination.description }}
                          />
                        )}
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