import { PurchaseReceiveLineItem } from "../../../../../../types";

export const getStatusBadgeClass = (status: string | undefined) => {
  const normalizedStatus = status?.toLowerCase() || "";
  if (normalizedStatus === "in_transit") return "badge-warning";
  if (normalizedStatus === "received") return "badge-success";
  return "badge-ghost";
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case "complete":
      return "bg-success/20 border-success";
    case "partial":
      return "bg-warning/20 border-warning";
    case "excess":
      return "bg-error/20 border-error";
    default:
      return "bg-base-200";
  }
};

export const getItemStatus = (
  item: PurchaseReceiveLineItem,
  scannedItems: Map<string, number> | undefined
) => {
  const scanned = scannedItems?.get(item.line_item_id) || 0;
  if (scanned === 0) return "pending";
  if (scanned < item.quantity) return "partial";
  if (scanned === item.quantity) return "complete";
  return "excess";
};

export const fetcher = (url: string) => fetch(url).then((r) => r.json());
