import {
  getApprovedPublicListingById,
  getApprovedPublicListings,
  listingToCatalogVehicle,
} from '@/features/listings/listingService';

export async function getCatalogVehicles() {
  const publicListings = await getApprovedPublicListings();
  return publicListings.map(listingToCatalogVehicle);
}

export async function getCatalogVehicleById(vehicleId) {
  const listing = await getApprovedPublicListingById(vehicleId);
  return listing ? listingToCatalogVehicle(listing) : null;
}
