import { NextResponse } from "next/server";
import { apiFetch } from "../../../../lib/api/client";
import { getUserAuth } from "../../../../lib/api/clients/zoho/zohoAuth";
import type {
  OrganizationsResponse,
  ZohoOrganization,
} from "../../../../types/zoho";

const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || "com";
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;

export async function GET() {
  try {
    const url = `${ZOHO_INVENTORY_URL}/organizations`;

    const response = await apiFetch<OrganizationsResponse>(url, {
      method: "GET",
      auth: await getUserAuth(),
    });

    return NextResponse.json<{ data: ZohoOrganization[] }>({
      data: response.organizations,
    });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Failed to fetch organizations" },
      { status: 500 }
    );
  }
}
