import { NextRequest, NextResponse } from "next/server";
import { getPurchaseReceivesByLocationIdRange } from "../../../../lib/api/clients/zoho/zohoData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("location_id");
    const dateStart = searchParams.get("date_start") ?? undefined;
    const dateEnd = searchParams.get("date_end") ?? undefined;
    const status = searchParams.get("status") ?? undefined;

    if (!locationId) {
      return NextResponse.json(
        { error: "location_id is required" },
        { status: 400 }
      );
    }

    const receives = await getPurchaseReceivesByLocationIdRange(locationId, {
      dateStart,
      dateEnd,
      status,
    });

    return NextResponse.json({
      data: receives,
      success: true,
      count: receives?.length,
    });
  } catch (error) {
    console.error("Error fetching purchase receives:", error);
    return NextResponse.json(
      { error: "Failed to fetch purchase receives" },
      { status: 500 }
    );
  }
}
