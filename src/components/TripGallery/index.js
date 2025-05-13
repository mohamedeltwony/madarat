import { useState, useEffect } from 'react';
import Image from 'next/legacy/image';
import { FaEye, FaImage } from 'react-icons/fa';
import { normalizeText } from '../../utils/textNormalizer';
import dynamic from 'next/dynamic';

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
  // All hooks must be called unconditionally at the top level of the component
  const [isClient, setIsClient] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    setIsClient(true);
    // Log gallery props for debugging
    console.log('Gallery props received:', gallery);
  }, [gallery]);

  // Helper to validate URL
  const isValidUrl = (url) => {
    if (!url) return false;
    if (typeof url !== 'string') return false;
    return url.startsWith('http'); // Basic validation
  };

  // Filter out invalid URLs - ensure gallery is an array first
  const validGalleryUrls = Array.isArray(gallery) 
    ? gallery
        .filter(isValidUrl)
        .filter(Boolean)
    : [];
  
  // Create an array of valid unique gallery images
  const uniqueGalleryUrls = [...new Set(validGalleryUrls)];
  
  console.log('Valid unique gallery URLs:', uniqueGalleryUrls);
  
  // Make an array of images for display
  const displayImages = [];
  
  // If we have valid images, use them
  if (uniqueGalleryUrls.length > 0) {
    // Use all available images up to 4
    displayImages.push(...uniqueGalleryUrls.slice(0, 4));
  }
  
  // The main image is the first one or null if no images
  const mainImage = displayImages.length > 0 ? displayImages[0] : null;
  
  // Small images are the next three (if available)
  const smallImages = displayImages.slice(1, 4);

  // Handle image load errors
  const handleImageError = (index) => {
    console.error(`Image at index ${index} failed to load`);
    setImageErrors((prev) => ({ ...prev, [index]: true }));
  };

  // ImageFallback component for when images fail to load
  const ImageFallback = ({ className }) => (
    <div className={`gallery-image-fallback ${className || ''}`}>
      {isClient && <FaImage size={24} className="fallback-icon" />}
      <span>{normalizeText('الصورة غير متوفرة')}</span>
    </div>
  );

  // Prepare content for rendering
  let content;
  
  // If we don't have any valid images, show the fallback component
  if (!mainImage) {
    content = (
      <div className="gallery-grid">
        <div className="main-image">
          <div className="image-wrapper">
            <ImageFallback />
          </div>
        </div>
        
        {/* Empty placeholders for the small images */}
        {[1, 2, 3].map((index) => (
          <div key={`empty-img-${index}`} className="small-image">
            <div className="image-wrapper">
              <ImageFallback />
            </div>
          </div>
        ))}
      </div>
    );
  } else {
    // Prepare slides for the lightbox - only use valid URLs
    const slides = uniqueGalleryUrls.map((img) => ({ src: img }));
    
    content = (
      <>
        <div className="gallery-grid">
          {/* Main Image */}
          <div className="main-image">
            <div className="image-wrapper">
              {!imageErrors[0] ? (
                <Image
                  src={mainImage}
                  alt={normalizeText("صورة الرحلة الرئيسية")}
                  layout="fill"
                  objectFit="cover"
                  priority
                  onError={() => handleImageError(0)}
                />
              ) : (
                <ImageFallback />
              )}
              {isClient && !imageErrors[0] && (
                <button
                  className="view-button"
                  onClick={() => {
                    setLightboxIndex(0);
                    setLightboxOpen(true);
                  }}
                  aria-label={normalizeText("عرض الصورة في المعرض")}
                >
                  <FaEye />
                </button>
              )}
            </div>
          </div>

          {/* Small Images */}
          {smallImages.map((image, index) => (
            <div key={`gallery-img-${index}`} className="small-image">
              <div className="image-wrapper">
                {!imageErrors[index + 1] ? (
                  <Image
                    src={image}
                    alt={normalizeText(`صورة معرض الرحلة ${index + 1}`)}
                    layout="fill"
                    objectFit="cover"
                    onError={() => handleImageError(index + 1)}
                  />
                ) : (
                  <ImageFallback />
                )}
                {isClient && !imageErrors[index + 1] && (
                  <button
                    className="view-button"
                    onClick={() => {
                      setLightboxIndex(index + 1);
                      setLightboxOpen(true);
                    }}
                    aria-label={normalizeText(`عرض الصورة رقم ${index + 2} في المعرض`)}
                  >
                    <FaEye />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {isClient && lightboxOpen && (
          <LightboxWithStyles
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={slides}
            index={lightboxIndex}
          />
        )}
      </>
    );
  }

  // Return a consistent structure regardless of whether we have images
  return (
    <div className="trip-gallery-container">
      {content}
      <style jsx>{`
        .trip-gallery-container {
          width: 100%;
          margin-bottom: 1.5rem;
          direction: rtl;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 200px);
          gap: 0.5rem;
        }
        .main-image {
          grid-column: 1;
          grid-row: 1 / span 2;
          height: 100%;
        }
        .small-image {
          height: 100%;
        }
        .image-wrapper {
          position: relative;
          height: 100%;
          overflow: hidden;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .view-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 255, 255, 0.85);
          color: #333;
          border: none;
          border-radius: 50px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          opacity: 0;
          transition: all 0.3s ease;
        }
        .image-wrapper:hover .view-button {
          opacity: 1;
        }
        .gallery-image-fallback {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f7f7f7;
          color: #666;
          text-align: center;
          padding: 1rem;
        }
        .fallback-icon {
          margin-bottom: 8px;
        }
        
        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-rows: 200px repeat(3, 120px);
          }
          .main-image {
            grid-column: 1 / span 2;
            grid-row: 1;
          }
          .small-image {
            grid-column: auto;
            grid-row: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default TripGallery;
