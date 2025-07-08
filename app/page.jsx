import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// Dynamic imports for code splitting
const Firstpage = dynamic(() => import("./(homes)/home-1/page"), {
  loading: () => <div className="component-loading">Loading...</div>,
  ssr: true,
});

const TourSlderOne = dynamic(() => import("@/components/homes/tours/TourSlderOne"), {
  loading: () => <div className="component-loading">Loading tours...</div>,
  ssr: false, // Not critical for initial render
});

const DestinationSlider = dynamic(() => import("@/components/homes/destinations/DestinationSlider"), {
  loading: () => <div className="component-loading">Loading destinations...</div>,
  ssr: false, // Not critical for initial render
});

export const metadata = {
  title: "Home || ViaTour - Travel & Tour React NextJS Template",
  description: "Discover amazing travel destinations and tours with ViaTour. Book your perfect vacation today!",
  keywords: "travel, tours, destinations, vacation, booking, adventure",
  openGraph: {
    title: "ViaTour - Your Perfect Travel Companion",
    description: "Discover amazing travel destinations and tours",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ViaTour - Your Perfect Travel Companion",
    description: "Discover amazing travel destinations and tours",
  },
  alternates: {
    canonical: "https://viatour.com",
  },
};

export default function page() {
  return (
    <>
      <Suspense fallback={
        <div className="page-loading" style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading content...</span>
          </div>
        </div>
      }>
        <Firstpage />
      </Suspense>
      
      <Suspense fallback={
        <div className="section-loading" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-border text-secondary" role="status"></div>
        </div>
      }>
        <DestinationSlider />
      </Suspense>
      
      <Suspense fallback={
        <div className="section-loading" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="spinner-border text-secondary" role="status"></div>
        </div>
      }>
        <TourSlderOne />
      </Suspense>
    </>
  );
}
