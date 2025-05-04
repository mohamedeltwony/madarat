import ClassName from '@/models/classname';
import { useState, useEffect } from 'react';

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

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
    setImageSrc(src);
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
