import { PackageDetail, PackageLineItem } from "../../../../../../types";

export const getPartNumber = (item: PackageLineItem): string | null => {
  const partNumberField = item.item_custom_fields?.find(
    (field) =>
      field.label.toLowerCase().includes("part") &&
      field.label.toLowerCase().includes("number")
  );
  return partNumberField?.value || null;
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

export const getMappedItemStatus = (
  parentItem: PackageLineItem,
  mappedItem: { line_item_id: string; quantity: number },
  scannedItems: Map<string, number> | undefined
) => {
  const scanned = scannedItems?.get(mappedItem.line_item_id) || 0;
  const expectedQuantity = mappedItem.quantity;

  if (scanned === 0) return "pending";
  if (scanned < expectedQuantity) return "partial";
  if (scanned === expectedQuantity) return "complete";
  return "excess";
};

export const getParentStatus = (
  item: PackageLineItem,
  scannedItems: Map<string, number> | undefined
) => {
  if (!item.mapped_items || item.mapped_items.length === 0) {
    return getItemStatus(item, scannedItems);
  }

  const mappedStatuses = item.mapped_items.map((mappedItem) =>
    getMappedItemStatus(item, mappedItem, scannedItems)
  );

  if (mappedStatuses.every((s) => s === "complete")) return "complete";
  if (mappedStatuses.every((s) => s === "pending")) return "pending";
  if (mappedStatuses.some((s) => s === "excess")) return "excess";
  return "partial";
};

export const getItemStatus = (
  item: PackageLineItem,
  scannedItems: Map<string, number> | undefined
) => {
  const scanned = scannedItems?.get(item.line_item_id) || 0;

  let expectedQuantity = item.quantity;
  if (item.mapped_items && item.mapped_items.length > 0) {
    expectedQuantity = item.mapped_items.reduce(
      (sum, mappedItem) => sum + mappedItem.quantity,
      0
    );
  }

  if (scanned === 0) return "pending";
  if (scanned < expectedQuantity) return "partial";
  if (scanned === expectedQuantity) return "complete";
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
