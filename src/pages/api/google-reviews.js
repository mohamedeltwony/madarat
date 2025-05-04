import NodeCache from 'node-cache';

// Create a cache with a TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

// Dummy reviews data for fallback when API key is not available
const dummyReviews = [
  {
    author_name: "محمد السيد",
    profile_photo_url: "https://via.placeholder.com/50",
    rating: 5,
    relative_time_description: "قبل شهر",
    text: "تجربة رائعة مع مدارات الكون! الرحلة كانت منظمة بشكل ممتاز والخدمات فاقت توقعاتي. سأتعامل معهم مرة أخرى بالتأكيد.",
    time: Date.now() / 1000 - 3600 * 24 * 30
  },
  {
    author_name: "فاطمة أحمد",
    profile_photo_url: "https://via.placeholder.com/50",
    rating: 5,
    relative_time_description: "قبل أسبوعين",
    text: "فريق عمل محترف ومتعاون. ساعدوني في تنظيم رحلة عائلية مميزة بأفضل الأسعار. أنصح بالتعامل معهم.",
    time: Date.now() / 1000 - 3600 * 24 * 14
  },
  {
    author_name: "أحمد محمود",
    profile_photo_url: "https://via.placeholder.com/50",
    rating: 4,
    relative_time_description: "قبل 3 أشهر",
    text: "خدمة جيدة وأسعار معقولة. استمتعت برحلتي إلى تركيا مع مدارات الكون.",
    time: Date.now() / 1000 - 3600 * 24 * 90
  }
];

export default async function handler(req, res) {
  try {
    // Define a consistent cache key
    const cacheKey = 'google_reviews_data';
    
    // Check if we have cached data
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      console.log('Returning cached Google reviews data');
      return res.status(200).json(cachedData);
    }
    
    // If no cached data, fetch from Google Places API
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    
    if (!apiKey || !placeId) {
      console.log('Missing API key or Place ID. Returning dummy reviews data.');
      const dummyData = {
        reviews: dummyReviews,
        totalReviews: dummyReviews.length,
        averageRating: 4.7,
        isDummy: true
      };
      
      // Cache the dummy data
      cache.set(cacheKey, dummyData);
      
      return res.status(200).json(dummyData);
    }
    
    // Construct the URL with field masks to optimize the request
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.error('Google Places API error:', data);
      console.log('Returning dummy reviews data due to API error.');
      
      const dummyData = {
        reviews: dummyReviews,
        totalReviews: dummyReviews.length,
        averageRating: 4.7,
        isDummy: true
      };
      
      // Cache the dummy data
      cache.set(cacheKey, dummyData);
      
      return res.status(200).json(dummyData);
    }
    
    // Process the reviews
    const { result } = data;
    const allReviews = result.reviews || [];
    
    // Filter for high-rated reviews (4 stars or higher)
    const highRatedReviews = allReviews.filter(review => review.rating >= 4);
    
    // Sort by time (newest first)
    const sortedReviews = highRatedReviews.sort((a, b) => 
      new Date(b.time * 1000) - new Date(a.time * 1000)
    );
    
    // Take the top 20 reviews
    const top20Reviews = sortedReviews.slice(0, 20);
    
    // Prepare the response data
    const responseData = {
      reviews: top20Reviews,
      totalReviews: result.user_ratings_total || 0,
      averageRating: result.rating || 0,
      isDummy: false
    };
    
    // Cache the data
    cache.set(cacheKey, responseData);
    
    // Return the data
    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching Google reviews:', error);
    console.log('Returning dummy reviews data due to error.');
    
    // Use the same cache key as above
    const cacheKey = 'google_reviews_data';
    
    const dummyData = {
      reviews: dummyReviews,
      totalReviews: dummyReviews.length,
      averageRating: 4.7,
      isDummy: true
    };
    
    // Cache the dummy data
    cache.set(cacheKey, dummyData);
    
    return res.status(200).json(dummyData);
  }
}
