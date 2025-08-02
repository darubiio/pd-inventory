import { Item, Location } from "../../../types";

const getWarehousesByLocation = (location: Location) => location.warehouses;

const filterActives = <T extends { status: string }>(items: T[]) => {
  return items.filter((item) => item.status === "active");
};

export const getWarehousesByLocations = (locations: Location[]) => {
  return filterActives(locations.flatMap(getWarehousesByLocation));
};

export const getItemCategories = (items: Item[]) => {
  return items.reduce((acc, { item_id, category_id, category_name }) => {
    acc[item_id] = { category_id, category_name };
    return acc;
  }, {} as Record<string, { category_id: string; category_name: string }>);
};
