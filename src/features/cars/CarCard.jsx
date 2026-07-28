import { Link } from 'react-router';
import { HiArrowRight, HiMapPin } from 'react-icons/hi2';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/helpers';
import VehicleImage from './VehicleImage';

export default function CarCard({ car }) {
  const vehicleName = `${car.brand} ${car.model}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-subtle)] transition-[transform,border-color,box-shadow] duration-[var(--duration-normal)] ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-raised)]">
      <VehicleImage
        src={car.image || car.images?.[0]}
        alt={`${vehicleName} rental vehicle`}
        imageClassName="transition-transform duration-[var(--duration-slow)] ease-[var(--ease-standard)] group-hover:scale-[1.03]"
      />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="type-caption">{car.category}</p>
            <h2 className="type-card-heading mt-1">{vehicleName}</h2>
          </div>
          <Badge variant={car.available ? 'success' : 'default'} dot={car.available}>
            {car.available ? 'Available' : 'Unavailable'}
          </Badge>
        </div>

        <p className="mt-3 flex items-center gap-1.5 text-sm text-[var(--text-secondary)]">
          <HiMapPin className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
          {car.city || car.location}
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-2 border-y border-[var(--border)] py-3 text-sm">
          <div>
            <dt className="type-caption">Gearbox</dt>
            <dd className="mt-1 font-medium text-[var(--text-primary)]">{car.transmission}</dd>
          </div>
          <div>
            <dt className="type-caption">Fuel</dt>
            <dd className="mt-1 font-medium text-[var(--text-primary)]">{car.fuelType}</dd>
          </div>
          <div>
            <dt className="type-caption">Seats</dt>
            <dd className="mt-1 font-medium text-[var(--text-primary)]">{car.seats}</dd>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <div>
            <p className="type-caption">From</p>
            <p className="type-numeric mt-0.5 text-xl font-semibold text-[var(--text-primary)]">
              {formatPrice(car.pricePerDay)}
              <span className="ml-1 text-sm font-normal text-[var(--text-secondary)]">/day</span>
            </p>
          </div>
          <Button as={Link} to={`/cars/${car.id}`} variant="outline" size="sm" iconRight={HiArrowRight}>
            View details
          </Button>
        </div>
      </div>
    </article>
  );
}

