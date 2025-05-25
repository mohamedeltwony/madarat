# Google Tag Manager Implementation Guide

## Overview

This document outlines the implementation of Google Tag Manager (GTM) in our Next.js application following industry best practices for performance, privacy, and user experience.

## Implementation Features

### ✅ Best Practices Implemented

1. **GDPR Compliance**: Cookie consent banner with user choice
2. **Performance Optimized**: Conditional loading based on consent
3. **Privacy First**: No tracking without explicit user consent
4. **RTL Support**: Full Arabic language and RTL layout support
5. **Mobile Responsive**: Optimized for all device sizes
6. **Accessibility**: Screen reader friendly and keyboard navigation
7. **Error Handling**: Graceful fallbacks and error boundaries

## File Structure

```
src/
├── lib/
│   └── gtm.js                    # GTM utility functions
├── hooks/
│   └── use-gtm.js               # Custom GTM tracking hook
├── components/
│   └── CookieConsent/
│       ├── CookieConsent.js     # Cookie consent component
│       └── CookieConsent.module.scss # Styling
├── pages/
│   ├── _app.js                  # GTM integration in app
│   └── _document.js             # GTM noscript tag
```

## Configuration

### Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_GTM_ID=GTM-5PQ58CMB
NEXT_PUBLIC_ENVIRONMENT=production
```

### GTM Container ID

Current GTM ID: `GTM-5PQ58CMB`

## Usage Examples

### Basic Event Tracking

```javascript
import { useGTM } from '../hooks/use-gtm';

function MyComponent() {
  const { trackButton, trackForm, trackTrip } = useGTM();

  const handleButtonClick = () => {
    trackButton('cta_button', {
      button_location: 'hero_section',
      button_text: 'احجز الآن'
    });
  };

  const handleFormSubmit = (formData) => {
    trackForm('contact_form', {
      form_location: 'contact_page',
      user_type: 'new_visitor'
    });
  };

  const handleTripBooking = (tripData) => {
    trackTrip({
      tripName: 'رحلة تركيا',
      destination: 'Istanbul',
      price: '1500',
      duration: '7 days'
    });
  };

  return (
    <div>
      <button onClick={handleButtonClick}>احجز الآن</button>
      <form onSubmit={handleFormSubmit}>
        {/* form content */}
      </form>
    </div>
  );
}
```

### Advanced Event Tracking

```javascript
import { useGTM } from '../hooks/use-gtm';

function TripCard({ trip }) {
  const { 
    trackExternalLink, 
    trackSocialInteraction, 
    trackDownload 
  } = useGTM();

  const handleExternalLink = (url) => {
    trackExternalLink(url, 'Trip Details Link');
  };

  const handleSocialShare = (platform) => {
    trackSocialInteraction(platform, 'share', trip.name);
  };

  const handleBrochureDownload = () => {
    trackDownload('trip-brochure.pdf', 'pdf', '2.5MB');
  };

  return (
    <div className="trip-card">
      <h3>{trip.name}</h3>
      <button onClick={() => handleExternalLink(trip.url)}>
        عرض التفاصيل
      </button>
      <button onClick={() => handleSocialShare('facebook')}>
        مشاركة على فيسبوك
      </button>
      <button onClick={handleBrochureDownload}>
        تحميل الكتيب
      </button>
    </div>
  );
}
```

### Search Tracking

```javascript
import { useGTM } from '../hooks/use-gtm';

function SearchComponent() {
  const { trackSearchAction } = useGTM();

  const handleSearch = async (searchTerm) => {
    const results = await performSearch(searchTerm);
    
    trackSearchAction(searchTerm, results.length);
    
    return results;
  };

  return (
    <SearchForm onSearch={handleSearch} />
  );
}
```

## Available Tracking Functions

### Core Functions

| Function | Description | Parameters |
|----------|-------------|------------|
| `trackEvent` | Send custom event | `eventData` object |
| `trackForm` | Track form submission | `formName`, `additionalData` |
| `trackButton` | Track button clicks | `buttonName`, `additionalData` |
| `trackTrip` | Track trip bookings | `tripData` object |
| `trackSearchAction` | Track search queries | `searchTerm`, `resultsCount` |

### Specialized Functions

| Function | Description | Use Case |
|----------|-------------|----------|
| `trackContactForm` | Contact form submissions | Contact page, inquiry forms |
| `trackNewsletterSignup` | Newsletter subscriptions | Email signup forms |
| `trackDownload` | File downloads | Brochures, PDFs, documents |
| `trackExternalLink` | External link clicks | Partner sites, booking platforms |
| `trackSocialInteraction` | Social media actions | Shares, likes, follows |
| `trackVideo` | Video interactions | Play, pause, complete |
| `trackScrollDepth` | Page scroll tracking | User engagement metrics |
| `trackEngagement` | General engagement | Custom engagement events |

## Cookie Consent Implementation

### Features

- **GDPR Compliant**: Explicit consent required
- **User Choice**: Accept or reject cookies
- **Persistent Settings**: Remembers user choice for 1 year
- **Re-consent Option**: Users can change their mind
- **Arabic Language**: Fully localized interface

### Consent States

1. **Not Answered**: Initial state, banner shown
2. **Accepted**: GTM loads, tracking enabled
3. **Rejected**: No tracking, settings button shown

### Styling

The cookie consent banner includes:
- Modern glassmorphism design
- RTL layout support
- Mobile responsive
- Accessibility features
- Smooth animations
- Dark mode support

## Data Layer Events

### Standard Events

```javascript
// Page View
{
  event: 'page_view',
  url: 'https://example.com/page',
  page_title: 'Page Title',
  page_path: '/page',
  page_category: 'trips',
  page_type: 'listing',
  user_language: 'ar'
}

// Trip Booking
{
  event: 'trip_booking',
  trip_name: 'رحلة تركيا',
  trip_destination: 'Istanbul',
  trip_price: '1500',
  trip_duration: '7 days'
}

// Form Submission
{
  event: 'form_submit',
  form_name: 'contact_form',
  form_location: 'contact_page'
}
```

## Testing & Debugging

### GTM Preview Mode

1. Open GTM container
2. Click "Preview" button
3. Enter your website URL
4. Test events in real-time

### Browser Console

Check for GTM events:
```javascript
// View dataLayer
console.log(window.dataLayer);

// Monitor new events
window.dataLayer.push = function() {
  console.log('GTM Event:', arguments);
  return Array.prototype.push.apply(window.dataLayer, arguments);
};
```

### Chrome Extensions

Recommended extensions:
- **Google Tag Assistant**: Verify GTM implementation
- **dataLayer Inspector**: Monitor dataLayer events
- **GTM/GA Debugger**: Debug tracking issues

## Performance Considerations

### Loading Strategy

- **Conditional Loading**: Only loads with user consent
- **Async Loading**: Non-blocking script loading
- **Lazy Loading**: Deferred until user interaction
- **Error Boundaries**: Graceful failure handling

### Bundle Size Impact

- GTM library: ~28KB gzipped
- Our implementation: ~8KB additional
- Cookie consent: ~4KB additional
- Total overhead: ~40KB (acceptable for functionality)

## Privacy & Compliance

### GDPR Compliance

✅ **Explicit Consent**: Required before any tracking
✅ **Clear Information**: What cookies are used for
✅ **Easy Opt-out**: Simple rejection option
✅ **Data Retention**: 1-year cookie expiration
✅ **Re-consent**: Users can change preferences

### Data Collection

Only collected with consent:
- Page views and navigation
- Form interactions
- Button clicks
- Search queries
- Trip booking events

## Troubleshooting

### Common Issues

1. **GTM not loading**
   - Check consent status
   - Verify GTM ID in environment variables
   - Check browser console for errors

2. **Events not firing**
   - Ensure user has given consent
   - Check dataLayer in browser console
   - Verify event structure

3. **Cookie banner not showing**
   - Check if consent cookie already exists
   - Clear browser cookies for testing
   - Verify component import in _app.js

### Debug Mode

Enable debug logging:
```javascript
// Add to gtm.js
const DEBUG = process.env.NODE_ENV === 'development';

export const sendGTMEvent = (eventData) => {
  if (DEBUG) {
    console.log('GTM Event:', eventData);
  }
  
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(eventData);
  }
};
```

## Migration Notes

### From Previous Implementation

If migrating from direct gtag implementation:
1. Remove existing gtag scripts
2. Update tracking calls to use new hooks
3. Test all tracking functionality
4. Verify GTM container configuration

### Breaking Changes

- All tracking now requires user consent
- Event structure may differ from previous implementation
- Some events may need remapping in GTM

## Support & Maintenance

### Regular Tasks

- Monitor GTM container for errors
- Update tracking based on business needs
- Review consent rates and user feedback
- Test new features before deployment

### Updates

When updating GTM implementation:
1. Test in GTM preview mode
2. Verify all existing events still work
3. Update documentation
4. Deploy during low-traffic periods

## Contact

For questions about this implementation:
- Technical issues: Check browser console and GTM preview
- Business requirements: Review tracking requirements document
- Privacy concerns: Ensure GDPR compliance maintained 