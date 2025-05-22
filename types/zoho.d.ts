export interface ZohoAuthToken {
  access_token: string;
  scope: string;
  api_domain: string;
  token_type: string;
  expires_in: number;
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
  warehouses: Warehouse[];
  shippingzones: unknown[];
  is_fba_location: boolean;
  sales_channels: unknown[];
}

export interface Warehouse {
  warehouse_id: string;
  warehouse_name: string;
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
