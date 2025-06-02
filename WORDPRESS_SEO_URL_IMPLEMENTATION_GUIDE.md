# WordPress SEO URL Implementation Guide
## How to Implement Geographic Hierarchy & Trip Types with WordPress

---

## 🎯 **YOUR CURRENT SETUP**

**WordPress Endpoint:** `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination`  
**Current Structure:** `/destinations/turkey/`  
**Goal:** `/destinations/europe/turkey/` and `/trips/honeymoon/turkey/`

---

## 🔧 **IMPLEMENTATION APPROACH**

### **Option 1: WordPress Custom Fields (Recommended)**
Add region and trip type data to your WordPress posts

### **Option 2: Hardcoded Mapping (Quick Start)**
Create mappings in your Next.js code

### **Option 3: WordPress Taxonomy (Advanced)**
Create custom taxonomies in WordPress

---

## 🚀 **IMPLEMENTATION PLAN**

### **Step 1: Add Geographic Data to WordPress**

#### **Option A: WordPress Custom Fields (ACF)**
Add these fields to your destination posts:
```php
// In WordPress admin, add ACF fields:
- region (select): europe, asia, middle-east, africa
- continent (text): Europe, Asia, Middle East, Africa
- country_code (text): TR, GE, IT, BA
```

#### **Option B: Quick Hardcoded Mapping**
Create mapping in Next.js:
```javascript
// src/utils/destinationMapping.js
const DESTINATION_REGIONS = {
  'turkey': {
    region: 'europe',
    continent: 'Europe',
    country: 'Turkey'
  },
  'georgia': {
    region: 'asia', 
    continent: 'Asia',
    country: 'Georgia'
  },
  'italy': {
    region: 'europe',
    continent: 'Europe', 
    country: 'Italy'
  },
  'bosnia': {
    region: 'europe',
    continent: 'Europe',
    country: 'Bosnia'
  },
  'poland': {
    region: 'europe',
    continent: 'Europe',
    country: 'Poland'
  },
  'russia': {
    region: 'europe',
    continent: 'Europe',
    country: 'Russia'
  }
};

export const getDestinationRegion = (slug) => {
  return DESTINATION_REGIONS[slug] || { region: 'other', continent: 'Other', country: slug };
};
```

---

## 📁 **FILE STRUCTURE CHANGES**

### **Current Structure:**
```
src/pages/destinations/
├── index.js                    → /destinations/
└── [slug]/
    └── index.js               → /destinations/turkey/
```

### **New Geographic Structure:**
```
src/pages/destinations/
├── index.js                    → /destinations/
├── [region]/
│   ├── index.js               → /destinations/europe/
│   └── [country]/
│       └── index.js           → /destinations/europe/turkey/
└── [slug]/
    └── index.js               → /destinations/turkey/ (redirect)
```

### **New Trip Type Structure:**
```
src/pages/trips/
├── index.js                    → /trips/
├── [type]/
│   ├── index.js               → /trips/honeymoon/
│   └── [destination]/
│       └── index.js           → /trips/honeymoon/turkey/
└── [slug]/
    └── index.js               → /trips/individual-trip/
```

---

## 💻 **CODE IMPLEMENTATION**

### **1. Create Regional Destination Pages**

#### **File: `src/pages/destinations/[region]/index.js`**
```javascript
import { useRouter } from 'next/router';
import { getDestinationsByRegion } from '@/utils/destinationMapping';

export default function RegionDestinations({ destinations, region }) {
  return (
    <div>
      <h1>Destinations in {region}</h1>
      {destinations.map(dest => (
        <div key={dest.id}>
          <Link href={`/destinations/${dest.region}/${dest.slug}`}>
            {dest.title}
          </Link>
        </div>
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { region: 'europe' } },
      { params: { region: 'asia' } },
      { params: { region: 'middle-east' } },
      { params: { region: 'africa' } }
    ],
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  // Fetch all destinations from WordPress
  const response = await fetch(
    'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?per_page=100'
  );
  const allDestinations = await response.json();
  
  // Filter by region using your mapping
  const destinations = allDestinations
    .map(dest => ({
      ...dest,
      ...getDestinationRegion(dest.slug)
    }))
    .filter(dest => dest.region === params.region);
    
  return {
    props: {
      destinations,
      region: params.region
    },
    revalidate: 3600
  };
}
```

#### **File: `src/pages/destinations/[region]/[country]/index.js`**
```javascript
import { getDestinationRegion } from '@/utils/destinationMapping';

export default function CountryDestination({ destination, trips, region, country }) {
  return (
    <div>
      <nav>
        <Link href="/destinations">Destinations</Link> / 
        <Link href={`/destinations/${region}`}>{region}</Link> / 
        <span>{country}</span>
      </nav>
      
      <h1>{destination.title} Trips</h1>
      
      {trips.map(trip => (
        <div key={trip.id}>
          <h3>{trip.title}</h3>
          <Link href={`/trips/${trip.slug}`}>View Trip</Link>
        </div>
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  // Fetch all destinations
  const response = await fetch(
    'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?per_page=100'
  );
  const destinations = await response.json();
  
  // Generate paths with region mapping
  const paths = destinations.map(dest => {
    const mapping = getDestinationRegion(dest.slug);
    return {
      params: {
        region: mapping.region,
        country: dest.slug
      }
    };
  });
  
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { region, country } = params;
  
  // Fetch destination data
  const destResponse = await fetch(
    `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?slug=${country}`
  );
  const destData = await destResponse.json();
  
  if (!destData.length) return { notFound: true };
  
  const destination = destData[0];
  
  // Fetch trips for this destination
  const tripsResponse = await fetch(
    `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?destination=${destination.id}&per_page=100`
  );
  const trips = await tripsResponse.json();
  
  return {
    props: {
      destination,
      trips,
      region,
      country
    },
    revalidate: 3600
  };
}
```

### **2. Create Trip Type Pages**

#### **File: `src/pages/trips/[type]/index.js`**
```javascript
import { getTripsByType } from '@/utils/tripMapping';

export default function TripTypeList({ trips, type }) {
  return (
    <div>
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Trips</h1>
      
      {trips.map(trip => (
        <div key={trip.id}>
          <h3>{trip.title}</h3>
          <p>Destination: {trip.destination}</p>
          <Link href={`/trips/${type}/${trip.destination_slug}`}>
            View {type} trips in {trip.destination}
          </Link>
        </div>
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { type: 'honeymoon' } },
      { params: { type: 'family' } },
      { params: { type: 'adventure' } },
      { params: { type: 'cultural' } },
      { params: { type: 'luxury' } },
      { params: { type: 'budget' } }
    ],
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  // Fetch all trips
  const response = await fetch(
    'https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?per_page=100'
  );
  const allTrips = await response.json();
  
  // Filter by trip type (you'll need to add this logic)
  const trips = filterTripsByType(allTrips, params.type);
  
  return {
    props: {
      trips,
      type: params.type
    },
    revalidate: 3600
  };
}
```

#### **File: `src/pages/trips/[type]/[destination]/index.js`**
```javascript
export default function TripTypeDestination({ trips, type, destination }) {
  return (
    <div>
      <nav>
        <Link href="/trips">Trips</Link> / 
        <Link href={`/trips/${type}`}>{type}</Link> / 
        <span>{destination}</span>
      </nav>
      
      <h1>{type.charAt(0).toUpperCase() + type.slice(1)} Trips in {destination}</h1>
      
      {trips.map(trip => (
        <div key={trip.id}>
          <h3>{trip.title}</h3>
          <p>{trip.description}</p>
          <Link href={`/trips/${trip.slug}`}>Book Now</Link>
        </div>
      ))}
    </div>
  );
}

export async function getStaticPaths() {
  // Generate all combinations of trip types and destinations
  const types = ['honeymoon', 'family', 'adventure', 'cultural', 'luxury', 'budget'];
  const destinations = ['turkey', 'georgia', 'italy', 'bosnia', 'poland', 'russia'];
  
  const paths = [];
  types.forEach(type => {
    destinations.forEach(destination => {
      paths.push({
        params: { type, destination }
      });
    });
  });
  
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const { type, destination } = params;
  
  // Fetch destination info
  const destResponse = await fetch(
    `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/destination?slug=${destination}`
  );
  const destData = await destResponse.json();
  
  if (!destData.length) return { notFound: true };
  
  // Fetch trips for this destination and type
  const tripsResponse = await fetch(
    `https://en4ha1dlwxxhwad.madaratalkon.com/wp-json/wp/v2/trip?destination=${destData[0].id}&per_page=100`
  );
  const allTrips = await tripsResponse.json();
  
  // Filter by trip type
  const trips = filterTripsByType(allTrips, type);
  
  return {
    props: {
      trips,
      type,
      destination: destData[0].title?.rendered || destination
    },
    revalidate: 3600
  };
}
```

### **3. Trip Type Filtering Utility**

#### **File: `src/utils/tripMapping.js`**
```javascript
// Option A: Based on trip title/description keywords
export const filterTripsByType = (trips, type) => {
  const typeKeywords = {
    honeymoon: ['honeymoon', 'romantic', 'couple', 'romance'],
    family: ['family', 'kids', 'children', 'family-friendly'],
    adventure: ['adventure', 'hiking', 'outdoor', 'active'],
    cultural: ['cultural', 'historical', 'heritage', 'museum'],
    luxury: ['luxury', 'premium', 'vip', 'deluxe'],
    budget: ['budget', 'economy', 'affordable', 'cheap']
  };
  
  const keywords = typeKeywords[type] || [];
  
  return trips.filter(trip => {
    const content = `${trip.title?.rendered || ''} ${trip.content?.rendered || ''}`.toLowerCase();
    return keywords.some(keyword => content.includes(keyword));
  });
};

// Option B: WordPress custom fields (if you add trip_type field)
export const filterTripsByTypeField = (trips, type) => {
  return trips.filter(trip => trip.acf?.trip_type === type);
};
```

### **4. Set Up URL Redirects**

#### **Add to `next.config.js`:**
```javascript
async redirects() {
  return [
    // Redirect old destination URLs to new geographic structure
    {
      source: '/destinations/turkey',
      destination: '/destinations/europe/turkey',
      permanent: true,
    },
    {
      source: '/destinations/georgia',
      destination: '/destinations/asia/georgia',
      permanent: true,
    },
    {
      source: '/destinations/italy',
      destination: '/destinations/europe/italy',
      permanent: true,
    },
    {
      source: '/destinations/bosnia',
      destination: '/destinations/europe/bosnia',
      permanent: true,
    },
    // Keep the /trips pattern for existing URLs
    {
      source: '/destinations/:region/trips',
      destination: '/destinations/:region',
      permanent: true,
    }
  ];
}
```

---

## 🚀 **IMPLEMENTATION STEPS**

### **Phase 1: Quick Start (1 week)**
1. ✅ Create the destination mapping utility
2. ✅ Create regional destination pages
3. ✅ Set up redirects from old URLs
4. ✅ Test the new structure

### **Phase 2: Trip Types (1-2 weeks)**
1. ✅ Create trip type filtering logic
2. ✅ Build trip type pages
3. ✅ Add trip type navigation
4. ✅ Update internal links

### **Phase 3: WordPress Enhancement (Optional)**
1. 🔧 Add ACF fields for regions and trip types
2. 🔧 Update WordPress data structure
3. 🔧 Refine filtering based on custom fields

---

## 📊 **TESTING YOUR IMPLEMENTATION**

### **Test URLs:**
```
✅ /destinations/europe/turkey/
✅ /destinations/asia/georgia/
✅ /trips/honeymoon/turkey/
✅ /trips/family/georgia/
✅ Old URLs redirect properly
```

### **Test Commands:**
```bash
# Test the build
npm run build

# Test redirects
curl -I https://your-site.com/destinations/turkey
# Should return 301 redirect to /destinations/europe/turkey
```

---

## 💡 **NEXT STEPS**

1. **Start with the hardcoded mapping** (quickest implementation)
2. **Test the new URL structure** thoroughly
3. **Monitor SEO performance** for 2-4 weeks
4. **Consider WordPress custom fields** for more dynamic control

Would you like me to start implementing any of these specific files, or do you have questions about the WordPress integration approach? 