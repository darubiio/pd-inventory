import { NextRequest, NextResponse } from "next/server";
import { getPurchaseReceiveById } from "../../../../../lib/api/clients/zoho/zohoData";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ purchaseorderId: string }> }
) {
  try {
    const { purchaseorderId: receiveId } = await params;

    const receive = await getPurchaseReceiveById(receiveId);

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
