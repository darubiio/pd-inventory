"use client";

import React from "react";
import { usePermission } from "../hooks/usePermissions";
import { usePermissions, useLocations } from "../auth/PermissionsProvider";
import { Action, Subject } from "../../types/permissions";

interface BaseProtectedProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loading?: React.ReactNode;
}

interface ProtectedComponentProps extends BaseProtectedProps {
  action: Action;
  subject: Subject;
  field?: string;
}

export function ProtectedComponent({
  action,
  subject,
  field,
  children,
  fallback = null,
  loading = null,
}: ProtectedComponentProps) {
  const { allowed, isLoading } = usePermission(action, subject, field);

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!allowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface MultiplePermissionsProps extends BaseProtectedProps {
  permissions: Array<{ action: Action; subject: Subject; field?: string }>;
  requireAll?: boolean;
}

export function ProtectedMultiplePermissions({
  permissions,
  requireAll = true,
  children,
  fallback = null,
  loading = null,
}: MultiplePermissionsProps) {
  const { canAccess, isLoading } = usePermissions();

  if (isLoading) {
    return <>{loading}</>;
  }

  const permissionResults = permissions.map(({ action, subject, field }) =>
    canAccess(action, subject, field)
  );

  const hasPermission = requireAll
    ? permissionResults.every((result) => result)
    : permissionResults.some((result) => result);

  if (!hasPermission) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface LocationProtectedProps extends BaseProtectedProps {
  locationId: string;
}

export function LocationProtected({
  locationId,
  children,
  fallback = null,
  loading = null,
}: LocationProtectedProps) {
  const { hasLocationAccess } = useLocations();
  const { isLoading } = usePermissions();

  if (isLoading) {
    return <>{loading}</>;
  }

  if (!hasLocationAccess(locationId)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function AdminOnly({
  children,
  fallback = null,
  loading = null,
}: BaseProtectedProps) {
  return (
    <ProtectedComponent
      action="manage"
      subject="all"
      fallback={fallback}
      loading={loading}
    >
      {children}
    </ProtectedComponent>
  );
}

interface AllowedLocationsSelectorProps {
  locations: Array<{
    location_id?: string;
    branch_id?: string;
    location_name?: string;
    branch_name?: string;
  }>;
  onLocationSelect: (locationId: string) => void;
  selectedLocationId?: string;
  className?: string;
}

export function AllowedLocationsSelector({
  locations,
  onLocationSelect,
  selectedLocationId,
  className = "",
}: AllowedLocationsSelectorProps) {
  const { filterAllowedLocations } = useLocations();

  const allowedLocations = filterAllowedLocations(locations);

  if (allowedLocations.length === 0) {
    return (
      <div className={`text-gray-500 text-sm ${className}`}>
        No hay ubicaciones disponibles
      </div>
    );
  }

  return (
    <select
      value={selectedLocationId || ""}
      onChange={(e) => onLocationSelect(e.target.value)}
      className={`border rounded px-3 py-2 ${className}`}
    >
      {!selectedLocationId && <option value="">Seleccionar ubicación</option>}
      {allowedLocations.map((location) => {
        const id = location.location_id || location.branch_id || "";
        const name =
          location.location_name || location.branch_name || `Ubicación ${id}`;

        return (
          <option key={id} value={id}>
            {name}
          </option>
        );
      })}
    </select>
  );
}

export function withPermissions<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: { action: Action; subject: Subject; field?: string }[],
  options: {
    requireAll?: boolean;
    fallback?: React.ComponentType;
    loading?: React.ComponentType;
  } = {}
) {
  const {
    requireAll = true,
    fallback: FallbackComponent,
    loading: LoadingComponent,
  } = options;

  return function ProtectedPage(props: P) {
    return (
      <ProtectedMultiplePermissions
        permissions={requiredPermissions}
        requireAll={requireAll}
        fallback={
          FallbackComponent ? (
            <FallbackComponent />
          ) : (
            <div>No tienes permisos para acceder a esta página</div>
          )
        }
        loading={
          LoadingComponent ? <LoadingComponent /> : <div>Cargando...</div>
        }
      >
        <Component {...props} />
      </ProtectedMultiplePermissions>
    );
  };
}

export {
  ProtectedComponent as Protected,
  ProtectedMultiplePermissions as ProtectedMultiple,
};
