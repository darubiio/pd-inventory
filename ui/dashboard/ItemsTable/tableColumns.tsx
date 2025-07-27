import { CellContext, Column, Table } from "@tanstack/react-table";
import { CategoryItem, ItemDetails } from "../../../types";
import CategoryNameHeader from "../../items/CategoryNameHeader";
import { filterBySubitemName } from "../../items/TableFilter";

export const getColumns = (warehouseId: string) => {
  return [
    {
      accessorKey: "name",
      header: ({
        table,
        column,
      }: {
        table: Table<CategoryItem>;
        column: Column<CategoryItem, string>;
      }) => <CategoryNameHeader table={table} column={column} dropIcon={false} />,
      cell: (info: CellContext<CategoryItem, string>) => (
        <div
          style={{ paddingLeft: `${info.row.depth * 1.5}rem` }}
          className="font-semibold"
        >
          {info.getValue()}
        </div>
      ),
      filterFn: filterBySubitemName,
    },
    {
      accessorFn: (item: ItemDetails) => {
        const warehouse = item.warehouses?.find(({ warehouse_id }) => {
          return warehouse_id === warehouseId;
        });
        return warehouse?.warehouse_stock_on_hand ?? 0;
      },
      header: "Stock",
      cell: (info: CellContext<ItemDetails, string>) => (
        <div className="font-bold">{info.getValue()}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info: CellContext<ItemDetails, string>) => (
        <div
          className={`font-semibold badge ${
            info.getValue() !== "active" ? "badge-error" : "badge-primary"
          }`}
        >
          {info.getValue()}
        </div>
      ),
    },
  ];
};
