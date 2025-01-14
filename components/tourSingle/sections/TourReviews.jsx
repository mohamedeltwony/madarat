"use client";

import React from "react";
import Rating from "../Rating";
import Reviews from "../Reviews";
import CommentBox from "../CommentBox";

export default function TourReviews({ tour }) {
  return (
    <div className="tourReviews">
      <h2 className="text-30" dir="rtl">تقييمات العملاء</h2>
      <div className="mt-30">
        <Rating />
      </div>

      <Reviews />

      <button className="button -md -outline-accent-1 text-accent-1 mt-30">
        عرض المزيد من التقييمات
        <i className="icon-arrow-top-right text-16 ml-10"></i>
      </button>

      <CommentBox />
    </div>
  );
} 