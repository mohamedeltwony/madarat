// User Identification and Persistent DataLayer Management
// This utility manages persistent user identification across visits

// Helper function to hash data using SHA-256
async function sha256(str) {
  if (!str || typeof str !== 'string') return null;
  try {
    const buffer = new TextEncoder().encode(str.toLowerCase().trim());
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    console.error('SHA-256 Hashing Error:', error);
    return null;
  }
}

// Generate a persistent user ID
function generatePersistentUserId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const screen = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '';
  
  // Create a semi-unique fingerprint
  const fingerprint = btoa(`${userAgent}_${screen}_${timestamp}_${random}`).substring(0, 32);
  return `user_${fingerprint}`;
}

// Storage keys
const STORAGE_KEYS = {
  USER_ID: 'madarat_user_id',
  USER_PROFILE: 'madarat_user_profile',
  VISIT_HISTORY: 'madarat_visit_history',
  FORM_SUBMISSIONS: 'madarat_form_submissions',
  TRACKING_DATA: 'madarat_tracking_data',
  LAST_VISIT: 'madarat_last_visit',
  VISIT_COUNT: 'madarat_visit_count',
  FIRST_VISIT: 'madarat_first_visit'
};

// User Profile Management
export class UserIdentificationManager {
  constructor() {
    this.userId = null;
    this.userProfile = null;
    this.isReturningUser = false;
    this.visitCount = 0;
    this.initialized = false;
  }

  // Initialize the user identification system
  async initialize() {
    if (typeof window === 'undefined') return;
    
    try {
      // Get or create persistent user ID
      this.userId = localStorage.getItem(STORAGE_KEYS.USER_ID);
      if (!this.userId) {
        this.userId = generatePersistentUserId();
        localStorage.setItem(STORAGE_KEYS.USER_ID, this.userId);
        localStorage.setItem(STORAGE_KEYS.FIRST_VISIT, new Date().toISOString());
        this.isReturningUser = false;
      } else {
        this.isReturningUser = true;
      }

      // Load existing user profile
      const storedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      this.userProfile = storedProfile ? JSON.parse(storedProfile) : {};

      // Update visit tracking
      this.updateVisitTracking();

      // Load tracking data
      this.loadTrackingData();

      this.initialized = true;
      console.log('User Identification Manager initialized:', {
        userId: this.userId,
        isReturningUser: this.isReturningUser,
        visitCount: this.visitCount
      });

      // Push initial identification to dataLayer
      this.pushIdentificationToDataLayer();

    } catch (error) {
      console.error('Error initializing User Identification Manager:', error);
    }
  }

  // Update visit tracking
  updateVisitTracking() {
    const now = new Date().toISOString();
    const lastVisit = localStorage.getItem(STORAGE_KEYS.LAST_VISIT);
    const visitCount = parseInt(localStorage.getItem(STORAGE_KEYS.VISIT_COUNT) || '0');
    
    // Update visit count
    this.visitCount = visitCount + 1;
    localStorage.setItem(STORAGE_KEYS.VISIT_COUNT, this.visitCount.toString());
    localStorage.setItem(STORAGE_KEYS.LAST_VISIT, now);

    // Store visit history
    const visitHistory = this.getVisitHistory();
    visitHistory.push({
      timestamp: now,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      visitNumber: this.visitCount
    });

    // Keep only last 50 visits
    if (visitHistory.length > 50) {
      visitHistory.splice(0, visitHistory.length - 50);
    }

    localStorage.setItem(STORAGE_KEYS.VISIT_HISTORY, JSON.stringify(visitHistory));
  }

  // Get visit history
  getVisitHistory() {
    try {
      const history = localStorage.getItem(STORAGE_KEYS.VISIT_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error loading visit history:', error);
      return [];
    }
  }

  // Load existing tracking data
  loadTrackingData() {
    try {
      const trackingData = localStorage.getItem(STORAGE_KEYS.TRACKING_DATA);
      return trackingData ? JSON.parse(trackingData) : {};
    } catch (error) {
      console.error('Error loading tracking data:', error);
      return {};
    }
  }

  // Save user profile data (encrypted)
  async saveUserProfile(userData) {
    if (!userData || typeof userData !== 'object') return;

    try {
      // Encrypt sensitive data
      const encryptedProfile = {
        ...this.userProfile,
        lastUpdated: new Date().toISOString(),
        // Store encrypted versions of PII
        encrypted_email: userData.email ? await sha256(userData.email) : this.userProfile.encrypted_email,
        encrypted_phone: userData.phone ? await sha256(userData.phone.replace(/\D/g, '')) : this.userProfile.encrypted_phone,
        encrypted_name: userData.name ? await sha256(userData.name) : this.userProfile.encrypted_name,
        // Store non-PII data in plain text
        nationality: userData.nationality || this.userProfile.nationality,
        user_type: userData.user_type || this.userProfile.user_type,
        preferred_language: userData.preferred_language || this.userProfile.preferred_language || 'ar',
        // Track form interactions
        form_interactions: this.userProfile.form_interactions || 0,
        last_form_submission: userData.form_submission ? new Date().toISOString() : this.userProfile.last_form_submission,
        // Track interests based on pages visited
        interests: this.updateInterests(userData.interests || []),
        // Device and browser fingerprint
        device_fingerprint: this.generateDeviceFingerprint()
      };

      // Increment form interactions if this is a form submission
      if (userData.form_submission) {
        encryptedProfile.form_interactions = (this.userProfile.form_interactions || 0) + 1;
      }

      this.userProfile = encryptedProfile;
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(encryptedProfile));

      // Also save form submission history
      if (userData.form_submission) {
        this.saveFormSubmission(userData);
      }

      console.log('User profile updated:', {
        userId: this.userId,
        hasEmail: !!encryptedProfile.encrypted_email,
        hasPhone: !!encryptedProfile.encrypted_phone,
        hasName: !!encryptedProfile.encrypted_name,
        formInteractions: encryptedProfile.form_interactions
      });

      // Push updated profile to dataLayer
      this.pushProfileUpdateToDataLayer();

    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  }

  // Save form submission history
  saveFormSubmission(submissionData) {
    try {
      const submissions = this.getFormSubmissions();
      const submission = {
        timestamp: new Date().toISOString(),
        form_name: submissionData.form_name,
        page_url: window.location.href,
        external_id: submissionData.external_id,
        event_id: submissionData.event_id,
        nationality: submissionData.nationality,
        user_type: submissionData.user_type,
        conversion_value: submissionData.conversion_value,
        trip_destination: submissionData.trip_destination
      };

      submissions.push(submission);

      // Keep only last 20 submissions
      if (submissions.length > 20) {
        submissions.splice(0, submissions.length - 20);
      }

      localStorage.setItem(STORAGE_KEYS.FORM_SUBMISSIONS, JSON.stringify(submissions));
    } catch (error) {
      console.error('Error saving form submission:', error);
    }
  }

  // Get form submission history
  getFormSubmissions() {
    try {
      const submissions = localStorage.getItem(STORAGE_KEYS.FORM_SUBMISSIONS);
      return submissions ? JSON.parse(submissions) : [];
    } catch (error) {
      console.error('Error loading form submissions:', error);
      return [];
    }
  }

  // Update user interests based on page visits
  updateInterests(newInterests = []) {
    const currentInterests = this.userProfile.interests || [];
    const currentPage = window.location.pathname;
    
    // Infer interests from page visits
    const pageInterests = [];
    if (currentPage.includes('italy')) pageInterests.push('italy');
    if (currentPage.includes('london') || currentPage.includes('scotland')) pageInterests.push('uk');
    if (currentPage.includes('cruise')) pageInterests.push('cruise');
    if (currentPage.includes('trip')) pageInterests.push('travel');

    // Combine and deduplicate interests
    const allInterests = [...new Set([...currentInterests, ...newInterests, ...pageInterests])];
    
    // Keep only last 10 interests
    return allInterests.slice(-10);
  }

  // Generate device fingerprint
  generateDeviceFingerprint() {
    if (typeof window === 'undefined') return null;

    try {
      const fingerprint = {
        screen: `${window.screen.width}x${window.screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        timestamp: new Date().toISOString()
      };

      return btoa(JSON.stringify(fingerprint)).substring(0, 32);
    } catch (error) {
      console.error('Error generating device fingerprint:', error);
      return null;
    }
  }

  // Push initial identification to dataLayer
  pushIdentificationToDataLayer() {
    if (typeof window === 'undefined' || !window.dataLayer) return;

    const identificationData = {
      event: 'user_identification',
      user_id: this.userId,
      is_returning_user: this.isReturningUser,
      visit_count: this.visitCount,
      first_visit: localStorage.getItem(STORAGE_KEYS.FIRST_VISIT),
      last_visit: localStorage.getItem(STORAGE_KEYS.LAST_VISIT),
      form_interactions_count: this.userProfile.form_interactions || 0,
      user_type: this.userProfile.user_type || 'unknown',
      nationality: this.userProfile.nationality || 'unknown',
      interests: this.userProfile.interests || [],
      device_fingerprint: this.userProfile.device_fingerprint,
      timestamp: new Date().toISOString()
    };

    window.dataLayer.push(identificationData);
    console.log('User identification pushed to dataLayer:', identificationData);
  }

  // Push profile update to dataLayer
  pushProfileUpdateToDataLayer() {
    if (typeof window === 'undefined' || !window.dataLayer) return;

    const updateData = {
      event: 'user_profile_update',
      user_id: this.userId,
      has_email: !!this.userProfile.encrypted_email,
      has_phone: !!this.userProfile.encrypted_phone,
      has_name: !!this.userProfile.encrypted_name,
      form_interactions_count: this.userProfile.form_interactions || 0,
      user_type: this.userProfile.user_type || 'unknown',
      nationality: this.userProfile.nationality || 'unknown',
      interests: this.userProfile.interests || [],
      last_updated: this.userProfile.lastUpdated,
      timestamp: new Date().toISOString()
    };

    window.dataLayer.push(updateData);
    console.log('User profile update pushed to dataLayer:', updateData);
  }

  // Get comprehensive user data for tracking
  async getUserDataForTracking() {
    if (!this.initialized) {
      await this.initialize();
    }

    const trackingData = this.loadTrackingData();
    const visitHistory = this.getVisitHistory();
    const formSubmissions = this.getFormSubmissions();

    return {
      // User identification
      user_id: this.userId,
      is_returning_user: this.isReturningUser,
      visit_count: this.visitCount,
      
      // Profile data (encrypted)
      encrypted_email: this.userProfile.encrypted_email,
      encrypted_phone: this.userProfile.encrypted_phone,
      encrypted_name: this.userProfile.encrypted_name,
      
      // Behavioral data
      form_interactions_count: this.userProfile.form_interactions || 0,
      last_form_submission: this.userProfile.last_form_submission,
      interests: this.userProfile.interests || [],
      
      // Classification data
      user_type: this.userProfile.user_type,
      nationality: this.userProfile.nationality,
      preferred_language: this.userProfile.preferred_language || 'ar',
      
      // Technical data
      device_fingerprint: this.userProfile.device_fingerprint,
      
      // Visit data
      first_visit: localStorage.getItem(STORAGE_KEYS.FIRST_VISIT),
      last_visit: localStorage.getItem(STORAGE_KEYS.LAST_VISIT),
      current_session_start: new Date().toISOString(),
      
      // Historical data counts
      total_visits: visitHistory.length,
      total_form_submissions: formSubmissions.length,
      
      // Facebook tracking data
      fbp: localStorage.getItem('_fbp'),
      fbc: localStorage.getItem('_fbc'),
      
      // UTM data (latest)
      utm_source: localStorage.getItem('utm_source'),
      utm_medium: localStorage.getItem('utm_medium'),
      utm_campaign: localStorage.getItem('utm_campaign'),
      utm_content: localStorage.getItem('utm_content'),
      utm_term: localStorage.getItem('utm_term')
    };
  }

  // Check if user matches criteria (for targeting)
  matchesUserCriteria(criteria) {
    if (!criteria || typeof criteria !== 'object') return false;

    // Check visit count
    if (criteria.min_visits && this.visitCount < criteria.min_visits) return false;
    if (criteria.max_visits && this.visitCount > criteria.max_visits) return false;

    // Check user type
    if (criteria.user_type && this.userProfile.user_type !== criteria.user_type) return false;

    // Check nationality
    if (criteria.nationality && this.userProfile.nationality !== criteria.nationality) return false;

    // Check form interactions
    const formInteractions = this.userProfile.form_interactions || 0;
    if (criteria.min_form_interactions && formInteractions < criteria.min_form_interactions) return false;

    // Check interests
    if (criteria.interests && criteria.interests.length > 0) {
      const userInterests = this.userProfile.interests || [];
      const hasMatchingInterest = criteria.interests.some(interest => userInterests.includes(interest));
      if (!hasMatchingInterest) return false;
    }

    return true;
  }

  // Clear all user data (for privacy compliance)
  clearUserData() {
    try {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });

      // Reset instance variables
      this.userId = null;
      this.userProfile = null;
      this.isReturningUser = false;
      this.visitCount = 0;
      this.initialized = false;

      console.log('All user data cleared');

      // Push data clearing event to dataLayer
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'user_data_cleared',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }

  // Export user data (for GDPR compliance)
  exportUserData() {
    try {
      const userData = {
        user_id: this.userId,
        profile: this.userProfile,
        visit_history: this.getVisitHistory(),
        form_submissions: this.getFormSubmissions(),
        tracking_data: this.loadTrackingData(),
        exported_at: new Date().toISOString()
      };

      return userData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }
}

// Create singleton instance
export const userManager = new UserIdentificationManager();

// Convenience functions
export const initializeUserTracking = () => userManager.initialize();
export const saveUserProfile = (userData) => userManager.saveUserProfile(userData);
export const getUserTrackingData = () => userManager.getUserDataForTracking();
export const isReturningUser = () => userManager.isReturningUser;
export const getUserId = () => userManager.userId;
export const getVisitCount = () => userManager.visitCount;
export const matchesUserCriteria = (criteria) => userManager.matchesUserCriteria(criteria);
export const clearAllUserData = () => userManager.clearUserData();
export const exportUserData = () => userManager.exportUserData();

// Auto-initialize on import (client-side only)
if (typeof window !== 'undefined') {
  userManager.initialize();
} 