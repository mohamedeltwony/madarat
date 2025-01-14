"use client";

import React, { useState, useEffect } from "react";

const parseItinerary = (contentHtml) => {
  if (!contentHtml) {
    console.log('=== RoadMap2: No content HTML provided ===');
    return [];
  }
  
  console.log('=== RoadMap2: Parsing content ===');
  console.log('Content type:', typeof contentHtml);
  console.log('Content length:', contentHtml.length);
  
  try {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentHtml;
    
    // Find all itinerary rows
    const rows = tempDiv.querySelectorAll('.itinerary-row');
    console.log('=== RoadMap2: Number of itinerary rows found:', rows.length);
    
    if (rows.length === 0) {
      console.log('=== RoadMap2: No itinerary rows found, logging full HTML ===');
      console.log(contentHtml);
      return [];
    }
    
    return parseRows(rows);
  } catch (error) {
    console.error('=== RoadMap2: Error parsing itinerary:', error);
    return [];
  }
};

const parseRows = (rows) => {
  const days = [];
  rows.forEach((row, index) => {
    const titleDiv = row.querySelector('.wte-itinerary-head-wrap .title');
    const dayMatch = titleDiv?.textContent?.trim().match(/اليوم\s*(\d+):/);
    const dayNumber = dayMatch ? dayMatch[1] : index + 1;
    
    const titleSpan = row.querySelector('.itinerary-title span');
    const title = `اليوم ${dayNumber}: ${titleSpan?.textContent?.trim() || ''}`;
    const content = row.querySelector('.itinerary-content .content')?.textContent?.trim() || '';
    
    days.push({
      title,
      content,
      icon: index === 0 ? 'icon-pin' : index === rows.length - 1 ? 'icon-flag' : ''
    });
  });
  return days;
};

export default function RoadMap2({ tour }) {
  const [activeRoadmap, setActiveRoadmap] = useState(0);
  const [days, setDays] = useState([]);
  
  useEffect(() => {
    console.log('=== Tour Data in RoadMap2 ===');
    console.log('Tour:', tour);
    
    if (!tour) {
      console.log('=== RoadMap2: No tour data available ===');
      return;
    }
    
    // Use the itinerary field directly
    const itineraryContent = tour.itinerary;
    console.log('=== RoadMap2: Itinerary Content ===');
    console.log('Type:', typeof itineraryContent);
    console.log('Content:', itineraryContent);
    
    const parsedDays = parseItinerary(itineraryContent);
    console.log('=== RoadMap2: Parsed days:', parsedDays);
    setDays(parsedDays);
  }, [tour]);

  if (!tour) {
    return <div>لا يوجد برنامج متاح</div>;
  }

  return (
    <div className="roadmap roadMap2" dir="rtl">
      {days.length > 0 ? (
        days.map((day, i) => (
          <div key={i} className="roadmap__item">
            <div
              className={`roadmap__icon ${day.icon ? 'roadmap__iconBig' : ''}`}
              onClick={() => setActiveRoadmap((pre) => (pre === i ? -1 : i))}
            >
              {day.icon && <i className={day.icon}></i>}
            </div>
            <div className="roadmap__wrap">
              <div
                className="roadmap__title"
                onClick={() => setActiveRoadmap((pre) => (pre === i ? -1 : i))}
              >
                {day.title}
              </div>
              {day.content && (
                <div
                  className={`roadmap__content ${
                    activeRoadmap === i ? "active" : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: day.content }}
                />
              )}
            </div>
          </div>
        ))
      ) : (
        <div>لا يوجد برنامج متاح</div>
      )}
    </div>
  );
}
