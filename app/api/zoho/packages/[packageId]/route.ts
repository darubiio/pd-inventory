import { NextResponse } from "next/server";
import { apiFetch } from "../../../../../lib/api/client";
import { getUserAuth } from "../../../../../lib/api/clients/zoho/zohoAuth";

const { ZOHO_ORG_ID } = process.env;
const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || "com";
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;

interface PackageDetailResponse {
  code: number;
  message: string;
  package: PackageDetail;
}

interface PackageDetail {
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
    shipment_id: string;
    shipment_number: string;
    carrier: string;
    service: string;
    tracking_number: string;
    shipping_date: string;
    delivery_days: number;
    delivery_guarantee: boolean;
    shipment_rate: number;
    status: string;
    detailed_status: string;
  };
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    fax: string;
    phone: string;
  };
  billing_address: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    fax: string;
    phone: string;
  };
  created_time: string;
  last_modified_time: string;
  template_id: string;
  template_name: string;
  template_type: string;
  is_emailed: boolean;
  notes: string;
  contact_persons: ContactPerson[];
  custom_fields: CustomField[];
}

interface PackageLineItem {
  line_item_id: string;
  so_line_item_id: string;
  item_id: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  unit: string;
  is_invoiced: boolean;
  item_custom_fields: CustomField[];
}

interface ContactPerson {
  contact_person_id: string;
}

interface CustomField {
  customfield_id: string;
  label: string;
  value: string;
  index: number;
  data_type: string;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const { packageId } = await params;

    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID is required" },
        { status: 400 }
      );
    }

    const url = `${ZOHO_INVENTORY_URL}/packages/${packageId}?organization_id=${ZOHO_ORG_ID}`;

    const data = await apiFetch<PackageDetail, PackageDetailResponse>(url, {
      method: "GET",
      auth: await getUserAuth(),
      transform: (response) => response.package,
    });

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching package detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch package detail" },
      { status: 500 }
    );
  }
}
