import { getWarehouseById } from "../../../../../lib/api/clients/zoho/zohoData";
import { WarehouseDetail } from "../../../../../ui/dashboard/WarehouseDetail/WarehouseDetail";

type WarehouseInventoryProps = {
  params: Promise<{ id: string }>;
};

const WarehouseInventory = async ({ params }: WarehouseInventoryProps) => {
  const { id } = await params;
  const warehouse = await getWarehouseById(id);
  return (
    <div className="grid md:grid-cols-[250px_1fr] h-[calc(100vh-6.9rem)]">
      <WarehouseDetail warehouseId={id} warehouse={warehouse} />
    </div>
  );
};

export default WarehouseInventory;
