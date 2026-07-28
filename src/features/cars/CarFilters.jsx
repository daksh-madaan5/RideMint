import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { SUPPORTED_LOCATIONS } from '@/constants';
import {
  CATALOG_PRICE_RANGES,
  VEHICLE_CATEGORIES,
  VEHICLE_FUEL_TYPES,
  VEHICLE_SEAT_OPTIONS,
  VEHICLE_TRANSMISSIONS,
} from './data/demoVehicles';

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
        options={VEHICLE_CATEGORIES}
        placeholder="All categories"
      />
      <Select
        label="Transmission"
        value={filters.transmission}
        onChange={(event) => onChange('transmission', event.target.value)}
        options={VEHICLE_TRANSMISSIONS}
        placeholder="Any transmission"
      />
      <Select
        label="Fuel type"
        value={filters.fuelType}
        onChange={(event) => onChange('fuelType', event.target.value)}
        options={VEHICLE_FUEL_TYPES}
        placeholder="Any fuel type"
      />
      <Select
        label="Seats"
        value={filters.seats}
        onChange={(event) => onChange('seats', event.target.value)}
        options={VEHICLE_SEAT_OPTIONS.map((seats) => ({ value: String(seats), label: `${seats} seats` }))}
        placeholder="Any capacity"
      />
      <Select
        label="Daily price"
        value={filters.priceRange}
        onChange={(event) => onChange('priceRange', event.target.value)}
        options={CATALOG_PRICE_RANGES.slice(1)}
        placeholder="Any price"
      />
    </form>
  );
}

