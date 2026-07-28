import { DEMO_VEHICLES } from '../data/demoVehicles';

/**
 * Phase 2 uses centralized demo data so the browsing flow is deterministic.
 * Existing Firestore read services remain untouched for the later integration phase.
 */
export async function getCatalogVehicles() {
  return DEMO_VEHICLES;
}

export async function getCatalogVehicleById(vehicleId) {
  return DEMO_VEHICLES.find((vehicle) => vehicle.id === vehicleId) || null;
}

