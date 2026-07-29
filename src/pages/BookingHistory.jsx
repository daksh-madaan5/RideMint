import { useState } from 'react';
import { Link } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HiCalendarDays } from 'react-icons/hi2';
import BookingRecordCard from '@/features/bookings/BookingRecordCard';
import {
  BOOKING_PREVIEW_MESSAGE,
  isLocalSecureBooking,
} from '@/features/bookings/bookingMode';
import { canCancelBooking } from '@/features/bookings/bookingUi';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';

export default function BookingHistory() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState('');
  const queryKey = ['rental-bookings', 'customer', user?.uid];

  const bookingsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!import.meta.env.DEV || !isLocalSecureBooking) return [];
      const { getCustomerRentalBookings } = await import(
        '@/features/bookings/bookingQueries'
      );
      return getCustomerRentalBookings(user.uid);
    },
    enabled: Boolean(user?.uid && isLocalSecureBooking),
  });

  const cancelMutation = useMutation({
    mutationFn: async (bookingId) => {
      setActionError('');
      if (!import.meta.env.DEV || !isLocalSecureBooking) {
        throw new Error(BOOKING_PREVIEW_MESSAGE);
      }
      const { cancelSecureBooking } = await import(
        '@/features/bookings/bookingClient'
      );
      return cancelSecureBooking(bookingId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: (error) => {
      setActionError(error?.message || 'The booking could not be cancelled.');
    },
  });

  if (!isLocalSecureBooking) {
    return (
      <BookingPageShell title="My Bookings" eyebrow="Booking availability">
        <EmptyState
          icon={HiCalendarDays}
          title="Online booking is unavailable"
          description={`${BOOKING_PREVIEW_MESSAGE} You can still browse cars and review estimated pricing.`}
          action={<Button as={Link} to="/cars">Browse cars</Button>}
        />
      </BookingPageShell>
    );
  }

  if (bookingsQuery.isLoading) {
    return (
      <BookingPageShell title="My Bookings">
        <div className="space-y-4">
          <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
          <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
        </div>
      </BookingPageShell>
    );
  }

  if (bookingsQuery.isError) {
    return (
      <BookingPageShell title="My Bookings">
        <ErrorState
          title="Bookings could not be loaded"
          description={bookingsQuery.error?.message}
          onRetry={bookingsQuery.refetch}
        />
      </BookingPageShell>
    );
  }

  const bookings = bookingsQuery.data || [];

  return (
    <BookingPageShell
      title="My Bookings"
      description="Booking requests created by this account."
    >
      {actionError && (
        <p className="mb-5 rounded-[var(--radius-control)] border border-[var(--danger)] bg-[var(--danger-subtle)] px-4 py-3 text-sm text-[var(--danger)]" role="alert">
          {actionError}
        </p>
      )}

      {bookings.length === 0 ? (
        <EmptyState
          icon={HiCalendarDays}
          title="No secure booking requests"
          description="Request an approved host listing to see it here."
          action={<Button as={Link} to="/cars">Browse cars</Button>}
        />
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const cancellable = canCancelBooking(booking);
            const pendingThisBooking = cancelMutation.isPending
              && cancelMutation.variables === booking.id;
            return (
              <BookingRecordCard
                key={booking.id}
                booking={booking}
                actionPending={pendingThisBooking}
                primaryAction={cancellable ? {
                  label: 'Cancel booking',
                  loadingLabel: 'Cancelling',
                  variant: 'destructive',
                  onClick: () => cancelMutation.mutate(booking.id),
                } : undefined}
              />
            );
          })}
        </div>
      )}
    </BookingPageShell>
  );
}

function BookingPageShell({ title, description, eyebrow = 'Secure bookings', children }) {
  return (
    <div className="mx-auto w-full max-w-[var(--content-customer)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">{title}</h1>
        {description && <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>}
      </header>
      {children}
    </div>
  );
}
