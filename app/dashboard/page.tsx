import { FC } from "react";

import WarehouseCard from "../../ui/dashboard/WarehouseCard";
import { getWarehousesByOrganization } from "../../lib/api/clients/zoho/zohoData";

const DashboardPage: FC = async () => {
  const warehouses = await getWarehousesByOrganization();
  return (
    <div className="grid grid-cols-1 m-2 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {warehouses?.map((props) => (
        <WarehouseCard key={props.warehouse_id} {...props} />
      ))}
    </div>
  );
};

export default DashboardPage;
