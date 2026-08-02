import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import {
  FUEL_TYPES,
  LISTING_CATEGORIES,
  LISTING_SEAT_OPTIONS,
  SUPPORTED_LOCATIONS,
  TRANSMISSION_TYPES,
} from '@/constants';

const CATALOG_PRICE_RANGES = [
  { value: '0-3000', label: 'Under ₹3,000' },
  { value: '3000-4500', label: '₹3,000–₹4,500' },
  { value: '4500-6000', label: '₹4,500–₹6,000' },
];

export default function CarFilters({ filters, onChange, onClear, className = '' }) {
  return (
    <form
      className={`space-y-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5 ${className}`}
      onSubmit={(event) => event.preventDefault()}
      aria-label="Vehicle filters"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="type-card-heading">Filters</h2>
        <Button type="button" variant="ghost" size="sm" onClick={onClear}>
          Clear all
        </Button>
      </div>

      <Select
        label="Pickup city"
        value={filters.location}
        onChange={(event) => onChange('location', event.target.value)}
        options={SUPPORTED_LOCATIONS}
        placeholder="All cities"
      />
      <Select
        label="Category"
        value={filters.category}
        onChange={(event) => onChange('category', event.target.value)}
        options={LISTING_CATEGORIES}
        placeholder="All categories"
      />
      <Select
        label="Transmission"
        value={filters.transmission}
        onChange={(event) => onChange('transmission', event.target.value)}
        options={TRANSMISSION_TYPES}
        placeholder="Any transmission"
      />
      <Select
        label="Fuel type"
        value={filters.fuelType}
        onChange={(event) => onChange('fuelType', event.target.value)}
        options={FUEL_TYPES}
        placeholder="Any fuel type"
      />
      <Select
        label="Seats"
        value={filters.seats}
        onChange={(event) => onChange('seats', event.target.value)}
        options={LISTING_SEAT_OPTIONS.map((seats) => ({ value: String(seats), label: `${seats} seats` }))}
        placeholder="Any capacity"
      />
      <Select
        label="Daily price"
        value={filters.priceRange}
        onChange={(event) => onChange('priceRange', event.target.value)}
        options={CATALOG_PRICE_RANGES}
        placeholder="Any price"
      />
    </form>
  );
}
