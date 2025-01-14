"use client";

import React from "react";
import TourSingleSidebar from "../TourSingleSidebar";
import TourImage from "../TourImage";
import TourHeader from "../sections/TourHeader";
import TourOverview from "../sections/TourOverview";
import TourItinerary from "../sections/TourItinerary";
import TourServices from "../sections/TourServices";
import TourReviews from "../sections/TourReviews";
import Faq from "../Faq";
import RoadMap2 from "../RoadMap2";

export default function SingleThree({ tour }) {
  return (
    <section className="pt-30 js-pin-container">
      <div className="container">
        <div className="row y-gap-30 justify-between">
          <div className="col-lg-8">
            {/* Tour Header */}
            <TourHeader tour={tour} />

            {/* Tour Image */}
            <TourImage tour={tour} />

            {/* Tour Overview */}
            <TourOverview tour={tour} />

            {/* Tour Itinerary */}
            <TourItinerary tour={tour} />

            {/* Tour Services */}
            <TourServices tour={tour} />

            {/* FAQ Section */}
            <h2 className="text-30" dir="rtl">الأسئلة الشائعة</h2>
            <div className="accordion -simple row y-gap-20 mt-30 js-accordion">
              <Faq />
            </div>
            <div className="line mt-60 mb-60"></div>

            {/* Tour Reviews */}
            <TourReviews tour={tour} />
          </div>

          <div className="col-lg-4">
            <div className="d-flex justify-end js-pin-content">
              <TourSingleSidebar tour={tour} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
