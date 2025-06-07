import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { CategoryItem } from "../../types";
import { CellContext, Table } from "@tanstack/react-table";

type CategoriesTableProps = {
  data: CategoryItem[];
};

export const getColumns = ({ data }: CategoriesTableProps) => {
  const locationKeys = Object.keys(data[0]).filter(
    (key) => key !== "id" && key !== "name" && key !== "items"
  );

  return [
    {
      accessorKey: "name",
      header: ({ table }: { table: Table<CategoryItem> }) => (
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          <div className="flex items-center">
            {table.getIsAllRowsExpanded() ? (
              <ChevronDownIcon width={17} />
            ) : (
              <ChevronRightIcon width={17} />
            )}
            <span className="ml-2">Category</span>
          </div>
        </button>
      ),
      cell: (info: CellContext<CategoryItem, unknown>) => (
        <div
          style={{ paddingLeft: `${info.row.depth * 1.5}rem` }}
          className="font-semibold"
        >
          {info.getValue() as string}
        </div>
      ),
    },
    ...locationKeys.map((location) => ({
      accessorKey: location,
      header: location.replace(/_/g, " "),
      cell: (info: CellContext<CategoryItem, unknown>) => info.getValue(),
    })),
  ];
};
