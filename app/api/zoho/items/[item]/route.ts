import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "../../../../../lib/api/client";
import { getUserAuth } from "../../../../../lib/api/clients/zoho/zohoAuth";
import { ItemDetails, ItemDetailResponse } from "../../../../../types";

const { ZOHO_ORG_ID } = process.env;
const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || "com";
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ item: string }> }
) {
  try {
    const { item: itemId } = await params;

    if (!itemId) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const url = `${ZOHO_INVENTORY_URL}/items/${itemId}?organization_id=${ZOHO_ORG_ID}`;
    const key = `Zoho-item-${itemId}`;

    const itemDetail = await apiFetch<ItemDetails, ItemDetailResponse>(url, {
      method: "GET",
      cacheCfg: { key, ttl: 600 },
      auth: await getUserAuth(),
      transform: (data) => data.item,
    });

    return NextResponse.json(itemDetail);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch item detail" },
      { status: 500 }
    );
  }
}
