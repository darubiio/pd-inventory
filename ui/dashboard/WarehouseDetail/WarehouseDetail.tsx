import { Categories } from "./Categories";
import { ProtectedWarehousePage } from "../ProtectedWarehousePage";
import { getItemCategories } from "../../../lib/api/clients/zoho/zohoData";
import { Location } from "../../../types";

export const WarehouseDetail = async (props: {
  warehouseId: string;
  warehouse?: Location;
}) => {
  const categories = await getItemCategories();
  return (
    <ProtectedWarehousePage warehouseId={props.warehouseId}>
      <Categories categories={categories} warehouse={props.warehouse} />
    </ProtectedWarehousePage>
  );
};
