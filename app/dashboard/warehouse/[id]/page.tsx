import { getItemCategories } from "../../../../lib/api/clients/zoho/zohoData";
import WarehouseDetail from "../../../../ui/dashboard/WarehouseDetail/WarehouseDetail";

// Force dynamic rendering since this requires authentication and real-time data
export const dynamic = "force-dynamic";

export default async function WarehouseItems({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: warehouseId } = await params;
  const categories = await getItemCategories();
  return <WarehouseDetail warehouseId={warehouseId} categories={categories} />;
}
