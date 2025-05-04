import ClassName from '@/models/classname';
import { useState, useEffect } from 'react';

import styles from './Image.module.scss';

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

  imageClassName.addIf(className, className);
  imageClassName.addIf(isLoaded, styles.loaded);
  imageClassName.addIf(isError, styles.error);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setIsError(true);
    console.error(`Failed to load image: ${src}`);
  };

  return (
    <figure className={imageClassName.toString()}>
      <div className={styles.featuredImageImg}>
        {!isLoaded && !isError && (
          <div className={styles.placeholder} style={{ width, height }}>
            {/* Show shimmer effect while loading */}
            <div className={styles.shimmer}></div>
          </div>
        )}
        <img
          width={width}
          height={height}
          src={src}
          alt={alt || ''}
          srcSet={srcSet}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'} // Use lazy loading for non-priority images
          decoding="async" // Async decoding for better performance
          onLoad={handleLoad}
          onError={handleError}
          style={{ opacity: isLoaded ? 1 : 0 }} // Fade in when loaded
        />
        {isError && (
          <div className={styles.errorPlaceholder}>
            <span>Unable to load image</span>
          </div>
        )}
      </div>
      {children && <figcaption>{children}</figcaption>}
      {dangerouslySetInnerHTML && (
        <figcaption
          dangerouslySetInnerHTML={{
            __html: dangerouslySetInnerHTML,
          }}
        />
      )}
    </figure>
  );
};

export default Image;
