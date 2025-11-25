import { useLocations, usePermissions } from "../auth/PermissionsProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useWarehouseAccess(warehouseId: string) {
  const { hasLocationAccess } = useLocations();
  const { isLoading } = usePermissions();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hasLocationAccess(warehouseId)) {
      router.replace("/dashboard");
    }
  }, [warehouseId, hasLocationAccess, isLoading, router]);

  return {
    hasAccess: hasLocationAccess(warehouseId),
    isLoading,
  };
}

export function useWarehousePermissions() {
  const { hasLocationAccess, userLocations, allowedLocationIds } =
    useLocations();

  const filterAllowedWarehouses = <T extends { location_id: string }>(
    warehouses: T[]
  ): T[] => {
    return warehouses.filter((warehouse) =>
      hasLocationAccess(warehouse.location_id)
    );
  };

  return {
    hasLocationAccess,
    userLocations,
    allowedLocationIds,
    filterAllowedWarehouses,
  };
}
