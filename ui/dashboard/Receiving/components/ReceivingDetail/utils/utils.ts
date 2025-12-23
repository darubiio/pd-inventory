import {
  PurchaseReceive,
  PurchaseReceiveLineItem,
} from "../../../../../../types";

export interface FindItemByCodeResult {
  item: PurchaseReceiveLineItem | null;
}

const normalizeForComparison = (value: string | undefined | null): string => {
  if (!value) return "";
  return value
    .replace(/[\s\-_\.]/g, "")
    .replace(/[^\w]/g, "")
    .toUpperCase()
    .trim();
};

const getItemIdentifiers = (item: PurchaseReceiveLineItem) => ({
  sku: normalizeForComparison(item.sku),
});

const matchesIdentifier = (identifier: string, code: string): boolean => {
  return Boolean(identifier && identifier === code);
};

const checkItemMatch = (
  item: PurchaseReceiveLineItem,
  normalizedCode: string
): FindItemByCodeResult | null => {
  const identifiers = getItemIdentifiers(item);

  if (matchesIdentifier(identifiers.sku, normalizedCode)) {
    return { item };
  }

  return null;
};

export const findItemByCode = (
  code: string,
  data?: PurchaseReceive
): FindItemByCodeResult => {
  const defaultResult = { item: null };

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
