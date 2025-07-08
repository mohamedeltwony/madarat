import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Critical components - load immediately
import Hero1 from "@/components/homes/heros/Hero1";
import Header1 from "@/components/layout/header/Header1";
import FooterOne from "@/components/layout/footers/FooterOne";

// Non-critical components - load dynamically
const ArticlesThree = dynamic(() => import("@/components/homes/articles/ArticlesThree"), {
  loading: () => <div className="section-loading">Loading articles...</div>,
  ssr: false,
});

const Banner = dynamic(() => import("@/components/homes/banners/Banner"), {
  loading: () => <div className="section-loading">Loading banner...</div>,
  ssr: false,
});

const BannerOne = dynamic(() => import("@/components/homes/banners/BannerOne"), {
  loading: () => <div className="section-loading">Loading banner...</div>,
  ssr: false,
});

const DestinationsOne = dynamic(() => import("@/components/homes/destinations/DestinationsOne"), {
  loading: () => <div className="section-loading">Loading destinations...</div>,
  ssr: true, // Important for SEO
});

const FeaturesOne = dynamic(() => import("@/components/homes/features/FeaturesOne"), {
  loading: () => <div className="section-loading">Loading features...</div>,
  ssr: true,
});

const TestimonialOne = dynamic(() => import("@/components/homes/testimonials/TestimonialOne"), {
  loading: () => <div className="section-loading">Loading testimonials...</div>,
  ssr: false,
});

const TourTypeOne = dynamic(() => import("@/components/homes/tourTypes/TourTypeOne"), {
  loading: () => <div className="section-loading">Loading tour types...</div>,
  ssr: false,
});

const Tour1 = dynamic(() => import("@/components/homes/tours/Tour1"), {
  loading: () => <div className="section-loading">Loading tours...</div>,
  ssr: true, // Important for SEO
});

const TourSlderOne = dynamic(() => import("@/components/homes/tours/TourSlderOne"), {
  loading: () => <div className="section-loading">Loading tour slider...</div>,
  ssr: false,
});

// Loading component for sections
const SectionLoader = ({ children, title = "Loading section..." }) => (
  <Suspense fallback={
    <div className="section-loading d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">{title}</span>
      </div>
    </div>
  }>
    {children}
  </Suspense>
);

export default function Home() {
  return (
    <main>
      {/* Critical above-the-fold content */}
      <Header1 />
      <Hero1 />
      
      {/* Above-the-fold but less critical */}
      <SectionLoader title="Loading features">
        <FeaturesOne />
      </SectionLoader>
      
      {/* Below-the-fold content with progressive loading */}
      <SectionLoader title="Loading destinations">
        <DestinationsOne />
      </SectionLoader>
      
      <SectionLoader title="Loading tours">
        <Tour1 />
      </SectionLoader>
      
      <SectionLoader title="Loading banner">
        <Banner />
      </SectionLoader>
      
      <SectionLoader title="Loading tour types">
        <TourTypeOne />
      </SectionLoader>
      
      <SectionLoader title="Loading tour slider">
        <TourSlderOne />
      </SectionLoader>
      
      <SectionLoader title="Loading testimonials">
        <TestimonialOne />
      </SectionLoader>
      
      <SectionLoader title="Loading banner">
        <BannerOne />
      </SectionLoader>
      
      <SectionLoader title="Loading articles">
        <ArticlesThree />
      </SectionLoader>
      
      {/* Footer is critical for navigation */}
      <FooterOne />
    </main>
  );
}
