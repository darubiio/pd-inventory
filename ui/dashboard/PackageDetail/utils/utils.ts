import { PackageDetail, PackageLineItem } from "../../../../types";
import {
  clearResult,
  scanItem,
  setLastScannedCode,
  setScanError,
} from "../state/scannerActions";

export const getPartNumber = (item: PackageLineItem): string | null => {
  const partNumberField = item.item_custom_fields?.find(
    (field) =>
      field.label.toLowerCase().includes("part") &&
      field.label.toLowerCase().includes("number")
  );
  return partNumberField?.value || null;
};

export const findItemByCode = (
  code: string,
  data?: PackageDetail
): PackageLineItem | null => {
  if (!data?.line_items) return null;

  const normalizedCode = code.trim().toUpperCase();

  return (
    data.line_items.find((item) => {
      const sku = item.sku?.toUpperCase();
      const partNumber = getPartNumber(item)?.toUpperCase();

      return sku === normalizedCode || partNumber === normalizedCode;
    }) || null
  );
};

export const getStatusBadgeClass = (status: string | undefined) => {
  const normalizedStatus = status?.toLowerCase() || "";
  if (normalizedStatus === "not_shipped") return "badge-warning";
  if (normalizedStatus === "shipped") return "badge-primary";
  if (normalizedStatus === "delivered") return "badge-success";
  return "";
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
  item: PackageLineItem,
  scannedItems: Map<string, number> | undefined
) => {
  const scanned = scannedItems?.get(item.line_item_id) || 0;
  if (scanned === 0) return "pending";
  if (scanned < item.quantity) return "partial";
  if (scanned === item.quantity) return "complete";
  return "excess";
};

export const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch package details");
  }
  const { data } = await response.json();
  return data as PackageDetail;
};
