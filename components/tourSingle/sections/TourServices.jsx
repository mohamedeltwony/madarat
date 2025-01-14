import React from "react";

export default function TourServices({ tour }) {
  return (
    <div className="tourServices">
      {tour?.inclusions && (
        <>
          <h2 className="text-30" dir="rtl">الخدمات المشمولة</h2>
          <div 
            className="text-dark-1 text-15 mt-20" 
            dir="rtl" 
            dangerouslySetInnerHTML={{ __html: tour.inclusions }} 
          />
          <div className="line mt-60 mb-60"></div>
        </>
      )}

      {tour?.exclusions && (
        <>
          <h2 className="text-30" dir="rtl">الخدمات الغير مشمولة</h2>
          <div 
            className="text-dark-1 text-15 mt-20" 
            dir="rtl" 
            dangerouslySetInnerHTML={{ __html: tour.exclusions }} 
          />
          <div className="line mt-60 mb-60"></div>
        </>
      )}
    </div>
  );
} 