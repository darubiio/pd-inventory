import { NextRequest, NextResponse } from "next/server";
import {
  getPurchaseReceiveById,
  updatePurchaseReceive,
} from "../../../../../lib/api/clients/zoho/zohoData";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ purchaseReceive: string }> }
) {
  try {
    const { purchaseReceive } = await params;

    const receive = await getPurchaseReceiveById(purchaseReceive);

    if (!receive) {
      return NextResponse.json(
        { error: "Purchase receive not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(receive);
  } catch (error) {
    console.error("Error fetching purchase receive:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase receive" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseReceive: string }> }
) {
  try {
    const { purchaseReceive: purchaseReceive } = await params;
    const body = await request.json();

    const updatedReceive = await updatePurchaseReceive(purchaseReceive, body);

    return NextResponse.json({
      message: "Purchase receive updated successfully",
      purchasereceive: updatedReceive,
    });
  } catch (error) {
    console.error("Error updating purchase receive:", error);
    return NextResponse.json(
      { error: "Failed to update purchase receive" },
      { status: 500 }
    );
  }
}
