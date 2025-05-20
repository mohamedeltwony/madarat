import { useState } from 'react';
import Image from 'next/image';

/**
 * FallbackImage component that displays a placeholder when the original image fails to load
 * @param {Object} props - Image props
 * @param {string} props.src - Source URL of the image
 * @param {string} props.alt - Alt text for the image
 * @param {number} props.width - Width of the image
 * @param {number} props.height - Height of the image
 * @param {Object} props.style - Additional style properties
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallbackSrc - Optional custom fallback image source
 * @returns {JSX.Element} - The image component with fallback
 */
export default function FallbackImage({
  src,
  alt,
  width = 400,
  height = 250,
  style,
  className,
  fallbackSrc,
  ...rest
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isError, setIsError] = useState(false);

  // If source URL contains "madaratalkon.com" and there's an error, use placeholder
  const handleError = () => {
    if (!isError) {
      console.log(`Image load failed for: ${src}`);
      // Use provided fallback or generate a placeholder URL based on dimensions
      const placeholderUrl = fallbackSrc || 
        `https://placehold.co/${width}x${height}/e0e0e0/5c5c5c?text=مدارات+الكون`;
      setImgSrc(placeholderUrl);
      setIsError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt || 'صورة مدارات الكون للرحلات والسياحة'}
      width={width}
      height={height}
      style={style}
      className={className}
      onError={handleError}
      {...rest}
    />
  );
} 