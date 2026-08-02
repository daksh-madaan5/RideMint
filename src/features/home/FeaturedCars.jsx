import { Link } from 'react-router';
import { HiArrowRight, HiOutlineMagnifyingGlass } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import SectionHeader from '@/components/ui/SectionHeader';
import Skeleton from '@/components/ui/Skeleton';
import CarCard from '@/features/cars/CarCard';
import { useCatalogVehicles } from '@/features/cars/hooks/useCatalogVehicles';

export default function FeaturedCars() {
  const { data: vehicles = [], isLoading, isError, refetch } = useCatalogVehicles();

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-[var(--content-customer)] px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Cars for everyday journeys"
          description="Compare practical cars from local hosts across supported cities."
          action={
            <Button as={Link} to="/cars" variant="outline" iconRight={HiArrowRight}>
              View all cars
            </Button>
          }
        />

        {isLoading && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading featured cars">
            {[0, 1, 2].map((item) => (
              <Skeleton key={item} variant="card" className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5" />
            ))}
          </div>
        )}
        {isError && <ErrorState className="mt-8" onRetry={refetch} description="The car catalogue could not be loaded." />}
        {!isLoading && !isError && vehicles.length === 0 && (
          <EmptyState
            className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]"
            icon={HiOutlineMagnifyingGlass}
            title="No cars available yet"
            description="Approved cars from local hosts will appear here when they are available."
          />
        )}
        {!isLoading && !isError && vehicles.length > 0 && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.slice(0, 3).map((vehicle) => <CarCard key={vehicle.id} car={vehicle} />)}
          </div>
        )}
      </div>
    </section>
  );
}
