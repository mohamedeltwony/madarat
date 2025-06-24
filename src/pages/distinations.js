import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/destination');
  }, [router]);

  return null;
}
