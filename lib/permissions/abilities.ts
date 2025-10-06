import {
  AbilityBuilder,
  createMongoAbility,
  MongoAbility,
} from "@casl/ability";
import {
  ZohoUserData,
  Permission,
  MorePermission,
  ReportPermission,
} from "../../types/user";
import { Action, Subject } from "../../types/permissions";

export type AppAbility = MongoAbility<[Action, Subject]>;

export function createAbilityForUser(
  userData: ZohoUserData | null
): AppAbility {
  const { can, cannot, build } = new AbilityBuilder<AppAbility>(
    createMongoAbility
  );

  if (!userData) {
    cannot("manage", "all");
    return build();
  }

  const { role } = userData;

  if (userData.is_super_admin) {
    can("manage", "all");
    return build();
  }

  if (userData.is_admin) {
    can("manage", "all");
    return build();
  }

  if (!role?.role?.permissions) {
    can("read", "dashboard");
    can("read", "item");
    can("read", "warehouse");
    return build();
  }
  if (role?.role?.permissions) {
    role.role.permissions.forEach((permission: Permission) => {
      const entity = permission.entity as Subject;

      if (permission.full_access) {
        can("manage", entity);
      } else {
        if (permission.more_permissions) {
          permission.more_permissions.forEach((morePerm: MorePermission) => {
            if (morePerm.is_enabled) {
              switch (morePerm.permission) {
                case "export_data":
                  can("export", entity);
                  break;
                case "preferences":
                case "update_org_profile":
                  can("update", entity);
                  break;
                default:
                  can("read", entity);
                  break;
              }
            }
          });
        }
        if (permission.report_permissions) {
          permission.report_permissions.forEach(
            (reportGroup: ReportPermission) => {
              reportGroup.reports.forEach((report) => {
                if (report.can_access) {
                  can("read", "report");
                }
                if (report.can_export) {
                  can("export", "report");
                }
                if (report.can_schedule) {
                  can("schedule", "report");
                }
                if (report.can_share) {
                  can("share", "report");
                }
              });
            }
          );
        }
      }
    });
  }

  if (userData.branches && userData.branches.length > 0) {
    can("read", "location");
    userData.branches.forEach(() => {
      can("manage", "branch");
    });
  }

  return build();
}

export function getAllowedLocationIds(userData: ZohoUserData | null): string[] {
  if (!userData?.branches?.length) {
    return [];
  }

  return userData.branches.map((branch) => branch.branch_id);
}

export function hasLocationAccess(
  userData: ZohoUserData | null,
  locationId: string
): boolean {
  if (!userData) {
    return false;
  }

  if (userData.is_super_admin) {
    return true;
  }

  const allowedIds = getAllowedLocationIds(userData);
  return allowedIds.includes(locationId);
}

export function getAllowedLocations(userData: ZohoUserData | null) {
  if (!userData?.branches) {
    return [];
  }

  return userData.branches;
}

export function mapZohoEntityToSubject(entity: string): Subject {
  const entityMap: Record<string, Subject> = {
    customer: "customer",
    vendor: "vendor",
    item: "item",
    compositeitem: "compositeitem",
    warehouse: "warehouse",
    transfer_order: "transfer_order",
    inventory_adjustment: "inventory_adjustment",
    pricebooks: "pricebooks",
    inventorycount: "inventorycount",
    invoice: "invoice",
    customer_payment: "customer_payment",
    salesorder: "salesorder",
    picklist: "picklist",
    package: "package",
    shipment_order: "shipment_order",
    creditnote: "creditnote",
    salesreturn: "salesreturn",
    salesreturn_receive: "salesreturn_receive",
    sales_receipt: "sales_receipt",
    bill: "bill",
    vendor_payment: "vendor_payment",
    purchaseorder: "purchaseorder",
    purchase_receive: "purchase_receive",
    vendor_credit: "vendor_credit",
    expense: "expense",
    account: "account",
    tax_rules: "tax_rules",
    setting: "setting",
    report: "report",
    documents: "documents",
    dashboard: "dashboard",
    branch: "branch",
    task_reminder: "task_reminder",
  };

  return entityMap[entity] || "all";
}
