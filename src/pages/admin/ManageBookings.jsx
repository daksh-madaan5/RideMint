import { useMemo, useState } from 'react';
import {
  HiArrowPath,
  HiCalendarDays,
  HiShieldCheck,
} from 'react-icons/hi2';
import { useQuery } from '@tanstack/react-query';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';
import {
  BOOKING_PREVIEW_MESSAGE,
  isLocalSecureBooking,
} from '@/features/bookings/bookingMode';
import { bookingStatusVariant } from '@/features/bookings/bookingUi';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice, formatDate } from '@/utils/helpers';

const STATUS_FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Completed', value: 'completed' },
];

function bookingVehicle(booking) {
  const snapshot = booking.listingSnapshot || {};
  return {
    image: snapshot.imageUrl || snapshot.image || snapshot.images?.[0] || '/images/cars/vehicle-placeholder.svg',
    name: [snapshot.make || snapshot.brand, snapshot.model].filter(Boolean).join(' ') || 'Vehicle unavailable',
    year: snapshot.year,
  };
}

function bookingPricing(booking) {
  const snapshot = booking.pricingSnapshot || {};
  return {
    dailyPrice: snapshot.pricePerDay ?? booking.pricePerDay ?? 0,
    rentalDays: snapshot.rentalDays ?? booking.rentalDays ?? 0,
    total: snapshot.totalAmount ?? booking.totalAmount ?? 0,
  };
}

function timestampLabel(value) {
  return value ? formatDate(value) : 'Not recorded';
}

function lifecycleTimestamp(booking) {
  const fields = {
    confirmed: ['Confirmed', booking.confirmedAt],
    rejected: ['Rejected', booking.rejectedAt],
    cancelled: ['Cancelled', booking.cancelledAt],
  };
  return fields[booking.status];
}

export default function ManageBookings() {
  const { user, userProfile, isAdmin } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');
  const adminConfirmed = Boolean(user?.uid && isAdmin && userProfile?.role === 'admin');

  const bookingsQuery = useQuery({
    queryKey: ['rental-bookings', 'admin'],
    queryFn: async () => {
      if (!import.meta.env.DEV || !isLocalSecureBooking || !adminConfirmed) {
        throw new Error('The secure admin booking overview is available only to a local administrator.');
      }
      const { getAdminRentalBookings } = await import(
        '@/features/bookings/bookingQueries'
      );
      return getAdminRentalBookings({ isAdmin: adminConfirmed });
    },
    enabled: Boolean(isLocalSecureBooking && adminConfirmed),
  });

  const bookings = useMemo(() => bookingsQuery.data || [], [bookingsQuery.data]);
  const filteredBookings = useMemo(
    () => activeFilter === 'all'
      ? bookings
      : bookings.filter((booking) => booking.status === activeFilter),
    [activeFilter, bookings]
  );

  if (!isLocalSecureBooking) {
    return (
      <AdminBookingsShell>
        <Card>
          <EmptyState
            icon={HiShieldCheck}
            title="Secure booking administration is local-only"
            description={BOOKING_PREVIEW_MESSAGE}
          />
        </Card>
      </AdminBookingsShell>
    );
  }

  if (!adminConfirmed) {
    return (
      <AdminBookingsShell>
        <Card>
          <EmptyState
            icon={HiShieldCheck}
            title="Administrator profile required"
            description="Booking records are queried only after the signed-in profile confirms administrator access."
          />
        </Card>
      </AdminBookingsShell>
    );
  }

  return (
    <AdminBookingsShell
      count={bookings.length}
      refreshing={bookingsQuery.isFetching}
      onRefresh={() => bookingsQuery.refetch()}
    >
      <Card padding={false}>
        <div className="border-b border-[var(--border)] px-4 py-4 sm:px-5">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto" aria-label="Filter bookings by status">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={activeFilter === filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`focus-ring min-h-9 shrink-0 rounded-[var(--radius-pill)] px-3 text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-[var(--primary)] text-white'
                    : 'bg-[var(--surface-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {bookingsQuery.isLoading ? (
          <BookingLoadingState />
        ) : bookingsQuery.isError ? (
          <ErrorState
            title="Booking records could not be loaded"
            description={bookingsQuery.error?.message || 'Check that the local Firebase emulators are running, then try again.'}
            onRetry={bookingsQuery.refetch}
          />
        ) : filteredBookings.length === 0 ? (
          <EmptyState
            icon={HiCalendarDays}
            title={bookings.length ? `No ${activeFilter} bookings` : 'No secure booking records'}
            description={bookings.length
              ? 'Choose another status filter to review the remaining records.'
              : 'Secure rental requests will appear here after customers submit them in the local environment.'}
            action={bookings.length && activeFilter !== 'all'
              ? <Button variant="outline" onClick={() => setActiveFilter('all')}>Show all bookings</Button>
              : undefined}
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full table-fixed text-left text-sm">
                <caption className="sr-only">
                  Read-only secure rental booking records
                </caption>
                <thead className="bg-[var(--surface-subtle)] text-xs uppercase tracking-[0.08em] text-[var(--text-tertiary)]">
                  <tr>
                    <th className="w-[21%] px-5 py-3 font-semibold">Vehicle</th>
                    <th className="w-[20%] px-5 py-3 font-semibold">Participants</th>
                    <th className="w-[17%] px-5 py-3 font-semibold">Dates</th>
                    <th className="w-[14%] px-5 py-3 font-semibold">Pricing</th>
                    <th className="w-[11%] px-5 py-3 font-semibold">Status</th>
                    <th className="w-[17%] px-5 py-3 font-semibold">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filteredBookings.map((booking) => (
                    <BookingTableRow key={booking.id} booking={booking} />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[var(--border)] lg:hidden">
              {filteredBookings.map((booking) => (
                <BookingMobileCard key={booking.id} booking={booking} />
              ))}
            </div>
          </>
        )}
      </Card>
    </AdminBookingsShell>
  );
}

function AdminBookingsShell({ children, count, refreshing, onRefresh }) {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
              Administration
            </p>
            <Badge variant="default">Read-only</Badge>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-[var(--text-primary)] sm:text-3xl">
            Booking overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
            Review secure rental activity across customers and hosts without changing booking state.
          </p>
          {typeof count === 'number' && (
            <p className="mt-2 text-xs text-[var(--text-tertiary)]" aria-live="polite">
              {count} {count === 1 ? 'booking record' : 'booking records'} loaded
            </p>
          )}
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            icon={HiArrowPath}
            loading={refreshing}
            loadingLabel="Refreshing"
            onClick={onRefresh}
          >
            Refresh
          </Button>
        )}
      </header>
      {children}
    </div>
  );
}

function BookingLoadingState() {
  return (
    <div aria-label="Loading booking records" role="status">
      <span className="sr-only">Loading booking records</span>
      <div className="hidden divide-y divide-[var(--border)] lg:block">
        {[1, 2, 3, 4].map((row) => (
          <div key={row} className="grid grid-cols-6 gap-5 px-5 py-5">
            {[1, 2, 3, 4, 5, 6].map((cell) => (
              <Skeleton key={cell} className="h-4 w-full" />
            ))}
          </div>
        ))}
      </div>
      <div className="space-y-5 p-4 lg:hidden">
        {[1, 2, 3].map((card) => (
          <div key={card} className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingTableRow({ booking }) {
  const vehicle = bookingVehicle(booking);
  const pricing = bookingPricing(booking);
  const lifecycle = lifecycleTimestamp(booking);

  return (
    <tr className="align-top transition-colors hover:bg-[var(--surface-subtle)]">
      <td className="px-5 py-5">
        <VehicleIdentity vehicle={vehicle} />
        <Identifier label="Listing ID" value={booking.listingId} className="mt-3" />
      </td>
      <td className="px-5 py-5">
        <Identifier label="Customer UID" value={booking.customerId} />
        <Identifier label="Host UID" value={booking.ownerId} className="mt-3" />
      </td>
      <td className="px-5 py-5 text-[var(--text-secondary)]">
        <p className="font-medium text-[var(--text-primary)]">{formatDate(booking.pickupDate) || 'Date unavailable'}</p>
        <p className="mt-1 text-xs">to {formatDate(booking.returnDate) || 'Date unavailable'}</p>
        <p className="mt-2 text-xs">{pricing.rentalDays} {pricing.rentalDays === 1 ? 'day' : 'days'}</p>
      </td>
      <td className="px-5 py-5">
        <p className="font-medium text-[var(--text-primary)]">{formatPrice(pricing.total)}</p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {formatPrice(pricing.dailyPrice)} / day
        </p>
      </td>
      <td className="px-5 py-5">
        <Badge variant={bookingStatusVariant(booking.status)} dot>
          {booking.status || 'unknown'}
        </Badge>
      </td>
      <td className="px-5 py-5">
        <Identifier label="Booking ID" value={booking.id} />
        <p className="mt-3 text-xs text-[var(--text-tertiary)]">
          Created {timestampLabel(booking.createdAt)}
        </p>
        <p className="mt-1 text-xs text-[var(--text-tertiary)]">
          Updated {timestampLabel(booking.updatedAt)}
        </p>
        {lifecycle && (
          <p className="mt-1 text-xs text-[var(--text-tertiary)]">
            {lifecycle[0]} {timestampLabel(lifecycle[1])}
          </p>
        )}
      </td>
    </tr>
  );
}

function BookingMobileCard({ booking }) {
  const vehicle = bookingVehicle(booking);
  const pricing = bookingPricing(booking);
  const lifecycle = lifecycleTimestamp(booking);

  return (
    <article className="space-y-5 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <VehicleIdentity vehicle={vehicle} />
        <Badge variant={bookingStatusVariant(booking.status)} dot>
          {booking.status || 'unknown'}
        </Badge>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <div>
          <dt className="text-xs text-[var(--text-tertiary)]">Pickup</dt>
          <dd className="mt-1 font-medium text-[var(--text-primary)]">{formatDate(booking.pickupDate) || 'Unavailable'}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--text-tertiary)]">Return</dt>
          <dd className="mt-1 font-medium text-[var(--text-primary)]">{formatDate(booking.returnDate) || 'Unavailable'}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--text-tertiary)]">Duration</dt>
          <dd className="mt-1 text-[var(--text-primary)]">{pricing.rentalDays} {pricing.rentalDays === 1 ? 'day' : 'days'}</dd>
        </div>
        <div>
          <dt className="text-xs text-[var(--text-tertiary)]">Total</dt>
          <dd className="mt-1 font-medium text-[var(--text-primary)]">{formatPrice(pricing.total)}</dd>
          <dd className="mt-0.5 text-xs text-[var(--text-secondary)]">{formatPrice(pricing.dailyPrice)} / day</dd>
        </div>
      </dl>

      <div className="grid gap-3 border-t border-[var(--border)] pt-4 sm:grid-cols-2">
        <Identifier label="Customer UID" value={booking.customerId} />
        <Identifier label="Host UID" value={booking.ownerId} />
        <Identifier label="Booking ID" value={booking.id} />
        <Identifier label="Listing ID" value={booking.listingId} />
      </div>

      <p className="text-xs text-[var(--text-tertiary)]">
        Created {timestampLabel(booking.createdAt)} / Updated {timestampLabel(booking.updatedAt)}
        {lifecycle && ` / ${lifecycle[0]} ${timestampLabel(lifecycle[1])}`}
      </p>
    </article>
  );
}

function VehicleIdentity({ vehicle }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <img
        src={vehicle.image}
        alt=""
        className="h-14 w-20 shrink-0 rounded-[var(--radius-control)] bg-[var(--surface-subtle)] object-cover"
      />
      <div className="min-w-0">
        <p className="font-medium text-[var(--text-primary)]">{vehicle.name}</p>
        <p className="mt-1 text-xs text-[var(--text-secondary)]">
          {vehicle.year || 'Year unavailable'}
        </p>
      </div>
    </div>
  );
}

function Identifier({ label, value, className = '' }) {
  return (
    <div className={className}>
      <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-1 break-all font-mono text-[11px] leading-4 text-[var(--text-secondary)]">
        {value || 'Unavailable'}
      </p>
    </div>
  );
}
