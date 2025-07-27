"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getItemsByWarehouseAndCategory } from "../../../lib/zohoData";
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

const defaultData: any[] = [];

export const ItemsTable = ({
  categoryId,
  warehouseId,
}: {
  warehouseId: string;
  categoryId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = React.useState<any[]>([]);

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
    if (!categoryId || !warehouseId) return;
    setIsLoading(true);
    getItemsByWarehouseAndCategory(warehouseId, categoryId)
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, [categoryId, warehouseId]);

  return (
    <div className="card bg-base-100 shadow-xl pt-3 h-[calc(100vh-80px)]">
      <div className="overflow-x-auto md:mx-3">
        {isLoading ? (
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
