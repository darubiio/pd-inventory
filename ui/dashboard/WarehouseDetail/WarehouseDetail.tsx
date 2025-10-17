import { Warehouse } from "../../../types";
import { Categories } from "./Categories";
import { ProtectedWarehousePage } from "../ProtectedWarehousePage";
import { getItemCategories } from "../../../lib/api/clients/zoho/zohoData";

export const WarehouseDetail = async (props: {
  warehouseId: string;
  warehouse?: Warehouse;
}) => {
  const categories = await getItemCategories();
  return (
    <ProtectedWarehousePage warehouseId={props.warehouseId}>
      <Categories categories={categories} warehouse={props.warehouse} />
    </ProtectedWarehousePage>
  );
};
