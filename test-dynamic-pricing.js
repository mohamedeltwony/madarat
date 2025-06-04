/**
 * Test Script for Dynamic Pricing Integration in Snapchat Tracking
 * 
 * This script tests the dynamic pricing functionality by simulating
 * different trip page visits and thank you page conversions.
 */

// Test scenarios for dynamic pricing
const testScenarios = [
  {
    name: "London Scotland Trip - High Value",
    tripId: "london-scotland-trip",
    expectedPrice: "5900",
    expectedCurrency: "SAR",
    expectedCategory: "travel_packages",
    queryParams: {
      trip_source: "london-scotland-trip",
      phone: "0555123456",
      email: "test.london@gmail.com",
      firstName: "أحمد",
      external_id: "london_test_001"
    }
  },
  {
    name: "Georgia Trip - Medium Value",
    tripId: "georgia-trip",
    expectedPrice: "3800",
    expectedCurrency: "SAR",
    expectedCategory: "travel_packages",
    queryParams: {
      trip_source: "georgia-trip",
      phone: "0566789123",
      email: "test.georgia@gmail.com",
      firstName: "فاطمة",
      external_id: "georgia_test_002"
    }
  },
  {
    name: "International License - Service",
    tripId: "international-licence-trip",
    expectedPrice: "1200",
    expectedCurrency: "SAR",
    expectedCategory: "services",
    queryParams: {
      trip_source: "international-licence-trip",
      phone: "0577456789",
      email: "test.license@gmail.com",
      firstName: "محمد",
      external_id: "license_test_003"
    }
  },
  {
    name: "Russia Trip - Premium Value",
    tripId: "russia-trip",
    expectedPrice: "8900",
    expectedCurrency: "SAR",
    expectedCategory: "travel_packages",
    queryParams: {
      trip_source: "russia-trip",
      phone: "0588123456",
      email: "test.russia@gmail.com",
      firstName: "خالد",
      external_id: "russia_test_004"
    }
  },
  {
    name: "No Trip Source - Default",
    tripId: null,
    expectedPrice: "10.00",
    expectedCurrency: "SAR",
    expectedCategory: "citizenship_services",
    queryParams: {
      phone: "0599987654",
      email: "test.default@gmail.com",
      firstName: "نورا",
      external_id: "default_test_005"
    }
  }
];

function testDynamicPricing() {
  console.log("🎯 Testing Dynamic Pricing Integration for Snapchat Tracking");
  console.log("=" .repeat(80));
  
  testScenarios.forEach((scenario, index) => {
    console.log(`\n🧪 Test ${index + 1}: ${scenario.name}`);
    console.log("-".repeat(50));
    
    try {
      // Simulate the dynamic pricing detection logic
      let mockRouter = {
        query: scenario.queryParams
      };
      
      // Mock the detectTripSource function logic
      const result = mockDetectTripSource(mockRouter, scenario.tripId);
      
      // Verify results
      const priceMatches = result.price === scenario.expectedPrice;
      const currencyMatches = result.currency === scenario.expectedCurrency;
      const categoryMatches = result.item_category === scenario.expectedCategory;
      
      console.log("📊 Expected vs Actual:");
      console.log(`   Price: ${scenario.expectedPrice} SAR → ${result.price} ${result.currency} ${priceMatches ? '✅' : '❌'}`);
      console.log(`   Category: ${scenario.expectedCategory} → ${result.item_category} ${categoryMatches ? '✅' : '❌'}`);
      console.log(`   Trip Detected: ${scenario.tripId ? 'Yes' : 'No'} → ${result.tripConfig ? 'Yes' : 'No'} ${(!!scenario.tripId === !!result.tripConfig) ? '✅' : '❌'}`);
      
      if (result.tripConfig) {
        console.log(`   Trip Name: ${result.tripConfig.name}`);
        console.log(`   Trip Destination: ${result.trip_destination}`);
        console.log(`   Item IDs: [${result.item_ids.join(', ')}]`);
      }
      
      // Mock Snapchat tracking call
      const snapchatData = {
        uuid_c1: scenario.queryParams.external_id,
        price: result.price,
        currency: result.currency,
        item_category: result.item_category,
        item_ids: result.item_ids,
        user_email: scenario.queryParams.email,
        trip_detected: !!result.tripConfig
      };
      
      console.log("📤 Mock Snapchat CUSTOM_EVENT_1 Data:");
      console.log(`   UUID: ${snapchatData.uuid_c1}`);
      console.log(`   Price: ${snapchatData.price} ${snapchatData.currency}`);
      console.log(`   Category: ${snapchatData.item_category}`);
      console.log(`   Email: ${snapchatData.user_email}`);
      
      const allTestsPassed = priceMatches && currencyMatches && categoryMatches;
      console.log(`\n${allTestsPassed ? '✅ Test PASSED' : '❌ Test FAILED'}`);
      
    } catch (error) {
      console.error(`❌ Test failed with error:`, error);
    }
  });
  
  console.log("\n" + "=".repeat(80));
  console.log("🏁 Dynamic Pricing Testing Complete!");
  console.log("💡 To test in real environment:");
  console.log("   1. Visit a trip page (e.g., /london-scotland-trip)");
  console.log("   2. Fill out the form and submit");
  console.log("   3. Check thank-you-citizen page console logs");
  console.log("   4. Verify Snapchat Events Manager for correct pricing");
}

// Mock function to simulate trip detection logic
function mockDetectTripSource(router, expectedTripId) {
  const result = {
    tripConfig: null,
    price: '10.00',
    currency: 'SAR',
    item_category: 'citizenship_services',
    item_ids: ['citizenship_service'],
    trip_destination: 'general_inquiry'
  };

  // Mock trip configurations
  const mockTripsConfig = {
    'london-scotland-trip': {
      id: 'london-scotland-trip',
      name: 'لندن واسكتلندا',
      price: 5900,
      currency: 'SAR',
      category: 'travel_packages',
      destination: 'لندن واسكتلندا'
    },
    'georgia-trip': {
      id: 'georgia-trip',
      name: 'جورجيا',
      price: 3800,
      currency: 'SAR',
      category: 'travel_packages',
      destination: 'جورجيا'
    },
    'international-licence-trip': {
      id: 'international-licence-trip',
      name: 'رخصة القيادة الدولية',
      price: 1200,
      currency: 'SAR',
      category: 'services',
      destination: 'خدمات سفر'
    },
    'russia-trip': {
      id: 'russia-trip',
      name: 'روسيا',
      price: 8900,
      currency: 'SAR',
      category: 'travel_packages',
      destination: 'روسيا'
    }
  };

  // Check URL parameters for trip source
  if (router && router.query) {
    const tripSource = router.query.trip_source || router.query.source;
    
    if (tripSource && mockTripsConfig[tripSource]) {
      const tripConfig = mockTripsConfig[tripSource];
      result.tripConfig = tripConfig;
      result.price = tripConfig.price.toString();
      result.currency = tripConfig.currency;
      result.item_category = tripConfig.category;
      result.item_ids = [tripConfig.id, tripConfig.name];
      result.trip_destination = tripConfig.destination;
    }
  }

  return result;
}

// Auto-run test after 1 second
setTimeout(() => {
  testDynamicPricing();
}, 1000);

// Also expose the test function globally for manual testing
window.testDynamicPricing = testDynamicPricing;

console.log("🚀 Dynamic Pricing Test Script Loaded");
console.log("Run testDynamicPricing() manually anytime to test"); 