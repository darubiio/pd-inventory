export interface FindItemByCodeResult<T> {
  item: T | null;
  isBoxBarcode: boolean;
}

interface IdentifiableItem {
  sku?: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  part_number?: string;
  cf_box_barcode?: string;
}

const normalizeForComparison = (value: string | undefined | null): string => {
  if (!value) return "";
  return value
    .replace(/[\s\-_\.]/g, "")
    .replace(/[^\w]/g, "")
    .toUpperCase()
    .trim();
};

const getItemIdentifiers = (item: IdentifiableItem) => ({
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

const checkItemMatch = <T extends IdentifiableItem>(
  item: T,
  normalizedCode: string
): FindItemByCodeResult<T> | null => {
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

export const findItemByCode = <T extends IdentifiableItem>(
  code: string,
  items?: T[]
): FindItemByCodeResult<T> => {
  const defaultResult = { item: null, isBoxBarcode: false };

  if (!items?.length) return defaultResult;

  const normalizedCode = normalizeForComparison(code);
  if (!normalizedCode) return defaultResult;

  for (const item of items) {
    const match = checkItemMatch(item, normalizedCode);
    if (match) return match;
  }

  return defaultResult;
};
