"use client";

import React, { useState } from "react";

export default function CommentBox() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    comment: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  return (
    <>
      <h2 className="text-30 pt-60" dir="rtl">اترك تعليقاً</h2>
      <p className="mt-30" dir="rtl">
        لن يتم نشر عنوان بريدك الإلكتروني. الحقول المطلوبة مشار إليها بـ *
      </p>

      <div className="reviewsGrid pt-30">
        <div className="reviewsGrid__item">
          Location
          <div className="d-flex x-gap-5 pl-20">
            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>
          </div>
        </div>

        <div className="reviewsGrid__item">
          Amenities
          <div className="d-flex x-gap-5 pl-20">
            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>
          </div>
        </div>

        <div className="reviewsGrid__item">
          Food
          <div className="d-flex x-gap-5 pl-20">
            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>
          </div>
        </div>

        <div className="reviewsGrid__item">
          Room
          <div className="d-flex x-gap-5 pl-20">
            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>
          </div>
        </div>

        <div className="reviewsGrid__item">
          Price
          <div className="d-flex x-gap-5 pl-20">
            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>
          </div>
        </div>

        <div className="reviewsGrid__item">
          Tour Operator
          <div className="d-flex x-gap-5 pl-20">
            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>

            <i className="icon-star text-10 text-yellow-2"></i>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="contactForm y-gap-30 pt-30">
        <div className="row y-gap-30">
          <div className="col-md-6">
            <div className="form-input">
              <input 
                type="text" 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
              <label htmlFor="name" className="lh-1 text-16 text-light-1">الاسم *</label>
            </div>
          </div>

          <div className="col-md-6">
            <div className="form-input">
              <input 
                type="email" 
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
              <label htmlFor="email" className="lh-1 text-16 text-light-1">البريد الإلكتروني *</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="form-input">
              <input 
                type="text" 
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required 
              />
              <label htmlFor="title" className="lh-1 text-16 text-light-1">عنوان التعليق *</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="form-input">
              <textarea 
                id="comment"
                value={formData.comment}
                onChange={(e) => setFormData({...formData, comment: e.target.value})}
                required 
                rows="5"
              ></textarea>
              <label htmlFor="comment" className="lh-1 text-16 text-light-1">التعليق *</label>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button type="submit" className="button -md -dark-1 bg-accent-1 text-white">
              نشر التعليق
              <i className="icon-arrow-top-right text-16 ml-10"></i>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
