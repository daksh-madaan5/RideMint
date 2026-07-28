import { Link, useLocation, useNavigate, useParams } from 'react-router';
import {
  HiArrowLeft,
  HiCalendarDays,
  HiCheck,
  HiMapPin,
  HiUsers,
  HiWrenchScrewdriver,
} from 'react-icons/hi2';
import Badge from '@/components/ui/Badge';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';
import VehicleImage from '@/features/cars/VehicleImage';
import { useCatalogVehicle } from '@/features/cars/hooks/useCatalogVehicles';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/utils/helpers';

export default function CarDetails() {
  const { carId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: vehicle, isLoading, isError, refetch } = useCatalogVehicle(carId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[var(--content-customer)] px-4 py-12 sm:px-6 lg:px-8" aria-label="Loading vehicle details">
        <Skeleton className="h-5 w-32" />
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <Skeleton variant="image" />
          <div className="space-y-5"><Skeleton className="h-10 w-3/4" /><Skeleton variant="paragraph" /><Skeleton className="h-12 w-full" /></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorState className="mx-auto min-h-[60vh] max-w-xl" title="Vehicle details did not load" onRetry={refetch} />;
  }

  if (!vehicle) {
    return (
      <section className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">Catalogue fallback</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold">Vehicle not found</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          This catalogue entry does not exist. Return to Explore cars to choose another listing.
        </p>
        <Button as={Link} to="/cars" className="mt-6">Back to cars</Button>
      </section>
    );
  }

  const vehicleName = `${vehicle.brand} ${vehicle.model}`;
  const hostedListing = vehicle.source === 'firestore-listing';
  const host = vehicle.ownerSnapshot || { displayName: 'Host information unavailable', photoURL: '', emailVerified: null };
  const continueToBooking = () => {
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    navigate(`/booking/${vehicle.id}`);
  };

  return (
    <div className="mx-auto max-w-[var(--content-customer)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <Link to="/cars" className="focus-ring inline-flex items-center gap-2 rounded text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
        <HiArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to cars
      </Link>

      <div className="mt-7 grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div>
          <VehicleImage src={vehicle.image} alt={`${vehicleName} rental vehicle`} className="rounded-[var(--radius-panel)] border border-[var(--border)]" eager />
          <section className="mt-8" aria-labelledby="specifications-title">
            <h2 id="specifications-title" className="font-heading text-xl font-semibold">Vehicle specifications</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {vehicle.specifications.map((specification) => (
                <li key={specification} className="flex items-center gap-3 rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm">
                  <HiCheck className="h-4 w-4 shrink-0 text-[var(--primary)]" aria-hidden="true" />
                  {specification}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">{vehicle.category}</p>
              <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">{vehicleName}</h1>
            </div>
            <Badge variant={vehicle.available ? 'success' : 'default'} dot={vehicle.available}>
              {vehicle.available ? 'Available' : 'Unavailable'}
            </Badge>
          </div>

          <p className="mt-5 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <HiMapPin className="h-5 w-5 text-[var(--primary)]" aria-hidden="true" />
            {vehicle.branch.name}
          </p>

          <div className="my-7 border-y border-[var(--border)] py-6">
            <p className="text-sm text-[var(--text-secondary)]">Daily rental from</p>
            <p className="mt-1 font-heading text-4xl font-semibold tracking-tight">
              {formatPrice(vehicle.pricePerDay)}
              <span className="ml-2 font-body text-sm font-normal text-[var(--text-secondary)]">per day</span>
            </p>
            <p className="mt-2 text-xs text-[var(--text-tertiary)]">Demo rate. Final totals are calculated in the booking flow.</p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Spec icon={HiCalendarDays} label="Year" value={vehicle.year} />
            <Spec icon={HiUsers} label="Seats" value={vehicle.seats} />
            <Spec icon={HiWrenchScrewdriver} label="Gearbox" value={vehicle.transmission} />
            <Spec label="Fuel" value={vehicle.fuelType} />
          </dl>

          {vehicle.description && (
            <section className="mt-8" aria-labelledby="listing-description-title">
              <h2 id="listing-description-title" className="font-heading text-lg font-semibold">About this car</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{vehicle.description}</p>
            </section>
          )}

          <section className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5" aria-labelledby="pickup-title">
            <h2 id="pickup-title" className="font-heading text-lg font-semibold">Pickup information</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow term="City" detail={vehicle.branch.city} />
              <DetailRow term="Address" detail={vehicle.branch.address || 'Demo information not supplied'} />
              <DetailRow term="Operating hours" detail={vehicle.branch.operatingHours || 'Demo information not supplied'} />
            </dl>
          </section>

          <section className="mt-5 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5" aria-labelledby="host-title">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--text-tertiary)]">Listed by</p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar src={host.photoURL} name={host.displayName} size="lg" />
              <div>
                <h2 id="host-title" className="font-heading text-lg font-semibold">{host.displayName || 'RideMint member'}</h2>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{vehicle.city}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--text-secondary)]">
              {host.emailVerified === true
                ? 'Firebase account email is verified.'
                : host.emailVerified === false
                  ? 'Firebase account email is not verified.'
                  : 'Email-verification status is not available for this demo listing.'}
            </p>
          </section>

          <div className="mt-6">
            <Button
              fullWidth
              size="lg"
              disabled={!vehicle.available || hostedListing}
              onClick={hostedListing ? undefined : continueToBooking}
            >
              {hostedListing ? 'Request this car' : vehicle.available ? (user ? 'Continue to booking' : 'Sign in to continue') : 'Currently unavailable'}
            </Button>
            <p className="mt-3 text-center text-sm text-[var(--text-secondary)]">
              {hostedListing
                ? 'Car requests are not available in this MVP phase.'
                : vehicle.available
                ? 'You can browse without an account. Sign-in is required only to continue to booking.'
                : 'This demo vehicle cannot enter the booking flow while marked unavailable.'}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-14 border-t border-[var(--border)] pt-10" aria-labelledby="policies-title">
        <h2 id="policies-title" className="font-heading text-2xl font-semibold">Rental details</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Policy title="Rental terms" text={vehicle.rentalTerms || 'Rental terms have not been collected for this host listing yet.'} />
          <Policy title="Fuel policy" text={vehicle.fuelPolicy || 'Fuel terms will be defined in a later request-and-booking phase.'} />
          <Policy title="Security deposit" text={vehicle.securityDeposit || 'Deposit information is not part of this listing MVP.'} />
          <Policy title="Cancellation" text={vehicle.cancellationPolicy || 'Cancellation terms are not available until booking requests are implemented.'} />
        </div>
        <p className="mt-6 text-sm leading-6 text-[var(--text-secondary)]">
          Need help understanding a rental detail? RideMint support information will be presented before confirmation; no support number is supplied in this demo catalogue.
        </p>
      </section>
    </div>
  );
}

function Spec({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[var(--radius-control)] border border-[var(--border)] bg-[var(--surface)] p-3">
      {Icon && <Icon className="mb-2 h-4 w-4 text-[var(--primary)]" aria-hidden="true" />}
      <dt className="text-xs text-[var(--text-tertiary)]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}

function DetailRow({ term, detail }) {
  return (
    <div className="grid grid-cols-[7rem_1fr] gap-3">
      <dt className="text-[var(--text-tertiary)]">{term}</dt>
      <dd className="font-medium text-[var(--text-primary)]">{detail}</dd>
    </div>
  );
}

function Policy({ title, text }) {
  return (
    <article className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
      <h3 className="font-heading text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
    </article>
  );
}
