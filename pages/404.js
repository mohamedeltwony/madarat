import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    // Site maintenance mode - redirect to coming soon page
    router.replace('/coming-soon');
  }, [router]);

  return null;
}

// 404 pages cannot have getServerSideProps - using client-side redirect
