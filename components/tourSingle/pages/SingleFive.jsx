"use client";

import React, { useState } from "react";
import TourSingleSidebar from "../TourSingleSidebar";
import CommentBox from "../CommentBox";
import Reviews from "../Reviews";
import Rating from "../Rating";
import Faq from "../Faq";
import DateCalender from "../DateCalender";
import OthersInformation from "../OthersInformation";
import Overview from "../Overview";
import Gallery4 from "../Galleries/Gallery4";
import MainInformation2 from "./MainInformation2";

const tabButtons = [
  "Overview",
  "Included",
  "Itinerary",
  "FAQ",
  "Reviews",
];

export default function SingleFive({ tour }) {
  const [activeTab, setActiveTab] = useState("Overview");
  
  return (
    <>
      <Gallery4 tour={tour} />

      <section className="layout-pt-md js-pin-container">
        <div className="container">
          <div className="row y-gap-30 justify-between">
            <div className="col-lg-8">
              <MainInformation2 tour={tour} />
              
              <div className="tabs -tourSingle mt-40 js-tabs">
                <div className="tabs__controls row x-gap-30 y-gap-10 js-tabs-controls">
                  {tabButtons.map((elm, i) => (
                    <div
                      onClick={() => setActiveTab(elm)}
                      key={i}
                      className="col-auto"
                    >
                      <button
                        className={`tabs__button text-30 md:text-20 fw-700 js-tabs-button ${
                          elm === activeTab ? "is-tab-el-active" : ""
                        }`}
                      >
                        {elm}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="tabs__content pt-40 js-tabs-content">
                  <div className={`tabs__pane ${activeTab === "Overview" ? "is-tab-el-active" : ""}`}>
                    <div className="row y-gap-20 justify-between items-center">
                      <OthersInformation tour={tour} />
                    </div>
                    <Overview tour={tour} />
                  </div>

                  <div className={`tabs__pane ${activeTab === "Included" ? "is-tab-el-active" : ""}`}>
                    <div className="row x-gap-40 y-gap-40">
                      <div className="col-12">
                        <h3 className="text-22 fw-500">What's included</h3>
                        {tour.inclusions ? (
                          <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour.inclusions }} />
                        ) : (
                          <div className="text-dark-1 text-15 mt-20">No inclusions specified</div>
                        )}
                      </div>

                      {tour.exclusions && (
                        <div className="col-12">
                          <h3 className="text-22 fw-500">What's not included</h3>
                          <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour.exclusions }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`tabs__pane ${activeTab === "Itinerary" ? "is-tab-el-active" : ""}`}>
                    <div className="row x-gap-40 y-gap-40">
                      <div className="col-12">
                        <h3 className="text-22 fw-500">Tour Itinerary</h3>
                        <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour.itinerary }} />
                      </div>
                    </div>
                  </div>

                  <div className={`tabs__pane ${activeTab === "FAQ" ? "is-tab-el-active" : ""}`}>
                    <div className="row y-gap-20">
                      <div className="col-12">
                        <div className="accordion -simple row y-gap-20 js-accordion">
                          <Faq />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`tabs__pane ${activeTab === "Reviews" ? "is-tab-el-active" : ""}`}>
                    <div className="row y-gap-40">
                      <div className="col-12">
                        <h3 className="text-22 fw-500">Customer Reviews</h3>
                        <Rating />
                        <Reviews />
                        <div className="mt-40">
                          <CommentBox />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
