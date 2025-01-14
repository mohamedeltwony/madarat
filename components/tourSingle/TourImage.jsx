import React from "react";

export default function TourImage({ tour }) {
  // Add console log to debug the image URL
  console.log('=== TourImage Component ===');
  console.log('Tour:', tour);
  console.log('Image URL:', tour?.image);

  return (
    <div className="tourImage mt-40">
      <img 
        src={tour?.image || '/img/placeholder.jpg'} 
        alt={tour?.title?.rendered || "Tour Image"} 
        className="rounded-4 w-100 h-100 object-cover"
        style={{ maxHeight: "500px" }}
      />
    </div>
  );
} 