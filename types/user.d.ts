export interface UserProfile {
  user_id: string;
  name: string;
  email: string;
  photo_url: string;
  user_role: string;
  user_type: string;
  status: string;
  email: string;
}

export interface BranchLocation {
  location_name: string;
  is_primary_branch: boolean;
  branch_id: string;
  branch_name: string;
  is_primary_location: boolean;
  is_default: boolean;
  location_id: string;
}

export interface MorePermission {
  is_enabled: boolean;
  permission_formatted: string;
  permission: string;
}

export interface ReportItem {
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

export interface ReportPermission {
  reports: ReportItem[];
  report_group_formatted: string;
  report_group: string;
}

export interface Permission {
  full_access: boolean;
  entity: string;
  more_permissions?: MorePermission[];
  report_permissions?: ReportPermission[];
}

export interface UserRole {
  role_name: string;
  permissions: Permission[];
  description: string;
  display_name: string;
}

export interface RoleData {
  role: UserRole;
  role_id: string;
  name: string;
  email: string;
  zuid: string;
}

export interface ZohoUserData {
  user_id: string;
  name: string;
  email_ids?: Array<{
    is_selected: boolean;
    email: string;
  }>;
  status?: string;
  user_role: string;
  user_type?: string;
  role_id?: string;
  is_super_admin?: boolean;
  is_admin?: boolean;
  photo_url?: string;
  role?: RoleData;
  email: string;
  mobile?: string;
  invitation_type?: string;
  billing_rate?: number;
  is_customer_segmented?: boolean;
  is_accountant?: boolean;
  created_time?: string;
  custom_fields?: any[];
  custom_field_hash?: Record<string, any>;
  is_associated_for_approval?: boolean;
  warehouses?: any[];
  is_associated_with_org_email?: boolean;
  branches?: BranchLocation[];
  segmentation_details?: any[];
  locations?: BranchLocation[];
  default_branch_id?: string;
  default_location_id?: string;
  associated_clients?: any[];
}
