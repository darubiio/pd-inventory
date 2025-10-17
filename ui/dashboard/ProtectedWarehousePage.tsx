"use client";

import { useWarehouseAccess } from "../../lib/hooks/useWarehousePermissions";
import { LocationProtected } from "../../lib/components/ProtectedComponent";

interface ProtectedWarehousePageProps {
  warehouseId: string;
  children: React.ReactNode;
}

export const ProtectedWarehousePage = ({
  warehouseId,
  children,
}: ProtectedWarehousePageProps) => {
  const { hasAccess, isLoading } = useWarehouseAccess(warehouseId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this location.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
