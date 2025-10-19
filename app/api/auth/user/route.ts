import { NextRequest, NextResponse } from "next/server";
import { zohoAuth } from "../../../../lib/auth/zohoAuth";
import { getWarehousesByOrganization } from "../../../../lib/api/clients/zoho/zohoData";

const getUserData = async (sessionId: string) => {
  const { user } = (await zohoAuth.getSessionById(sessionId)) || {};
  const warehouses = await getWarehousesByOrganization();

  const userBranches = warehouses.map((warehouse) => ({
    is_default: false,
    is_primary_branch: false,
    is_primary_location: false,
    branch_id: warehouse.warehouse_id,
    location_id: warehouse.warehouse_id,
    branch_name: warehouse.warehouse_name,
    location_name: warehouse.warehouse_name,
  }));

  return {
    ...user,
    branches: userBranches,
    is_admin: user?.user_role === "admin",
    locations: userBranches,
  };
};

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

    const userData = await getUserData(sessionId);
    if (!userData) return notAuthenticated;

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error getting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
