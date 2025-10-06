import { usePermissions as usePermissionsContext } from "../auth/PermissionsProvider";
import { Action, Subject } from "../../types/permissions";

export function usePermission(
  action: Action,
  subject: Subject,
  field?: string
) {
  const { canAccess, isLoading } = usePermissionsContext();

  const allowed = canAccess(action, subject, field);

  return {
    allowed,
    isLoading,
    can: allowed,
    cannot: !allowed,
  };
}

export function useMultiplePermissions(
  permissions: Array<{ action: Action; subject: Subject; field?: string }>
) {
  const { canAccess, isLoading } = usePermissionsContext();

  const results = permissions.map(({ action, subject, field }) => ({
    action,
    subject,
    field,
    allowed: canAccess(action, subject, field),
  }));

  const allAllowed = results.every((result) => result.allowed);
  const anyAllowed = results.some((result) => result.allowed);

  return {
    results,
    allAllowed,
    anyAllowed,
    isLoading,
  };
}

export function useInventoryPermissions() {
  const { canAccess } = usePermissionsContext();

  return {
    canViewItems: canAccess("read", "item"),
    canCreateItems: canAccess("create", "item"),
    canUpdateItems: canAccess("update", "item"),
    canDeleteItems: canAccess("delete", "item"),
    canManageItems: canAccess("manage", "item"),

    canViewWarehouses: canAccess("read", "warehouse"),
    canCreateWarehouses: canAccess("create", "warehouse"),
    canUpdateWarehouses: canAccess("update", "warehouse"),
    canDeleteWarehouses: canAccess("delete", "warehouse"),
    canManageWarehouses: canAccess("manage", "warehouse"),

    canViewInventoryAdjustments: canAccess("read", "inventory_adjustment"),
    canCreateInventoryAdjustments: canAccess("create", "inventory_adjustment"),
    canManageInventoryAdjustments: canAccess("manage", "inventory_adjustment"),
  };
}

export function useReportsPermissions() {
  const { canAccess } = usePermissionsContext();

  return {
    canViewReports: canAccess("read", "report"),
    canExportReports: canAccess("export", "report"),
    canScheduleReports: canAccess("schedule", "report"),
    canShareReports: canAccess("share", "report"),
    canManageReports: canAccess("manage", "report"),
  };
}

export function useSettingsPermissions() {
  const { canAccess } = usePermissionsContext();

  return {
    canViewSettings: canAccess("read", "setting"),
    canUpdateSettings: canAccess("update", "setting"),
    canManageSettings: canAccess("manage", "setting"),

    canViewUsers: canAccess("read", "setting"),
    canManageUsers: canAccess("manage", "setting"),
    canExportData: canAccess("export", "all"),
  };
}

export function useAdminPermissions() {
  const { canAccess } = usePermissionsContext();

  return {
    isAdmin: canAccess("manage", "all"),
    canManageAll: canAccess("manage", "all"),
  };
}
