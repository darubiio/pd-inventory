"use client";
import React from "react";
import { Column, Row, Table } from "@tanstack/react-table";
import { CategoryItem } from "../../types";

export const filterBySubitemName = (
  row: Row<CategoryItem>,
  columnId: string,
  filterValue: string
) => {
  if (!filterValue) return true;
  const isStartsWith = filterValue.startsWith("^");
  const search = isStartsWith
    ? filterValue.slice(1).toLowerCase()
    : filterValue.toLowerCase();
  const hasMatchingSubitem = (item: CategoryItem): boolean => {
    if (typeof item.name === "string") {
      if (isStartsWith) {
        if (item.name.toLowerCase().startsWith(search)) return true;
      } else {
        if (item.name.toLowerCase().includes(search)) return true;
      }
    }
    if (Array.isArray(item.items) && item.items.length > 0) {
      return item.items.some(hasMatchingSubitem);
    }
    return false;
  };
  return hasMatchingSubitem(row.original);
};

export const Filter = ({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
};
