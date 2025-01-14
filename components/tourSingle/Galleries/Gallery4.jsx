"use client";

import Stars from "@/components/common/Stars";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";

const defaultImages = [
  "/img/tourSingle/2/2.png",
  "/img/tourSingle/2/1.png",
  "/img/tourSingle/2/3.png",
];

export default function Gallery4({ tour }) {
  const galleryImages = tour?.gallery?.length > 0 
    ? tour.gallery 
    : tour?.imageSrc 
      ? [tour.imageSrc] 
      : defaultImages;

  return (
    <section className="tourSingleHero5">
      <div className="tourSingleHero5__image">
        <div className="js-section-slider">
          <div className="swiper-wrapper" style={{ height: "796px" }}>
            <Swiper
              spaceBetween={10}
              className="w-100 overflow-visible"
              style={{ maxWidth: "100%" }}
              loop={true}
              navigation={{
                prevEl: ".js-slider1-prev9",
                nextEl: ".js-slider1-next9",
              }}
              modules={[Navigation, Pagination]}
              slidesPerView={1}
            >
              {galleryImages.map((image, i) => (
                <SwiperSlide key={i}>
                  <div className="swiper-slide">
                    <Image
                      width={1200}
                      height={800}
                      src={image}
                      alt={`${tour?.title || 'Tour'} - Image ${i + 1}`}
                      className="img-cover rounded-12"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="navTourSingle">
            <button className="navTourSingle__button bg-white js-slider1-prev js-slider1-prev9">
              <i className="icon-arrow-left text-14"></i>
            </button>

            <button className="navTourSingle__button bg-white js-slider1-next js-slider1-next9">
              <i className="icon-arrow-right text-14"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
