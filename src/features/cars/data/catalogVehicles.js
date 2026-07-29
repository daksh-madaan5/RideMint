export const VEHICLE_PLACEHOLDER_IMAGE = '/images/cars/vehicle-placeholder.svg';

export const FALLBACK_VEHICLE_IMAGES = {
  swift: '/images/cars/swift.webp',
  creta: '/images/cars/creta.webp',
  city: '/images/cars/city.webp',
  nexon: '/images/cars/nexon.webp',
};

const standardRentalDetails = {
  rentalTerms: 'A valid driving licence and identity verification are required at pickup.',
  fuelPolicy: 'Return the vehicle with the same fuel level recorded at pickup.',
  securityDeposit: 'A refundable security deposit may be confirmed by the host before pickup.',
  cancellationPolicy: 'Eligible bookings may be cancelled before the pickup date.',
};

const createPickupArea = (city, locality) => ({
  name: `${locality}, ${city}`,
  city,
  address: locality,
  operatingHours: null,
});

export const FALLBACK_VEHICLES = [
  {
    id: 'swift',
    source: 'fallback',
    ownerSnapshot: { displayName: 'Aarav', photoURL: '', emailVerified: null },
    brand: 'Maruti Suzuki',
    model: 'Swift',
    year: 2024,
    category: 'Hatchback',
    transmission: 'Manual',
    fuelType: 'Petrol',
    seats: 5,
    city: 'Bengaluru',
    pricePerDay: 2400,
    available: true,
    image: FALLBACK_VEHICLE_IMAGES.swift,
    branch: createPickupArea('Bengaluru', 'Indiranagar'),
    description: 'A practical five-seat hatchback for city errands and weekend drives, with light controls, efficient petrol performance, and useful cabin space.',
    specifications: ['1197 cc engine', '2 cabin bags', 'Air conditioning'],
    ...standardRentalDetails,
  },
  {
    id: 'creta',
    source: 'fallback',
    ownerSnapshot: { displayName: 'Nisha', photoURL: '', emailVerified: null },
    brand: 'Hyundai',
    model: 'Creta',
    year: 2025,
    category: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    city: 'Hyderabad',
    pricePerDay: 4200,
    available: true,
    image: FALLBACK_VEHICLE_IMAGES.creta,
    branch: createPickupArea('Hyderabad', 'Banjara Hills'),
    description: 'A comfortable automatic SUV with a raised driving position, flexible luggage room, and an easygoing petrol engine for urban and highway journeys.',
    specifications: ['1497 cc engine', '3 cabin bags', 'Rear-view camera'],
    ...standardRentalDetails,
  },
  {
    id: 'city',
    source: 'fallback',
    ownerSnapshot: { displayName: 'Rohan', photoURL: '', emailVerified: null },
    brand: 'Honda',
    model: 'City',
    year: 2024,
    category: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    city: 'Mumbai',
    pricePerDay: 3900,
    available: true,
    image: FALLBACK_VEHICLE_IMAGES.city,
    branch: createPickupArea('Mumbai', 'Andheri East'),
    description: 'A refined automatic sedan with generous rear-seat comfort, a composed ride, and a responsive petrol engine suited to longer city and intercity travel.',
    specifications: ['1498 cc engine', '3 cabin bags', 'Automatic climate control'],
    ...standardRentalDetails,
  },
  {
    id: 'nexon',
    source: 'fallback',
    ownerSnapshot: { displayName: 'Ananya', photoURL: '', emailVerified: null },
    brand: 'Tata',
    model: 'Nexon',
    year: 2025,
    category: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    city: 'Bhubaneswar',
    pricePerDay: 3600,
    available: true,
    image: FALLBACK_VEHICLE_IMAGES.nexon,
    branch: createPickupArea('Bhubaneswar', 'Patia'),
    description: 'A compact automatic SUV with supportive seating, practical ground clearance, and enough luggage capacity for everyday trips around the city and beyond.',
    specifications: ['1199 cc engine', '3 cabin bags', 'Rear parking sensors'],
    ...standardRentalDetails,
  },
];

export const VEHICLE_CATEGORIES = [...new Set(FALLBACK_VEHICLES.map((vehicle) => vehicle.category))];
export const VEHICLE_TRANSMISSIONS = [...new Set(FALLBACK_VEHICLES.map((vehicle) => vehicle.transmission))];
export const VEHICLE_FUEL_TYPES = [...new Set(FALLBACK_VEHICLES.map((vehicle) => vehicle.fuelType))];
export const VEHICLE_SEAT_OPTIONS = [...new Set(FALLBACK_VEHICLES.map((vehicle) => vehicle.seats))].sort((a, b) => a - b);
export const CATALOG_PRICE_RANGES = [
  { value: '', label: 'Any price' },
  { value: '0-3000', label: 'Under ₹3,000' },
  { value: '3000-4500', label: '₹3,000–₹4,500' },
  { value: '4500-6000', label: '₹4,500–₹6,000' },
];
