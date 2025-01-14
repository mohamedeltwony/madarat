import React from "react";

export default function Overview({ tour }) {
  return (
    <>
      <div className="row x-gap-40 y-gap-40">
        <div className="col-12">
          <h3 className="text-22 fw-500">Overview</h3>
          <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour?.description }} />
        </div>

        {tour?.highlights && (
          <div className="col-12">
            <h3 className="text-22 fw-500">Highlights</h3>
            <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour?.highlights }} />
          </div>
        )}

        {tour?.itinerary && (
          <div className="col-12">
            <h3 className="text-22 fw-500">Itinerary</h3>
            <div className="text-dark-1 text-15 mt-20" dangerouslySetInnerHTML={{ __html: tour?.itinerary }} />
          </div>
        )}
      </div>
    </>
  );
}
