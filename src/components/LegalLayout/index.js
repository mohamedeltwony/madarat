import { useEffect } from 'react';
import Layout from '@/components/Layout';
import styles from './LegalLayout.module.scss';

const LegalLayout = ({ children }) => {
  useEffect(() => {
    // Add the legal-page class to the body when component mounts
    document.body.classList.add('legal-page');

    // Remove the class when the component unmounts
    return () => {
      document.body.classList.remove('legal-page');
    };
  }, []);

  return (
    <Layout>
      <div className={styles.legalLayoutContent}>{children}</div>
    </Layout>
  );
};

export default LegalLayout;
