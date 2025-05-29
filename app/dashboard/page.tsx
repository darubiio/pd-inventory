import { FC } from "react";

import ChartBar from "../../ui/dashboard/ChartBar";
import {
  getCategories,
  getItemsCategoriesStock,
  getWarehouseCategoryStock,
} from "../../lib/zohoData";

const TOP_FIVE_CATEGORIES_ID = [
  "5956907000000819463",
  "5956907000000819459",
  "5956907000000819547",
  "5956907000000819639",
  "5956907000042283399",
];

const DashboardPage: FC = async () => {
  const dataset = await getCategories();
  const itemDetails = await getWarehouseCategoryStock();

  return (
    <div className="flex flex-col h-full pt-2 md:pt-0 md:pl-2">
      <div className="flex h-2/12 gap-4 xl:overflow-x-visible pl-1 pb-3 overflow-x-auto">
        <TopProducts />
      </div>
      <div className="card h-10/12 bg-base-200 shadow-md ml-1 p-4 pb-0">
          <ChartBar data={itemDetails} dataset={dataset} />
      </div>
    </div>
  );
};

export const TopProducts = async () => {
  const itemsStock = await getItemsCategoriesStock();
  const topFiveItems = itemsStock.filter(({ id }) =>
    TOP_FIVE_CATEGORIES_ID.includes(id)
  );

  const getItemStockValueSum = (item: {}) => {
    return Object.values(item).reduce((acc: number, curr) => {
      if (typeof curr === "number") return acc + curr;
      return acc;
    }, 0);
  };

  return topFiveItems.map((item) => (
    <div key={item.name} className="card bg-base-200 shadow-md w-1/5 min-w-35 p-4">
      <div className="stat-title uppercase font-semibold min-w-30 truncate">
        {item.name}
      </div>
      <div className="stat-desc">Total stock</div>
      <div className="stat-value">{getItemStockValueSum(item)}</div>
    </div>
  ));
};

export default DashboardPage;
