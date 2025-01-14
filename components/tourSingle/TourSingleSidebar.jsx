"use client";

import React from "react";
import Link from "next/link";

export default function TourSingleSidebar({ tour }) {
  // Debug: Log tour data
  console.log('=== TourSingleSidebar: Tour Data ===');
  console.log('Tour object:', tour);
  console.log('Raw price value:', tour?.price);
  console.log('Price type:', typeof tour?.price);

  return (
    <div className="px-30 py-30 rounded-4 bg-white shadow-3">
      <div className="text-14 text-light-1">السعر يبدأ من</div>
      <div className="text-30 fw-600 text-blue-1">{tour?.price || 5888} ريال سعودي</div>
      <div className="text-14 text-light-1">للشخص الواحد</div>

      <div className="row y-gap-20 pt-30">
        <div className="col-12">
          <div className="d-flex items-center">
            <i className="icon-clock text-16 text-light-1 mr-10"></i>
            <div className="text-15">{tour?.duration || '11'} أيام</div>
          </div>
        </div>

        <div className="col-12">
          <div className="d-flex items-center">
            <i className="icon-location text-16 text-light-1 mr-10"></i>
            <div className="text-15">{tour?.location}</div>
          </div>
        </div>

        {tour?.groupSize && (
          <div className="col-12">
            <div className="d-flex items-center">
              <i className="icon-user text-16 text-light-1 mr-10"></i>
              <div className="text-15">حجم المجموعة: {tour.groupSize}</div>
            </div>
          </div>
        )}

        {tour?.languages && (
          <div className="col-12">
            <div className="d-flex items-center">
              <i className="icon-globe text-16 text-light-1 mr-10"></i>
              <div className="text-15">اللغة: {tour.languages}</div>
            </div>
          </div>
        )}
      </div>

      <div className="row y-gap-20 pt-20">
        <div className="col-12">
          <Link 
            href={`/booking-pages?tour=${tour?.slug}`}
            className="button -md -dark-1 bg-blue-1 text-white w-100"
          >
            احجز الآن
          </Link>
        </div>

        <div className="col-12">
          <Link 
            href="https://wa.me/your-whatsapp-number"
            target="_blank"
            className="button -md -outline-blue-1 text-blue-1 w-100"
          >
            <i className="icon-whatsapp text-16 mr-10"></i>
            تواصل معنا
          </Link>
        </div>
      </div>

      <div className="row y-gap-10 pt-20">
        <div className="col-12">
          <div className="text-14 text-light-1 text-center">
            لا يوجد رسوم حجز إضافية
          </div>
        </div>
        <div className="col-12">
          <div className="text-14 text-light-1 text-center">
            الدفع عند التأكيد
          </div>
        </div>
      </div>
    </div>
  );
}
