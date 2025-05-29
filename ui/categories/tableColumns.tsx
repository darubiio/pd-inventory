import {
  ArrowDownCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { CategoryItem } from "../../types";

type CategoriesTableProps = {
  data: CategoryItem[];
};

export const getColumns = ({ data }: CategoriesTableProps) => {
  const locationKeys = Object.keys(data[0]).filter(
    (key) => key !== "id" && key !== "name"
  );

  return [
    {
      accessorKey: "name",
      header: ({
        table,
      }: {
        table: import("@tanstack/react-table").Table<CategoryItem>;
      }) => (
        <button
          {...{
            onClick: table.getToggleAllRowsExpandedHandler(),
          }}
        >
          <div className="flex items-center">
            {table.getIsAllRowsExpanded() ? (
              <ArrowDownCircleIcon width={17} />
            ) : (
              <ArrowRightCircleIcon width={17} />
            )}
            <span className="ml-2">Category</span>
          </div>
        </button>
      ),
      cell: (
        info: import("@tanstack/react-table").CellContext<CategoryItem, unknown>
      ) => <span className="font-semibold">{info.getValue() as string}</span>,
    },
    ...locationKeys.map((location) => ({
      accessorKey: location,
      header: location.replace(/_/g, " "),
      cell: (
        info: import("@tanstack/react-table").CellContext<CategoryItem, unknown>
      ) => info.getValue(),
    })),
  ];
};
