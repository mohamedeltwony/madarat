import React from "react";

export default function TourOverview({ tour }) {
  return (
    <div className="tourOverview">
      <h2 className="text-30" dir="rtl">نظرة عامة</h2>
      <div 
        className="text-dark-1 text-15 mt-20" 
        dir="rtl" 
      >
        <div className="row y-gap-20">
          <div className="col-12">
            <div className="d-flex items-center">
              <i className="icon-clock text-16 text-light-1 mr-10"></i>
              <div className="text-15">مدة الرحلة: {tour?.duration || '11'} أيام</div>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex items-center">
              <i className="icon-location text-16 text-light-1 mr-10"></i>
              <div className="text-15">الدول: {tour?.countries || 'ايطاليا ، النمسا ، التشيك ، المجر'}</div>
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex items-center">
              <i className="icon-users text-16 text-light-1 mr-10"></i>
              <div className="text-15">نوع الرحلة: {tour?.type || 'رحلة جماعية'}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="line mt-60 mb-60"></div>
    </div>
  );
} 