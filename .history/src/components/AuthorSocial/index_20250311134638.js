import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaGlobe } from 'react-icons/fa';
import styles from './AuthorSocial.module.scss';

export default function AuthorSocial({ social = {}, website }) {
  const { twitter, facebook, instagram, linkedin } = social || {};
  
  // Check if there are any social links to display
  const hasSocialLinks = twitter || facebook || instagram || linkedin || website;
  
  if (!hasSocialLinks) {
    return null;
  }
  
  return (
    <div className={styles.socialContainer}>
      <h3 className={styles.socialTitle}>تواصل مع المؤلف</h3>
      
      <div className={styles.socialLinks}>
        {website && (
          <a 
            href={website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            title="الموقع الإلكتروني"
          >
            <FaGlobe />
          </a>
        )}
        
        {twitter && (
          <a 
            href={twitter} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            title="تويتر"
          >
            <FaTwitter />
          </a>
        )}
        
        {facebook && (
          <a 
            href={facebook} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            title="فيسبوك"
          >
            <FaFacebook />
          </a>
        )}
        
        {instagram && (
          <a 
            href={instagram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            title="انستغرام"
          >
            <FaInstagram />
          </a>
        )}
        
        {linkedin && (
          <a 
            href={linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.socialLink}
            title="لينكد إن"
          >
            <FaLinkedin />
          </a>
        )}
      </div>
    </div>
  );
} 