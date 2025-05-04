import NodeCache from 'node-cache';

// Create a cache with a TTL of 1 hour (3600 seconds)
const cache = new NodeCache({ stdTTL: 3600 });

// Base64 encoded simple avatar image - ensures we always have a valid placeholder
const PLACEHOLDER_AVATAR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFEklEQVR4nO1ZXWhcRRT+dld3kyattOmKVRQrNbZGUx+kVsSKGlFEBBERH0TwRRQRfPBREUFFfPBJ8Ad88cUfUETEH8SnollFWmurpDVtYtJNmt1sNsnO/czDN3Nzk7vZ3exu7iIi+cJw986dM3PO+c6ZMzObwH/4dyPSg/fKAPYCeBXAThk7C+AtAF8AqOm1MsBhAOr/HB8BGOzl5j8G0Oi0+WMAqZ6pATgMoNZm8/XxYU8QABa32XjrONgTBACjTuYbHcapnt/8dQDfAfgBwAyAGwB8BWBLp8XGu0BgkfRYCWAPgDEAn3VasAQR/E8BXJKxkwCuBnAjgNsBvAzgx6ACpqFsWgHwg7iCnf98CL1rHVpjDYBBiQ9vnJHxxUQi8YuEUmUi5ZfyC3n/CyyQbgQwnkwmT+Xz+T9HR0ebiUQCPuI45vu+n8vlvBMnTizJ/HQQnQE2bLqMjXQ6nZucnPRHRkbMyMiImZiYMOl0uinzNABfnz17dplzeZ5ntRh4EsBpAF8DuM0eCJRA0sSwZVzCtxsbG2smJyctADMyMmLu379vJicnfY4Vi0VzcHBQA6gDsIuLi2pkZETJ+lrW+1LW/FrG3upIQMTMfC9J+b7vbWxsdCSg1+t6fn7eanwZwBkA9wEoEAEU6THx3DnJTRZAioJKJTCXTqe9bDZrK5WK2d7eVtvb2/b69et2YWHBVCoVUyqVbLVafURCEVXZZBZAQ8SWJB7bx8iTRDMIgVMjIyP1gYEBe/r0aXvkyBFbLBZtLpez29vbplwuK5KxQjZBBGYliJdkDonYBzxPyaFW0NUlg6QlG/kDAwP26tWrdmtry25ubiohYvL5vM1kMrZQKBghYebm5iiBVW7+MIBnAbwCYExy/Yrsj1J4OkgdOCf+tQAq4+PjPv1dKBTs5uamBaBkU7ZYLGYHB1W5XDZnzpwx4nqFYkrG3wTwDYD3AXyroA7INPoLwFoXErhfEoKam5tTruRZEJeWlpSQUScxBICrALwJ4CJv7BC4BBLZXrfQY1xbW7PuJbW+vk4XqnK5bG/dumVu3brll0olm8lkfLnD2JbJALitl2VMiXv8paUlK5mnnJgZGRlR7Ie4Kd0uZqDrQDbscy8EaoBBu7KyopeXlw0zztbWlhkbGzOXL1/Wi4uLNpvN+mfOnDFXrlzRU1NT/vz8vJmc9P3BQb9er3d9D9wmFY7U4cOHm4VC4T/jrjO3t7cdZTc2NtSpU6cUtaAkJhzwHhjvlgBdpDY2NvyNjQ2/A4G6a3xZrN1xFbqt7wnwt0e1WjXVatUvl8tWUqO9d+9eR/OOIldXV+3Vq1ftpUuX7IULF5z62TUBpkO9Xjf1el2tr6/rer3uNRoNX0m2pBro2dnZpriuIURUoVBQYtQX6fFEGAJ3GmPM+Pj4Y5VK5VGW49u3b9NddH9TgpTJ+QqA5wB8IK3fLgBfAvgIwGsAHgRwrKOQIGASExMTD2xsbDwwPT39qNRsA6Ak8XJNmo5jEqCjIQkk5E6hxZc5AK9JYJ/gRmlvMQTgWbENJANMI1O2Wq1aKV72ypUrtXQ6XZV8Xw/TyPCiYr93izQqOfFpV9vC/RDISJCNSTI4Jq5yIU3MpEshcVTcPSxtX0fsZNPK4VLyfXQRQ4Z9/XnZ9HvJZDJ/9uzZP6TH/0NuVh/A/0+tLrDZDU74DoBfO/zmviiWYcCenr/0TshNuB//6R/EHwPAC5qwRUu/AAAAAElFTkSuQmCC';

// Dummy reviews data for fallback when API key is not available
const dummyReviews = [
  {
    author_name: "محمد السيد",
    profile_photo_url: PLACEHOLDER_AVATAR,
    rating: 5,
    relative_time_description: "قبل شهر",
    text: "تجربة رائعة مع مدارات الكون! الرحلة كانت منظمة بشكل ممتاز والخدمات فاقت توقعاتي. سأتعامل معهم مرة أخرى بالتأكيد.",
    time: Date.now() / 1000 - 3600 * 24 * 30
  },
  {
    author_name: "فاطمة أحمد",
    profile_photo_url: PLACEHOLDER_AVATAR,
    rating: 5,
    relative_time_description: "قبل أسبوعين",
    text: "فريق عمل محترف ومتعاون. ساعدوني في تنظيم رحلة عائلية مميزة بأفضل الأسعار. أنصح بالتعامل معهم.",
    time: Date.now() / 1000 - 3600 * 24 * 14
  },
  {
    author_name: "أحمد محمود",
    profile_photo_url: PLACEHOLDER_AVATAR,
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
