/**
 * Test Script for Snapchat CUSTOM_EVENT_1 Integration on Citizen Thank You Page
 * 
 * This script tests the Snapchat pixel integration by simulating
 * a citizen thank you page visit with various user data scenarios.
 */

// Test data scenarios
const testScenarios = [
  {
    name: "Complete User Data",
    queryParams: {
      phone: "0555123456",
      email: "ahmed.citizen@gmail.com", 
      firstName: "أحمد",
      lastName: "السعودي",
      external_id: "citizen_test_001",
      eventId: "test_event_123",
      nationality: "مواطن"
    }
  },
  {
    name: "Phone Only",
    queryParams: {
      phone: "966555789123",
      external_id: "citizen_test_002", 
      eventId: "test_event_456",
      nationality: "مواطن"
    }
  },
  {
    name: "Email Only",
    queryParams: {
      email: "sarah.citizen@yahoo.com",
      external_id: "citizen_test_003",
      eventId: "test_event_789", 
      nationality: "مواطن"
    }
  }
];

function testSnapchatIntegration() {
  console.log("🧪 Testing Snapchat CUSTOM_EVENT_1 Integration on Citizen Thank You Page");
  console.log("=" .repeat(80));
  
  // Check if Snapchat pixel is loaded
  if (typeof window.snaptr === 'undefined') {
    console.error("❌ Snapchat pixel not loaded! Make sure the pixel code is in _document.js");
    return;
  }
  
  console.log("✅ Snapchat pixel detected");
  
  testScenarios.forEach((scenario, index) => {
    console.log(`\n🎯 Test ${index + 1}: ${scenario.name}`);
    console.log("-".repeat(50));
    
    try {
      // Simulate the conversion tracking logic
      const mockUserData = scenario.queryParams;
      
      // Prepare Snapchat data (simulating the same logic as in thank-you-citizen.js)
      const snapchatData = {
        uuid_c1: mockUserData.external_id || `citizen_test_${Date.now()}`,
        transaction_id: mockUserData.eventId || `tx_test_${Date.now()}`,
        item_ids: ['citizenship_service', 'travel_consultation'],
        data_use: 'marketing',
        user_email: mockUserData.email || null,
        user_phone_number: mockUserData.phone ? mockUserData.phone.replace(/\D/g, '') : null,
        firstname: mockUserData.firstName || null,
        lastname: mockUserData.lastName || null,
        geo_city: 'Riyadh',
        geo_country: 'SA',
        geo_region: 'Riyadh',
        currency: 'SAR',
        price: '10.00',
        item_category: 'citizenship_services'
      };
      
      // Clean up null values
      Object.keys(snapchatData).forEach(key => {
        if (snapchatData[key] === null || snapchatData[key] === undefined) {
          delete snapchatData[key];
        }
      });
      
      // Track the event
      window.snaptr('track', 'CUSTOM_EVENT_1', snapchatData);
      
      console.log("📤 Snapchat CUSTOM_EVENT_1 fired with data:", {
        uuid_c1: snapchatData.uuid_c1,
        transaction_id: snapchatData.transaction_id,
        has_email: !!snapchatData.user_email,
        has_phone: !!snapchatData.user_phone_number,
        has_name: !!(snapchatData.firstname || snapchatData.lastname),
        item_category: snapchatData.item_category,
        price: snapchatData.price,
        currency: snapchatData.currency
      });
      
      console.log("✅ Test passed successfully");
      
    } catch (error) {
      console.error(`❌ Test failed:`, error);
    }
  });
  
  console.log("\n" + "=".repeat(80));
  console.log("🏁 Testing complete! Check the Snapchat Events Manager to verify events.");
  console.log("📊 Expected events: 3 CUSTOM_EVENT_1 events with different user data");
  console.log("🔗 Snapchat Events Manager: https://ads.snapchat.com/manager/events");
}

// Auto-run test after 2 seconds to allow pixel to load
setTimeout(() => {
  testSnapchatIntegration();
}, 2000);

// Also expose the test function globally for manual testing
window.testSnapchatCitizenIntegration = testSnapchatIntegration;

console.log("🚀 Snapchat Citizen Test Script Loaded");
console.log("Run testSnapchatCitizenIntegration() manually anytime to test"); 