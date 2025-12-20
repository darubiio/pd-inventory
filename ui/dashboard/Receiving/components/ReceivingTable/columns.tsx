import { ColumnDef } from "@tanstack/react-table";
import { PurchaseReceiveRow } from "../../../../../types";
import { Dispatch, SetStateAction } from "react";
import { getStatusBadge } from "./ReceivingTable";

type GetColumnsParams = {
  actions: {
    setSelectedPurchaseOrderId: Dispatch<SetStateAction<string | null>>;
  };
};

export const getColumns = ({
  actions,
}: GetColumnsParams): ColumnDef<PurchaseReceiveRow>[] => [
  {
    accessorKey: "receive_number",
    header: "Receive #",
    cell: (ctx) => (
      <div className="font-semibold">{ctx.getValue() as string}</div>
    ),
  },
  {
    accessorKey: "purchaseorder_number",
    header: "PO Number",
    cell: (ctx) => (
      <span className="opacity-70 text-sm">{ctx.getValue() as string}</span>
    ),
  },
  {
    accessorKey: "vendor_name",
    header: "Vendor",
  },
  {
    accessorKey: "received_status",
    header: "Status",
    cell: ({ row }) => {
      const statusBadge = getStatusBadge(row.original.received_status);
      return (
        <span className={`badge ${statusBadge.class}`}>
          {statusBadge.label}
        </span>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Receive Date",
  },
  {
    accessorKey: "location_name",
    header: "Location",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <button
        className="btn btn-ghost btn-sm"
        onClick={() =>
          actions.setSelectedPurchaseOrderId(row.original.receive_id)
        }
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
