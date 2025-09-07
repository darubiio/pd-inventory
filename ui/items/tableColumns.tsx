import { CategoryItem } from "../../types";
import { CellContext, Column, Table } from "@tanstack/react-table";
import CategoryNameHeader from "./CategoryNameHeader";
import { filterBySubitemName } from "./TableFilter";
import { ReactNode } from "react";

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
      }) => <CategoryNameHeader table={table} column={column} />,
      cell: (info: CellContext<CategoryItem, ReactNode>) => (
        <div
          style={{ paddingLeft: `${info.row.depth * 1.5}rem` }}
          className="font-semibold"
        >
          {info.getValue()}
        </div>
      ),
      filterFn: filterBySubitemName,
    },
    ...locationKeys.map((location) => ({
      accessorKey: location,
      header: location.replace(/_/g, " "),
      cell: (info: CellContext<CategoryItem, ReactNode>) => (
        <div
          style={{ paddingLeft: `${info.row.depth * 1.5}rem` }}
          className="font-semibold flex justify-center align-middle"
        >
          {info.getValue()}
        </div>
      ),
    })),
  ];
};
