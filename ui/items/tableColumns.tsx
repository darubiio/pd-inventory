import { CategoryItem } from "../../types";
import { CellContext, Column, Table } from "@tanstack/react-table";
import CategoryNameHeader from "./CategoryNameHeader";
import { filterBySubitemName } from "./TableFilter";
import { ReactNode } from "react";
import { cleanWarehouseName } from "../../lib/api/utils/zohoDataUtils";

type CategoriesTableProps = {
  data: CategoryItem[];
};

export const getColumns = ({ data }: CategoriesTableProps) => {
  const locationKeys = data?.length
    ? Object.keys(data[0]).filter(
        (key) => key !== "id" && key !== "name" && key !== "items"
      )
    : [];

  return [
    {
      accessorKey: "name",
      header: ({
        table,
        column,
      }: {
        table: Table<CategoryItem>;
        column: Column<CategoryItem, string>;
      }) => (
        <CategoryNameHeader
          table={table}
          column={column}
          isStatusTable={false}
        />
      ),
      cell: (info: CellContext<CategoryItem, ReactNode>) => (
        <div
          style={{ paddingLeft: `${info.row.depth * 1.5}rem` }}
          className={`font-semibold ${
            info.row.depth > 0 ? "text-gray-600 dark:text-gray-300" : ""
          }`}
        >
          {info.getValue()}
        </div>
      ),
      filterFn: filterBySubitemName,
    },
    ...locationKeys.map((location) => ({
      accessorKey: location,
      header:
        cleanWarehouseName(location.replace(/_/g, " ")) ||
        location.replace(/_/g, " "),
      cell: (info: CellContext<CategoryItem, ReactNode>) => (
        <div
          className={`flex justify-center align-middle font-semibold ${
            info.row.depth > 0 ? "text-gray-600 dark:text-gray-300" : ""
          }`}
        >
          {info.getValue()}
        </div>
      ),
    })),
  ];
};
