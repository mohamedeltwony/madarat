import ClassName from '@/models/classname';
import { useState, useEffect } from 'react';
import { toASCIISafeUrl, containsNonASCII } from '@/utils/urlHelpers';

import styles from './Image.module.scss';

// Default placeholder image to show on errors
const DEFAULT_PLACEHOLDER = '/images/image-placeholder.png';

const Image = ({
  children,
  className,
  width = '100%',
  height = 'auto',
  src,
  alt,
  srcSet,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw', // Default responsive sizes
  dangerouslySetInnerHTML,
  priority = false, // For critical images above the fold
}) => {
  const imageClassName = new ClassName(styles.image);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  imageClassName.addIf(className, className);
  imageClassName.addIf(isLoaded, styles.loaded);
  imageClassName.addIf(isError, styles.error);

  // Reset loading state when src changes and ensure ASCII-safe URLs
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    
    // Ensure the image source is ASCII-safe for better compatibility
    if (src) {
      try {
        // For external URLs, encode only if they contain non-ASCII characters
        if (src.startsWith('http') && containsNonASCII(src)) {
          const url = new URL(src);
          // Encode only the pathname and search params, keep domain intact
          if (containsNonASCII(url.pathname)) {
            const encodedPath = url.pathname.split('/').map(segment => 
              segment && containsNonASCII(segment) ? encodeURIComponent(segment) : segment
            ).join('/');
            url.pathname = encodedPath;
          }
          if (containsNonASCII(url.search)) {
            url.search = toASCIISafeUrl(url.search);
          }
          setImageSrc(url.toString());
        } else if (!src.startsWith('http') && containsNonASCII(src)) {
          // For relative URLs, encode the entire path
          setImageSrc(toASCIISafeUrl(src));
        } else {
          setImageSrc(src);
        }
      } catch (error) {
        console.warn('Error processing image URL:', error);
        setImageSrc(src); // Fallback to original src
      }
    } else {
      setImageSrc(src);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    // Try to use a default placeholder
    setImageSrc(DEFAULT_PLACEHOLDER);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <div className={imageClassName.toString()}>
      {!isError && (
        <>
          <div className={styles.placeholder}>
            <div className={styles.shimmer} />
          </div>
          <img
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            srcSet={srcSet}
            sizes={sizes}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
          />
        </>
      )}
      {isError && (
        <div className={styles.errorPlaceholder}>
          {alt || 'Image could not be loaded'}
        </div>
      )}
      {children}
      {dangerouslySetInnerHTML && (
        <div dangerouslySetInnerHTML={dangerouslySetInnerHTML} />
      )}
    </div>
  );
};

export default Image;
