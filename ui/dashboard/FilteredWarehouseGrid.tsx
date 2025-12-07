"use client";

import { useLocations } from "../../lib/auth/PermissionsProvider";
import { usePermissions } from "../../lib/auth/PermissionsProvider";
import { WarehouseCard } from "./WarehouseCard";
import { WarehouseAndPosition } from "../../types/zoho";
import Loading from "../../app/dashboard/(warehouses)/loading";

interface FilteredWarehouseGridProps {
  warehouses: WarehouseAndPosition[] | null;
}

export const FilteredWarehouseGrid = ({
  warehouses,
}: FilteredWarehouseGridProps) => {
  const { hasLocationAccess } = useLocations();
  const { canAccess, isLoading } = usePermissions();

  if (isLoading) return <Loading />;

  if (!canAccess("read", "warehouse")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Warehouse Permissions
          </h2>
          <p className="text-gray-600">
            You don't have permissions to view warehouses.
          </p>
        </div>
      </div>
    );
  }

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Warehouses Available
          </h2>
          <p className="text-gray-600">No warehouses found in the system.</p>
        </div>
      </div>
    );
  }

  const allowedWarehouses = warehouses.filter((location) =>
    hasLocationAccess(location.location_id)
  );

  if (allowedWarehouses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            No Location Access
          </h2>
          <p className="text-gray-600 mb-4">
            You don't have access to any warehouse locations.
          </p>
          <p className="text-sm text-gray-500">
            Contact your administrator to request access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="m-2">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-4">
        {allowedWarehouses.map((warehouse) => (
          <WarehouseCard key={warehouse.location_id} {...warehouse} />
        ))}
      </div>
    </div>
  );
};
