import { useMemo, useState } from 'react';
import { addDays, startOfDay } from 'date-fns';
import { Link, useLocation, useNavigate } from 'react-router';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi2';
import Button from '@/components/ui/Button';
import DateRangePicker from '@/components/ui/DateRangePicker';
import { useAuth } from '@/hooks/useAuth';
import { formatPrice } from '@/utils/helpers';
import {
  BOOKING_PREVIEW_MESSAGE,
  isLocalSecureBooking,
} from './bookingMode';
import {
  MAX_RENTAL_DAYS,
  rentalDaysBetween,
  toIsoDate,
  validateBookingDates,
} from './bookingUi';

export default function SecureBookingPanel({ vehicle }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [pickupDate, setPickupDate] = useState(startOfDay(new Date()));
  const [returnDate, setReturnDate] = useState(addDays(startOfDay(new Date()), 1));
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const hostedListing = vehicle.source === 'firestore-listing';
  const ownerRequest = Boolean(user?.uid && vehicle.ownerId === user.uid);
  const secureEligible = isLocalSecureBooking && hostedListing && vehicle.available;
  const requestComplete = feedback?.type === 'success';
  const rentalDays = rentalDaysBetween(pickupDate, returnDate);
  const dateError = validateBookingDates(pickupDate, returnDate);
  const estimatedTotal = Number.isSafeInteger(vehicle.pricePerDay)
    && rentalDays > 0
    ? vehicle.pricePerDay * rentalDays
    : 0;

  const panelMessage = useMemo(() => {
    if (!hostedListing) return BOOKING_PREVIEW_MESSAGE;
    if (!isLocalSecureBooking) return BOOKING_PREVIEW_MESSAGE;
    if (!vehicle.available) return 'This listing is not currently available for requests.';
    if (ownerRequest) return 'You cannot request a car listed by your own account.';
    return '';
  }, [hostedListing, ownerRequest, vehicle.available]);

  const submitRequest = async () => {
    setFeedback(null);
    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!secureEligible || ownerRequest || dateError || submitting) return;

    setSubmitting(true);
    try {
      if (!import.meta.env.DEV) throw new Error(BOOKING_PREVIEW_MESSAGE);
      const { requestBooking } = await import('./bookingClient');
      const result = await requestBooking({
        listingId: vehicle.id,
        pickupDate: toIsoDate(pickupDate),
        returnDate: toIsoDate(returnDate),
      });
      setFeedback({
        type: 'success',
        message: result.idempotent
          ? 'This booking request already exists and is shown in My Bookings.'
          : 'Booking request sent securely to the host.',
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error?.message || 'The booking request could not be sent.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="booking-request"
      className="mt-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5"
      aria-labelledby="booking-request-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
            {secureEligible ? 'Secure booking request' : 'Review rental dates'}
          </p>
          <h2 id="booking-request-title" className="mt-1 font-heading text-xl font-semibold">
            Request this car
          </h2>
        </div>
        {secureEligible && (
          <span className="rounded-[var(--radius-pill)] bg-[var(--success-subtle)] px-2.5 py-1 text-xs font-medium text-[var(--success)]">
            Secure local booking
          </span>
        )}
      </div>

      <div className="mt-5">
        <DateRangePicker
          pickupDate={pickupDate}
          returnDate={returnDate}
          onPickupChange={setPickupDate}
          onReturnChange={setReturnDate}
          maxRentalDays={MAX_RENTAL_DAYS}
          disabled={!secureEligible || ownerRequest}
        />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-[var(--border)] py-4">
        <SummaryItem label="Rental days" value={rentalDays > 0 ? rentalDays : '—'} />
        <SummaryItem label="Daily price" value={formatPrice(vehicle.pricePerDay)} />
        <SummaryItem label="Estimated total" value={formatPrice(estimatedTotal)} />
      </dl>

      {(dateError && secureEligible && !ownerRequest) && (
        <p className="mt-3 text-sm text-[var(--danger)]" role="alert">{dateError}</p>
      )}
      {panelMessage && (
        <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">{panelMessage}</p>
      )}
      {feedback && (
        <div
          className={`mt-4 rounded-[var(--radius-control)] border px-4 py-3 text-sm ${
            feedback.type === 'success'
              ? 'border-[var(--success)] bg-[var(--success-subtle)] text-[var(--success)]'
              : 'border-[var(--danger)] bg-[var(--danger-subtle)] text-[var(--danger)]'
          }`}
          role={feedback.type === 'error' ? 'alert' : 'status'}
        >
          <div className="flex items-start gap-2">
            {feedback.type === 'success' && <HiCheckCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />}
            <span>{feedback.message}</span>
          </div>
          {feedback.type === 'success' && (
            <Link className="focus-ring mt-3 inline-flex items-center gap-1 rounded font-semibold underline" to="/my-bookings">
              View My Bookings
              <HiArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      )}

      <Button
        fullWidth
        size="lg"
        className="mt-5"
        disabled={(user && ownerRequest) || !secureEligible || Boolean(dateError) || requestComplete}
        loading={submitting}
        loadingLabel="Sending request"
        onClick={submitRequest}
      >
        {requestComplete
          ? 'Request sent'
          : !user && secureEligible
            ? 'Sign in to request'
            : secureEligible
              ? 'Send booking request'
              : 'Booking unavailable'}
      </Button>
      <p className="mt-3 text-center text-xs text-[var(--text-tertiary)]">
        {secureEligible
          ? 'Availability and final INR pricing are verified before the request is created.'
          : 'You can still review dates and estimated pricing. No reservation is created.'}
      </p>
    </section>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-[var(--text-tertiary)]">{label}</dt>
      <dd className="mt-1 text-sm font-semibold">{value}</dd>
    </div>
  );
}
