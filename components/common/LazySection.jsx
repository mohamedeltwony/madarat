"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";

const LazySection = ({ 
  children, 
  threshold = 0.1, 
  rootMargin = "50px",
  placeholder,
  className = "",
  style = {},
  once = true,
  fallback,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            setHasBeenVisible(true);
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin, once]);

  const shouldRender = isVisible || hasBeenVisible;

  const defaultPlaceholder = (
    <div 
      className="lazy-section-placeholder d-flex justify-content-center align-items-center"
      style={{
        minHeight: '200px',
        backgroundColor: '#f8f9fa',
        color: '#6c757d',
        ...style,
      }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary mb-2" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div>Loading content...</div>
      </div>
    </div>
  );

  return (
    <div 
      ref={sectionRef} 
      className={`lazy-section ${className}`}
      style={style}
    >
      {shouldRender ? (
        <Suspense fallback={fallback || defaultPlaceholder}>
          {children}
        </Suspense>
      ) : (
        placeholder || defaultPlaceholder
      )}
    </div>
  );
};

export default LazySection;