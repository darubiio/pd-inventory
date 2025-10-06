import { getItemCategories } from "../../../../lib/api/clients/zoho/zohoData";
import { ProtectedWarehousePage } from "../../../../ui/dashboard/ProtectedWarehousePage";
import { WarehouseDetail } from "../../../../ui/dashboard/WarehouseDetail/WarehouseDetail";

export const dynamic = "force-dynamic";

export default async function WarehouseItems({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: warehouseId } = await params;
  const categories = await getItemCategories();

  return (
    <ProtectedWarehousePage warehouseId={warehouseId}>
      <WarehouseDetail warehouseId={warehouseId} categories={categories} />
    </ProtectedWarehousePage>
  );
}
