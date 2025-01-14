import Stars from "@/components/common/Stars";
import React from "react";

export default function MainInformation2({ tour }) {
  // Debug: Log all tour data with distinctive prefix
  console.log('🏷️ TOUR DATA START ----------------');
  console.log('📦 Complete tour object:', tour);
  console.log('💰 Raw price value:', tour?.price);
  console.log('💰 Price type:', typeof tour?.price);
  console.log('📍 Tour fields:', {
    title: tour?.title || 'No title',
    price: tour?.price || 'No price',
    rating: tour?.rating || 'No rating',
    ratingCount: tour?.ratingCount || 'No rating count',
    location: tour?.location || 'No location',
    duration: tour?.duration || 'No duration'
  });
  console.log('🏷️ TOUR DATA END ------------------');

  return (
    <div className="">
      <div className="row x-gap-10 y-gap-10 items-center">
        {tour?.featured && (
          <div className="col-auto">
            <button className="button -accent-1 text-14 py-5 px-15 bg-accent-1-05 text-accent-1 rounded-200">
              Featured
            </button>
          </div>
        )}
        <div className="col-auto">
          <button className="button -accent-1 text-14 py-5 px-15 bg-light-1 rounded-200">
            Free cancellation
          </button>
        </div>
        <div className="col-auto ml-auto">
          <div className="text-14 text-light-1">From</div>
          <div className="text-22 lh-12 fw-600 text-blue-1">
            ${tour?.price || 0}
            <span className="text-14 text-light-1 ml-5">per person</span>
          </div>
        </div>
      </div>

      <h2 className="text-40 sm:text-30 lh-14 mt-20" dir="rtl">
        {tour?.title}
      </h2>

      <div className="row y-gap-20 justify-between pt-20">
        <div className="col-auto">
          <div className="row x-gap-20 y-gap-20 items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex x-gap-5 pr-10">
                  <Stars star={tour?.rating || 0} font={12} />
                </div>
                <span className="text-dark-1">
                  {tour?.rating || 0}
                  ({tour?.ratingCount || 0} reviews)
                </span>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-pin text-16 mr-5"></i>
                <span className="text-light-1">
                  {tour?.location}
                </span>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <i className="icon-clock text-16 mr-5"></i>
                <span className="text-light-1">
                  {tour?.duration || '11 Days'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-auto">
          <div className="col-auto">
            <div className="d-flex x-gap-30 y-gap-10">
              <button className="d-flex items-center text-blue-1">
                <i className="icon-share flex-center text-16 mr-10"></i>
                Share
              </button>

              <button className="d-flex items-center text-blue-1">
                <i className="icon-heart flex-center text-16 mr-10"></i>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
