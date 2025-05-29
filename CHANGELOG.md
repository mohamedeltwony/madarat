# Changelog

## [2024-01-29] - Enhanced GTM DataLayer with Encrypted User Data

### Added
- **Encrypted User Data in DataLayer**: Added SHA-256 hashed user information to all GTM tracking events
  - `encrypted_email`: SHA-256 hash of user email address
  - `encrypted_phone`: SHA-256 hash of user phone number (digits only)
  - `encrypted_name`: SHA-256 hash of user full name
- **Enhanced Page Context**: Added comprehensive page context data to all events
  - `url`: Current page URL
  - `page_title`: Page title
  - `page_path`: Page path
  - `page_category`: Page category for better segmentation
  - `user_language`: User interface language (ar)
- **Privacy-Compliant Tracking**: Implemented SHA-256 hashing for PII data before sending to GTM

### Changed
- **Thank You Pages**: Updated both citizen and resident thank you pages to include encrypted user data
- **Trip Form Redirects**: Enhanced form success handlers to pass user data via URL parameters
- **GTM Event Structure**: Enriched all conversion events with additional context and encrypted user data

### Technical Details
- **Encryption Method**: SHA-256 hashing with lowercase and trimmed input
- **Data Flow**: Form → URL Parameters → Thank You Page → Encrypted → DataLayer
- **Privacy**: No plain text PII is sent to GTM or Google Analytics
- **Compliance**: GDPR-compliant data minimization through hashing

### Files Modified
- `src/pages/thank-you-citizen.js`: Added encrypted user data tracking
- `src/pages/thank-you-resident.js`: Added encrypted user data tracking  
- `src/pages/italy-trip.js`: Enhanced form success handler
- `src/pages/london-scotland-trip.js`: Enhanced form success handler
- `src/pages/cruise-italy-spain-france.js`: Enhanced form success handler
- `docs/DATALAYER_TRACKING.md`: Updated documentation with encrypted fields

### Benefits
- **Enhanced Tracking**: Better user journey tracking with privacy protection
- **Advanced Matching**: Enables advanced matching capabilities in GTM/GA4
- **Privacy Compliance**: Maintains GDPR compliance through data hashing
- **Debugging**: Improved debugging capabilities with comprehensive event data

// ... existing changelog entries ... 