import { CellContext } from "@tanstack/react-table";
import { ItemDetails } from "../../../types";

export const getColumns = (warehouseId: string) => {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: (info: CellContext<ItemDetails, string>) => (
        <div className="font-semibold">{info.getValue()}</div>
      ),
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
