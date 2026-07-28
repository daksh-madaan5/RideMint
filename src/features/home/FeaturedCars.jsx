import { Link } from 'react-router';
import { HiArrowRight } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
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
          title="A fleet for everyday journeys"
          description="A first look at RideMint vehicles available across our demo cities."
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
        {isError && <ErrorState className="mt-8" onRetry={refetch} description="The demo fleet could not be loaded." />}
        {!isLoading && !isError && (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {vehicles.slice(0, 3).map((vehicle) => <CarCard key={vehicle.id} car={vehicle} />)}
          </div>
        )}
      </div>
    </section>
  );
}
