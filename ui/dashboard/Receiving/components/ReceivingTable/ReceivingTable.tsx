"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDownTrayIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { cleanWarehouseName } from "../../../../../lib/api/utils/zohoDataUtils";
import { getColumns } from "./columns";
import { Location, PurchaseReceive } from "../../../../../types";
import TableLoading from "../../../../loading/tableLoading";
import { ReceivingListingLoading } from "../../../../loading/receivingLoading";
import { useMemo, useState } from "react";
import { ReceivingDetail } from "../ReceivingDetail/ReceivingDetail";
import { DateRangeInput } from "@components/inputs";

const statusOptions = {
  all: { label: "All", value: "all" },
  issued: { label: "In Transit", value: "in_transit" },
  received: { label: "Received", value: "received" },
};

export const getStatusBadge = (status?: string) => {
  switch (status?.toLowerCase()) {
    case "in_transit":
      return { label: "In Transit", class: "badge-info" };
    case "received":
      return { label: "Received", class: "badge-success" };
    case "cancelled":
      return { label: "Cancelled", class: "badge-error" };
    default:
      return { label: "Other", class: "badge-warning" };
  }
};

type ReceivingTableProps = {
  data: PurchaseReceive[];
  onDateChange?: (start: string, end: string) => void;
  onStatusChange?: (status: string) => void;
  defaultDateStart?: string;
  defaultDateEnd?: string;
  defaultStatus?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onRefresh?: () => void;
  warehouse?: Location;
  initialLoading?: boolean;
};

export function ReceivingTable({
  data,
  defaultDateEnd,
  defaultDateStart,
  defaultStatus = "in_transit",
  error,
  loading = false,
  onDateChange,
  onStatusChange,
  onRefresh,
  onRetry,
  warehouse,
  initialLoading = false,
}: ReceivingTableProps) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(defaultStatus);
  const [selectedPurchaseReceives, setSelectedPurchaseReceives] =
    useState<PurchaseReceive | null>(null);

  const filtered = useMemo(() => {
    const text = globalFilter.trim().toLowerCase();
    return (data || []).filter((receive) => {
      if (!text) return true;
      return (
        receive.receive_number?.toLowerCase().includes(text) ||
        receive.purchaseorder_number?.toLowerCase().includes(text) ||
        receive.vendor_name?.toLowerCase().includes(text)
      );
    });
  }, [data, globalFilter]);

  const table = useReactTable<PurchaseReceive>({
    data: filtered,
    columns: getColumns({ actions: { setSelectedPurchaseReceives } }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="card bg-base-100 shadow-xl pt-2 h-full md:h-[calc(100vh-4.5rem)]">
      <div className="px-1 md:px-3 pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <div className="bg-base-100 border border-gray-300 dark:border-gray-600 shadow-sm rounded-md px-3 py-2 font-extrabold h-10 flex items-center gap-2">
            <ArrowDownTrayIcon className="h-5 w-5" />
            {cleanWarehouseName(warehouse?.location_name)}
          </div>
          <label className="input input-bordered flex-1 rounded-sm h-10 flex items-center">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search by PR number"
              aria-label="Search receiving orders"
              className="grow"
            />
          </label>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="bg-base-100 border border-gray-300 dark:border-gray-600 shadow-sm rounded-md hover:shadow-md transition-shadow md:hidden h-10 w-10 flex items-center justify-center"
              aria-label="Refresh receiving orders"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center md:gap-2 md:justify-end">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="btn border border-gray-300 dark:border-gray-600 btn-sm hidden shadow-sm rounded-md hover:shadow-md transition-shadow md:inline-flex h-10 w-10"
              aria-label="Refresh purchase orders"
            >
              <ArrowPathIcon
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
          )}
          <DateRangeInput
            defaultStart={defaultDateStart}
            defaultEnd={defaultDateEnd}
            onChange={(start?: string, end?: string) => {
              if (start && end) onDateChange?.(start, end);
            }}
            label="Dates"
            loading={loading}
            className="w-full"
            buttonClassName="w-full justify-between"
          />
          <label className="select">
            <span className="label">Status</span>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                onStatusChange?.(e.target.value);
              }}
              aria-label="Filter status"
            >
              {Object.values(statusOptions).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>
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
            <span>{error}</span>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="btn btn-primary mt-4"
              aria-label="Retry loading receiving orders"
            >
              Try again
            </button>
          )}
        </div>
      ) : initialLoading || loading ? (
        <>
          <ReceivingListingLoading />
          <div className="overflow-x-auto md:mx-3 hidden md:block">
            <TableLoading cols={8} rows={14} />
          </div>
        </>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <ArrowDownTrayIcon className="h-24 w-24 opacity-20 mb-4" />
          <p className="text-sm opacity-50">No receiving orders found</p>
        </div>
      ) : (
        <>
          <div className="md:hidden px-1 pb-1 flex flex-col gap-3">
            {filtered.map((receive) => {
              const statusBadge = getStatusBadge(receive.received_status);
              return (
                <div
                  key={receive.receive_id}
                  onClick={() => setSelectedPurchaseReceives(receive)}
                  className="card bg-base-100 shadow-sm border border-gray-300 dark:border-gray-600 p-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {receive.receive_number}
                    </div>
                    <span className={`badge ${statusBadge.class}`}>
                      {statusBadge.label}
                    </span>
                  </div>
                  <div className="text-sm opacity-80">
                    {receive.vendor_name}
                  </div>
                  <div className="text-xs opacity-70">
                    PO: {receive.purchaseorder_number}
                  </div>
                  <div className="text-xs opacity-70">Date: {receive.date}</div>
                  {receive.location_name && (
                    <div className="text-xs opacity-70">
                      Location: {receive.location_name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto md:mx-3 hidden md:block">
            <table className="table table-md table-zebra">
              <thead>
                <tr>
                  {table.getFlatHeaders().map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {selectedPurchaseReceives && (
        <ReceivingDetail
          updatePurchaseReceives={onRetry}
          purchaseReceive={selectedPurchaseReceives}
          onClose={() => setSelectedPurchaseReceives(null)}
        />
      )}
    </div>
  );
}
