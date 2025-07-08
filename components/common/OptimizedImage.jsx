"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  quality = 75,
  placeholder = "blur",
  blurDataURL,
  sizes,
  fill = false,
  aspectRatio,
  style = {},
  onLoad,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate blur data URL if not provided
  const generateBlurDataURL = useCallback((w = 10, h = 10) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, w, h);
    return canvas.toDataURL();
  }, []);

  const handleLoad = useCallback((event) => {
    setIsLoaded(true);
    onLoad?.(event);
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoaded(true);
  }, []);

  // Calculate responsive sizes if not provided
  const responsiveSizes = sizes || (
    fill ? "100vw" : 
    width && width > 768 ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" :
    "(max-width: 768px) 100vw, 50vw"
  );

  // Container style for aspect ratio
  const containerStyle = {
    ...style,
    ...(aspectRatio && !fill && {
      position: 'relative',
      width: '100%',
      aspectRatio,
    }),
  };

  if (hasError) {
    return (
      <div 
        className={`error-placeholder ${className}`}
        style={{
          ...containerStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#6c757d',
          fontSize: '0.875rem',
          minHeight: height || 200,
        }}
      >
        <div className="text-center">
          <i className="icon-image text-2xl mb-2"></i>
          <div>Image not available</div>
        </div>
      </div>
    );
  }

  const imageProps = {
    src,
    alt: alt || "",
    className: `optimized-image ${className} ${isLoaded ? 'loaded' : 'loading'}`,
    quality,
    priority,
    sizes: responsiveSizes,
    onLoad: handleLoad,
    onError: handleError,
    placeholder: blurDataURL || placeholder === "blur" ? "blur" : "empty",
    ...(blurDataURL && { blurDataURL }),
    ...(placeholder === "blur" && !blurDataURL && { 
      blurDataURL: typeof window !== "undefined" ? generateBlurDataURL() : undefined 
    }),
    style: {
      transition: 'opacity 0.3s ease',
      opacity: isLoaded ? 1 : 0.8,
      ...(fill ? {} : {}),
    },
    ...props,
  };

  if (fill) {
    return (
      <div className="relative" style={containerStyle}>
        <Image
          {...imageProps}
          fill
        />
      </div>
    );
  }

  if (aspectRatio) {
    return (
      <div style={containerStyle}>
        <Image
          {...imageProps}
          width={width}
          height={height}
          style={{
            ...imageProps.style,
            width: '100%',
            height: 'auto',
          }}
        />
      </div>
    );
  }

  return (
    <Image
      {...imageProps}
      width={width}
      height={height}
    />
  );
};

export default OptimizedImage;