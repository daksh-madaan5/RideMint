import { useState } from 'react';
import { Link } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HiArrowPath,
  HiPencilSquare,
  HiPlus,
  HiRectangleStack,
} from 'react-icons/hi2';
import { toast } from 'react-toastify';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import PageHeader from '@/components/ui/PageHeader';
import Skeleton from '@/components/ui/Skeleton';
import ListingImageGallery from '@/features/listings/ListingImageGallery';
import {
  useOwnerListings,
  useReactivateListing,
} from '@/features/listings/listingHooks';
import { LISTING_STATUS_COPY } from '@/features/listings/listingSchema';
import { deactivateOwnListing } from '@/features/listings/listingService';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, formatPrice } from '@/utils/helpers';

const statusPresentation = {
  pending: {
    label: 'Pending',
    badge: 'warning',
    accent: 'border-l-[var(--warning)]',
  },
  approved: {
    label: 'Approved',
    badge: 'success',
    accent: 'border-l-[var(--success)]',
  },
  rejected: {
    label: 'Rejected',
    badge: 'danger',
    accent: 'border-l-[var(--danger)]',
  },
  inactive: {
    label: 'Inactive',
    badge: 'default',
    accent: 'border-l-[var(--text-tertiary)]',
  },
};

const statusOrder = ['pending', 'approved', 'rejected', 'inactive'];

export default function MyListings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [confirmAction, setConfirmAction] = useState(null);
  const { data: listings = [], isLoading, isError, refetch } = useOwnerListings(user?.uid);
  const reactivateMutation = useReactivateListing(user?.uid);

  const deactivateMutation = useMutation({
    mutationFn: (listing) => deactivateOwnListing({
      listingId: listing.id,
      ownerId: user.uid,
      current: listing,
    }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['owner-listings', user.uid] }),
        queryClient.invalidateQueries({ queryKey: ['catalog-vehicles'] }),
      ]);
      setConfirmAction(null);
      toast.success('Listing deactivated.');
    },
    onError: (error) => toast.error(error.message || 'Listing could not be deactivated.'),
  });

  const handleConfirm = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'reactivate') {
      reactivateMutation.mutate(confirmAction.listing, {
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ['catalog-vehicles'] });
          setConfirmAction(null);
          toast.success('Listing reactivated and submitted for review.');
        },
        onError: (error) => toast.error(error.message || 'Listing could not be reactivated.'),
      });
      return;
    }
    deactivateMutation.mutate(confirmAction.listing);
  };

  const actionBusy = deactivateMutation.isPending || reactivateMutation.isPending;
  const groupedListings = Object.fromEntries(
    statusOrder.map((status) => [
      status,
      listings.filter((listing) => listing.listingStatus === status),
    ])
  );

  return (
    <div className="mx-auto max-w-[var(--content-customer)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <PageHeader
        eyebrow="Host listings"
        title="My listings"
        description="Track review status, update vehicle information, or control whether a listing stays active."
        actions={<Button as={Link} to="/list-your-car" icon={HiPlus}>List another car</Button>}
      />

      {isLoading && (
        <div className="mt-8 grid gap-5 lg:grid-cols-2" aria-label="Loading your listings">
          {[0, 1].map((item) => (
            <Skeleton key={item} variant="card" className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5" />
          ))}
        </div>
      )}
      {isError && <ErrorState className="mt-8" title="Your listings did not load" onRetry={refetch} />}
      {!isLoading && !isError && listings.length === 0 && (
        <EmptyState
          className="mt-8 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]"
          icon={HiRectangleStack}
          title="You have not listed a car yet"
          description="Create your first listing and submit it for administrator review."
          action={<Button as={Link} to="/list-your-car">List your first car</Button>}
        />
      )}

      {!isLoading && !isError && listings.length > 0 && (
        <div className="mt-10 space-y-10">
          {statusOrder.map((status) => {
            const statusListings = groupedListings[status];
            if (!statusListings.length) return null;
            const presentation = statusPresentation[status];

            return (
              <section key={status} aria-labelledby={`${status}-listings-title`}>
                <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] pb-3">
                  <div>
                    <h2 id={`${status}-listings-title`} className="font-heading text-xl font-semibold">{presentation.label}</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{LISTING_STATUS_COPY[status]}</p>
                  </div>
                  <span className="text-sm font-medium text-[var(--text-tertiary)]">{statusListings.length}</span>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  {statusListings.map((listing) => (
                    <article
                      key={listing.id}
                      className={`overflow-hidden rounded-[var(--radius-card)] border border-l-4 border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-subtle)] transition-[transform,border-color,box-shadow] duration-[var(--duration-normal)] hover:-translate-y-[3px] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-card)] ${presentation.accent}`}
                    >
                      <div className="grid h-full sm:grid-cols-[12rem_1fr]">
                        <ListingImageGallery
                          listing={listing}
                          alt={`${listing.make} ${listing.model} listing`}
                          compact
                        />
                        <div className="flex min-w-0 flex-col p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="min-w-0">
                              <h3 className="truncate font-heading text-xl font-semibold">{listing.make} {listing.model}</h3>
                              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                                {listing.city} · {formatPrice(listing.pricePerDay)}/day
                              </p>
                            </div>
                            <Badge variant={presentation.badge}>{presentation.label}</Badge>
                          </div>

                          <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
                            {LISTING_STATUS_COPY[status]}
                          </p>
                          {status === 'rejected' && listing.rejectionReason && (
                            <div className="mt-3 rounded-[var(--radius-control)] bg-[var(--danger-subtle)] px-3 py-2 text-sm text-[var(--danger)]">
                              <strong>Rejection reason:</strong> {listing.rejectionReason}
                            </div>
                          )}

                          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <dt className="text-[var(--text-tertiary)]">Availability</dt>
                              <dd className="mt-1 font-medium capitalize">{listing.availabilityStatus}</dd>
                            </div>
                            <div>
                              <dt className="text-[var(--text-tertiary)]">Updated</dt>
                              <dd className="mt-1 font-medium">{formatDate(listing.updatedAt) || 'Pending timestamp'}</dd>
                            </div>
                          </dl>

                          <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
                            <Button
                              as={Link}
                              to={`/list-your-car/${listing.id}`}
                              variant="secondary"
                              size="sm"
                              icon={HiPencilSquare}
                            >
                              Edit
                            </Button>
                            {status === 'inactive' ? (
                              <Button
                                size="sm"
                                icon={HiArrowPath}
                                disabled={actionBusy}
                                loading={reactivateMutation.isPending && confirmAction?.listing.id === listing.id}
                                onClick={() => setConfirmAction({ type: 'reactivate', listing })}
                              >
                                Reactivate
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={actionBusy}
                                onClick={() => setConfirmAction({ type: 'deactivate', listing })}
                              >
                                Deactivate
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(confirmAction)}
        onClose={actionBusy ? undefined : () => setConfirmAction(null)}
        onConfirm={handleConfirm}
        title={confirmAction?.type === 'reactivate' ? 'Reactivate this listing?' : 'Deactivate this listing?'}
        description={
          confirmAction?.type === 'reactivate'
            ? 'Reactivated listings are submitted for review before becoming public.'
            : 'It will be hidden from customers. The listing will not be deleted.'
        }
        confirmText={confirmAction?.type === 'reactivate' ? 'Reactivate and submit' : 'Deactivate'}
        confirmVariant={confirmAction?.type === 'reactivate' ? 'primary' : 'destructive'}
        danger={confirmAction?.type !== 'reactivate'}
        isLoading={actionBusy}
      />
    </div>
  );
}
