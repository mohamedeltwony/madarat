import Link from 'next/link';
import Image from 'next/image';
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
      <div className={styles.backgroundMedia}> {/* Rename container */}
        {backgroundVideo ? (
          <video
            key={backgroundVideo} // Add key to force re-render if src changes
            autoPlay
            muted
            loop
            playsInline // Important for iOS playback
            className={styles.heroVideo} // Add specific class for video styling
          >
            <source src={backgroundVideo} type="video/mp4" />
            {/* Add other video formats if available */}
            {/* <source src={backgroundVideo.replace('.mp4', '.webm')} type="video/webm" /> */}
            Your browser does not support the video tag.
            {/* Optional: Display image as fallback if video fails? */}
            {backgroundImage && (
               <img src={backgroundImage} alt="" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}} />
            )}
          </video>
        ) : backgroundImage ? (
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            quality={85}
            sizes="100vw"
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
        ) : null}
      </div>
      <div className={styles.overlay} />
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
      <div className={styles.curve} />
    </div>
  );
};

export default Hero;
          priority
          quality={85}
          sizes="100vw"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      </div>
      <div className={styles.overlay} />
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
      <div className={styles.curve} />
    </div>
  );
};

export default Hero;
