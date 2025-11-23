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

const normalizeForComparison = (value: string | undefined | null): string => {
  if (!value) return "";
  return value
    .replace(/[\s\-_\.]/g, "")
    .replace(/[^\w]/g, "")
    .toUpperCase()
    .trim();
};

export const findItemByCode = (
  code: string,
  data?: PackageDetail
): PackageLineItem | null => {
  if (!data?.line_items) return null;

  const normalizedCode = normalizeForComparison(code);

  if (!normalizedCode) return null;

  return (
    data.line_items.find((item) => {
      const sku = normalizeForComparison(item.sku);
      const upc = normalizeForComparison(item.upc);
      const ean = normalizeForComparison(item.ean);
      const isbn = normalizeForComparison(item.isbn);
      const partNumber = normalizeForComparison(item.part_number);
      const customPartNumber = normalizeForComparison(getPartNumber(item));

      return (
        (sku && sku === normalizedCode) ||
        (upc && upc === normalizedCode) ||
        (ean && ean === normalizedCode) ||
        (isbn && isbn === normalizedCode) ||
        (partNumber && partNumber === normalizedCode) ||
        (customPartNumber && customPartNumber === normalizedCode)
      );
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
