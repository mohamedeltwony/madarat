/**
 * Enhanced Phone Validation Utility
 * Handles edge cases from Snapchat ads and other traffic sources
 */

// Enhanced phone validation regex that handles more edge cases
export const PHONE_REGEX = /^(0|5|966)([0-9]{8,12})$/;

// Alternative regex for international formats
export const INTERNATIONAL_PHONE_REGEX = /^(\+?966|0)?[5][0-9]{8}$/;

/**
 * Validates Saudi phone numbers with enhanced logic
 * @param {string} phone - Phone number to validate
 * @param {boolean} allowInternational - Whether to allow international format
 * @returns {boolean} - Whether the phone number is valid
 */
export function validateSaudiPhone(phone, allowInternational = true) {
  if (!phone || typeof phone !== 'string') return false;
  
  // Clean the phone number
  const cleanPhone = phone.trim().replace(/\s+/g, '');
  
  // Handle empty string
  if (cleanPhone === '') return false;
  
  // Primary validation with existing regex
  if (PHONE_REGEX.test(cleanPhone)) return true;
  
  // Secondary validation for international formats (if enabled)
  if (allowInternational && INTERNATIONAL_PHONE_REGEX.test(cleanPhone)) return true;
  
  // Additional validation for edge cases from ads
  const numbersOnly = cleanPhone.replace(/[^0-9]/g, '');
  
  // Check for valid Saudi mobile patterns
  if (numbersOnly.length === 9 && numbersOnly.startsWith('5')) return true;
  if (numbersOnly.length === 10 && numbersOnly.startsWith('05')) return true;
  if (numbersOnly.length === 12 && numbersOnly.startsWith('966') && numbersOnly.substring(3).startsWith('5')) return true;
  if (numbersOnly.length === 13 && numbersOnly.startsWith('+966') && numbersOnly.substring(4).startsWith('5')) return true;
  
  return false;
}

/**
 * Normalizes phone number to consistent format
 * @param {string} phone - Phone number to normalize
 * @returns {string} - Normalized phone number
 */
export function normalizePhoneNumber(phone) {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const numbersOnly = phone.replace(/[^0-9]/g, '');
  
  // Handle different formats
  if (numbersOnly.startsWith('966') && numbersOnly.length >= 12) {
    // International format: 966xxxxxxxxx -> 0xxxxxxxxx
    return '0' + numbersOnly.substring(3);
  } else if (numbersOnly.startsWith('5') && numbersOnly.length === 9) {
    // Mobile format: 5xxxxxxxx -> 05xxxxxxxx
    return '0' + numbersOnly;
  } else if (numbersOnly.startsWith('05') && numbersOnly.length === 10) {
    // Already in correct format
    return numbersOnly;
  }
  
  return numbersOnly;
}

/**
 * Detects if user is coming from Snapchat
 * @returns {boolean} - Whether user is from Snapchat
 */
export function isSnapchatTraffic() {
  if (typeof window === 'undefined') return false;
  
  try {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('sc_click_id') || urlParams.get('snapchat_click_id')) return true;
    
    // Check referrer
    const referrer = document.referrer || '';
    if (referrer.includes('snapchat.com') || referrer.includes('sc-static.net')) return true;
    
    // Check user agent for Snapchat app
    const userAgent = navigator.userAgent || '';
    if (userAgent.includes('Snapchat') || userAgent.includes('SNAP')) return true;
    
    // Check UTM source
    if (urlParams.get('utm_source') === 'snapchat' || urlParams.get('utm_medium') === 'snapchat') return true;
    
    return false;
  } catch (error) {
    console.warn('Error detecting Snapchat traffic:', error);
    return false;
  }
}

/**
 * Enhanced phone input handler that works better with Snapchat traffic
 * @param {string} value - Input value
 * @param {Function} setIsPhoneValid - Function to set phone validity
 * @param {Function} setPhoneTouched - Function to set phone touched state
 * @param {boolean} forceValidation - Whether to force validation even if not touched
 * @returns {boolean} - Whether the phone is valid
 */
export function handlePhoneInput(value, setIsPhoneValid, setPhoneTouched, forceValidation = false) {
  const isFromSnapchat = isSnapchatTraffic();
  
  // Set touched state
  if (setPhoneTouched) {
    setPhoneTouched(true);
  }
  
  // Enhanced validation for Snapchat traffic
  const isValid = validateSaudiPhone(value, isFromSnapchat);
  
  if (setIsPhoneValid) {
    setIsPhoneValid(isValid);
  }
  
  // Log for debugging Snapchat issues
  if (isFromSnapchat) {
    console.log('Snapchat phone validation:', {
      input: value,
      normalized: normalizePhoneNumber(value),
      isValid: isValid,
      userAgent: navigator.userAgent
    });
  }
  
  return isValid;
}

/**
 * Checks if phone number might be auto-populated from URL
 * @returns {string|null} - Phone number from URL or null
 */
export function getPhoneFromURL() {
  if (typeof window === 'undefined') return null;
  
  try {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('phone') || urlParams.get('phoneNumber') || urlParams.get('mobile');
  } catch (error) {
    console.warn('Error getting phone from URL:', error);
    return null;
  }
}

/**
 * Debounced validation function for better performance
 * @param {Function} validationFn - Validation function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounceValidation(validationFn, delay = 300) {
  let timeoutId;
  
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => validationFn.apply(this, args), delay);
  };
} 