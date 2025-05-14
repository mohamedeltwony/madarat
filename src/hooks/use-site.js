import { useContext, createContext } from 'react';
import { removeLastTrailingSlash } from '@/lib/util';
import SITE_CONFIG from '@/lib/config';

export const SiteContext = createContext();

/**
 * useSiteContext
 */

export function useSiteContext(data) {
  const { homepage = '' } = SITE_CONFIG;

  // Trim the trailing slash from the end of homepage to avoid
  // double // issues throughout the metadata
  const cleanHomepage = removeLastTrailingSlash(homepage);

  return {
    ...data,
    homepage: cleanHomepage,
  };
}

/**
 * useSite
 */

export default function useSite() {
  const site = useContext(SiteContext);
  return site;
}
