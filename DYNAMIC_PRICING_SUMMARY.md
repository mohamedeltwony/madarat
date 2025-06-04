# 🎯 Dynamic Pricing Integration for Snapchat Tracking

## Overview
This implementation adds dynamic pricing detection to Snapchat CUSTOM_EVENT_1 and Google Ads conversion tracking based on the specific trip or service the user is interested in, rather than using fixed pricing values.

## ✅ Features Implemented

### 1. **Dynamic Trip Source Detection**
- **URL Parameters**: `?trip_source=london-scotland-trip`
- **Referrer Detection**: Analyzes the previous page URL to identify trip pages
- **localStorage Tracking**: Stores recent trip page visits (30-minute expiry)

### 2. **Price Range Support**
- **High-Value Trips**: Russia (8,900 SAR), Cruise (9,500 SAR)
- **Medium-Value Trips**: London Scotland (5,900 SAR), Italy (7,200 SAR)
- **Budget Trips**: Georgia (3,800 SAR), Turkey (4,500 SAR)
- **Services**: International License (1,200 SAR)
- **Default**: General inquiry (10 SAR)

### 3. **Enhanced Tracking Data**
- **Trip-Specific Categories**: `travel_packages`, `cruise_packages`, `services`
- **Dynamic Item IDs**: Trip ID + Trip name in both languages
- **Geographic Data**: Destination-specific information
- **Duration Tracking**: Trip duration in days

## 🔧 Implementation Details

### Core Functions

#### `detectTripSource(router)`
Detects the trip source using multiple methods:
1. URL parameters (`trip_source`, `source`)
2. Document referrer analysis
3. localStorage recent visits
4. Fallback to default pricing

#### `storeLastVisitedTrip(tripId)`
Stores trip page visits for later price detection:
```javascript
{
  tripId: 'london-scotland-trip',
  timestamp: 1673456789123,
  url: 'https://example.com/london-scotland-trip',
  pathname: '/london-scotland-trip'
}
```

### Integration Points

#### 1. **Trip Pages**
```javascript
// Auto-stores visit when user lands on trip page
useEffect(() => {
  storeLastVisitedTrip('london-scotland-trip');
  trackSnapchatViewContent({...});
}, []);
```

#### 2. **Thank You Page**
```javascript
// Detects trip source and uses dynamic pricing
const tripPricing = detectTripSource(router);
window.snaptr('track', 'CUSTOM_EVENT_1', {
  price: tripPricing.price,        // Dynamic: 5900 instead of 10
  currency: tripPricing.currency,  // SAR
  item_category: tripPricing.item_category,
  item_ids: tripPricing.item_ids
});
```

## 📊 Pricing Matrix

| Trip | Price (SAR) | Category | Item IDs |
|------|-------------|----------|----------|
| London Scotland | 5,900 | travel_packages | [`london-scotland-trip`, `لندن واسكتلندا`] |
| Russia | 8,900 | travel_packages | [`russia-trip`, `روسيا`] |
| Italy | 7,200 | travel_packages | [`italy-trip`, `إيطاليا`] |
| Georgia | 3,800 | travel_packages | [`georgia-trip`, `جورجيا`] |
| Turkey | 4,500 | travel_packages | [`turkey-trip`, `تركيا`] |
| Cruise | 9,500 | cruise_packages | [`cruise-italy-spain-france`, `رحلة بحرية`] |
| Int'l License | 1,200 | services | [`international-licence-trip`, `رخصة القيادة الدولية`] |
| **Default** | **10** | **citizenship_services** | **[`citizenship_service`]** |

## 🎯 Tracking Benefits

### Before (Fixed Pricing)
```javascript
// All conversions tracked as 10 SAR
snaptr('track', 'CUSTOM_EVENT_1', {
  price: '10.00',
  currency: 'SAR',
  item_category: 'citizenship_services'
});
```

### After (Dynamic Pricing)
```javascript
// London Scotland conversion tracked as 5,900 SAR
snaptr('track', 'CUSTOM_EVENT_1', {
  price: '5900',
  currency: 'SAR',
  item_category: 'travel_packages',
  trip_id: 'london-scotland-trip',
  trip_name: 'لندن واسكتلندا'
});
```

## 🧪 Testing

### Test Script: `test-dynamic-pricing.js`
- **5 Test Scenarios**: High-value, medium-value, budget, services, default
- **Mock Trip Detection**: Simulates real pricing logic
- **Verification**: Checks price, currency, category accuracy

### Manual Testing
1. Visit trip page: `/london-scotland-trip`
2. Fill out form and submit
3. Check console logs on thank-you page
4. Verify Snapchat Events Manager

## 📈 Expected Impact

### Snapchat Optimization
- **Better ROAS Calculation**: Accurate conversion values (5,900 SAR vs 10 SAR)
- **Improved Bidding**: Algorithm optimizes for higher-value trips
- **Enhanced Lookalike Audiences**: Better quality seed data

### Google Ads Enhancement
- **Smart Bidding Improvement**: Value-based bidding optimization
- **Enhanced Conversions**: Better user matching with accurate values
- **Campaign Performance**: ROI calculations based on actual trip values

## 🔍 Monitoring & Debugging

### Console Logs
```javascript
// Trip Detection
console.log('Dynamic trip pricing detected:', {
  trip_id: 'london-scotland-trip',
  trip_name: 'لندن واسكتلندا',
  price: '5900',
  currency: 'SAR'
});

// Snapchat Tracking
console.log('Snapchat CUSTOM_EVENT_1 tracked successfully with dynamic pricing:', {
  price: '5900',
  currency: 'SAR',
  trip_detected: true,
  trip_name: 'لندن واسكتلندا'
});
```

### Error Handling
- **Fallback Pricing**: Default to 10 SAR if detection fails
- **Type Safety**: String conversion for price values
- **Null Checks**: Handles missing trip configurations gracefully

## 🚀 Usage Examples

### URL Parameter Method
```
/thank-you-citizen?trip_source=london-scotland-trip&phone=555123456&email=test@example.com
```

### Referrer Method
```
User visits: /london-scotland-trip → Form submission → /thank-you-citizen
Automatic detection from document.referrer
```

### localStorage Method
```javascript
// Stored on trip page visit
localStorage.setItem('lastVisitedTrip', JSON.stringify({
  tripId: 'london-scotland-trip',
  timestamp: Date.now()
}));
```

## 🎯 Next Steps
1. **A/B Testing**: Compare performance with/without dynamic pricing
2. **Extended Integration**: Apply to other conversion events
3. **Analytics Enhancement**: Add trip-specific reporting dimensions
4. **Optimization**: Fine-tune pricing detection algorithms

---
**Note**: This implementation maintains backward compatibility with existing tracking while adding sophisticated pricing intelligence for better ad platform optimization. 