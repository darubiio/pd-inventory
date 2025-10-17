import {
  CategoryItem,
  Item,
  ItemCategories,
  ItemDetails,
  Location,
  WarehouseCategory,
} from "../../../types";

const withLocationId = (location: Location) =>
  location.warehouses.map((w) => ({ ...w, location_id: location.location_id }));

const filterActives = <T extends { status: string }>(items: T[]) => {
  return items.filter((item) => item.status === "active");
};

export const getWarehousesByLocations = (locations: Location[]) => {
  return filterActives(locations.flatMap(withLocationId));
};

export const getCategories = (items: Item[]) => {
  return items.reduce((acc, { item_id, category_id, category_name }) => {
    acc[item_id] = { category_id, category_name };
    return acc;
  }, {} as Record<string, { category_id: string; category_name: string }>);
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export function extractUniqueCategories(
  items: { category_id: string; category_name: string }[]
) {
  return Array.from(
    new Map(
      items
        .filter(
          ({ category_id, category_name }) =>
            Boolean(category_id && category_id.trim()) &&
            Boolean(category_name && category_name.trim())
        )
        .map(({ category_id, category_name }) => [
          category_id,
          { category_id, category_name },
        ])
    ).values()
  );
}

export const getItemsDetailCategories = (
  itemDetails: ItemDetails[],
  itemCategories: Record<string, { category_id: string; category_name: string }>
) => {
  return itemDetails.map((item) => ({
    ...item,
    ...itemCategories[item["item_id"]],
  }));
};

const normalizeWarehouseName = (name?: string): string | undefined =>
  name?.replace(/ /g, "_");

const addCategoryWarehouseStock = (
  category: CategoryItem,
  warehouseName: string,
  stock: number
) => {
  category[warehouseName] = Number(category[warehouseName] ?? 0) + stock;
};

const buildCategoryItem = (item: ItemDetails): CategoryItem => {
  const { item_id, name, warehouses } = item;
  const itemStock: CategoryItem = { id: item_id, name, items: [] };
  warehouses.forEach((warehouse) => {
    const warehouseName = normalizeWarehouseName(warehouse.warehouse_name);
    if (warehouseName) {
      itemStock[warehouseName] = Number(warehouse.warehouse_stock_on_hand);
    }
  });
  return itemStock;
};

export const processItem = (item: ItemDetails, data: ItemCategories) => {
  const { category_id, category_name, warehouses } = item;
  if (!category_id || !category_name) return;

  if (!data[category_id]) {
    data[category_id] = { id: category_id, name: category_name, items: [] };
  }

  warehouses.forEach((warehouse) => {
    const warehouseName = normalizeWarehouseName(warehouse.warehouse_name);
    if (warehouseName) {
      addCategoryWarehouseStock(
        data[category_id],
        warehouseName,
        Number(warehouse.warehouse_stock_on_hand)
      );
    }
  });

  data[category_id].items.push(buildCategoryItem(item));
};

export const itemsByCategoryAndWarehouse = (
  item: ItemDetails,
  warehouseId: string,
  categoryId: string
) =>
  item.warehouses.some(
    (warehouse) =>
      warehouse.warehouse_id === warehouseId && item.category_id === categoryId
  ) && item.category_id === categoryId;

const ensureWarehouseBucket = (
  acc: WarehouseCategory,
  warehouseName: string
) => {
  if (!acc[warehouseName]) {
    acc[warehouseName] = { name: warehouseName };
  }
  return acc[warehouseName];
};

const addCategoryStock = (
  bucket: Record<string, unknown>,
  categoryId: string,
  delta: number
) => {
  const current = Number((bucket as Record<string, number>)[categoryId] ?? 0);
  (bucket as Record<string, number>)[categoryId] = current + delta;
};

export const buildWarehouseCategoryMap = (
  items: ItemDetails[]
): WarehouseCategory => {
  const acc: WarehouseCategory = {};
  for (const item of items) {
    const { category_id, warehouses } = item;
    for (const wh of warehouses) {
      const { warehouse_name, warehouse_stock_on_hand } = wh;
      const bucket = ensureWarehouseBucket(acc, warehouse_name);
      addCategoryStock(
        bucket as Record<string, unknown>,
        category_id,
        warehouse_stock_on_hand
      );
    }
  }
  return acc;
};
