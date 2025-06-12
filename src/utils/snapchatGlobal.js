/**
 * Global Snapchat Tracking Utilities
 * This file makes Snapchat tracking functions available on the window object for testing
 */

// Defensive imports to prevent SSR issues
let trackingFunctions = {};

try {
  if (typeof window !== 'undefined') {
    const snapchatTracking = require('./snapchatTracking');
    trackingFunctions = {
      generateSnapchatEventId: snapchatTracking.generateSnapchatEventId,
      trackSnapchatPageView: snapchatTracking.trackSnapchatPageView,
      trackSnapchatViewContent: snapchatTracking.trackSnapchatViewContent,
      trackSnapchatCustomEvent: snapchatTracking.trackSnapchatCustomEvent,
      trackSnapchatAddCart: snapchatTracking.trackSnapchatAddCart,
      trackSnapchatSignUp: snapchatTracking.trackSnapchatSignUp,
      trackSnapchatPurchase: snapchatTracking.trackSnapchatPurchase,
      sendToSnapchatCAPI: snapchatTracking.sendToSnapchatCAPI,
      prepareSnapchatUserData: snapchatTracking.prepareSnapchatUserData,
      getSnapchatTrackingParams: snapchatTracking.getSnapchatTrackingParams
    };
  }
} catch (error) {
  console.warn('Failed to load Snapchat tracking functions:', error);
  trackingFunctions = {};
}

// Make functions available globally for testing (only in browser)
if (typeof window !== 'undefined' && Object.keys(trackingFunctions).length > 0) {
  // Core tracking functions
  window.trackSnapchatPageView = trackingFunctions.trackSnapchatPageView;
  window.trackSnapchatViewContent = trackingFunctions.trackSnapchatViewContent;
  window.trackSnapchatCustomEvent = trackingFunctions.trackSnapchatCustomEvent;
  window.trackSnapchatAddCart = trackingFunctions.trackSnapchatAddCart;
  window.trackSnapchatSignUp = trackingFunctions.trackSnapchatSignUp;
  window.trackSnapchatPurchase = trackingFunctions.trackSnapchatPurchase;
  
  // Utility functions
  window.generateSnapchatEventId = trackingFunctions.generateSnapchatEventId;
  window.sendToSnapchatCAPI = trackingFunctions.sendToSnapchatCAPI;
  window.prepareSnapchatUserData = trackingFunctions.prepareSnapchatUserData;
  window.getSnapchatTrackingParams = trackingFunctions.getSnapchatTrackingParams;
  
  // Debug helper
  window.snapchatDebug = {
    listFunctions: () => {
      console.log('Available Snapchat functions:', {
        trackSnapchatPageView: typeof window.trackSnapchatPageView,
        trackSnapchatViewContent: typeof window.trackSnapchatViewContent,
        trackSnapchatCustomEvent: typeof window.trackSnapchatCustomEvent,
        trackSnapchatAddCart: typeof window.trackSnapchatAddCart,
        trackSnapchatSignUp: typeof window.trackSnapchatSignUp,
        trackSnapchatPurchase: typeof window.trackSnapchatPurchase,
        generateSnapchatEventId: typeof window.generateSnapchatEventId,
        sendToSnapchatCAPI: typeof window.sendToSnapchatCAPI,
        prepareSnapchatUserData: typeof window.prepareSnapchatUserData,
        getSnapchatTrackingParams: typeof window.getSnapchatTrackingParams
      });
    }
  };
  
  console.log('✅ Snapchat tracking functions attached to window object');
} 