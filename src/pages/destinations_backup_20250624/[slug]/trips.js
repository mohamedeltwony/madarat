import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * Legacy Redirect Component
 * This component redirects /destinations/[slug]/trips to /destinations/[slug]
 * Maintains SEO and user experience during the URL structure transition
 */
export default function DestinationTripsRedirect() {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) {
      // Redirect to the new URL structure
      router.replace(`/destinations/${slug}`, undefined, { shallow: false });
    }
  }, [slug, router]);

  return (
    <>
      <Head>
        <title>Redirecting...</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`/destinations/${slug}`} />
      </Head>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>جاري إعادة التوجيه...</h2>
          <p>يتم توجيهك إلى الصفحة الجديدة</p>
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  // Return minimal props since this is just a redirect
  return {
    props: {},
    // Short revalidation to ensure redirects work quickly
    revalidate: 60,
  };
}
