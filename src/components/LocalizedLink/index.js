import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { containsArabic, decodeArabicUrl } from '@/utils/urlHelpers';

/**
 * LocalizedLink - A wrapper around Next.js Link component that handles
 * non-Latin URLs (especially Arabic) without encoding them.
 */
const LocalizedLink = ({ href, children, ...props }) => {
  const router = useRouter();
  const { locale } = router;
  const [decodedHref, setDecodedHref] = useState(href);

  useEffect(() => {
    // On client-side only, try to decode the URL
    if (typeof href === 'string') {
      try {
        const decoded = decodeURIComponent(href);
        setDecodedHref(decoded);
      } catch (e) {
        console.error('Error decoding URL:', e);
      }
    }
  }, [href]);

  // For client-side rendering, use the a tag with custom click handling for Arabic URLs
  if (
    typeof window !== 'undefined' &&
    typeof href === 'string' &&
    containsArabic(decodedHref)
  ) {
    const handleClick = (e) => {
      e.preventDefault();
      window.location.href = decodedHref;
    };

    return (
      <a href={decodedHref} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  // For standard links or server-side rendering, use Next.js Link
  return (
    <Link href={href} locale={locale} {...props}>
      {children}
    </Link>
  );
};

export default LocalizedLink;
