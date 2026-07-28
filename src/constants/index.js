export const BRANDS = ['BMW', 'Mercedes-Benz', 'Audi', 'Tesla', 'Porsche', 'Toyota', 'Honda', 'Ford', 'Lamborghini', 'Ferrari', 'Range Rover', 'Volvo'];
export const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
export const TRANSMISSION_TYPES = ['Automatic', 'Manual'];
export const SEAT_OPTIONS = [2, 4, 5, 6, 7, 8];
export const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating-desc' },
  { label: 'Newest', value: 'newest' },
];
export const BOOKING_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];
export const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Explore Cars', path: '/cars' },
];
export const SUPPORTED_LOCATIONS = [
  'Bengaluru',
  'Hyderabad',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Chennai',
  'Bhubaneswar',
];
export const DEFAULT_LOCATION = 'Bengaluru';
export const PRICE_RANGES = [
  { label: 'Under ₹2,000', min: 0, max: 2000 },
  { label: '₹2,000–₹4,000', min: 2000, max: 4000 },
  { label: '₹4,000–₹7,000', min: 4000, max: 7000 },
  { label: '₹7,000–₹10,000', min: 7000, max: 10000 },
  { label: '₹10,000+', min: 10000, max: Infinity },
];
