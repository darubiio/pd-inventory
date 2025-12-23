import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "../../../../../lib/api/client";
import { getUserAuth } from "../../../../../lib/api/clients/zoho/zohoAuth";
import { ItemDetails, ItemDetailResponse } from "../../../../../types";

const { ZOHO_ORG_ID } = process.env;
const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || "com";
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;

const fetchItemDetail = async (itemId: string): Promise<ItemDetails | null> => {
  try {
    const url = `${ZOHO_INVENTORY_URL}/items/${itemId}?organization_id=${ZOHO_ORG_ID}`;
    const key = `Zoho-item-${itemId}`;

    return await apiFetch<ItemDetails, ItemDetailResponse>(url, {
      method: "GET",
      cacheCfg: { key, ttl: 600 },
      auth: await getUserAuth(),
      transform: (data) => data.item,
    });
  } catch (error) {
    return null;
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemIds = searchParams.get("ids");

    if (!itemIds) {
      return NextResponse.json(
        { error: "Item IDs parameter 'ids' is required" },
        { status: 400 }
      );
    }

    const itemIdList = itemIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    if (itemIdList.length === 0) {
      return NextResponse.json(
        { error: "At least one valid item ID is required" },
        { status: 400 }
      );
    }

    const itemDetailsPromises = itemIdList.map(fetchItemDetail);
    const itemDetails = await Promise.all(itemDetailsPromises);

    const successfulItems = itemDetails.filter(
      (item): item is ItemDetails => item !== null
    );
    const failedCount = itemDetails.length - successfulItems.length;

    return NextResponse.json({
      items: successfulItems,
      total: successfulItems.length,
      failed: failedCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch item details" },
      { status: 500 }
    );
  }
}
