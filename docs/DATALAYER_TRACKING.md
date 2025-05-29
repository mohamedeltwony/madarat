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
  timestamp: '2024-01-15T10:31:00.000Z'
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
  completion_time: '2024-01-15T10:31:00.000Z'
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
    lead_source: 'website'
  }
}
```

#### For Residents (`/thank-you-resident`)

Similar structure but with different values:
- `conversion_value: 8` (instead of 10)
- `user_type: 'resident'`
- `nationality: 'مقيم'`
- `lead_quality: 'medium'` (instead of 'high')
- `item_variant: 'Resident'`

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
- **No PII is sent to dataLayer**: Names, emails, and phone numbers are not included
- **Hashed IDs only**: Only external_id and lead_event_id are sent
- **Nationality tracking**: Only general nationality status (citizen/resident)

### GDPR Compliance
- All tracking respects user consent preferences
- Data can be filtered or blocked based on consent status
- No cross-site tracking without consent

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