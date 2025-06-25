import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function TaxCertificateRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/legal-documents');
  }, [router]);

  return null;
}
