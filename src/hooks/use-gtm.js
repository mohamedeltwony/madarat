import { useCallback } from 'react';
import { 
  sendGTMEvent, 
  trackFormSubmission, 
  trackButtonClick, 
  trackTripBooking, 
  trackSearch 
} from '../lib/gtm';

/**
 * Custom hook for Google Tag Manager tracking
 * Provides easy-to-use functions for tracking events
 */
export const useGTM = () => {
  // Track custom events
  const trackEvent = useCallback((eventData) => {
    sendGTMEvent(eventData);
  }, []);

  // Track form submissions
  const trackForm = useCallback((formName, additionalData = {}) => {
    trackFormSubmission(formName, additionalData);
  }, []);

  // Track button clicks
  const trackButton = useCallback((buttonName, additionalData = {}) => {
    trackButtonClick(buttonName, additionalData);
  }, []);

  // Track trip bookings
  const trackTrip = useCallback((tripData = {}) => {
    trackTripBooking(tripData);
  }, []);

  // Track search actions
  const trackSearchAction = useCallback((searchTerm, resultsCount = 0) => {
    trackSearch(searchTerm, resultsCount);
  }, []);

  // Track contact form submissions
  const trackContactForm = useCallback((formType, contactData = {}) => {
    sendGTMEvent({
      event: 'contact_form_submit',
      form_type: formType,
      contact_method: contactData.method || 'form',
      contact_subject: contactData.subject || '',
      ...contactData,
    });
  }, []);

  // Track newsletter signups
  const trackNewsletterSignup = useCallback((email, source = '') => {
    sendGTMEvent({
      event: 'newsletter_signup',
      email_provided: !!email,
      signup_source: source,
    });
  }, []);

  // Track file downloads
  const trackDownload = useCallback((fileName, fileType = '', fileSize = '') => {
    sendGTMEvent({
      event: 'file_download',
      file_name: fileName,
      file_type: fileType,
      file_size: fileSize,
    });
  }, []);

  // Track external link clicks
  const trackExternalLink = useCallback((url, linkText = '') => {
    sendGTMEvent({
      event: 'external_link_click',
      link_url: url,
      link_text: linkText,
      outbound: true,
    });
  }, []);

  // Track social media interactions
  const trackSocialInteraction = useCallback((platform, action, target = '') => {
    sendGTMEvent({
      event: 'social_interaction',
      social_platform: platform,
      social_action: action,
      social_target: target,
    });
  }, []);

  // Track video interactions
  const trackVideo = useCallback((action, videoTitle = '', videoProgress = 0) => {
    sendGTMEvent({
      event: 'video_interaction',
      video_action: action, // play, pause, complete, etc.
      video_title: videoTitle,
      video_progress: videoProgress,
    });
  }, []);

  // Track scroll depth
  const trackScrollDepth = useCallback((percentage) => {
    sendGTMEvent({
      event: 'scroll_depth',
      scroll_percentage: percentage,
      page_path: window.location.pathname,
    });
  }, []);

  // Track user engagement
  const trackEngagement = useCallback((engagementType, value = '') => {
    sendGTMEvent({
      event: 'user_engagement',
      engagement_type: engagementType,
      engagement_value: value,
      timestamp: new Date().toISOString(),
    });
  }, []);

  return {
    trackEvent,
    trackForm,
    trackButton,
    trackTrip,
    trackSearchAction,
    trackContactForm,
    trackNewsletterSignup,
    trackDownload,
    trackExternalLink,
    trackSocialInteraction,
    trackVideo,
    trackScrollDepth,
    trackEngagement,
  };
}; 