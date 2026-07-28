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
  { label: 'Cars', path: '/cars' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];
export const PRICE_RANGES = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $500', min: 200, max: 500 },
  { label: '$500+', min: 500, max: Infinity },
];
