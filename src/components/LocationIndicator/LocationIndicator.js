// Location indicator component for forms
// Shows the detected city to users without being intrusive

import React from 'react';
import { FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { useGeolocation } from '@/hooks/useGeolocation';
import styles from './LocationIndicator.module.scss';

const LocationIndicator = ({ showInForm = false, className = '' }) => {
  const { locationData, loading, getDisplayLocation, isValidLocation } = useGeolocation();

  // Don't show anything while loading unless explicitly requested
  if (loading && !showInForm) {
    return null;
  }

  // Don't show if location detection failed and we're not in a form
  if (!isValidLocation() && !showInForm) {
    return null;
  }

  const displayLocation = getDisplayLocation();

  return (
    <div className={`${styles.locationIndicator} ${className}`}>
      <div className={styles.locationContent}>
        {loading ? (
          <>
            <FaSpinner className={`${styles.icon} ${styles.spinning}`} />
            <span className={styles.text}>جاري تحديد الموقع...</span>
          </>
        ) : (
          <>
            <FaMapMarkerAlt className={styles.icon} />
            <span className={styles.text}>
              {isValidLocation() ? displayLocation : 'موقع غير محدد'}
            </span>
          </>
        )}
      </div>
      {showInForm && (
        <div className={styles.privacy}>
          <small>نحن نستخدم عنوان IP لتحديد المدينة فقط (لا نطلب إذن الموقع)</small>
        </div>
      )}
    </div>
  );
};

export default LocationIndicator; 