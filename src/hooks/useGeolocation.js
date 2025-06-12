// React hook for IP-based geolocation in forms
// This provides city-level location data without requiring user permissions

import { useState, useEffect } from 'react';

/**
 * Custom hook to get user location based on IP address
 * @returns {Object} Location data and loading state
 */
export const useGeolocation = () => {
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/get-location', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to get location: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
          setLocationData(data);
          console.log('Location data loaded:', data.displayLocation);
        } else {
          throw new Error(data.error || 'Failed to get location data');
        }

      } catch (err) {
        console.error('Error fetching location:', err);
        setError(err.message);
        // Set fallback data
        setLocationData({
          success: false,
          location: {
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            source: 'error'
          },
          displayLocation: 'موقع غير محدد'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, []);

  return {
    locationData,
    loading,
    error,
    // Helper functions
    getCity: () => locationData?.location?.city || 'Unknown',
    getCountry: () => locationData?.location?.country || 'Unknown',
    getDisplayLocation: () => locationData?.displayLocation || 'موقع غير محدد',
    isValidLocation: () => locationData?.metadata?.valid || false,
    getLocationForForm: () => ({
      client_city: locationData?.location?.city || 'Unknown',
      client_region: locationData?.location?.region || 'Unknown',
      client_country: locationData?.location?.country || 'Unknown',
      client_country_code: locationData?.location?.country_code || 'XX',
      client_latitude: locationData?.location?.latitude || null,
      client_longitude: locationData?.location?.longitude || null,
      client_timezone: locationData?.location?.timezone || 'UTC',
      client_isp: locationData?.location?.isp || 'Unknown',
      client_location_display: locationData?.displayLocation || 'موقع غير محدد',
      client_location_valid: locationData?.metadata?.valid || false,
      client_location_source: locationData?.location?.source || 'hook',
      client_local_time: locationData?.timestamps?.local || new Date().toISOString(),
      client_timezone_offset: locationData?.timestamps?.timezone || 'UTC',
    })
  };
};

/**
 * Simplified hook that just returns location data for form submissions
 * @returns {Object} Location data formatted for forms
 */
export const useLocationForForms = () => {
  const { locationData, loading, error, getLocationForForm } = useGeolocation();

  return {
    locationData: locationData?.success ? getLocationForForm() : null,
    loading,
    error,
    city: locationData?.location?.city || 'Unknown',
    country: locationData?.location?.country || 'Unknown',
    displayLocation: locationData?.displayLocation || 'موقع غير محدد'
  };
};

export default useGeolocation; 