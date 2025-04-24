import Link from 'next/link';
import Image from 'next/image'; // Use next/image
import styles from './Hero.module.scss';
import Container from '@/components/Container';

const Hero = ({
  title,
  description,
  backgroundImage, // Keep for fallback or image option
  backgroundVideo, // Add new video prop
  featuredText,
  featuredLink,
  children,
}) => {
  return (
    <div className={`${styles.hero} hero`}>
      {/* Background Media Container */}
      <div className={styles.backgroundMedia}>
        {backgroundVideo ? (
          // Render video if backgroundVideo prop is provided
          <video
            key={backgroundVideo} // Add key to help React identify changes if src updates
            className={styles.heroVideo} // Apply specific video styles
            autoPlay
            muted
            loop
            playsInline // Essential for iOS background playback
          >
            <source src={backgroundVideo} type="video/mp4" />
            {/* Optional: Add other source types for broader compatibility */}
            {/* <source src={backgroundVideo.replace('.mp4', '.webm')} type="video/webm" /> */}
            Your browser does not support the video tag.
          </video>
        ) : backgroundImage ? (
          // Render image if backgroundImage is provided and video is not
          <Image
            src={backgroundImage}
            alt="Hero background" // More descriptive alt text if possible
            fill // Use fill layout
            priority // Prioritize loading for LCP
            quality={85} // Adjust quality as needed
            sizes="100vw" // Specify sizes for responsive loading
            style={{
              objectFit: 'cover', // Ensure image covers the area
              objectPosition: 'center', // Center the image
            }}
          />
        ) : (
          // Optional: Render a fallback color or nothing if neither is provided
          null
        )}
      </div>

      {/* Overlay */}
      <div className={styles.overlay} />

      {/* Content */}
      <Container>
        <div className={styles.content}>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
          {featuredText && featuredLink && (
            <Link href={featuredLink} className={styles.featuredButton}>
              {featuredText}
            </Link>
          )}
          {children}
        </div>
      </Container>

      {/* Optional Curve/Shape */}
      <div className={styles.curve} />
    </div>
  );
};

export default Hero;
