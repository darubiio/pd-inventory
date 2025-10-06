import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../../lib/auth/zohoAuth";
import { getWarehousesByOrganization } from "../../../../lib/api/clients/zoho/zohoData";

export async function GET(request: NextRequest) {
  try {
    const sessionId =
      request.cookies.get("zoho-session-id")?.value ||
      request.headers.get("x-session-id");

    const notAuthenticated = NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );

    if (!sessionId) return notAuthenticated;

    const redisSession = await zohoAuth.getSessionById(sessionId);
    const user = redisSession?.user;

    if (!user) return notAuthenticated;

    const warehouses = await getWarehousesByOrganization();

    const userBranches = warehouses.map((warehouse) => ({
      location_name: warehouse.warehouse_name,
      is_primary_branch: false,
      branch_id: warehouse.warehouse_id,
      branch_name: warehouse.warehouse_name,
      is_primary_location: false,
      is_default: false,
      location_id: warehouse.warehouse_id,
    }));

    const enhancedUserData = {
      user_id: user.user_id,
      name: user.name,
      email_ids: [{ is_selected: true, email: user.email }],
      status: user.status,
      user_role: user.user_role,
      user_type: user.user_type,
      role_id: user.role_id,
      is_super_admin: false,
      is_admin: user.user_role === "admin",
      photo_url: user.photo_url,
      email: user.email,
      mobile: "",
      created_time: user.created_time,
      branches: userBranches,
      locations: userBranches,
    };

    return NextResponse.json(enhancedUserData);
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
