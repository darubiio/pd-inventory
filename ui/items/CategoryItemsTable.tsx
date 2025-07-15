"use client";

import React, { FC, useMemo } from "react";
import {
  useReactTable,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { CategoryItem } from "../../types";
import { getColumns } from "./tableColumns";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const defaultData: CategoryItem[] = [];

interface CategoriesTableProps {
  data: CategoryItem[];
}

export const CategoriesTable: FC<CategoriesTableProps> = ({ data }) => {
  const columns = useMemo(() => getColumns({ data }), [data]);

  const table = useReactTable({
    data: data ?? defaultData,
    columns,
    getFilteredRowModel: getFilteredRowModel(),
    getSubRows: (row) => row.items,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="card bg-base-100 shadow-xl pt-3 h-[calc(100vh-80px)] m-2">
      <div className="overflow-x-auto md:mx-3">
        <table className="table table-md table-pin-rows table-pin-cols table-zebra">
          <thead>
            <tr>
              {table
                .getFlatHeaders()
                .map((header, idx) =>
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
                              <ChevronDownIcon width={17} />
                            ) : (
                              <ChevronRightIcon width={17} />
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
