import React, { useState } from "react";
import {
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Table, Column } from "@tanstack/react-table";
import { CategoryItem } from "../../types";

interface CategoryNameHeaderProps {
  table: Table<CategoryItem>;
  column: Column<CategoryItem, string>;
  dropIcon?: boolean;
  isStatusTable?: boolean;
}

const CategoryNameHeader: React.FC<CategoryNameHeaderProps> = ({
  table,
  column,
  isStatusTable = true,
  dropIcon = true,
}) => {
  const [filterActive, setFilterActive] = useState(false);
  const toggleFilter = () => {
    setFilterActive((prev) => !prev);
    if (filterActive) column.setFilterValue("");
  };

  return (
    <div
      className={`flex items-center w-full ${!isStatusTable ? "md:w-60" : ""}`}
    >
      <button
        type="button"
        onClick={table.getToggleAllRowsExpandedHandler()}
        className="cursor-pointer"
      >
        {dropIcon ? (
          table.getIsAllRowsExpanded() ? (
            <ChevronDownIcon width={17} />
          ) : (
            <ChevronRightIcon width={17} />
          )
        ) : null}
      </button>
      <div className="flex-1 justify-between flex items-center">
        {filterActive ? (
          <Filter column={column} table={table} />
        ) : (
          <span className="font-semibold text-base leading-5 h-10 p-1 inline-flex items-center w-30">
            Categories
          </span>
        )}

        <label className="btn btn-xs swap swap-rotate ml-2">
          <input
            type="checkbox"
            checked={filterActive}
            onChange={toggleFilter}
            readOnly={false}
          />
          <XMarkIcon width={17} className="swap-on fill-current" />
          <AdjustmentsHorizontalIcon
            width={17}
            className="swap-off fill-current"
          />
        </label>
      </div>
    </div>
  );
};

function Filter({ column }: { column: Column<any, any>; table: Table<any> }) {
  const columnFilterValue = column.getFilterValue();
  return (
    <input
      autoFocus
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search item...`}
      className="w-full min-w-30 h-10 p-1"
    />
  );
}

export default CategoryNameHeader;
