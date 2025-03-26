import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/destinations');
  }, [router]);

  return null;
} 