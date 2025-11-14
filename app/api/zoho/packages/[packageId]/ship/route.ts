import { NextResponse } from "next/server";
import { apiFetch } from "../../../../../../lib/api/client";
import { getUserAuth } from "../../../../../../lib/api/clients/zoho/zohoAuth";

const { ZOHO_ORG_ID } = process.env;

const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || "com";
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;

interface ShipmentOrderResponse {
  code: number;
  message: string;
  shipment_order: {
    shipment_id: string;
    shipment_number: string;
    status: string;
  };
}

export async function POST(
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

    const packageUrl = `${ZOHO_INVENTORY_URL}/packages/${packageId}?organization_id=${ZOHO_ORG_ID}`;
    const packageResponse = await apiFetch<
      any,
      { code: number; message: string; package: any }
    >(packageUrl, {
      method: "GET",
      auth: await getUserAuth(),
      transform: (response) => response.package,
    });

    if (!packageResponse) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    const salesorderId = packageResponse.salesorder_id;

    if (packageResponse.shipment_order?.shipment_id) {
      const shipmentId = packageResponse.shipment_order.shipment_id;
      const deliveredUrl = `${ZOHO_INVENTORY_URL}/shipmentorders/${shipmentId}/status/delivered?organization_id=${ZOHO_ORG_ID}`;

      await apiFetch(deliveredUrl, {
        method: "POST",
        auth: await getUserAuth(),
      });

      return NextResponse.json({
        success: true,
        message: "Package marked as delivered",
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const shipmentNumber = `SH-${Date.now()}`;

    const createShipmentUrl = `${ZOHO_INVENTORY_URL}/shipmentorders?package_ids=${packageId}&salesorder_id=${salesorderId}&organization_id=${ZOHO_ORG_ID}`;

    const shipmentData = {
      shipment_number: shipmentNumber,
      date: today,
      delivery_method: "Manual Shipment",
      tracking_number: `PKG-${packageId}`,
      notes: "Scanned and packed via inventory system",
    };

    const shipmentResponse = await apiFetch<any, ShipmentOrderResponse>(
      createShipmentUrl,
      {
        method: "POST",
        auth: await getUserAuth(),
        body: JSON.stringify(shipmentData),
      }
    );

    if (shipmentResponse?.shipment_order?.shipment_id) {
      const shipmentId = shipmentResponse.shipment_order.shipment_id;
      const deliveredUrl = `${ZOHO_INVENTORY_URL}/shipmentorders/${shipmentId}/status/delivered?organization_id=${ZOHO_ORG_ID}`;

      await apiFetch(deliveredUrl, {
        method: "POST",
        auth: await getUserAuth(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Package shipped successfully",
      data: shipmentResponse,
    });
  } catch (error) {
    console.error("Error shipping package:", error);
    return NextResponse.json(
      {
        error: "Failed to ship package",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
