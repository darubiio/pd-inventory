export interface ZohoAuthToken {
  access_token: string;
  scope: string;
  api_domain: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface ZohoUser {
  user_id: string;
  name: string;
  email: string;
  email_ids: Array<{
    email: string;
    is_selected: boolean;
  }>;
  status: string;
  user_role: string;
  user_type: string;
  role_id: string;
  photo_url: string;
  is_claimant: boolean;
  created_time: string;
  custom_fields: string;
}

export interface ZohoUserResponse {
  code: number;
  message: string;
  user: ZohoUser;
}

export interface UserSession {
  user: ZohoUser;
  access_token: string;
  expires_at: number;
  refresh_token?: string;
  refreshed_at?: number;
  refresh_count?: number;
  last_activity?: number;
}

export interface Location {
  location_id: string;
  location_name: string;
  type: string;
  address: {
    street_address1: string;
    street_address2: string;
    city: string;
    postal_code: string;
    country: string;
    state: string;
    state_code: string;
  };
  phone: string;
  tax_settings_id: string;
  website: string;
  fax: string;
  email: string;
  is_location_active: boolean;
  is_primary_location: boolean;
  autonumbergenerationgroup_id: string;
  autonumbergenerationgroup_name: string;
  is_storage_location_enabled: boolean;
  total_zones: string;
  location_stock_on_hand: number;
  parent_location_id: string;
  warehouses: Warehouse[];
  shippingzones: unknown[];
  is_fba_location: boolean;
  sales_channels: unknown[];
}

export interface Warehouse {
  location_id: string;
  location_name: string;
  attention: string;
  address: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  state_code: string;
  country: string;
  zip: string;
  phone: string;
  email: string;
  status: string;
}

export interface Item {
  item_id: string;
  name: string;
  item_name: string;
  category_id: string;
  category_name: string;
  unit: string;
  status: "active" | "inactive";
  source: string;
  is_combo_product: boolean;
  is_linked_with_zohocrm: boolean;
  zcrm_product_id: string;
  description: string;
  brand: string;
  manufacturer: string;
  rate: number;
  tax_id: string;
  tax_name: string;
  tax_percentage: number;
  purchase_account_id: string;
  purchase_account_name: string;
  account_id: string;
  account_name: string;
  purchase_description: string;
  purchase_rate: number;
  can_be_sold: boolean;
  can_be_purchased: boolean;
  track_inventory: boolean;
  item_type: "inventory" | "non-inventory" | string;
  product_type: "goods" | "services" | string;
  stock_on_hand: number;
  has_attachment: boolean;
  is_returnable: boolean;
  available_stock: number;
  actual_available_stock: number;
  sku: string;
  upc: string;
  ean: string;
  isbn: string;
  part_number: string;
  is_storage_location_enabled: boolean;
  reorder_level: number;
  image_name: string;
  image_type: string;
  image_document_id: string;
  created_time: string; // ISO date string
  last_modified_time: string; // ISO date string
  show_in_storefront: boolean;
  cf_perdomo_distributor_miami_r: string;
  cf_perdomo_distributor_miami_r_unformatted: string;
  cf_perdomo_distributor_naples_: string;
  cf_perdomo_distributor_naples__unformatted: string;
  cf_perdomo_distributor_fort_my: string;
  cf_perdomo_distributor_fort_my_unformatted: string;
  cf_perdomo_distributor_tampa_r: string;
  cf_perdomo_distributor_tampa_r_unformatted: string;
  cf_perdomo_distributor_katy_re: string;
  cf_perdomo_distributor_katy_re_unformatted: string;
  cf_perdomo_distributor_sarasot: string;
  cf_perdomo_distributor_sarasot_unformatted: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  weight_unit: string;
  dimension_unit: string;
  tags: string[];
}

export interface ItemDetails {
  item_id: string;
  name: string;
  unit: string;
  unit_id: string;
  description: string;
  category_id: string;
  category_name: string;
  product_type: string;
  purchase_account_id: string;
  vendor_id: string;
  vendor_name: string;
  purchase_description: string;
  purchase_account_name: string;
  account_id: string;
  account_name: string;
  tax_id: string;
  tax_name: string;
  tax_name_formatted: string;
  tax_percentage: number;
  tax_type: string;
  tax_status: string;
  tax_groups_details: string;
  tax_country_code: string;
  tax_information: string;
  purchase_tax_id: string;
  purchase_tax_name: string;
  purchase_tax_percentage: number;
  purchase_tax_type: string;
  purchase_tax_information: string;
  sales_tax_rule_id: string;
  sales_tax_rule_name: string;
  purchase_tax_rule_id: string;
  purchase_tax_rule_name: string;
  inventory_account_id: string;
  inventory_account_name: string;
  tags: string[];
  status: string;
  source: string;
  is_combo_product: boolean;
  is_storage_location_enabled: boolean;
  item_type: string;
  is_returnable: boolean;
  rate: number;
  pricing_scheme: string;
  default_price_brackets: {
    pricebook_discount: string;
    start_quantity: number;
    end_quantity: number;
    pricebook_rate: number;
  }[];
  pricebook_rate: number;
  price_brackets: unknown[];
  combo_type: string;
  purchase_rate: number;
  stock_on_hand: number;
  asset_value: string;
  available_stock: number;
  actual_available_stock: number;
  committed_stock: number;
  actual_committed_stock: number;
  available_for_sale_stock: number;
  actual_available_for_sale_stock: number;
  sku: string;
  image_document_id: string;
  sales_margin: string;
  package_details: {
    length: string;
    width: string;
    height: string;
    weight: string;
    weight_unit: string;
    dimension_unit: string;
  };
  custom_fields: unknown[];
  locations: Location[];
}

export interface CategoryItem {
  id: string;
  name: string;
  items: Array<CategoryItem>;
  [warehouse: string]: number | string | Array<any>;
}

interface ItemCategories {
  [category: string]: CategoryItem;
}

interface WarehouseCategory {
  [warehouse: string]: {
    [category: string]: number | string;
    name: string;
  };
}

interface Categories {
  category_id: string;
  category_name: string;
}

export interface WarehouseAndPosition extends Location {
  coordinates: [number, number];
  mapUrl: string;
}

export interface ZohoOrganization {
  organization_id: string;
  name: string;
  contact_name: string;
  email: string;
  is_default_org: boolean;
  plan_type: number;
  tax_group_enabled: boolean;
  zi_migration_status: number;
  plan_name: string;
  plan_period: string;
  language_code: string;
  fiscal_year_start_month: number;
  account_created_date: string;
  account_created_date_formatted: string;
  time_zone: string;
  is_org_active: boolean;
  currency_id: string;
  currency_code: string;
  currency_symbol: string;
  currency_format: string;
  price_precision: number;
}

export type LocationsResponse = {
  locations: Location[];
};

export type ItemDetailsResponse = {
  items: ItemDetails;
};

export type OrganizationsResponse = {
  organizations: ZohoOrganization[];
};

type ItemsResponse = {
  items: Item[];
  page_context?: {
    has_more_page: boolean;
  };
};

type MapBoxLocationResponse = {
  features: {
    center: [number, number];
  }[];
};

export interface PackageLineItem {
  line_item_id: string;
  so_line_item_id: string;
  item_id: string;
  name: string;
  description: string;
  sku: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  part_number?: string;
  quantity: number;
  unit: string;
  is_invoiced: boolean;
  item_custom_fields?: Array<{
    customfield_id: string;
    label: string;
    value: string;
  }>;
}

export interface PackageDetail {
  package_id: string;
  package_number: string;
  salesorder_id: string;
  salesorder_number: string;
  date: string;
  customer_id: string;
  customer_name: string;
  status: string;
  total_quantity: string;
  line_items: PackageLineItem[];
  shipment_order?: {
    shipment_id?: string;
    carrier?: string;
    tracking_number?: string;
    shipping_date?: string;
    status?: string;
  };
  shipping_address?: {
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  notes?: string;
}
