"use client";

import React, { FC } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
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
    data: data ?? defaultData,
    columns: getColumns({ data }),
    getSubRows: row => row.items,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="overflow-x-auto md:mx-3 h-screen">
      <table className="table table-md table-pin-rows table-pin-cols table-zebra">
        <thead>
            <tr>
              {table.getFlatHeaders().map((header, idx) =>
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
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, idx) =>
                idx === 0 ? (
                  <th key={cell.id}>
                    <div className="flex items-center gap-2">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
    </div>
  );
};
