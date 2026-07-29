import { FALLBACK_VEHICLES } from '../data/catalogVehicles';
import {
  getApprovedPublicListingById,
  getApprovedPublicListings,
  listingToCatalogVehicle,
} from '@/features/listings/listingService';

export async function getCatalogVehicles() {
  try {
    const publicListings = (await getApprovedPublicListings()).map(listingToCatalogVehicle);
    const publicKeys = new Set(publicListings.map(vehicleKey));
    const uniqueFallbacks = FALLBACK_VEHICLES.filter((vehicle) => !publicKeys.has(vehicleKey(vehicle)));
    return [...publicListings, ...uniqueFallbacks];
  } catch {
    return FALLBACK_VEHICLES;
  }
}

export async function getCatalogVehicleById(vehicleId) {
  const fallbackVehicle = FALLBACK_VEHICLES.find((vehicle) => vehicle.id === vehicleId);
  if (fallbackVehicle) return fallbackVehicle;
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
