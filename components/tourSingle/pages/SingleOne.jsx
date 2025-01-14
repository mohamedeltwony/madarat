import React from "react";
import MainInformation from "../MainInformation";
import Overview from "../Overview";
import TourSingleSidebar from "../TourSingleSidebar";
import Image from "next/image";

export default function SingleOne({ tour }) {
  return (
    <>
      <section className="">
        <div className="container">
          <MainInformation tour={tour} />
          
          {/* Tour Image */}
          <div className="relative d-flex justify-center overflow-hidden mt-30">
            <Image
              src={tour.imageSrc}
              alt={tour.title}
              width={1200}
              height={600}
              className="rounded-4 object-cover"
            />
          </div>
        </div>
      </section>

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <Overview tour={tour} />

              <div className="line mt-60 mb-60"></div>

              {tour.inclusions && (
                <>
                  <h2 className="text-30">What's included</h2>
                  <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour.inclusions }} />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}

              {tour.exclusions && (
                <>
                  <h2 className="text-30">What's not included</h2>
                  <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour.exclusions }} />
                  <div className="line mt-60 mb-60"></div>
                </>
              )}
            </div>

            <div className="col-lg-4">
              <div className="d-flex justify-end js-pin-content">
                <TourSingleSidebar tour={tour} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
