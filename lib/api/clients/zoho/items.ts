import { ItemCategories } from "../../../../types";
import {
  getCategories,
  getItemsDetailCategories,
  processItem,
} from "../../utils/zohoDataUtils";
import {
  getItems,
  getItemsDetailById,
  getWarehousesByOrganization,
} from "./zohoData";

export const getItemsDetail = async () => {
  const itemList = await getItems();
  const itemCategories = getCategories(itemList);
  const itemDetails = await getItemsDetailById(Object.keys(itemCategories));
  const details = getItemsDetailCategories(itemDetails, itemCategories);

  return details;
};

export const getItemsCategoriesStock = async () => {
  const itemDetails = await getItemsDetail();
  const locations = await getWarehousesByOrganization();
  const locationIds = locations.map((loc) => loc.location_id);
  const data: ItemCategories = {};

  itemDetails.forEach((item) => processItem(item, data, locationIds));

  return Object.values(data);
};
