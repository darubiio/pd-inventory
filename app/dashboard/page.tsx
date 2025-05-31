import { FC } from "react";

import { getWarehouses } from "../../lib/zohoData";
import WarehouseCard from "../../ui/dashboard/WarehouseCard";

const DashboardPage: FC = async () => {
  const warehouses = await getWarehouses();
  return (
    <>
      <div className="card bg-base-100 shadow-md m-2">
      <div className="card-title pl-4 pt-3">
        <h1 className="text-1xl font-bold">Warehouses</h1>
      </div>
      <div className="grid grid-cols-1 m-2 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {warehouses?.map((props) => (
          <WarehouseCard key={props.warehouse_id} {...props} />
        ))}
      </div>
      </div>
    </>
  );
};

export default DashboardPage;
