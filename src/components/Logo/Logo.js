import Image from 'next/image'; // Import Image
import { useSiteContext } from 'hooks/use-site';
import styles from './Logo.module.scss';

const Logo = ({ width = 150, height = 46 }) => {
  // Add optional width/height props
  const { metadata = {} } = useSiteContext();
  const { title } = metadata;

  return (
    <div className={styles.logo}>
      {/* Replace text span with Image component */}
      <Image
        src="/logo.png" // Path relative to public folder
        alt={title || 'مدارات الكون Logo'} // Use site title for alt text
        width={width} // Use prop or default
        height={height} // Use prop or default
        priority // Load logo quickly
        sizes={`${width}px`} // Add sizes prop based on the rendered width
      />
    </div>
  );
};

export default Logo;
