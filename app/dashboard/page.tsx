import { FC } from "react";

import { getWarehouses } from "../../lib/zohoData";
import WarehouseCard from "../../ui/dashboard/WarehouseCard";

const DashboardPage: FC = async () => {
  const warehouses = await getWarehouses();
  return (
    <div className="grid grid-cols-1 m-2 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {warehouses?.map((props) => (
        <WarehouseCard key={props.warehouse_id} {...props} />
      ))}
    </div>
  );
};

export default DashboardPage;
