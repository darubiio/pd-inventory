import {
  CategoryItem,
  Item,
  ItemCategories,
  ItemDetails,
  Location,
  WarehouseCategory,
} from "../../../types";

export const getWarehousesByLocations = (locations: Location[]) => {
  return locations.filter((loc) => loc.type === "line_item_only");
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
  locationName: string,
  stock: number
) => {
  category[locationName] = Number(category[locationName] ?? 0) + stock;
};

const buildCategoryItem = (
  item: ItemDetails,
  locations: Location[]
): CategoryItem => {
  const { item_id, name } = item;
  const itemStock: CategoryItem = { id: item_id, name, items: [] };
  locations.forEach((location) => {
    const stock = Number(location.location_stock_on_hand);
    const locationName = normalizeWarehouseName(location.location_name);
    if (locationName) itemStock[locationName] = stock;
  });
  return itemStock;
};

const DEFAULT_CATEGORY = {
  id: "others",
  name: "Others",
} as const;

const handleCategories = (
  data: ItemCategories,
  categoryId: string,
  categoryName: string
) => {
  if (!data[categoryId]) {
    data[categoryId] = { id: categoryId, name: categoryName, items: [] };
  }
};

const addWarehouseStock = (
  category: CategoryItem,
  locations: ItemDetails["locations"]
) => {
  locations.forEach((location) => {
    const locationName = normalizeWarehouseName(location.location_name);
    if (locationName) {
      addCategoryWarehouseStock(
        category,
        locationName,
        Number(location.location_stock_on_hand)
      );
    }
  });
};

export const processItem = (
  item: ItemDetails,
  data: ItemCategories,
  locationIds: string[]
) => {
  const categoryId = item.category_id || DEFAULT_CATEGORY.id;
  const categoryName = item.category_name || DEFAULT_CATEGORY.name;
  const locations = item.locations.filter((loc) =>
    locationIds.includes(loc.location_id)
  );

  if (!item.category_id || !item.category_name) {
    item.category_id = DEFAULT_CATEGORY.id;
    item.category_name = DEFAULT_CATEGORY.name;
  }

  handleCategories(data, categoryId, categoryName);
  addWarehouseStock(data[categoryId], locations);
  data[categoryId].items.push(buildCategoryItem(item, locations));
};

export const itemsByCategoryAndWarehouse = (
  item: ItemDetails,
  warehouseId: string,
  categoryId: string
) =>
  item.locations.some(
    (location) =>
      location.location_id === warehouseId && item.category_id === categoryId
  ) && item.category_id === categoryId;

const ensureWarehouseBucket = (
  acc: WarehouseCategory,
  locationName: string
) => {
  if (!acc[locationName]) {
    acc[locationName] = { name: locationName };
  }
  return acc[locationName];
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
    const { category_id, locations } = item;
    for (const wh of locations) {
      const { location_name, location_stock_on_hand } = wh;
      const bucket = ensureWarehouseBucket(acc, location_name);
      addCategoryStock(
        bucket as Record<string, unknown>,
        category_id,
        location_stock_on_hand
      );
    }
  }
  return acc;
};
