"use client";

import React, { FC } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { CategoryItem } from "../../types";
import { getColumns } from "./tableColumns";
import {
  ArrowDownCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

const defaultData: CategoryItem[] = [];

interface CategoriesTableProps {
  data: CategoryItem[];
}

export const CategoriesTable: FC<CategoriesTableProps> = ({ data }) => {
  const table = useReactTable({
    columns: getColumns({ data }),
    data: data ?? defaultData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="table table-md table-pin-cols table-zebra">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header, idx) =>
              idx === 0 ? (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ) : (
                <td key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </td>
              )
            )}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell, idx) =>
              idx === 0 ? (
                <th key={cell.id}>
                  <div className="flex items-center">
                    {row.getCanExpand() ? (
                      <button
                        {...{
                          onClick: row.getToggleExpandedHandler(),
                          style: { cursor: "pointer" },
                        }}
                      >
                        {row.getIsExpanded() ? (
                          <ArrowDownCircleIcon width={17} />
                        ) : (
                          <ArrowRightCircleIcon width={17} />
                        )}
                      </button>
                    ) : (
                      ""
                    )}
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </th>
              ) : (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
