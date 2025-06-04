// Central trips configuration with pricing and metadata
export const tripsConfig = {
  'london-scotland-trip': {
    id: 'london-scotland-trip',
    name: 'لندن واسكتلندا',
    nameEn: 'London Scotland',
    price: 5900,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'لندن واسكتلندا',
    includes_flights: false,
    duration_days: 8,
    cities: ['لندن', 'إدنبرة'],
    highlights: ['تأشيرة سريعة', 'راحة تامة', 'مواعيد مرنة', 'إقامة فاخرة'],
    description: 'رحلة سياحية استثنائية إلى لندن واسكتلندا مع شركة مدارات الكون للسياحة والسفر'
  },
  'italy-trip': {
    id: 'italy-trip',
    name: 'إيطاليا',
    nameEn: 'Italy',
    price: 7200,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'إيطاليا',
    includes_flights: false,
    duration_days: 10,
    cities: ['روما', 'فلورنسا', 'البندقية'],
    highlights: ['تاريخ عريق', 'فن وثقافة', 'مأكولات شهية'],
    description: 'استكشف جمال إيطاليا وتاريخها العريق'
  },
  'turkey-trip': {
    id: 'turkey-trip',
    name: 'تركيا',
    nameEn: 'Turkey',
    price: 4500,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'تركيا',
    includes_flights: false,
    duration_days: 7,
    cities: ['إسطنبول', 'أنقرة', 'كابادوكيا'],
    highlights: ['تاريخ وحداثة', 'طبيعة خلابة', 'أسواق تقليدية'],
    description: 'رحلة ممتعة إلى تركيا بين التاريخ والحداثة'
  },
  'georgia-trip': {
    id: 'georgia-trip',
    name: 'جورجيا',
    nameEn: 'Georgia',
    price: 3800,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'جورجيا',
    includes_flights: false,
    duration_days: 6,
    cities: ['تبليسي', 'باتومي', 'جوري'],
    highlights: ['طبيعة ساحرة', 'تاريخ عريق', 'ضيافة أصيلة'],
    description: 'اكتشف جمال جورجيا الطبيعي والثقافي'
  },
  'azerbaijan-trip': {
    id: 'azerbaijan-trip',
    name: 'أذربيجان',
    nameEn: 'Azerbaijan',
    price: 4200,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'أذربيجان',
    includes_flights: false,
    duration_days: 7,
    cities: ['باكو', 'غابالا', 'شيكي'],
    highlights: ['أرض النار', 'هندسة معمارية فريدة', 'ضيافة كريمة'],
    description: 'رحلة استثنائية إلى أذربيجان أرض النار'
  },
  'bosnia-trip': {
    id: 'bosnia-trip',
    name: 'البوسنة والهرسك',
    nameEn: 'Bosnia Herzegovina',
    price: 5200,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'البوسنة والهرسك',
    includes_flights: false,
    duration_days: 8,
    cities: ['سراييفو', 'موستار', 'بانيالوكا'],
    highlights: ['طبيعة أوروبية', 'تاريخ إسلامي', 'ضيافة البلقان'],
    description: 'استمتع بجمال البوسنة والهرسك الساحر'
  },
  'poland-trip': {
    id: 'poland-trip',
    name: 'بولندا',
    nameEn: 'Poland',
    price: 6100,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'بولندا',
    includes_flights: false,
    duration_days: 9,
    cities: ['وارسو', 'كراكوف', 'غدانسك'],
    highlights: ['تاريخ عريق', 'هندسة قوطية', 'ثقافة أوروبية'],
    description: 'اكتشف تاريخ وثقافة بولندا الأوروبية'
  },
  'russia-trip': {
    id: 'russia-trip',
    name: 'روسيا',
    nameEn: 'Russia',
    price: 8900,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'روسيا',
    includes_flights: false,
    duration_days: 12,
    cities: ['موسكو', 'سان بطرسبرغ', 'كازان'],
    highlights: ['القصور الإمبراطورية', 'الكرملين', 'الثقافة الروسية'],
    description: 'رحلة ملكية إلى روسيا وقصورها التاريخية'
  },
  'schengen-visa-trip': {
    id: 'schengen-visa-trip',
    name: 'أوروبا الشنغن',
    nameEn: 'Schengen Europe',
    price: 7800,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'أوروبا',
    includes_flights: false,
    duration_days: 14,
    cities: ['باريس', 'روما', 'برلين', 'أمستردام'],
    highlights: ['جولة أوروبية شاملة', 'تأشيرة شنغن', 'عواصم أوروبية'],
    description: 'جولة أوروبية شاملة بتأشيرة شنغن واحدة'
  },
  'cruise-italy-spain-france': {
    id: 'cruise-italy-spain-france',
    name: 'رحلة بحرية - إيطاليا وإسبانيا وفرنسا',
    nameEn: 'Mediterranean Cruise',
    price: 9500,
    currency: 'SAR',
    category: 'cruise_packages',
    destination: 'البحر المتوسط',
    includes_flights: false,
    duration_days: 10,
    cities: ['روما', 'برشلونة', 'مارسيليا', 'نابولي'],
    highlights: ['رحلة بحرية فاخرة', 'وجهات متعددة', 'ترفيه على متن السفينة'],
    description: 'رحلة بحرية فاخرة في البحر المتوسط'
  },
  'trabzon-wider-north-turkey': {
    id: 'trabzon-wider-north-turkey',
    name: 'طرابزون وشمال تركيا',
    nameEn: 'Trabzon North Turkey',
    price: 3900,
    currency: 'SAR',
    category: 'travel_packages',
    destination: 'طرابزون وشمال تركيا',
    includes_flights: false,
    duration_days: 6,
    cities: ['طرابزون', 'ريزة', 'آرتفين'],
    highlights: ['طبيعة خضراء', 'البحر الأسود', 'مرتفعات جميلة'],
    description: 'استمتع بطبيعة شمال تركيا الخلابة'
  },
  'international-licence-trip': {
    id: 'international-licence-trip',
    name: 'رخصة القيادة الدولية',
    nameEn: 'International Driving License',
    price: 1200,
    currency: 'SAR',
    category: 'services',
    destination: 'خدمات سفر',
    includes_flights: false,
    duration_days: 1,
    cities: ['المملكة العربية السعودية'],
    highlights: ['إجراءات سريعة', 'خدمة موثوقة', 'سعر تنافسي'],
    description: 'احصل على رخصة القيادة الدولية بسهولة'
  }
};

// Helper function to get trip config by ID
export function getTripConfig(tripId) {
  return tripsConfig[tripId] || null;
}

// Helper function to get trip config by page path
export function getTripConfigByPath(path) {
  // Remove leading slash and .js extension if present
  const cleanPath = path.replace(/^\//, '').replace(/\.js$/, '');
  return getTripConfig(cleanPath);
}

// Helper function to get all trip IDs
export function getAllTripIds() {
  return Object.keys(tripsConfig);
}

// Helper function to get trips by category
export function getTripsByCategory(category) {
  return Object.values(tripsConfig).filter(trip => trip.category === category);
}

// Helper function to format price with currency
export function formatTripPrice(trip) {
  if (!trip) return 'غير محدد';
  return `${trip.price.toLocaleString('en-US')} ${trip.currency}`;
}

// Helper function to get Snapchat tracking data for a trip
export function getSnapchatTripData(tripId) {
  const trip = getTripConfig(tripId);
  if (!trip) return null;
  
  return {
    price: trip.price,
    currency: trip.currency,
    item_ids: [trip.id],
    item_category: trip.category,
    content_name: trip.name,
    content_type: 'product',
    destination: trip.destination
  };
} 