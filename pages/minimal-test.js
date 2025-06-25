import React from 'react';

export default function MinimalTest() {
  // Test trip objects - one with duration and one without
  const trips = [
    {
      id: 1,
      title: 'Trip with duration',
      duration: {
        days: 5,
        nights: 4,
        duration_unit: 'أيام',
        duration_type: 'days'
      }
    },
    {
      id: 2,
      title: 'Trip without duration',
      duration: null
    }
  ];

  // Format each trip's duration text
  const formattedTrips = trips.map(trip => {
    // Format duration with our fixed code
    let durationText = 'غير محدد';
    if (trip.duration) {
      // Safely destructure duration with defaults to prevent errors
      const { days = 0, nights = 0, duration_unit = '', duration_type = 'days' } = trip.duration || {};
      
      if (duration_type === 'days') {
        durationText = `${days} أيام`;
      } else if (duration_type === 'nights') {
        durationText = `${nights} ليالٍ`;
      } else if (duration_type === 'both') {
        durationText = `${days} أيام ${nights} ليالٍ`;
      }
    }

    return {
      ...trip,
      formattedDuration: durationText
    };
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Minimal Test Page for Trip Duration Handling</h1>
      
      {formattedTrips.map(trip => (
        <div key={trip.id} style={{ margin: '20px 0', padding: '20px', border: '1px solid #eee' }}>
          <h2>{trip.title}</h2>
          <p>Duration: {trip.formattedDuration}</p>
          <pre>
            {JSON.stringify(trip, null, 2)}
          </pre>
        </div>
      ))}
    </div>
  );
} 