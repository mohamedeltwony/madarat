# DataLayer Tracking Documentation

## Overview

This document outlines all the data that is pushed to the Google Tag Manager (GTM) dataLayer after successful form submissions in the Madarat Al-Kon travel website.

## Form Submission Events

### 1. Trip Booking Form Submission

When a user successfully submits a trip booking form, the following events are pushed to dataLayer:

#### Event 1: `form_submit`
```javascript
{
  event: 'form_submit',
  form_name: 'trip_booking_form',
  form_location: '/italy-trip', // Current page path
  form_type: 'trip_booking',
  user_nationality: 'مواطن', // or 'مقيم'
  user_type: 'citizen', // or 'resident'
  trip_destination: 'Italy',
  trip_name: 'Italy Trip',
  trip_value: 2500,
  currency: 'SAR',
  external_id: 'unique-form-id',
  lead_event_id: 'unique-lead-id',
  timestamp: '2024-01-15T10:30:00.000Z',
  
  // UTM and tracking data
  utm_source: 'google',
  utm_medium: 'cpc',
  utm_campaign: 'italy_trip_2024',
  utm_term: 'italy travel',
  utm_content: 'ad_variant_1',
  
  // Device and browser info
  screen_width: 1920,
  screen_height: 1080,
  device_vendor: 'Apple',
  operating_system: 'macOS',
  browser: 'Chrome',
  user_agent: 'Mozilla/5.0...',
  
  // Facebook tracking IDs
  fb_browser_id: '_fbp_value',
  fb_click_id: '_fbc_value',
  referrer: 'https://google.com'
}
```

#### Event 2: `trip_booking`
```javascript
{
  event: 'trip_booking',
  trip_name: 'Italy Trip',
  trip_destination: 'Italy',
  trip_price: '2500',
  trip_duration: '7 days',
  category: 'international',
  booking_step: 'lead_submitted',
  nationality: 'مواطن',
  user_type: 'citizen'
}
```

#### Event 3: `purchase_intent`
```javascript
{
  event: 'purchase_intent',
  ecommerce: {
    currency: 'SAR',
    value: 2500,
    items: [{
      item_id: 'italy-trip-2024',
      item_name: 'Italy Trip Package',
      item_category: 'Travel',
      item_variant: 'Citizen', // or 'Resident'
      price: 2500,
      quantity: 1
    }]
  },
  user_data: {
    nationality: 'مواطن',
    user_type: 'citizen'
  }
}
```

### 2. Thank You Page Conversion Events

#### For Citizens (`/thank-you-citizen`)

##### Event 1: `conversion`
```javascript
{
  event: 'conversion',
  conversion_type: 'lead',
  conversion_value: 10,
  currency: 'SAR',
  user_type: 'citizen',
  nationality: 'مواطن',
  form_name: 'citizenship_form',
  page_type: 'thank_you',
  lead_source: 'website',
  external_id: 'unique-external-id',
  event_id: 'unique-event-id',
  timestamp: '2024-01-15T10:31:00.000Z',
  form_location: 'thank-you-citizen',
  lead_quality: 'high',
  completion_time: '2024-01-15T10:31:00.000Z',
  
  // Encrypted user data (SHA-256 hashed for privacy compliance)
  encrypted_email: 'a1b2c3d4e5f6...', // SHA-256 hash of user email
  encrypted_phone: 'f6e5d4c3b2a1...', // SHA-256 hash of user phone
  encrypted_name: '123456789abc...', // SHA-256 hash of user name
  
  // Page context
  url: 'https://madaratalkon.com/thank-you-citizen',
  page_title: 'شكراً لك! | مدارات الكون',
  page_path: '/thank-you-citizen',
  page_category: 'thank-you-citizen',
  user_language: 'ar'
}
```

##### Event 2: `form_submit` (completion)
```javascript
{
  event: 'form_submit',
  form_name: 'citizenship_form_complete',
  form_location: 'thank-you-citizen',
  conversion_value: 10,
  currency: 'SAR',
  user_type: 'citizen',
  lead_quality: 'high',
  completion_time: '2024-01-15T10:31:00.000Z',
  
  // Encrypted user data (SHA-256 hashed for privacy compliance)
  encrypted_email: 'a1b2c3d4e5f6...', // SHA-256 hash of user email
  encrypted_phone: 'f6e5d4c3b2a1...', // SHA-256 hash of user phone
  encrypted_name: '123456789abc...', // SHA-256 hash of user name
  
  // Page context
  url: 'https://madaratalkon.com/thank-you-citizen',
  page_title: 'شكراً لك! | مدارات الكون',
  page_path: '/thank-you-citizen',
  page_category: 'thank-you-citizen',
  user_language: 'ar',
  external_id: 'unique-external-id',
  event_id: 'unique-event-id',
  timestamp: '2024-01-15T10:31:00.000Z'
}
```

##### Event 3: `purchase` (Enhanced Ecommerce)
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'unique-external-id',
    value: 10,
    currency: 'SAR',
    items: [{
      item_id: 'citizen-lead',
      item_name: 'Citizen Lead Conversion',
      item_category: 'Lead Generation',
      item_variant: 'Citizen',
      price: 10,
      quantity: 1
    }]
  },
  user_data: {
    nationality: 'مواطن',
    user_type: 'citizen',
    lead_source: 'website',
    encrypted_email: 'a1b2c3d4e5f6...', // SHA-256 hash of user email
    encrypted_phone: 'f6e5d4c3b2a1...', // SHA-256 hash of user phone
    encrypted_name: '123456789abc...' // SHA-256 hash of user name
  },
  // Additional context fields
  conversion_type: 'lead',
  conversion_value: 10,
  currency: 'SAR',
  form_name: 'citizenship_form',
  page_type: 'thank_you',
  lead_source: 'website',
  external_id: 'unique-external-id',
  event_id: 'unique-event-id',
  timestamp: '2024-01-15T10:31:00.000Z',
  url: 'https://madaratalkon.com/thank-you-citizen',
  page_title: 'شكراً لك! | مدارات الكون',
  page_path: '/thank-you-citizen',
  page_category: 'thank-you-citizen',
  user_language: 'ar',
  form_location: 'thank-you-citizen',
  lead_quality: 'high',
  completion_time: '2024-01-15T10:31:00.000Z'
}
```

#### For Residents (`/thank-you-resident`)

Similar structure but with different values:
- `conversion_value: 8` (instead of 10)
- `user_type: 'resident'`
- `nationality: 'مقيم'`
- `lead_quality: 'medium'` (instead of 'high')
- `item_variant: 'Resident'`
- `page_category: 'thank-you-resident'`
- `form_location: 'thank-you-resident'`

All encrypted user data fields (`encrypted_email`, `encrypted_phone`, `encrypted_name`) are included in the same format.

### 3. Error Tracking

When form submission fails:

```javascript
{
  event: 'form_submission_error',
  form_name: 'trip_booking_form',
  error_message: 'Network error occurred',
  form_location: '/italy-trip',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

## Page View Tracking

### Homepage
```javascript
{
  event: 'page_view',
  page_title: 'مدارات الكون',
  page_location: 'https://madaratalkon.com/',
  page_category: 'homepage'
}
```

## Data Structure Reference

### User Data Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `user_nationality` | string | User's nationality in Arabic | `'مواطن'` or `'مقيم'` |
| `user_type` | string | User type in English | `'citizen'` or `'resident'` |
| `external_id` | string | Unique form submission ID | `'uuid-v4-string'` |
| `lead_event_id` | string | Unique lead tracking ID | `'uuid-v4-string'` |

### Trip Data Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `trip_name` | string | Name of the trip | `'Italy Trip'` |
| `trip_destination` | string | Destination country/city | `'Italy'` |
| `trip_value` | number | Estimated trip value | `2500` |
| `trip_duration` | string | Trip duration | `'7 days'` |

### UTM and Tracking Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `utm_source` | string | Traffic source | `'google'`, `'facebook'`, `'direct'` |
| `utm_medium` | string | Marketing medium | `'cpc'`, `'social'`, `'email'` |
| `utm_campaign` | string | Campaign name | `'italy_trip_2024'` |
| `fb_browser_id` | string | Facebook browser ID | `'_fbp_value'` |
| `fb_click_id` | string | Facebook click ID | `'_fbc_value'` |

### Device and Browser Fields
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `screen_width` | number | Screen width in pixels | `1920` |
| `screen_height` | number | Screen height in pixels | `1080` |
| `device_vendor` | string | Device manufacturer | `'Apple'`, `'Samsung'` |
| `operating_system` | string | Operating system | `'macOS'`, `'Windows'`, `'iOS'` |
| `browser` | string | Browser name | `'Chrome'`, `'Safari'`, `'Firefox'` |

## Enhanced Ecommerce Implementation

The tracking includes Google Analytics 4 Enhanced Ecommerce events:

### Purchase Event Structure
```javascript
{
  event: 'purchase',
  ecommerce: {
    transaction_id: 'unique-transaction-id',
    value: 10, // Total value
    currency: 'SAR',
    items: [{
      item_id: 'product-id',
      item_name: 'Product Name',
      item_category: 'Category',
      item_variant: 'Variant',
      price: 10,
      quantity: 1
    }]
  }
}
```

## Testing and Debugging

### Browser Console Testing
```javascript
// View all dataLayer events
console.log(window.dataLayer);

// Monitor new events
window.dataLayer.push = function() {
  console.log('New DataLayer Event:', arguments[0]);
  return Array.prototype.push.apply(window.dataLayer, arguments);
};
```

### GTM Preview Mode
1. Open GTM container
2. Click "Preview" button
3. Enter your website URL
4. Submit a form and verify events appear in the preview

### Test Script
Run the automated test script:
```bash
node scripts/test-gtm-tracking.js
```

## Privacy and Compliance

### PII Data Handling
- **Encrypted PII in dataLayer**: User emails, names, and phone numbers are SHA-256 hashed before being sent to dataLayer
- **No plain text PII**: Raw personal information is never sent to GTM or Google Analytics
- **Hashed IDs only**: Only external_id and lead_event_id are sent in plain text for tracking purposes
- **Nationality tracking**: Only general nationality status (citizen/resident) is tracked

### Encryption Details
- **Algorithm**: SHA-256 hashing
- **Data processed**: Email addresses, phone numbers, and full names
- **Format**: Lowercase and trimmed before hashing
- **Purpose**: Enables advanced matching while maintaining privacy compliance

### Encrypted Fields in DataLayer
| Field | Description | Example |
|-------|-------------|---------|
| `encrypted_email` | SHA-256 hash of user email | `a1b2c3d4e5f6...` |
| `encrypted_phone` | SHA-256 hash of user phone (digits only) | `f6e5d4c3b2a1...` |
| `encrypted_name` | SHA-256 hash of user full name | `123456789abc...` |

### GDPR Compliance
- All tracking respects user consent preferences
- Encrypted data can be filtered or blocked based on consent status
- No cross-site tracking without consent
- Data minimization through hashing ensures privacy protection

## Integration with Other Platforms

### Facebook Pixel
- Events are synchronized with Facebook Pixel using matching `event_id`
- Prevents duplicate event counting between platforms

### Google Analytics 4
- Enhanced Ecommerce events are compatible with GA4
- Conversion tracking aligns with GA4 goals and events

### Zapier Webhooks
- DataLayer events complement (not replace) Zapier data collection
- Both systems track the same form submissions independently

## Troubleshooting

### Common Issues
1. **Events not appearing**: Check GTM container is published
2. **Missing data**: Verify form submission completes successfully
3. **Duplicate events**: Check for multiple GTM containers

### Debug Mode
Enable debug logging in development:
```javascript
// In gtm.js
const DEBUG = process.env.NODE_ENV === 'development';
if (DEBUG) console.log('GTM Event:', eventData);
```

## Persistent User Identification System

### Overview

The website now includes a comprehensive persistent user identification system that stores user data across visits and recognizes returning users. This system enhances all dataLayer events with persistent user information while maintaining privacy compliance through encryption.

### Key Features

- **Persistent User ID**: Each user gets a unique, persistent identifier that survives across sessions
- **Encrypted Data Storage**: All PII (email, phone, name) is SHA-256 hashed before storage
- **Visit Tracking**: Complete history of user visits and interactions
- **Form Submission History**: Track all form submissions with metadata
- **Interest Tracking**: Automatically infer user interests from page visits
- **Device Fingerprinting**: Generate unique device signatures for better identification
- **GDPR Compliance**: Full data export and deletion capabilities

### Enhanced DataLayer Events

All GTM events now include additional persistent user data:

```javascript
{
  event: 'conversion',
  // ... existing event data ...
  
  // Persistent user identification
  persistent_user_id: 'user_abc123def456',
  is_returning_user: true,
  visit_count: 5,
  form_interactions_count: 3,
  
  // Encrypted persistent data
  persistent_encrypted_email: 'a1b2c3d4e5f6...',
  persistent_encrypted_phone: 'f6e5d4c3b2a1...',
  persistent_encrypted_name: '123456789abc...',
  
  // Behavioral data
  user_interests: ['italy', 'travel', 'cruise'],
  total_visits: 8,
  total_form_submissions: 2,
  
  // Classification data
  persistent_user_type: 'citizen',
  persistent_nationality: 'مواطن',
  preferred_language: 'ar',
  
  // Technical data
  device_fingerprint: 'fp_xyz789abc123',
  first_visit: '2024-01-15T10:00:00.000Z',
  last_visit: '2024-01-20T14:30:00.000Z',
  
  // Facebook tracking data
  persistent_fbp: '_fbp_value',
  persistent_fbc: '_fbc_value',
  
  // UTM data (latest)
  persistent_utm_source: 'google',
  persistent_utm_medium: 'cpc',
  persistent_utm_campaign: 'italy_trip_2024',
  persistent_utm_content: 'ad_variant_1',
  persistent_utm_term: 'italy travel',
  
  // Event metadata
  event_timestamp: '2024-01-20T14:35:00.000Z'
}
```

### User Identification Events

#### Initial User Identification
Fired when a user first visits or returns to the site:

```javascript
{
  event: 'user_identification',
  user_id: 'user_abc123def456',
  is_returning_user: false,
  visit_count: 1,
  first_visit: '2024-01-15T10:00:00.000Z',
  last_visit: null,
  form_interactions_count: 0,
  user_type: 'unknown',
  nationality: 'unknown',
  interests: [],
  device_fingerprint: 'fp_xyz789abc123',
  timestamp: '2024-01-15T10:00:00.000Z'
}
```

#### User Profile Update
Fired when user profile data is updated (e.g., after form submission):

```javascript
{
  event: 'user_profile_update',
  user_id: 'user_abc123def456',
  has_email: true,
  has_phone: true,
  has_name: true,
  form_interactions_count: 1,
  user_type: 'citizen',
  nationality: 'مواطن',
  interests: ['italy', 'travel'],
  last_updated: '2024-01-15T10:30:00.000Z',
  timestamp: '2024-01-15T10:30:00.000Z'
}
```

### Storage Structure

The system uses localStorage with the following keys:

| Key | Description | Data Type |
|-----|-------------|-----------|
| `madarat_user_id` | Persistent user identifier | String |
| `madarat_user_profile` | Encrypted user profile data | JSON Object |
| `madarat_visit_history` | Array of visit records | JSON Array |
| `madarat_form_submissions` | Array of form submission records | JSON Array |
| `madarat_tracking_data` | Additional tracking metadata | JSON Object |
| `madarat_last_visit` | Timestamp of last visit | ISO String |
| `madarat_visit_count` | Total number of visits | Number |
| `madarat_first_visit` | Timestamp of first visit | ISO String |

### User Profile Data Structure

```javascript
{
  lastUpdated: '2024-01-15T10:30:00.000Z',
  
  // Encrypted PII (SHA-256 hashed)
  encrypted_email: 'a1b2c3d4e5f6...',
  encrypted_phone: 'f6e5d4c3b2a1...',
  encrypted_name: '123456789abc...',
  
  // Classification data
  nationality: 'مواطن',
  user_type: 'citizen',
  preferred_language: 'ar',
  
  // Behavioral data
  form_interactions: 3,
  last_form_submission: '2024-01-15T10:30:00.000Z',
  interests: ['italy', 'travel', 'cruise'],
  
  // Technical data
  device_fingerprint: 'fp_xyz789abc123'
}
```

### Visit History Structure

```javascript
[
  {
    timestamp: '2024-01-15T10:00:00.000Z',
    url: 'https://madaratalkon.com/italy-trip',
    referrer: 'https://google.com',
    userAgent: 'Mozilla/5.0...',
    visitNumber: 1
  },
  // ... more visits
]
```

### Form Submission History Structure

```javascript
[
  {
    timestamp: '2024-01-15T10:30:00.000Z',
    form_name: 'trip_form',
    page_url: 'https://madaratalkon.com/italy-trip',
    external_id: 'uuid-external-id',
    event_id: 'uuid-event-id',
    nationality: 'مواطن',
    user_type: 'citizen',
    conversion_value: 10,
    trip_destination: 'italy'
  },
  // ... more submissions
]
```

### API Functions

#### Initialization
```javascript
import { initializeUserTracking } from '@/utils/userIdentification';

// Initialize the system (auto-called on import)
await initializeUserTracking();
```

#### Save User Profile
```javascript
import { saveUserProfile } from '@/utils/userIdentification';

await saveUserProfile({
  email: 'user@example.com',
  phone: '0501234567',
  name: 'John Doe',
  nationality: 'مواطن',
  user_type: 'citizen',
  form_submission: true,
  form_name: 'trip_form',
  external_id: 'uuid-external-id',
  event_id: 'uuid-event-id',
  conversion_value: 10,
  trip_destination: 'italy'
});
```

#### Get User Data
```javascript
import { getUserTrackingData } from '@/utils/userIdentification';

const userData = await getUserTrackingData();
console.log(userData);
```

#### Check User Criteria
```javascript
import { matchesUserCriteria } from '@/utils/userIdentification';

const isTargetUser = matchesUserCriteria({
  min_visits: 2,
  user_type: 'citizen',
  interests: ['italy', 'travel']
});
```

#### Data Management
```javascript
import { exportUserData, clearAllUserData } from '@/utils/userIdentification';

// Export all user data (GDPR compliance)
const exportedData = exportUserData();

// Clear all user data
clearAllUserData();
```

### User Data Dashboard

A comprehensive dashboard component is available to view and manage user data:

```javascript
import UserDataDashboard from '@/components/UserDataDashboard';

// Use in any page or component
<UserDataDashboard />
```

The dashboard includes:
- **Overview**: Basic user information and statistics
- **Encrypted Data**: View encrypted PII data (hashed)
- **Behavioral Data**: User behavior and interests
- **Tracking Data**: Facebook and UTM tracking information
- **Form Submissions**: History of all form submissions
- **Visit History**: Complete visit tracking
- **Data Export**: Download all user data as JSON
- **Data Clearing**: Remove all stored data

### Privacy and Compliance

#### Data Encryption
- All PII is SHA-256 hashed before storage
- Original data is never stored in localStorage
- Hashing is consistent for matching purposes

#### GDPR Compliance
- **Right to Access**: Full data export functionality
- **Right to Erasure**: Complete data deletion
- **Data Minimization**: Only necessary data is stored
- **Purpose Limitation**: Data used only for tracking and analytics

#### Data Retention
- Visit history: Last 50 visits
- Form submissions: Last 20 submissions
- User profile: Persistent until manually cleared
- Interests: Last 10 interests

### Integration with Existing Systems

#### GTM Enhancement
All existing GTM events are automatically enhanced with persistent user data without requiring code changes.

#### Facebook Pixel
Persistent user data improves Facebook's advanced matching capabilities.

#### Analytics Platforms
Enhanced user identification improves attribution and user journey tracking.

### Benefits

1. **Better User Recognition**: Identify returning users across sessions
2. **Enhanced Attribution**: Improved conversion attribution and user journey tracking
3. **Personalization**: Enable personalized experiences based on user history
4. **Privacy Compliance**: GDPR-compliant data handling with encryption
5. **Analytics Enhancement**: Richer data for analytics and optimization
6. **Cross-Session Tracking**: Maintain user context across multiple visits
7. **Interest Targeting**: Automatic interest inference for better targeting

### Implementation Notes

- System auto-initializes on page load
- All existing tracking continues to work unchanged
- Backward compatible with existing implementations
- No server-side storage required
- Works entirely in the browser with localStorage

// ... existing documentation continues ... 