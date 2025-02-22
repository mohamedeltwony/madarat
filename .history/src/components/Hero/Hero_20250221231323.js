import styles from './Hero.module.scss';

const Hero = ({ title, description, backgroundImage, children }) => {
  return (
    <div 
      className={styles.hero}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
        {children}
      </div>
      <div className={styles.curve} />
    </div>
  );
};

export default Hero; 