import { FC } from "react";
import { getAllWarehouseData } from "../../../lib/api/clients/mapbox/mapboxData";
import { FilteredWarehouseGrid } from "../../../ui/dashboard/FilteredWarehouseGrid";

export const dynamic = "force-dynamic";

const DashboardPage: FC = async () => {
  const warehouses = await getAllWarehouseData();
  return <FilteredWarehouseGrid warehouses={warehouses} />;
};

export default DashboardPage;
