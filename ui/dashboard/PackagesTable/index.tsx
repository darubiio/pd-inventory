"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import DateRangeInput from "../../components/DateRangeInput";
import TableLoading from "../../loading/tableLoading";
import { PackageListingLoading } from "../../../app/dashboard/warehouse/[id]/loading";
import { PackageDetail } from "../PackageDetail/PackageDetail";

type PackageRow = {
  package_id: string;
  package_number: string;
  salesorder_id: string;
  salesorder_number: string;
  date: string;
  customer_name: string;
  status: string;
  total_quantity?: string | number;
  created_time?: string;
  shipment_order?: { tracking_number?: string; carrier?: string };
};

const statusOptions = {
  all: { label: "All", value: "all" },
  not_shipped: { label: "NotShipped", value: "not_shipped" },
  shipped: { label: "Shipped", value: "shipped" },
  delivered: { label: "Delivered", value: "delivered" },
};

const normalizeStatus = (s?: string) => (s || "").trim();

export function PackagesTable({
  data,
  onDateChange,
  defaultDateStart,
  defaultDateEnd,
  loading = false,
  error,
  onRetry,
}: {
  data: PackageRow[];
  onDateChange?: (start: string, end: string) => void;
  defaultDateStart?: string;
  defaultDateEnd?: string;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null
  );

  const getStatusBadgeClass = (status: string) => {
    const isPending = normalizeStatus(status).toLowerCase() === "not_shipped";
    return isPending
      ? "badge-warning"
      : status === "shipped"
      ? "badge-primary"
      : status === "delivered"
      ? "badge-success"
      : "";
  };

  const columns = useMemo<ColumnDef<PackageRow>[]>(
    () => [
      {
        accessorKey: "package_number",
        header: "Package",
        cell: (ctx) => (
          <div className="font-semibold">{ctx.getValue() as string}</div>
        ),
      },
      {
        accessorKey: "package_id",
        header: "ID",
        cell: (ctx) => (
          <span className="opacity-70">{ctx.getValue() as string}</span>
        ),
      },
      {
        accessorKey: "customer_name",
        header: "Customer",
      },
      {
        accessorKey: "salesorder_number",
        header: "Sales Order",
      },
      {
        accessorKey: "date",
        header: "Date",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (ctx) => {
          const v = String(ctx.getValue() ?? "") as keyof typeof statusOptions;
          return (
            <span className={`badge ${getStatusBadgeClass(v)}`}>
              {statusOptions[v].label}
            </span>
          );
        },
      },
      {
        accessorKey: "shipment_order.tracking_number",
        header: "Tracking",
        cell: ({ row }) => (
          <span className="text-xs">
            {row.original.shipment_order?.tracking_number || "-"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <button
            onClick={() => setSelectedPackageId(row.original.package_id)}
            className="btn btn-sm btn-ghost"
            aria-label="View details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        ),
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const text = globalFilter.trim().toLowerCase();
    return (data || [])
      .filter((p) => {
        if (!statusFilter || statusFilter === "all") return true;
        const s = normalizeStatus(p.status);
        if (statusFilter === "not_shipped")
          return s.toLowerCase() === "not_shipped";
        return s === statusFilter;
      })
      .filter((p) => {
        if (!text) return true;
        return (
          p.package_number?.toLowerCase().includes(text) ||
          p.package_id?.toLowerCase().includes(text)
        );
      });
  }, [data, globalFilter, statusFilter]);

  const table = useReactTable<PackageRow>({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="card bg-base-100 shadow-xl pt-3 h-screen md:h-[calc(100vh-6.9rem)]">
      <div className="px-1 md:px-3 pb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="join w-full md:w-1/2">
          <label className="input w-full rounded-sm">
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
              placeholder="Search by package number or ID"
              aria-label="Search packages"
            />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center md:gap-2 md:justify-end">
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
              onChange={(e) => setStatusFilter(e.target.value)}
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
              aria-label="Retry loading packages"
            >
              Try again
            </button>
          )}
        </div>
      ) : loading ? (
        <>
          <PackageListingLoading />
          <div className="overflow-x-auto md:mx-3 hidden md:block">
            <TableLoading cols={8} rows={14} />
          </div>
        </>
      ) : (
        <>
          <div className="md:hidden px-1 pb-1 flex flex-col gap-3">
            {filtered.map((p) => (
              <div
                key={p.package_id}
                onClick={() => setSelectedPackageId(p.package_id)}
                className="card bg-base-100 shadow-sm border border-gray-300 dark:border-gray-600 p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{p.package_number}</div>
                  <span className={`badge ${getStatusBadgeClass(p.status)}`}>
                    {statusOptions[p.status as keyof typeof statusOptions]
                      ?.label || p.status}
                  </span>
                </div>
                <div className="text-sm opacity-80">{p.customer_name}</div>
                <div className="text-xs opacity-70">
                  SO: {p.salesorder_number}
                </div>
                <div className="text-xs opacity-70">ID: {p.package_id}</div>
                <div className="text-xs opacity-70">Date: {p.date}</div>
                <div className="text-xs opacity-70">
                  Tracking: {p.shipment_order?.tracking_number || "-"}
                </div>
              </div>
            ))}
            {!filtered.length && (
              <div className="px-1 pb-4 text-sm opacity-75">
                No packages found
              </div>
            )}
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
      {selectedPackageId && (
        <PackageDetail
          packageId={selectedPackageId}
          onClose={() => setSelectedPackageId(null)}
        />
      )}
    </div>
  );
}
