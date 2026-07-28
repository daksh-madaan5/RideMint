import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  HiCheck,
  HiClipboardDocumentCheck,
  HiEye,
  HiXMark,
} from 'react-icons/hi2';
import { toast } from 'react-toastify';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import ErrorState from '@/components/ui/ErrorState';
import Modal from '@/components/ui/Modal';
import PageHeader from '@/components/ui/PageHeader';
import Skeleton from '@/components/ui/Skeleton';
import Textarea from '@/components/ui/Textarea';
import VehicleImage from '@/features/cars/VehicleImage';
import { usePendingListings } from '@/features/listings/listingHooks';
import { moderateListing } from '@/features/listings/listingService';
import { useAuth } from '@/hooks/useAuth';
import { formatDate, formatPrice } from '@/utils/helpers';

export default function ModerateListings() {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [reasonError, setReasonError] = useState('');
  const { data: listings = [], isLoading, isError, refetch } = usePendingListings(isAdmin);

  const closeReview = () => {
    setSelected(null);
    setRejectionReason('');
    setReasonError('');
  };

  const openReview = (listing) => {
    setSelected(listing);
    setRejectionReason('');
    setReasonError('');
  };

  const moderationMutation = useMutation({
    mutationFn: ({ decision }) => moderateListing({
      listingId: selected.id,
      adminId: user.uid,
      decision,
      rejectionReason,
    }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-listings'] }),
        queryClient.invalidateQueries({ queryKey: ['catalog-vehicles'] }),
      ]);
      toast.success(variables.decision === 'approved' ? 'Listing approved.' : 'Listing rejected.');
      closeReview();
    },
    onError: (error) => toast.error(error.message || 'Moderation action failed.'),
  });

  const reject = () => {
    if (!rejectionReason.trim()) {
      setReasonError('Add a clear reason the host can act on.');
      return;
    }
    setReasonError('');
    moderationMutation.mutate({ decision: 'rejected' });
  };

  return (
    <div>
      <PageHeader
        eyebrow="Marketplace moderation"
        title="Pending listings"
        description="Review submitted vehicle details before approving or rejecting a public listing."
      />

      {isLoading && (
        <div className="mt-6 space-y-3" aria-label="Loading pending listings">
          {[0, 1, 2].map((item) => (
            <Skeleton key={item} className="h-20 w-full rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]" />
          ))}
        </div>
      )}
      {isError && (
        <ErrorState
          title="Pending listings did not load"
          onRetry={refetch}
          className="mt-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]"
        />
      )}
      {!isLoading && !isError && listings.length === 0 && (
        <EmptyState
          icon={HiClipboardDocumentCheck}
          className="mt-6 rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)]"
          title="No pending listings"
          description="New and reactivated host listings will appear here for review."
        />
      )}

      {!isLoading && !isError && listings.length > 0 && (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Vehicle</th>
                    <th className="px-5 py-3 font-semibold">Host</th>
                    <th className="px-5 py-3 font-semibold">City</th>
                    <th className="px-5 py-3 font-semibold">Price/day</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="transition-colors hover:bg-[var(--surface-subtle)]">
                      <td className="px-5 py-4 font-medium">{listing.make} {listing.model}</td>
                      <td className="px-5 py-4 text-[var(--text-secondary)]">{listing.ownerSnapshot?.displayName || 'RideMint member'}</td>
                      <td className="px-5 py-4 text-[var(--text-secondary)]">{listing.city}</td>
                      <td className="px-5 py-4 font-medium">{formatPrice(listing.pricePerDay)}</td>
                      <td className="px-5 py-4"><Badge variant="warning">Pending</Badge></td>
                      <td className="px-5 py-4 text-right">
                        <Button variant="secondary" size="sm" icon={HiEye} onClick={() => openReview(listing)}>
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 space-y-4 md:hidden">
            {listings.map((listing) => (
              <article key={listing.id} className="rounded-[var(--radius-card)] border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-heading text-lg font-semibold">{listing.make} {listing.model}</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{listing.city} · {formatPrice(listing.pricePerDay)}/day</p>
                  </div>
                  <Badge variant="warning">Pending</Badge>
                </div>
                <p className="mt-4 text-sm text-[var(--text-secondary)]">
                  Listed by {listing.ownerSnapshot?.displayName || 'RideMint member'}
                </p>
                <Button fullWidth variant="secondary" size="sm" icon={HiEye} className="mt-5" onClick={() => openReview(listing)}>
                  Review listing
                </Button>
              </article>
            ))}
          </div>
        </>
      )}

      <Modal
        isOpen={Boolean(selected)}
        onClose={moderationMutation.isPending ? undefined : closeReview}
        title={selected ? `${selected.make} ${selected.model}` : 'Listing review'}
        description="Review the submitted public information before making a moderation decision."
        size="xl"
      >
        {selected && (
          <div className="grid gap-6 md:grid-cols-[1fr_1.05fr]">
            <div>
              <VehicleImage
                src={selected.images?.[0]?.url}
                alt={`${selected.make} ${selected.model} submitted listing`}
                className="rounded-[var(--radius-card)] border border-[var(--border)]"
              />
              {selected.images?.length > 1 && (
                <p className="mt-2 text-xs text-[var(--text-secondary)]">{selected.images.length} images submitted</p>
              )}
            </div>
            <div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <ReviewField term="Host" detail={selected.ownerSnapshot?.displayName || 'RideMint member'} />
                <ReviewField term="Submitted" detail={formatDate(selected.createdAt) || 'Pending timestamp'} />
                <ReviewField term="City" detail={selected.city} />
                <ReviewField term="Category" detail={selected.category} />
                <ReviewField term="Year" detail={selected.year} />
                <ReviewField term="Seats" detail={selected.seats} />
                <ReviewField term="Transmission" detail={selected.transmission} />
                <ReviewField term="Fuel" detail={selected.fuelType} />
                <ReviewField term="Price/day" detail={formatPrice(selected.pricePerDay)} />
                <ReviewField term="Availability" detail={selected.availabilityStatus} />
              </dl>
              <div className="mt-5">
                <h3 className="text-sm font-semibold">Description</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{selected.description}</p>
              </div>
              <div className="mt-5">
                <Textarea
                  label="Rejection reason"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  error={reasonError}
                  supportingText="Required when rejecting. Keep the reason specific and actionable."
                />
              </div>
              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="destructive"
                  icon={HiXMark}
                  onClick={reject}
                  loading={moderationMutation.isPending}
                  fullWidth
                  className="sm:w-auto"
                >
                  Reject
                </Button>
                <Button
                  icon={HiCheck}
                  onClick={() => moderationMutation.mutate({ decision: 'approved' })}
                  loading={moderationMutation.isPending}
                  fullWidth
                  className="sm:w-auto"
                >
                  Approve
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function ReviewField({ term, detail }) {
  return (
    <div>
      <dt className="text-xs text-[var(--text-tertiary)]">{term}</dt>
      <dd className="mt-1 font-medium capitalize">{detail}</dd>
    </div>
  );
}
