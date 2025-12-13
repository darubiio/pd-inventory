import { PackageDetail, PackageLineItem } from "../../../../../../types";

export interface FindItemByCodesResult {
  item: PackageLineItem | null;
  isBoxBarcode: boolean;
}

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

const getItemIdentifiers = (item: PackageLineItem) => ({
  boxBarcode: normalizeForComparison(item.cf_box_barcode),
  sku: normalizeForComparison(item.sku),
  upc: normalizeForComparison(item.upc),
  ean: normalizeForComparison(item.ean),
  isbn: normalizeForComparison(item.isbn),
  partNumber: normalizeForComparison(item.part_number),
});

const matchesIdentifier = (identifier: string, code: string): boolean => {
  return Boolean(identifier && identifier === code);
};

const checkItemMatch = (
  item: PackageLineItem,
  normalizedCode: string
): FindItemByCodesResult | null => {
  const identifiers = getItemIdentifiers(item);

  if (matchesIdentifier(identifiers.boxBarcode, normalizedCode)) {
    return { item, isBoxBarcode: true };
  }

  const standardIdentifiers = [
    identifiers.sku,
    identifiers.upc,
    identifiers.ean,
    identifiers.isbn,
    identifiers.partNumber,
  ];

  if (standardIdentifiers.some((id) => matchesIdentifier(id, normalizedCode))) {
    return { item, isBoxBarcode: false };
  }

  return null;
};

export const findItemByCode = (
  code: string,
  data?: PackageDetail
): FindItemByCodesResult => {
  const defaultResult = { item: null, isBoxBarcode: false };

  if (!data?.line_items) return defaultResult;

  const normalizedCode = normalizeForComparison(code);
  if (!normalizedCode) return defaultResult;

  for (const item of data.line_items) {
    const match = checkItemMatch(item, normalizedCode);
    if (match) return match;
  }

  return defaultResult;
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
