import { ColumnDef } from "@tanstack/react-table";
import { PackageRow } from "../../../../../../types";
import { getStatusBadgeClass } from "../../PackageDetail/utils/utils";
import { Dispatch, SetStateAction } from "react";

type GetColumnsParams = {
  actions: {
    setSelectedPackageId: Dispatch<SetStateAction<string | null>>;
  };
};

export const statusOptions = {
  all: { label: "All", value: "all" },
  not_shipped: { label: "NotShipped", value: "not_shipped" },
  shipped: { label: "Shipped", value: "shipped" },
  delivered: { label: "Delivered", value: "delivered" },
};

export const normalizeStatus = (s?: string) => (s || "").trim();

export const getColumns = ({
  actions,
}: GetColumnsParams): ColumnDef<PackageRow>[] => [
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
        onClick={() => actions.setSelectedPackageId(row.original.package_id)}
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
];
