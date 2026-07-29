import { HiCalendarDays, HiMapPin } from 'react-icons/hi2';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { bookingStatusVariant } from './bookingUi';
import { formatPrice } from '@/utils/helpers';

function displayDate(value) {
  if (!value) return 'Date unavailable';
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function BookingRecordCard({
  booking,
  primaryAction,
  secondaryAction,
  actionPending = false,
}) {
  const listing = booking.listingSnapshot || {};
  const pricing = booking.pricingSnapshot || {};
  const vehicleName = `${listing.make || 'Vehicle'} ${listing.model || ''}`.trim();

  return (
    <Card className="overflow-hidden">
      <div className="grid sm:grid-cols-[12rem_1fr]">
        <div className="min-h-40 bg-[var(--surface-subtle)]">
          {listing.imageUrl ? (
            <img
              src={listing.imageUrl}
              alt={vehicleName}
              className="h-full min-h-40 w-full object-cover"
            />
          ) : (
            <div className="flex h-full min-h-40 items-center justify-center px-4 text-center text-sm text-[var(--text-tertiary)]">
              Vehicle image unavailable
            </div>
          )}
        </div>

        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-heading text-xl font-semibold">{vehicleName}</h2>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{listing.year}</p>
            </div>
            <Badge variant={bookingStatusVariant(booking.status)} dot>
              {booking.status}
            </Badge>
          </div>

          <div className="mt-4 grid gap-2 text-sm text-[var(--text-secondary)] sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <HiCalendarDays className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              {displayDate(booking.pickupDate)} – {displayDate(booking.returnDate)}
            </p>
            <p className="flex items-center gap-2">
              <HiMapPin className="h-4 w-4 text-[var(--primary)]" aria-hidden="true" />
              {listing.city || 'Pickup city unavailable'}
            </p>
          </div>

          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-[var(--border)] pt-4">
            <PriceItem label="Duration" value={`${pricing.rentalDays || 0} ${pricing.rentalDays === 1 ? 'day' : 'days'}`} />
            <PriceItem label="Daily price" value={formatPrice(pricing.pricePerDay || 0)} />
            <PriceItem label="Total" value={formatPrice(pricing.totalAmount || 0)} />
          </dl>

          {(primaryAction || secondaryAction) && (
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              {secondaryAction && (
                <Button
                  variant={secondaryAction.variant || 'secondary'}
                  size="sm"
                  disabled={actionPending}
                  onClick={secondaryAction.onClick}
                >
                  {secondaryAction.label}
                </Button>
              )}
              {primaryAction && (
                <Button
                  variant={primaryAction.variant || 'primary'}
                  size="sm"
                  loading={actionPending}
                  loadingLabel={primaryAction.loadingLabel || 'Working'}
                  onClick={primaryAction.onClick}
                >
                  {primaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function PriceItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-[var(--text-tertiary)]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
