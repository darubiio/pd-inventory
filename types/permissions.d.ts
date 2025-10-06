import { ZohoUserData } from "./user";

export type Action =
  | "manage"
  | "create"
  | "read"
  | "update"
  | "delete"
  | "export"
  | "schedule"
  | "share";

export type Subject =
  | "customer"
  | "vendor"
  | "item"
  | "compositeitem"
  | "warehouse"
  | "transfer_order"
  | "inventory_adjustment"
  | "pricebooks"
  | "inventorycount"
  | "invoice"
  | "customer_payment"
  | "salesorder"
  | "picklist"
  | "package"
  | "shipment_order"
  | "creditnote"
  | "salesreturn"
  | "salesreturn_receive"
  | "sales_receipt"
  | "bill"
  | "vendor_payment"
  | "purchaseorder"
  | "purchase_receive"
  | "vendor_credit"
  | "expense"
  | "account"
  | "tax_rules"
  | "setting"
  | "report"
  | "documents"
  | "dashboard"
  | "branch"
  | "task_reminder"
  | "location"
  | "all";

export interface AppAbility {
  can(action: Action, subject: Subject, field?: string): boolean;
  cannot(action: Action, subject: Subject, field?: string): boolean;
}

export interface PermissionsContextType {
  ability: AppAbility | null;
  userLocations: ZohoUserData["branches"];
  allowedLocationIds: string[];
  hasLocationAccess: (locationId: string) => boolean;
  canAccess: (action: Action, subject: Subject, field?: string) => boolean;
  isLoading: boolean;
}

export interface ReportPermission {
  full_access: boolean;
  is_at_warehouse_level: boolean;
  can_schedule: boolean;
  report_constant: string;
  can_share: boolean;
  is_export_enabled: boolean;
  report_name_formatted: string;
  is_schedule_enabled: boolean;
  can_export: boolean;
  can_access: boolean;
}

export interface EntityPermission {
  entity: string;
  full_access: boolean;
  more_permissions?: Array<{
    is_enabled: boolean;
    permission_formatted: string;
    permission: string;
  }>;
  report_permissions?: Array<{
    reports: ReportPermission[];
    report_group_formatted: string;
    report_group: string;
  }>;
}
