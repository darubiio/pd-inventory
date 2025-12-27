export interface FindItemByCodeResult<T> {
  item: T | null;
  isBoxBarcode: boolean;
  isMappedItem?: boolean;
  mappedItemQuantity?: number;
  mappedItemId?: string;
}

interface IdentifiableItem {
  sku?: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  part_number?: string;
  cf_box_barcode?: string;
}

interface MappedItem extends IdentifiableItem {
  line_item_id: string;
  item_id: string;
  name: string;
  quantity: number;
  cf_box_qty?: string;
  cf_package_qty?: string;
}

interface ItemWithMappedItems extends IdentifiableItem {
  mapped_items?: MappedItem[];
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

export const findItemByCode = <T extends ItemWithMappedItems>(
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

    if (item.mapped_items && item.mapped_items.length > 0) {
      for (const mappedItem of item.mapped_items) {
        const mappedMatch = checkItemMatch(mappedItem, normalizedCode);
        if (mappedMatch) {
          const parentQuantity = (item as any).quantity || 1;
          const mappedQuantity = mappedItem.quantity || 1;
          const totalQuantity = parentQuantity * mappedQuantity;

          return {
            item: {
              ...item,
              quantity: totalQuantity,
              cf_box_barcode: mappedItem.cf_box_barcode,
              cf_box_qty: mappedItem.cf_box_qty,
              cf_package_qty: mappedItem.cf_package_qty,
              upc: mappedItem.upc,
              ean: mappedItem.ean,
              isbn: mappedItem.isbn,
              part_number: mappedItem.part_number,
            } as T,
            isBoxBarcode: mappedMatch.isBoxBarcode,
            isMappedItem: true,
            mappedItemQuantity: totalQuantity,
            mappedItemId: mappedItem.line_item_id,
          };
        }
      }
    }
  }

  return defaultResult;
};
