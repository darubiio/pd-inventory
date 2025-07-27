import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CategoryItem } from "../../types";
import { CellContext, Column, Row, Table } from "@tanstack/react-table";
import CategoryNameHeader from "./CategoryNameHeader";
import { filterBySubitemName } from "./TableFilter";

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
    ...locationKeys.map((location) => ({
      accessorKey: location,
      header: location.replace(/_/g, " "),
      cell: (info: CellContext<CategoryItem, unknown>) => info.getValue(),
    })),
  ];
};
