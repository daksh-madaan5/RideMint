import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { HiAdjustmentsHorizontal, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import Drawer from '@/components/ui/Drawer';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import PageHeader from '@/components/ui/PageHeader';
import Select from '@/components/ui/Select';
import Skeleton from '@/components/ui/Skeleton';
import CarCard from '@/features/cars/CarCard';
import CarFilters from '@/features/cars/CarFilters';
import { useCatalogVehicles } from '@/features/cars/hooks/useCatalogVehicles';
import { formatDate } from '@/utils/helpers';

const FILTER_KEYS = ['location', 'category', 'transmission', 'fuelType', 'seats', 'priceRange'];
const EMPTY_FILTERS = Object.fromEntries(FILTER_KEYS.map((key) => [key, '']));
const SORT_OPTIONS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A to Z' },
];

function matchesPrice(price, range) {
  if (!range) return true;
  const [minimum, maximum] = range.split('-').map(Number);
  return price >= minimum && price <= maximum;
}

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: vehicles = [], isLoading, isError, refetch } = useCatalogVehicles();

  const filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, searchParams.get(key) || '']));
  const sortBy = searchParams.get('sort') || 'recommended';
  const pickup = searchParams.get('pickup');
  const returnDate = searchParams.get('return');

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParams);
    FILTER_KEYS.forEach((key) => next.delete(key));
    setSearchParams(next, { replace: true });
  };

  const filteredVehicles = useMemo(() => {
    const matches = vehicles.filter((vehicle) => (
      (!filters.location || vehicle.city === filters.location)
      && (!filters.category || vehicle.category === filters.category)
      && (!filters.transmission || vehicle.transmission === filters.transmission)
      && (!filters.fuelType || vehicle.fuelType === filters.fuelType)
      && (!filters.seats || vehicle.seats === Number(filters.seats))
      && matchesPrice(vehicle.pricePerDay, filters.priceRange)
    ));

    if (sortBy === 'price-asc') return [...matches].sort((a, b) => a.pricePerDay - b.pricePerDay);
    if (sortBy === 'price-desc') return [...matches].sort((a, b) => b.pricePerDay - a.pricePerDay);
    if (sortBy === 'name') return [...matches].sort((a, b) => `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`));
    return matches;
  }, [filters.category, filters.fuelType, filters.location, filters.priceRange, filters.seats, filters.transmission, sortBy, vehicles]);

  const dateContext = pickup && returnDate
    ? `${formatDate(pickup)} to ${formatDate(returnDate)}`
    : null;
  const hasActiveFilters = FILTER_KEYS.some((key) => Boolean(filters[key]));

  return (
    <div className="mx-auto max-w-[var(--content-customer)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader
        eyebrow="Cars near you"
        title="Explore cars"
        description="Compare cars listed by local hosts using the details that matter for your trip."
      />

      {dateContext && (
        <div className="mt-6 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--primary-subtle)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          Showing catalogue options for <strong className="font-semibold text-[var(--text-primary)]">{dateContext}</strong>. Final date availability is confirmed during booking.
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CarFilters filters={filters} onChange={updateParam} onClear={clearFilters} />
          </div>
        </aside>

        <section aria-labelledby="catalog-results">
          <div className="flex flex-col gap-4 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="secondary" className="lg:hidden" icon={HiAdjustmentsHorizontal} onClick={() => setMobileFiltersOpen(true)}>
                Filters
              </Button>
              <div>
                <h2 id="catalog-results" className="text-sm font-semibold text-[var(--text-primary)]">
                  {isLoading ? 'Loading vehicles…' : `${filteredVehicles.length} ${filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}`}
                </h2>
                <p className="mt-0.5 text-xs text-[var(--text-tertiary)]">Cars available across supported cities</p>
              </div>
            </div>
            <Select
              label="Sort by"
              value={sortBy}
              onChange={(event) => updateParam('sort', event.target.value === 'recommended' ? '' : event.target.value)}
              options={SORT_OPTIONS}
              containerClassName="sm:w-52"
            />
          </div>

          {isLoading && (
            <div className="mt-6 grid gap-6 md:grid-cols-2" aria-label="Loading vehicles">
              {[0, 1, 2, 3].map((item) => (
                <Skeleton key={item} variant="card" className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5" />
              ))}
            </div>
          )}
          {isError && (
            <ErrorState
              className="mt-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]"
              title="The car catalogue did not load"
              description="Please try loading the available cars again."
              onRetry={refetch}
            />
          )}
          {!isLoading && !isError && filteredVehicles.length === 0 && (
            <EmptyState
              className="mt-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]"
              icon={HiOutlineMagnifyingGlass}
              title={hasActiveFilters ? 'No cars match these filters' : 'No cars available yet'}
              description={hasActiveFilters
                ? 'Clear the filters and try a broader search.'
                : 'Approved cars from local hosts will appear here when they are available.'}
              action={hasActiveFilters ? { label: 'Clear filters', onClick: clearFilters } : undefined}
            />
          )}
          {!isLoading && !isError && filteredVehicles.length > 0 && (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {filteredVehicles.map((vehicle) => <CarCard key={vehicle.id} car={vehicle} />)}
            </div>
          )}
        </section>
      </div>

      <Drawer isOpen={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)} title="Filter cars" side="left">
        <CarFilters
          filters={{ ...EMPTY_FILTERS, ...filters }}
          onChange={updateParam}
          onClear={clearFilters}
          className="border-0 p-0 shadow-none"
        />
        <Button fullWidth className="mt-5" onClick={() => setMobileFiltersOpen(false)}>
          Show {filteredVehicles.length} {filteredVehicles.length === 1 ? 'car' : 'cars'}
        </Button>
      </Drawer>
    </div>
  );
}
