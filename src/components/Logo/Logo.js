import { useSiteContext } from 'hooks/use-site';
import styles from './Logo.module.scss';

const Logo = () => {
  const { metadata = {} } = useSiteContext();
  const { title } = metadata;

  return (
    <div className={styles.logo}>
      <span className={styles.text}>{title || 'مدارات الكون'}</span>
    </div>
  );
};

export default Logo;
