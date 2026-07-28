import { useQuery } from '@tanstack/react-query';
import { getCatalogVehicleById, getCatalogVehicles } from '../services/catalogService';

export function useCatalogVehicles() {
  return useQuery({
    queryKey: ['demo-catalog-vehicles'],
    queryFn: getCatalogVehicles,
    staleTime: Infinity,
  });
}

export function useCatalogVehicle(vehicleId) {
  return useQuery({
    queryKey: ['demo-catalog-vehicle', vehicleId],
    queryFn: () => getCatalogVehicleById(vehicleId),
    enabled: Boolean(vehicleId),
    staleTime: Infinity,
  });
}

