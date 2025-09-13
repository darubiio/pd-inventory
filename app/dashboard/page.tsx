import { FC } from "react";

import WarehouseCard from "../../ui/dashboard/WarehouseCard";
import { getAllWarehouseData } from "../../lib/api/clients/mapbox/mapboxData";

// Force dynamic rendering since this requires authentication and real-time data
export const dynamic = "force-dynamic";

const DashboardPage: FC = async () => {
  const warehouses = await getAllWarehouseData();

  return (
    <div className="grid grid-cols-1 m-2 gap-2 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3">
      {warehouses?.map((props) => (
        <WarehouseCard key={props.warehouse_id} {...props} />
      ))}
    </div>
  );
};

export default DashboardPage;
