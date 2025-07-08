"use client";

import React, { useEffect, Suspense } from "react";
import dynamic from "next/dynamic";

// Lazy load AOS only when needed
const initializeAOS = async () => {
  const AOS = await import("aos");
  AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    delay: 0,
    easing: 'ease-in-out',
    disable: function() {
      // Disable AOS on mobile devices for better performance
      const maxWidth = 768;
      return window.innerWidth < maxWidth;
    }
  });
};

export default function Wrapper({ children }) {
  useEffect(() => {
    // Initialize AOS only on client side and when component mounts
    if (typeof window !== "undefined") {
      initializeAOS();
    }
  }, []);

  return (
    <Suspense fallback={
      <div className="loading-wrapper" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      {children}
    </Suspense>
  );
}
