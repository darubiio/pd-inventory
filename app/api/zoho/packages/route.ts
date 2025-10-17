import { NextRequest, NextResponse } from "next/server";
import {
  getPackagesByLocationId,
  getPackagesByLocationIdRange,
} from "../../../../lib/api/clients/zoho/zohoData";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get("location_id");
    const dateStart = searchParams.get("date_start") ?? undefined;
    const dateEnd = searchParams.get("date_end") ?? undefined;

    if (!locationId) {
      return NextResponse.json(
        { error: "location_id parameter is required" },
        { status: 400 }
      );
    }

    const data =
      dateStart || dateEnd
        ? await getPackagesByLocationIdRange(locationId, dateStart, dateEnd)
        : await getPackagesByLocationId(locationId);

    return NextResponse.json({
      data,
      success: true,
      count: data?.length,
    });
  } catch (error) {
    console.error("Error fetching packages:", error);
    return NextResponse.json(
      { error: "Failed to fetch packages" },
      { status: 500 }
    );
  }
}
