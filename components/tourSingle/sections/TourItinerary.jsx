import React from "react";
import RoadMap2 from "../RoadMap2";

export default function TourItinerary({ tour }) {
  return (
    <div className="tourItinerary">
      <h2 className="text-30" dir="rtl">البرنامج اليومي</h2>
      <div className="mt-20">
        <RoadMap2 tour={tour} />
      </div>
      <div className="line mt-60 mb-60"></div>
    </div>
  );
} 