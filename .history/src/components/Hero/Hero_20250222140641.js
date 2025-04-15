import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.scss';

const Hero = ({
  title,
  description,
  backgroundImage,
  featuredText,
  featuredLink,
  children,
}) => {
  return (
    <div className={styles.hero}>
      <div className={styles.backgroundImage}>
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
      </div>
      <div className={styles.overlay} />
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
      <div className={styles.curve} />
    </div>
  );
};

export default Hero;
