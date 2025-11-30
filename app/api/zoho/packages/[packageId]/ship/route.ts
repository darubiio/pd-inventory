import { NextResponse } from "next/server";
import { apiFetch } from "../../../../../../lib/api/client";
import { getUserAuth } from "../../../../../../lib/api/clients/zoho/zohoAuth";
import { PackageDetail } from "../../../../../../types/zoho";

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
      PackageDetail,
      { code: number; message: string; package: PackageDetail }
    >(packageUrl, {
      method: "GET",
      auth: await getUserAuth(),
      transform: (response) => response.package,
    });

    if (!packageResponse) {
      return NextResponse.json({ error: "Package not found" }, { status: 404 });
    }

    if (!packageResponse.salesorder_id) {
      return NextResponse.json(
        { error: "Package has no associated sales order" },
        { status: 400 }
      );
    }

    const salesOrderId = packageResponse.salesorder_id;

    if (packageResponse.shipment_order?.shipment_id) {
      return NextResponse.json({
        success: true,
        message: `This package already contains shipping order ${packageResponse.shipment_order.shipment_id}`,
        shipmentId: packageResponse.shipment_order.shipment_id,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    const timestamp = Date.now().toString().slice(-5);
    const shipmentNumber = `SN-${timestamp}`;

    const createShipmentUrl = `${ZOHO_INVENTORY_URL}/shipmentorders?package_ids=${packageId}&salesorder_id=${salesOrderId}&organization_id=${ZOHO_ORG_ID}`;

    const shipmentData = {
      shipment_number: shipmentNumber,
      date: today,
      delivery_method: "Pick up",
      tracking_number: packageId,
      notes: `Shipment created automatically on ${today} via PD Inventory System`,
    };

    const shipmentResponse = await apiFetch<ShipmentOrderResponse>(
      createShipmentUrl,
      {
        method: "POST",
        auth: await getUserAuth(),
        body: JSON.stringify(shipmentData),
      }
    );

    if (!shipmentResponse?.shipment_order?.shipment_id) {
      return NextResponse.json(
        { error: "Failed to create shipment order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Shipment order created successfully",
      shipmentId: shipmentResponse.shipment_order.shipment_id,
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
