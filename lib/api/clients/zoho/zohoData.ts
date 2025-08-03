"use server";

import {
  Item,
  ItemCategories,
  ItemDetails,
  Warehouse,
} from "../../../../types";
import { getAllCacheChunks, setCacheChunks } from "../../cache";
import { apiFetch } from "../../client";
import { apiFetchAllPaginated } from "../../paginationClient";
import {
  chunkArray,
  extractUniqueCategories,
  getCategories,
  getItemsDetailCategories,
  getWarehousesByLocations,
  itemsByCategoryAndWarehouse,
  processItem,
} from "../../utils/zohoDataUtils";
import { getAuth } from "./zohoAuth";

const { ZOHO_ORG_ID, ZOHO_DOMAIN } = process.env;
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;

export const getOrganizations = async () => {
  const url = `${ZOHO_INVENTORY_URL}/organizations/${ZOHO_ORG_ID}`;
  const key = `zoho_organizations`;
  const auth = await getAuth();
  return apiFetch(url, { method: "GET", cacheCfg: { key }, auth });
};

export const getWarehousesByOrganization = async () => {
  const url = `${ZOHO_INVENTORY_URL}/locations?organization_id=${ZOHO_ORG_ID}`;
  const key = `zoho_warehouses`;
  return apiFetch<Warehouse[]>(url, {
    method: "GET",
    cacheCfg: { key },
    auth: await getAuth(),
    transform: (data) => getWarehousesByLocations(data.locations),
  });
};

export const getItems = async () => {
  const cacheKeyBase = `Zoho-items`;
  const buildPath = (page: number) => {
    return `${ZOHO_INVENTORY_URL}/items?organization_id=${ZOHO_ORG_ID}&page=${page}&per_page=800`;
  };
  return apiFetchAllPaginated<Item>({
    buildPath,
    cacheKeyBase,
    auth: await getAuth(),
    extractPage: (response) => ({
      data: response.items || [],
      has_more: response.page_context?.has_more_page ?? false,
    }),
  });
};

export const getItemDetailByItemsId = async (itemIdList: string[]) => {
  const itemIds = itemIdList.join("%2C");
  const url = `${ZOHO_INVENTORY_URL}/itemdetails?item_ids=${itemIds}&organization_id=${ZOHO_ORG_ID}`;
  return apiFetch<ItemDetails>(url, {
    method: "GET",
    auth: await getAuth(),
    transform: (data) => data.items || [],
  });
};

export const getItemsDetailById = async (
  itemIdList: string[],
  chunkSize = 120
): Promise<ItemDetails[]> => {
  try {
    const chunks = chunkArray(itemIdList, chunkSize);
    const results = await Promise.all(chunks.map(getItemDetailByItemsId));
    return results.flat();
  } catch (error) {
    console.error("Error fetching item details:", error);
    throw error;
  }
};

export const getItemCategories = async () => {
  const items = await getItems();
  return extractUniqueCategories(items);
};

export const getItemsDetail = async () => {
  const cacheKeyBase = `Zoho-itemsDetail`;
  const itemDetailsCache = await getAllCacheChunks<ItemDetails>(cacheKeyBase);
  if (itemDetailsCache?.length) return itemDetailsCache;

  const itemList = await getItems();
  const itemCategories = getCategories(itemList);
  const itemDetails = await getItemsDetailById(Object.keys(itemCategories));
  const details = getItemsDetailCategories(itemDetails, itemCategories);

  setCacheChunks(cacheKeyBase, details);

  return details;
};

export const getItemsCategoriesStock = async () => {
  const itemDetails = await getItemsDetail();
  const data: ItemCategories = {};

  itemDetails.forEach((item) => processItem(item, data));

  return Object.values(data);
};

export const getItemsByWarehouseAndCategory = async (
  warehouseId: string,
  categoryId: string
): Promise<ItemDetails[]> => {
  const itemDetails = await getItemsDetail();
  return itemDetails.filter((item) =>
    itemsByCategoryAndWarehouse(item, warehouseId, categoryId)
  );
};
