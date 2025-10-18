"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { getItemsByWarehouseAndCategory } from "../../../lib/api/clients/zoho/zohoData";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getColumns } from "./tableColumns";
import {
  ArrowDownCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import TableLoading from "../../loading/tableLoading";
import { CategoryItem } from "../../../types";
import { useAbortableRequest } from "../../../lib/hooks/useAbortableRequest";

const defaultData: any[] = [];

export const ItemsTable = ({
  categoryId,
  warehouseId,
}: {
  warehouseId: string;
  categoryId: string;
}) => {
  const fetchItems = useCallback(
    async (warehouseId: string, categoryId: string, signal?: AbortSignal) => {
      const items = await getItemsByWarehouseAndCategory(
        warehouseId,
        categoryId
      );
      return items;
    },
    []
  );

  const {
    reset,
    cleanup,
    isLoading,
    error,
    data: items,
    execute: loadItems,
  } = useAbortableRequest(fetchItems, { debounceMs: 300 });

  const columns = useMemo(
    () => getColumns(warehouseId) as ColumnDef<CategoryItem>[],
    [warehouseId]
  );

  const table = useReactTable<CategoryItem>({
    data: items ?? defaultData,
    columns: columns,
    getSubRows: (row) => row.items,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  useEffect(() => {
    if (!categoryId || !warehouseId) return reset();

    loadItems(warehouseId, categoryId);
    return cleanup;
  }, [categoryId, warehouseId, loadItems, reset, cleanup]);

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="overflow-x-auto md:mx-3">
        {error ? (
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <div className="alert alert-error max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Failed to load items. Please try again.</span>
            </div>
            <button
              onClick={() => loadItems(warehouseId, categoryId)}
              className="btn btn-primary mt-4"
              aria-label="Retry loading items"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <TableLoading cols={6} />
        ) : (
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
        )}
      </div>
    </div>
  );
};
