import { DEMO_VEHICLES } from '../data/demoVehicles';
import {
  getApprovedPublicListingById,
  getApprovedPublicListings,
  listingToCatalogVehicle,
} from '@/features/listings/listingService';

/**
 * Phase 2 uses centralized demo data so the browsing flow is deterministic.
 * Existing Firestore read services remain untouched for the later integration phase.
 */
export async function getCatalogVehicles() {
  try {
    const publicListings = (await getApprovedPublicListings()).map(listingToCatalogVehicle);
    const publicKeys = new Set(publicListings.map(vehicleKey));
    const nonDuplicateDemos = DEMO_VEHICLES.filter((vehicle) => !publicKeys.has(vehicleKey(vehicle)));
    return [...publicListings, ...nonDuplicateDemos];
  } catch {
    return DEMO_VEHICLES;
  }
}

export async function getCatalogVehicleById(vehicleId) {
  const demoVehicle = DEMO_VEHICLES.find((vehicle) => vehicle.id === vehicleId);
  if (demoVehicle) return demoVehicle;
  try {
    const listing = await getApprovedPublicListingById(vehicleId);
    return listing ? listingToCatalogVehicle(listing) : null;
  } catch {
    return null;
  }
}

function vehicleKey(vehicle) {
  return `${vehicle.brand || vehicle.make}|${vehicle.model}|${vehicle.city}`.toLowerCase();
}
