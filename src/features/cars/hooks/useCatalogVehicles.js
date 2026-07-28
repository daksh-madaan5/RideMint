import { useQuery } from '@tanstack/react-query';
import { getCatalogVehicleById, getCatalogVehicles } from '../services/catalogService';

export function useCatalogVehicles() {
  return useQuery({
    queryKey: ['catalog-vehicles'],
    queryFn: getCatalogVehicles,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCatalogVehicle(vehicleId) {
  return useQuery({
    queryKey: ['catalog-vehicle', vehicleId],
    queryFn: () => getCatalogVehicleById(vehicleId),
    enabled: Boolean(vehicleId),
    staleTime: 5 * 60 * 1000,
  });
}
