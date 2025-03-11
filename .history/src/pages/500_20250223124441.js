import Layout from '@/components/Layout';
import Container from '@/components/Container';
import styles from '@/styles/pages/Error.module.scss';

export default function Custom500() {
  return (
    <Layout>
      <Container>
        <div className={styles.error}>
          <h1>500 - خطأ في الخادم</h1>
          <p>عذراً، حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.</p>
        </div>
      </Container>
    </Layout>
  );
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
  return {
    props: {},
  };
}
