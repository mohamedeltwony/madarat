export default function TourOverview({ tour }) {
  // Log the raw tour data for debugging
  console.log('=== Raw Tour Data ===');
  console.log('Tour object:', tour);
  console.log('Content:', tour?.content);
  console.log('Description:', tour?.description);
  console.log('Inclusions:', tour?.inclusions);
  console.log('Exclusions:', tour?.exclusions);

  // Process the sections
  const sections = {
    description: tour?.description || '',
    inclusions: Array.isArray(tour?.inclusions) ? tour.inclusions : [],
    exclusions: Array.isArray(tour?.exclusions) ? tour.exclusions : [],
    itinerary: Array.isArray(tour?.itinerary) ? tour.itinerary : []
  };

  console.log('=== Processed Tour Sections ===');
  console.log('Sections:', sections);

  return (
    <div className="tourOverview">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {sections.description && (
              <div className="tourOverview__description">
                <h3>وصف الرحلة</h3>
                <p>{sections.description}</p>
              </div>
            )}

            {sections.inclusions.length > 0 && (
              <div className="tourOverview__inclusions">
                <h3>العرض يشمل</h3>
                <ul>
                  {sections.inclusions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {sections.exclusions.length > 0 && (
              <div className="tourOverview__exclusions">
                <h3>العرض لا يشمل</h3>
                <ul>
                  {sections.exclusions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 