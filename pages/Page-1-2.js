// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from '../src/utils/NoSSRSwiper';
import { Pagination, Autoplay, Navigation } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';

// Simple UI component replacements
const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${className}`} {...props}>
    {children}
  </button>
);

const Card = ({ children, className, ...props }) => (
  <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
    {children}
  </div>
);

const Badge = ({ children, className, ...props }) => (
  <span className={`px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 ${className}`} {...props}>
    {children}
  </span>
);

const TabsList = ({ children, ...props }) => (
  <div className="flex space-x-2 border-b mb-4" {...props}>
    {children}
  </div>
);

const TabsTrigger = ({ children, value, active, onClick, ...props }) => (
  <button 
    className={`px-4 py-2 ${active ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);

const TabsContent = ({ children, value, activeValue, ...props }) => (
  value === activeValue ? <div {...props}>{children}</div> : null
);

const Tabs = ({ children, defaultValue, ...props }) => {
  const [value, setValue] = useState(defaultValue);
  
  return (
    <div {...props}>
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, {
            children: React.Children.map(child.props.children, tab => {
              if (tab.type === TabsTrigger) {
                return React.cloneElement(tab, {
                  active: tab.props.value === value,
                  onClick: () => setValue(tab.props.value)
                });
              }
              return tab;
            })
          });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeValue: value });
        }
        return child;
      })}
    </div>
  );
};

const Separator = ({ className, ...props }) => (
  <hr className={`my-4 border-gray-200 ${className}`} {...props} />
);

const Avatar = ({ children, ...props }) => (
  <div className="relative inline-block rounded-full overflow-hidden w-10 h-10" {...props}>
    {children}
  </div>
);

const AvatarImage = ({ src, alt, ...props }) => (
  <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
);

const AvatarFallback = ({ children, ...props }) => (
  <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600" {...props}>
    {children}
  </div>
);

const Input = ({ className, ...props }) => (
  <input className={`px-4 py-2 border border-gray-300 rounded-md ${className}`} {...props} />
);

const App = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chart section without echarts
  const renderMockChart = () => (
    <div id="satisfaction-chart" className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
      <p className="text-white text-center">Customer Satisfaction Chart<br/>(Chart visualization requires echarts library)</p>
    </div>
  );

  useEffect(() => {
    // Remove chart initialization since we're using the mock chart
  }, []);

  const destinations = [
    {
      id: 1,
      name: 'Santorini, Greece',
      image:
        'https://readdy.ai/api/search-image?query=Stunning%20aerial%20view%20of%20Santorini%20Greece%20with%20iconic%20white%20buildings%20and%20blue%20domed%20churches%20perched%20on%20cliffs%20overlooking%20the%20deep%20blue%20Aegean%20Sea%20at%20sunset%2C%20dramatic%20clouds%2C%20crystal%20clear%20water%2C%20cinematic%20lighting%2C%20high%20resolution%20photography&width=600&height=400&seq=1&orientation=landscape',
      category: 'europe',
      description:
        'Experience the breathtaking views of white-washed buildings against the deep blue Aegean Sea.',
    },
    {
      id: 2,
      name: 'Bali, Indonesia',
      image:
        'https://readdy.ai/api/search-image?query=Magical%20Bali%20Indonesia%20rice%20terraces%20with%20lush%20green%20steps%20cascading%20down%20hillsides%2C%20tropical%20paradise%2C%20morning%20mist%2C%20palm%20trees%2C%20traditional%20temples%20in%20background%2C%20dramatic%20lighting%2C%20cinematic%20atmosphere%2C%20professional%20travel%20photography&width=600&height=400&seq=2&orientation=landscape',
      category: 'asia',
      description:
        'Discover the perfect blend of stunning beaches, lush rice terraces, and spiritual temples.',
    },
    {
      id: 3,
      name: 'Machu Picchu, Peru',
      image:
        'https://readdy.ai/api/search-image?query=Mystical%20ancient%20ruins%20of%20Machu%20Picchu%20Peru%20at%20dawn%20with%20dramatic%20mountain%20peaks%20of%20Huayna%20Picchu%20in%20background%2C%20morning%20mist%20swirling%20around%20stone%20structures%2C%20lush%20green%20terraces%2C%20dramatic%20clouds%2C%20golden%20sunlight%2C%20archaeological%20wonder%2C%20cinematic%20quality&width=600&height=400&seq=3&orientation=landscape',
      category: 'americas',
      description:
        'Explore the ancient Incan citadel set high in the Andes Mountains, shrouded in mystery and wonder.',
    },
    {
      id: 4,
      name: 'Kyoto, Japan',
      image:
        'https://readdy.ai/api/search-image?query=Enchanting%20traditional%20Japanese%20temple%20in%20Kyoto%20with%20cherry%20blossoms%20in%20full%20bloom%2C%20stone%20lanterns%2C%20wooden%20architecture%2C%20zen%20garden%20with%20raked%20sand%2C%20arched%20bridge%20over%20koi%20pond%2C%20maple%20trees%20with%20vibrant%20red%20leaves%2C%20misty%20mountains%20in%20background%2C%20golden%20hour%20lighting&width=600&height=400&seq=4&orientation=landscape',
      category: 'asia',
      description:
        'Immerse yourself in Japanese culture with ancient temples, traditional tea houses, and cherry blossoms.',
    },
    {
      id: 5,
      name: 'Serengeti, Tanzania',
      image:
        'https://readdy.ai/api/search-image?query=Breathtaking%20African%20savanna%20landscape%20in%20Serengeti%20Tanzania%20with%20golden%20grass%20plains%20stretching%20to%20horizon%2C%20acacia%20trees%20silhouetted%20against%20dramatic%20sunset%20sky%2C%20herd%20of%20elephants%20and%20giraffes%20walking%20in%20distance%2C%20dramatic%20clouds%2C%20cinematic%20lighting%2C%20wildlife%20photography&width=600&height=400&seq=5&orientation=landscape',
      category: 'africa',
      description:
        'Witness the incredible Great Migration and spot the Big Five on an unforgettable safari adventure.',
    },
    {
      id: 6,
      name: 'Amalfi Coast, Italy',
      image:
        'https://readdy.ai/api/search-image?query=Stunning%20aerial%20view%20of%20colorful%20Amalfi%20Coast%20Italy%20with%20pastel-colored%20buildings%20clinging%20to%20steep%20cliffs%2C%20azure%20Mediterranean%20Sea%20below%2C%20winding%20coastal%20road%2C%20luxury%20yachts%20in%20harbor%2C%20lemon%20groves%2C%20dramatic%20rocky%20coastline%2C%20golden%20evening%20light%2C%20cinematic%20travel%20photography&width=600&height=400&seq=6&orientation=landscape',
      category: 'europe',
      description:
        'Drive along the stunning coastline with colorful villages perched on cliffs above the Mediterranean.',
    },
  ];
  const specialOffers = [
    {
      id: 1,
      destination: 'Maldives Luxury Retreat',
      image:
        'https://readdy.ai/api/search-image?query=Luxurious%20overwater%20bungalows%20in%20Maldives%20with%20crystal%20clear%20turquoise%20water%2C%20private%20infinity%20pools%2C%20wooden%20walkways%2C%20palm%20trees%2C%20pristine%20white%20sand%20beach%2C%20vibrant%20coral%20reef%20visible%20below%2C%20dramatic%20sunset%20sky%2C%20cinematic%20travel%20photography%2C%20paradise%20island&width=400&height=300&seq=7&orientation=landscape',
      description:
        '7 nights in an overwater villa with private pool, all-inclusive package',
      originalPrice: 4599,
      discountPrice: 3699,
      savings: '20%',
    },
    {
      id: 2,
      destination: 'Japanese Cherry Blossom Tour',
      image:
        'https://readdy.ai/api/search-image?query=Enchanting%20Japanese%20garden%20with%20cherry%20blossoms%20in%20full%20bloom%2C%20traditional%20red%20pagoda%2C%20stone%20lanterns%2C%20wooden%20bridge%20over%20koi%20pond%2C%20Mount%20Fuji%20in%20background%2C%20pink%20petals%20falling%20gently%2C%20misty%20atmosphere%2C%20golden%20hour%20lighting%2C%20cinematic%20travel%20photography&width=400&height=300&seq=8&orientation=landscape',
      description:
        '10-day guided tour of Tokyo, Kyoto and Osaka during cherry blossom season',
      originalPrice: 3299,
      discountPrice: 2799,
      savings: '15%',
    },
    {
      id: 3,
      destination: 'Greek Islands Cruise',
      image:
        'https://readdy.ai/api/search-image?query=Luxury%20cruise%20ship%20sailing%20through%20Greek%20Islands%20with%20stunning%20views%20of%20Santorini%20white%20buildings%20with%20blue%20domes%2C%20crystal%20clear%20Aegean%20sea%2C%20dramatic%20cliffs%2C%20other%20islands%20visible%20in%20distance%2C%20golden%20sunset%20light%2C%20cinematic%20travel%20photography&width=400&height=300&seq=9&orientation=landscape',
      description:
        '7-day luxury cruise visiting Mykonos, Santorini, Crete and Rhodes',
      originalPrice: 2899,
      discountPrice: 2199,
      savings: '24%',
    },
  ];
  const trendingDestinations = [
    {
      id: 1,
      name: 'Bora Bora',
      image:
        'https://readdy.ai/api/search-image?query=Stunning%20aerial%20view%20of%20Bora%20Bora%20with%20crystal%20clear%20turquoise%20lagoon%2C%20overwater%20bungalows%2C%20Mount%20Otemanu%20in%20background%2C%20coral%20reefs%20visible%20below%20water%2C%20lush%20green%20palm%20trees%2C%20white%20sand%20beaches%2C%20dramatic%20clouds%2C%20cinematic%20lighting%2C%20paradise%20island&width=300&height=300&seq=10&orientation=squarish',
    },
    {
      id: 2,
      name: 'Santorini',
      image:
        'https://readdy.ai/api/search-image?query=Beautiful%20Santorini%20Greece%20sunset%20view%20with%20white%20buildings%20and%20blue%20domes%2C%20cascading%20down%20volcanic%20cliffs%2C%20deep%20blue%20Aegean%20sea%20below%2C%20luxury%20infinity%20pools%2C%20dramatic%20orange%20and%20pink%20sky%2C%20cinematic%20lighting%2C%20travel%20photography&width=300&height=300&seq=11&orientation=squarish',
    },
    {
      id: 3,
      name: 'Kyoto',
      image:
        'https://readdy.ai/api/search-image?query=Traditional%20Japanese%20temple%20in%20Kyoto%20with%20cherry%20blossoms%2C%20wooden%20architecture%2C%20zen%20garden%2C%20stone%20lanterns%2C%20arched%20bridge%2C%20koi%20pond%2C%20maple%20trees%20with%20red%20leaves%2C%20misty%20mountains%2C%20golden%20hour%20lighting%2C%20cinematic%20travel%20photography&width=300&height=300&seq=12&orientation=squarish',
    },
    {
      id: 4,
      name: 'Machu Picchu',
      image:
        'https://readdy.ai/api/search-image?query=Ancient%20ruins%20of%20Machu%20Picchu%20Peru%20at%20sunrise%20with%20dramatic%20mountain%20peaks%20in%20background%2C%20morning%20mist%20swirling%20around%20stone%20structures%2C%20lush%20green%20terraces%2C%20dramatic%20clouds%2C%20golden%20sunlight%2C%20archaeological%20wonder%2C%20cinematic%20quality&width=300&height=300&seq=13&orientation=squarish',
    },
  ];
  const trips = [
    {
      id: 1,
      name: 'Enchanting Bali Retreat',
      image:
        'https://readdy.ai/api/search-image?query=Luxurious%20Bali%20retreat%20with%20infinity%20pool%20overlooking%20lush%20jungle%20and%20rice%20terraces%2C%20traditional%20wooden%20villa%20architecture%2C%20tropical%20flowers%2C%20palm%20trees%2C%20dramatic%20sunset%20lighting%2C%20cinematic%20travel%20photography%2C%20paradise%20island&width=400&height=300&seq=14&orientation=landscape',
      description:
        '10 days of pure bliss exploring temples, beaches, and rice terraces',
      price: 2499,
      category: 'asia',
    },
    {
      id: 2,
      name: 'Mystical Peru Adventure',
      image:
        'https://readdy.ai/api/search-image?query=Majestic%20view%20of%20Machu%20Picchu%20Peru%20with%20dramatic%20mountain%20backdrop%2C%20ancient%20stone%20structures%2C%20llamas%20grazing%20nearby%2C%20morning%20mist%2C%20dramatic%20clouds%2C%20golden%20sunlight%20streaming%20through%2C%20lush%20green%20terraces%2C%20cinematic%20travel%20photography&width=400&height=300&seq=15&orientation=landscape',
      description:
        '12-day journey through Lima, Sacred Valley, Machu Picchu and Lake Titicaca',
      price: 3299,
      category: 'americas',
    },
    {
      id: 3,
      name: 'African Safari Experience',
      image:
        'https://readdy.ai/api/search-image?query=Luxury%20safari%20experience%20in%20Africa%20with%20open-top%20jeep%20viewing%20elephants%20and%20giraffes%20on%20savanna%20at%20sunset%2C%20acacia%20trees%20silhouetted%20against%20orange%20sky%2C%20luxury%20tented%20camp%20visible%20in%20distance%2C%20dramatic%20lighting%2C%20cinematic%20wildlife%20photography&width=400&height=300&seq=16&orientation=landscape',
      description:
        "14-day safari through Kenya and Tanzania's most iconic wildlife reserves",
      price: 5499,
      category: 'africa',
    },
    {
      id: 4,
      name: 'Mediterranean Cruise',
      image:
        'https://readdy.ai/api/search-image?query=Luxury%20cruise%20ship%20sailing%20through%20Mediterranean%20with%20stunning%20coastal%20views%2C%20blue%20waters%2C%20dramatic%20cliffs%2C%20colorful%20coastal%20towns%2C%20luxury%20deck%20with%20infinity%20pool%2C%20sunset%20lighting%2C%20cinematic%20travel%20photography&width=400&height=300&seq=17&orientation=landscape',
      description:
        '10-day luxury cruise visiting Spain, France, Italy and Greece',
      price: 2899,
      category: 'europe',
    },
    {
      id: 5,
      name: 'Japanese Culture Tour',
      image:
        'https://readdy.ai/api/search-image?query=Traditional%20Japanese%20tea%20ceremony%20in%20Kyoto%20with%20tatami%20floor%2C%20sliding%20paper%20doors%2C%20zen%20garden%20visible%20through%20window%2C%20cherry%20blossoms%2C%20kimono-clad%20participants%2C%20traditional%20tea%20sets%2C%20soft%20natural%20lighting%2C%20cinematic%20cultural%20photography&width=400&height=300&seq=18&orientation=landscape',
      description:
        '14-day immersive experience through Tokyo, Kyoto, Osaka and Hiroshima',
      price: 3799,
      category: 'asia',
    },
    {
      id: 6,
      name: 'Northern Lights Adventure',
      image:
        'https://readdy.ai/api/search-image?query=Spectacular%20Northern%20Lights%20dancing%20across%20night%20sky%20in%20Iceland%2C%20vibrant%20green%20and%20purple%20aurora%2C%20snow-covered%20landscape%20below%2C%20glass%20igloo%20accommodation%20visible%2C%20starry%20sky%2C%20mountains%20in%20background%2C%20cinematic%20night%20photography&width=400&height=300&seq=19&orientation=landscape',
      description:
        '8-day winter journey through Iceland to witness the aurora borealis',
      price: 2999,
      category: 'europe',
    },
  ];
  const reviews = [
    {
      id: 1,
      name: 'Sarah Johnson',
      avatar:
        'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20smiling%20woman%20with%20shoulder%20length%20brown%20hair%2C%20natural%20makeup%2C%20neutral%20background%2C%20warm%20friendly%20expression%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=20&orientation=squarish',
      rating: 5,
      text: 'Our trip to Bali was absolutely magical! The itinerary was perfectly balanced between adventure and relaxation. Our guide was knowledgeable and friendly. Will definitely book with Mystic Voyages again!',
    },
    {
      id: 2,
      name: 'Michael Chen',
      avatar:
        'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20smiling%20Asian%20man%20with%20short%20black%20hair%2C%20glasses%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20friendly%20expression%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=21&orientation=squarish',
      rating: 5,
      text: 'The African safari exceeded all our expectations. From the luxury accommodations to the incredible wildlife sightings, everything was top-notch. The attention to detail and personalized service made this a trip of a lifetime.',
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      avatar:
        'https://readdy.ai/api/search-image?query=Professional%20headshot%20of%20smiling%20Hispanic%20woman%20with%20long%20dark%20hair%2C%20natural%20makeup%2C%20neutral%20background%2C%20warm%20friendly%20expression%2C%20high%20quality%20portrait%20photography&width=100&height=100&seq=22&orientation=squarish',
      rating: 4,
      text: 'Our Mediterranean cruise was wonderful! The excursions were well-organized and the onboard experience was luxurious. The only reason for 4 stars instead of 5 is that one port was changed last minute, but the alternative was still great.',
    },
  ];
  const blogPosts = [
    {
      id: 1,
      title: '10 Hidden Gems in Southeast Asia You Need to Visit',
      image:
        'https://readdy.ai/api/search-image?query=Stunning%20hidden%20lagoon%20in%20Southeast%20Asia%20with%20crystal%20clear%20turquoise%20water%2C%20limestone%20cliffs%2C%20lush%20tropical%20vegetation%2C%20small%20wooden%20boat%2C%20no%20tourists%2C%20secluded%20beach%2C%20dramatic%20lighting%2C%20cinematic%20travel%20photography&width=400&height=250&seq=23&orientation=landscape',
      excerpt:
        'Discover off-the-beaten-path destinations that offer authentic experiences away from the crowds...',
      date: 'May 5, 2025',
      readTime: '8 min read',
      category: 'Travel Tips',
    },
    {
      id: 2,
      title: 'The Ultimate Safari Packing Guide',
      image:
        'https://readdy.ai/api/search-image?query=Stylish%20safari%20gear%20neatly%20arranged%20on%20wooden%20surface%20including%20binoculars%2C%20khaki%20clothing%2C%20wide-brimmed%20hat%2C%20camera%20with%20telephoto%20lens%2C%20leather%20journal%2C%20compass%2C%20sunglasses%2C%20premium%20travel%20photography%2C%20soft%20natural%20lighting&width=400&height=250&seq=24&orientation=landscape',
      excerpt:
        'Everything you need to bring for an unforgettable wildlife adventure in Africa...',
      date: 'April 28, 2025',
      readTime: '6 min read',
      category: 'Packing Tips',
    },
    {
      id: 3,
      title: 'Sustainable Travel: How to Reduce Your Carbon Footprint',
      image:
        'https://readdy.ai/api/search-image?query=Eco-friendly%20travel%20concept%20with%20reusable%20water%20bottle%2C%20bamboo%20utensils%2C%20organic%20toiletries%2C%20canvas%20tote%20bag%2C%20solar%20charger%2C%20all%20arranged%20on%20natural%20background%2C%20soft%20lighting%2C%20environmental%20conservation%20theme%2C%20premium%20photography&width=400&height=250&seq=25&orientation=landscape',
      excerpt:
        'Practical tips for environmentally conscious travelers who want to explore the world responsibly...',
      date: 'April 15, 2025',
      readTime: '10 min read',
      category: 'Sustainable Travel',
    },
  ];
  const filteredTrips = trips.filter(
    (trip) =>
      (activeTab === 'all' || trip.category === activeTab) &&
      (searchQuery === '' ||
        trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trip.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Mystic Voyages
            </h1>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#destinations"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Destinations
            </a>
            <a
              href="#offers"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Special Offers
            </a>
            <a
              href="#trips"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Trips
            </a>
            <a
              href="#reviews"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Reviews
            </a>
            <a
              href="#blog"
              className="text-gray-300 hover:text-white transition-colors duration-300 cursor-pointer whitespace-nowrap"
            >
              Blog
            </a>
          </nav>
          <div>
            <Button
              variant="outline"
              className="mr-2 bg-transparent border-indigo-500 text-indigo-400 hover:bg-indigo-950 hover:text-indigo-300 !rounded-button whitespace-nowrap cursor-pointer"
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-0 !rounded-button whitespace-nowrap cursor-pointer">
              Book Now
            </Button>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="relative pt-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Magical%20travel%20scene%20with%20dramatic%20mountain%20landscape%2C%20aurora%20borealis%20in%20night%20sky%2C%20crystal%20clear%20lake%20reflecting%20stars%2C%20luxury%20glamping%20dome%20with%20warm%20light%20inside%2C%20mystical%20atmosphere%2C%20cinematic%20lighting%2C%20professional%20travel%20photography%2C%20inspiring%20wanderlust&width=1440&height=800&seq=26&orientation=landscape"
            alt="Magical Travel Experience"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="block">Unlock Your</span>
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Magical Adventure
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Discover extraordinary destinations and create unforgettable
              memories with our curated travel experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg !rounded-button whitespace-nowrap cursor-pointer">
                Explore Trips
              </Button>
              <Button
                variant="outline"
                className="border-gray-400 text-gray-200 hover:bg-gray-800 px-8 py-6 text-lg !rounded-button whitespace-nowrap cursor-pointer"
              >
                <i className="fas fa-play-circle mr-2"></i> Watch Video
              </Button>
            </div>
          </div>
        </div>
        {/* Trending Destinations Carousel */}
        <div className="container mx-auto px-6 pb-16 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-white">
              Trending Destinations
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="prev-button !rounded-full border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
              >
                <i className="fas fa-chevron-left"></i>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="next-button !rounded-full border-gray-700 hover:bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
              >
                <i className="fas fa-chevron-right"></i>
              </Button>
            </div>
          </div>
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={24}
            slidesPerView={1.2}
            centeredSlides={true}
            loop={true}
            navigation={{
              prevEl: '.prev-button',
              nextEl: '.next-button',
            }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 3.2 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            className="trending-swiper !overflow-visible"
          >
            {trendingDestinations.map((destination) => (
              <SwiperSlide key={destination.id}>
                <div className="relative group cursor-pointer rounded-2xl overflow-hidden transform transition-all duration-500 hover:scale-95">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-90"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h4 className="text-2xl font-bold text-white mb-2">
                      {destination.name}
                    </h4>
                    <div className="flex items-center text-gray-300 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      <span>Explore destination</span>
                      <i className="fas fa-arrow-right ml-2"></i>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
      {/* Special Offers */}
      <section id="offers" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Special Offers</h2>
              <p className="text-gray-400">
                Limited-time deals on extraordinary experiences
              </p>
            </div>
            <Button
              variant="link"
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer whitespace-nowrap"
            >
              View All Offers <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialOffers.map((offer) => (
              <Card
                key={offer.id}
                className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-indigo-500 transition-all duration-300"
              >
                <div className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1">
                      Save {offer.savings}
                    </Badge>
                  </div>
                  <div className="h-56 overflow-hidden">
                    <img
                      src={offer.image}
                      alt={offer.destination}
                      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">
                    {offer.destination}
                  </h3>
                  <p className="text-gray-400 mb-4">{offer.description}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-gray-400 line-through mr-2">
                        ${offer.originalPrice}
                      </span>
                      <span className="text-2xl font-bold text-white">
                        ${offer.discountPrice}
                      </span>
                    </div>
                    <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 !rounded-button whitespace-nowrap cursor-pointer">
                      View Deal
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Destinations */}
      <section id="destinations" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Explore Magical Destinations
            </h2>
            <p className="text-gray-400">
              Discover breathtaking locations that will transport you to another
              world
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="group relative overflow-hidden rounded-xl cursor-pointer h-80"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent opacity-90 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-2xl font-bold mb-2">
                    {destination.name}
                  </h3>
                  <p className="text-gray-300 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {destination.description}
                  </p>
                  <Button className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                    Explore <i className="fas fa-arrow-right ml-2"></i>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Trips Section */}
      <section id="trips" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Curated Trips</h2>
              <p className="text-gray-400">
                Handcrafted journeys designed to create unforgettable memories
              </p>
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative mb-4 max-w-md">
                <Input
                  type="text"
                  placeholder="Search trips..."
                  className="bg-gray-800 border-gray-700 text-gray-200 pl-10 pr-4 py-2 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
          </div>
          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="bg-gray-800 border border-gray-700 p-1">
              <TabsTrigger
                value="all"
                onClick={() => setActiveTab('all')}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white !rounded-button whitespace-nowrap cursor-pointer"
              >
                All Trips
              </TabsTrigger>
              <TabsTrigger
                value="asia"
                onClick={() => setActiveTab('asia')}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white !rounded-button whitespace-nowrap cursor-pointer"
              >
                Asia
              </TabsTrigger>
              <TabsTrigger
                value="europe"
                onClick={() => setActiveTab('europe')}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white !rounded-button whitespace-nowrap cursor-pointer"
              >
                Europe
              </TabsTrigger>
              <TabsTrigger
                value="africa"
                onClick={() => setActiveTab('africa')}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white !rounded-button whitespace-nowrap cursor-pointer"
              >
                Africa
              </TabsTrigger>
              <TabsTrigger
                value="americas"
                onClick={() => setActiveTab('americas')}
                className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white !rounded-button whitespace-nowrap cursor-pointer"
              >
                Americas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTrips.map((trip) => (
                  <Card
                    key={trip.id}
                    className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-indigo-500 transition-all duration-300"
                  >
                    <div className="h-56 overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{trip.name}</h3>
                        <Badge className="bg-gray-700 text-gray-300">
                          {trip.category.charAt(0).toUpperCase() +
                            trip.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-4">{trip.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 text-sm">From</span>
                          <span className="text-2xl font-bold text-white ml-2">
                            ${trip.price}
                          </span>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {filteredTrips.length === 0 && (
                <div className="text-center py-12">
                  <i className="fas fa-search text-4xl text-gray-600 mb-4"></i>
                  <h3 className="text-xl font-medium mb-2">No trips found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="asia" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTrips.map((trip) => (
                  <Card
                    key={trip.id}
                    className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-indigo-500 transition-all duration-300"
                  >
                    <div className="h-56 overflow-hidden">
                      <img
                        src={trip.image}
                        alt={trip.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold">{trip.name}</h3>
                        <Badge className="bg-gray-700 text-gray-300">
                          {trip.category.charAt(0).toUpperCase() +
                            trip.category.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-gray-400 mb-4">{trip.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-gray-400 text-sm">From</span>
                          <span className="text-2xl font-bold text-white ml-2">
                            ${trip.price}
                          </span>
                        </div>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 !rounded-button whitespace-nowrap cursor-pointer">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
            {/* Similar TabsContent for other tabs (europe, africa, americas) would go here */}
          </Tabs>
          <div className="text-center mt-12">
            <Button
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 !rounded-button whitespace-nowrap cursor-pointer"
            >
              Load More Trips <i className="fas fa-chevron-down ml-2"></i>
            </Button>
          </div>
        </div>
      </section>
      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                What Our Travelers Say
              </h2>
              <p className="text-gray-400 mb-8">
                Don&apos;t just take our word for it. Hear from travelers who have
                experienced the magic of our journeys.
              </p>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="bg-gray-900 rounded-xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center mb-4">
                      <Avatar className="h-12 w-12 mr-4 border-2 border-indigo-500">
                        <AvatarImage src={review.avatar} alt={review.name} />
                        <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{review.name}</h4>
                        <div className="flex text-yellow-400 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300">{review.text}</p>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button
                  variant="link"
                  className="text-indigo-400 hover:text-indigo-300 cursor-pointer whitespace-nowrap"
                >
                  Read More Reviews on Google{' '}
                  <i className="fab fa-google ml-2"></i>
                </Button>
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-8 border border-gray-700">
              <h3 className="text-xl font-bold mb-6 text-center">
                Customer Satisfaction
              </h3>
              <div id="satisfaction-chart" className="h-80 w-full"></div>
              <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-indigo-400">98%</p>
                  <p className="text-gray-400 text-sm">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-400">12K+</p>
                  <p className="text-gray-400 text-sm">Happy Travelers</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-pink-400">50+</p>
                  <p className="text-gray-400 text-sm">Destinations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Travel Inspiration</h2>
              <p className="text-gray-400">
                Stories and tips from our travel experts
              </p>
            </div>
            <Button
              variant="link"
              className="text-indigo-400 hover:text-indigo-300 cursor-pointer whitespace-nowrap"
            >
              View All Posts <i className="fas fa-arrow-right ml-2"></i>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="bg-gray-800 border-gray-700 overflow-hidden group hover:border-indigo-500 transition-all duration-300"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Badge className="bg-indigo-600 hover:bg-indigo-700 text-white mr-2">
                      {post.category}
                    </Badge>
                    <span className="text-gray-400 text-sm">
                      {post.date} · {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{post.title}</h3>
                  <p className="text-gray-400 mb-4">{post.excerpt}</p>
                  <Button
                    variant="outline"
                    className="border-indigo-500 text-indigo-400 hover:bg-indigo-950 hover:text-indigo-300 !rounded-button whitespace-nowrap cursor-pointer"
                  >
                    Read More
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter */}
      <section className="py-20 bg-indigo-900 bg-opacity-30 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Abstract%20magical%20travel%20background%20with%20subtle%20purple%20and%20blue%20gradient%2C%20stars%2C%20northern%20lights%20effect%2C%20mystical%20atmosphere%2C%20dreamy%20landscape%20silhouette%2C%20professional%20design%20background&width=1440&height=400&seq=27&orientation=landscape"
            alt="Newsletter Background"
            className="w-full h-full object-cover object-center opacity-30"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Join Our Adventure Community
            </h2>
            <p className="text-gray-300 mb-8">
              Subscribe to receive exclusive offers, travel inspiration, and
              tips from our experts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800/80 border-gray-700 text-gray-200 py-6 rounded-lg focus:border-indigo-500 focus:ring-indigo-500 flex-grow"
              />
              <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 py-6 px-8 !rounded-button whitespace-nowrap cursor-pointer">
                Subscribe
              </Button>
            </div>
            <p className="text-gray-400 text-sm mt-4">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Mystic Voyages
              </h3>
              <p className="text-gray-400 mb-6">
                Creating extraordinary travel experiences that inspire wonder
                and connection.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-facebook-f text-lg"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-twitter text-lg"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-instagram text-lg"></i>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-400 transition-colors duration-300 cursor-pointer"
                >
                  <i className="fab fa-pinterest text-lg"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Destinations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Special Offers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Travel Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Terms & Conditions
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Booking Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                  >
                    Travel Insurance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <i className="fas fa-map-marker-alt text-indigo-400 mt-1 mr-3"></i>
                  <span className="text-gray-400">
                    123 Adventure Lane, Wanderlust City, WL 12345
                  </span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-phone-alt text-indigo-400 mr-3"></i>
                  <span className="text-gray-400">+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope text-indigo-400 mr-3"></i>
                  <span className="text-gray-400">info@mysticvoyages.com</span>
                </li>
              </ul>
              <div className="mt-6">
                <h4 className="font-bold mb-3">We Accept</h4>
                <div className="flex space-x-3">
                  <i className="fab fa-cc-visa text-2xl text-gray-400"></i>
                  <i className="fab fa-cc-mastercard text-2xl text-gray-400"></i>
                  <i className="fab fa-cc-amex text-2xl text-gray-400"></i>
                  <i className="fab fa-cc-paypal text-2xl text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
          <Separator className="bg-gray-800" />
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              © 2025 Mystic Voyages. All rights reserved.
            </p>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-300 cursor-pointer whitespace-nowrap"
              >
                Privacy Policy
              </Button>
              <Separator
                orientation="vertical"
                className="h-4 bg-gray-700 mx-2"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-300 cursor-pointer whitespace-nowrap"
              >
                Terms of Service
              </Button>
              <Separator
                orientation="vertical"
                className="h-4 bg-gray-700 mx-2"
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-300 cursor-pointer whitespace-nowrap"
              >
                Sitemap
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
export default App;
