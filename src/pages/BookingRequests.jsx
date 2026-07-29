import { useState } from 'react';
import { Link } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { HiInboxStack } from 'react-icons/hi2';
import BookingRecordCard from '@/features/bookings/BookingRecordCard';
import {
  BOOKING_PREVIEW_MESSAGE,
  isLocalSecureBooking,
} from '@/features/bookings/bookingMode';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Skeleton from '@/components/ui/Skeleton';
import { useAuth } from '@/hooks/useAuth';

export default function BookingRequests() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState('');
  const queryKey = ['rental-bookings', 'host', user?.uid];

  const requestsQuery = useQuery({
    queryKey,
    queryFn: async () => {
      if (!import.meta.env.DEV || !isLocalSecureBooking) return [];
      const { getHostRentalBookings } = await import(
        '@/features/bookings/bookingQueries'
      );
      return getHostRentalBookings(user.uid);
    },
    enabled: Boolean(user?.uid && isLocalSecureBooking),
  });

  const responseMutation = useMutation({
    mutationFn: async ({ bookingId, decision }) => {
      setActionError('');
      if (!import.meta.env.DEV || !isLocalSecureBooking) {
        throw new Error(BOOKING_PREVIEW_MESSAGE);
      }
      const { respondToBooking } = await import(
        '@/features/bookings/bookingClient'
      );
      return respondToBooking({ bookingId, decision });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey }),
    onError: (error) => {
      setActionError(
        error?.message?.includes('dates')
          ? `Date conflict: ${error.message}`
          : error?.message || 'The booking request could not be updated.'
      );
    },
  });

  if (!isLocalSecureBooking) {
    return (
      <RequestsShell>
        <EmptyState
          icon={HiInboxStack}
          title="Booking requests are currently unavailable"
          description={BOOKING_PREVIEW_MESSAGE}
          action={<Button as={Link} to="/my-listings">View My Listings</Button>}
        />
      </RequestsShell>
    );
  }

  if (requestsQuery.isLoading) {
    return (
      <RequestsShell>
        <div className="space-y-4">
          <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
          <Skeleton className="h-52 w-full rounded-[var(--radius-card)]" />
        </div>
      </RequestsShell>
    );
  }

  if (requestsQuery.isError) {
    return (
      <RequestsShell>
        <ErrorState
          title="Booking requests could not be loaded"
          description={requestsQuery.error?.message}
          onRetry={requestsQuery.refetch}
        />
      </RequestsShell>
    );
  }

  const requests = requestsQuery.data || [];

  return (
    <RequestsShell>
      {actionError && (
        <p className="mb-5 rounded-[var(--radius-control)] border border-[var(--danger)] bg-[var(--danger-subtle)] px-4 py-3 text-sm text-[var(--danger)]" role="alert">
          {actionError}
        </p>
      )}

      {requests.length === 0 ? (
        <EmptyState
          icon={HiInboxStack}
          title="No booking requests"
          description="Customer requests for your approved listings will appear here."
          action={<Button as={Link} to="/my-listings">View My Listings</Button>}
        />
      ) : (
        <div className="space-y-4">
          {requests.map((booking) => {
            const pending = booking.status === 'pending';
            const actionPending = responseMutation.isPending
              && responseMutation.variables?.bookingId === booking.id;
            return (
              <BookingRecordCard
                key={booking.id}
                booking={booking}
                actionPending={actionPending}
                secondaryAction={pending ? {
                  label: 'Reject',
                  variant: 'destructive',
                  onClick: () => responseMutation.mutate({
                    bookingId: booking.id,
                    decision: 'reject',
                  }),
                } : undefined}
                primaryAction={pending ? {
                  label: 'Accept',
                  loadingLabel: 'Responding',
                  onClick: () => responseMutation.mutate({
                    bookingId: booking.id,
                    decision: 'accept',
                  }),
                } : undefined}
              />
            );
          })}
        </div>
      )}
    </RequestsShell>
  );
}

function RequestsShell({ children }) {
  return (
    <div className="mx-auto w-full max-w-[var(--content-customer)] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
          Host workspace
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold">Booking Requests</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Accept or reject secure requests for listings owned by this account.
        </p>
      </header>
      {children}
    </div>
  );
}
