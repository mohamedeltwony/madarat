import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './TripGallery.module.scss';
import dynamic from 'next/dynamic';

// Dynamically import icons to avoid SSR issues
const FaEye = dynamic(() => import('react-icons/fa').then((mod) => mod.FaEye), {
  ssr: false,
});
const FaImage = dynamic(
  () => import('react-icons/fa').then((mod) => mod.FaImage),
  { ssr: false }
);

// Dynamically import Lightbox component with ssr: false
const Lightbox = dynamic(
  () => import('yet-another-react-lightbox').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div>Loading...</div>,
  }
);

// Load lightbox styles in a client component
const LightboxWithStyles = ({ open, close, slides, index }) => {
  useEffect(() => {
    // Import styles only on client side
    import('yet-another-react-lightbox/styles.css');
  }, []);

  return <Lightbox open={open} close={close} slides={slides} index={index} />;
};

const TripGallery = ({ gallery = [], videoUrl = null }) => {
  const [isClient, setIsClient] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Log the received gallery props to help with debugging
  useEffect(() => {
    console.log('Gallery images received:', gallery);
  }, [gallery]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Normalize gallery data - ensure all items are valid strings
  const normalizeGalleryItem = (item) => {
    if (!item) return null;
    if (typeof item === 'string') return item;
    if (item.url) return item.url;
    if (item.source_url) return item.source_url;
    return null;
  };

  // Make sure gallery is an array with valid items (strings or objects with URL)
  const validGallery = Array.isArray(gallery)
    ? gallery.map(normalizeGalleryItem).filter(Boolean)
    : [];

  // If there's no gallery data, don't render the component
  if (validGallery.length === 0) {
    console.log('No valid gallery items found, not rendering gallery');
    return null;
  }

  console.log('Valid gallery images:', validGallery);

  // Process gallery items
  const mainImage = validGallery[0];
  const smallImages = validGallery.slice(1);

  // Handle image load errors
  const handleImageError = (index) => {
    console.error(
      `Failed to load image at index ${index}:`,
      index === 0 ? mainImage : smallImages[index - 1]
    );
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // ImageFallback component for when images fail to load
  const ImageFallback = ({ className }) => (
    <div className={`${styles.imageFallback} ${className || ''}`}>
      {isClient && <FaImage className={styles.fallbackIcon} />}
      <span className={styles.fallbackText}>الصورة غير متوفرة</span>
    </div>
  );

  // Prepare slides for the lightbox
  const slides = validGallery.map((img) => ({ src: img }));

  return (
    <div className={styles.tripGalleryContainer}>
      <div className={styles.row}>
        {/* Main Image */}
        {mainImage && (
          <div className={styles.mainImageCol}>
            <div className={styles.galleryImageWrap}>
              <div
                className={styles.imageContainer}
                style={{ position: 'relative', width: '100%', height: '100%' }}
              >
                {!imageErrors[0] ? (
                  <Image
                    src={mainImage}
                    alt="Trip main image"
                    fill={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover' }}
                    priority
                    onError={() => handleImageError(0)}
                  />
                ) : (
                  <ImageFallback className={styles.mainImageFallback} />
                )}
              </div>
              {isClient && !imageErrors[0] && (
                <button
                  className={styles.viewButton}
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                  aria-label="عرض الصورة في المعرض"
                >
                  <FaEye className={styles.icon} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Small Images */}
        {smallImages.length > 0 && (
          <div className={styles.smallImagesCol}>
            <div className={styles.smallImagesGrid}>
              {smallImages.map((image, index) => (
                <div
                  key={`gallery-img-${index}`}
                  className={styles.smallImageContainer}
                >
                  <div
                    className={`${styles.galleryImageWrap} ${index >= 2 ? styles.active : ''}`}
                  >
                    <div
                      className={styles.imageContainer}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                      }}
                    >
                      {!imageErrors[index + 1] ? (
                        <Image
                          src={image}
                          alt={`Trip gallery image ${index + 1}`}
                          fill={true}
                          sizes="(max-width: 768px) 50vw, 25vw"
                          style={{ objectFit: 'cover' }}
                          onError={() => handleImageError(index + 1)}
                        />
                      ) : (
                        <ImageFallback className={styles.smallImageFallback} />
                      )}
                    </div>
                    {isClient && !imageErrors[index + 1] && (
                      <button
                        className={styles.viewButton}
                        onClick={() => {
                          setLightboxIndex(index + 1);
                          setLightboxOpen(true);
                        }}
                        aria-label={`عرض الصورة رقم ${index + 2} في المعرض`}
                      >
                        <FaEye className={styles.icon} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isClient && lightboxOpen && (
        <LightboxWithStyles
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={lightboxIndex}
        />
      )}
    </div>
  );
};

export default TripGallery;
