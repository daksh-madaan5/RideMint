import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getOwnerListingById,
  getOwnerListings,
  getPendingListings,
  reactivateOwnListing,
} from './listingService';

export function useOwnerListings(ownerId) {
  return useQuery({
    queryKey: ['owner-listings', ownerId],
    queryFn: () => getOwnerListings(ownerId),
    enabled: Boolean(ownerId),
  });
}

export function useOwnerListing(listingId, ownerId) {
  return useQuery({
    queryKey: ['owner-listing', listingId, ownerId],
    queryFn: () => getOwnerListingById(listingId, ownerId),
    enabled: Boolean(listingId && ownerId),
  });
}

export function usePendingListings(enabled) {
  return useQuery({
    queryKey: ['pending-listings'],
    queryFn: getPendingListings,
    enabled,
  });
}

export function useReactivateListing(ownerId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listing) => reactivateOwnListing({
      listingId: listing.id,
      ownerId,
      current: listing,
    }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['owner-listings', ownerId] }),
  });
}
