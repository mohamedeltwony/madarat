/**
 * Re-exports metadata-related functions from site.js
 * This file exists to maintain backward compatibility with imports
 * that use @/lib/metadata instead of @/lib/site
 */

export { getSiteMetadata, defaultMetadata, constructMetadata, helmetSettingsFromMetadata, constructPageMetadata } from './site'; 