import { FC } from "react";

import ChartBar from "../../ui/dashboard/ChartBar";
import { getCategories, getWarehouseCategoryStock } from "../../lib/zohoData";

const DashboardPage: FC = async () => {
  const dataset = await getCategories()
  const itemDetails = await getWarehouseCategoryStock();

  return (
    <div className="flex flex-col gap-4 p-4">      
      <div className="card bg-base-200 w-full shadow-sm">
        <div className="card-body">
          <ChartBar data={itemDetails} dataset={dataset} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
