import { getAuthToken } from "./zohoAuth";
import { getItemCategories, getWarehousesByLocations } from "./zohoDataUtils";
import {
  Item,
  ItemCategories,
  ItemDetails,
  Warehouse,
  WarehouseCategory,
} from "../types";
import { Redis } from "@upstash/redis";

const REDIS = Redis.fromEnv();

const { ZOHO_ORG_ID, ZOHO_DOMAIN } = process.env;

export const getOrganizationDetails = async (accessToken?: string) => {
  try {
    const token = accessToken || (await getAuthToken());

    const url = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1/organizations/${ZOHO_ORG_ID}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });

    const data = await res.json();
    if (res.status !== 200) {
      console.error("Error fetching organization details:", data);
      throw new Error("Failed to fetch organization details");
    }

    if (data.organization) return data.organization;

    throw new Error("No organization details found in response");
  } catch (error) {
    console.error("Error fetching token from Redis:", error);
    throw new Error("Failed to fetch token from Redis");
  }
};

export const getWarehouses = async (
  accessToken?: string
): Promise<Warehouse[]> => {
  try {
    const token = accessToken || (await getAuthToken());

    const warehousesCache: Warehouse[] | null = await REDIS.get("warehouses");
    if (warehousesCache) return warehousesCache;

    const url = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1/locations?organization_id=${ZOHO_ORG_ID}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });

    const data = await res.json();
    if (res.status !== 200) {
      console.error("Error fetching warehouses:", data);
      throw new Error("Failed to fetch warehouses");
    }

    if (data.locations) {
      const warehousesByLocation = getWarehousesByLocations(data.locations);
      REDIS.set("warehouses", warehousesByLocation, { ex: 5400 });
      return warehousesByLocation;
    }

    throw new Error("No warehouses found in response");
  } catch (error) {
    console.error("Error fetching token from Redis:", error);
    throw new Error("Failed to fetch token from Redis");
  }
};

const getItems = async (accessToken?: string): Promise<Item[]> => {
  try {
    const token = accessToken || (await getAuthToken());

    const url = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1/items?organization_id=${ZOHO_ORG_ID}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });

    const data = await res.json();
    if (res.status !== 200) {
      console.error("Error fetching items:", data);
      throw new Error("Failed to fetch items");
    }

    if (data.items) return data.items;

    throw new Error("No items found in response");
  } catch (error) {
    console.error("Error fetching token from Redis:", error);
    throw new Error("Failed to fetch token from Redis");
  }
};

const getItemsDetailByItemsId = async (
  itemIdList: string[],
  accessToken?: string
): Promise<ItemDetails> => {
  try {
    const token = accessToken || (await getAuthToken());

    const itemIds = itemIdList.join("%2C");
    const url = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1/itemdetails?item_ids=${itemIds}&organization_id=${ZOHO_ORG_ID}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Zoho-oauthtoken ${token}` },
    });

    const data = await res.json();
    if (res.status !== 200) {
      console.error("Error fetching items:", data);
      throw new Error("Failed to fetch items");
    }

    if (data.items) return data.items;

    throw new Error("No items found in response");
  } catch (error) {
    console.error("Error fetching token from Redis:", error);
    throw new Error("Failed to fetch token from Redis");
  }
};

const getItemsDetail = async (
  itemIdList: string[],
  accessToken?: string,
  chunkSize = 40
) => {
  if (!itemIdList.length) return [];
  const token = accessToken || (await getAuthToken());
  const chunks = [];
  for (let i = 0; i < itemIdList.length; i += chunkSize) {
    chunks.push(itemIdList.slice(i, i + chunkSize));
  }
  const results = await Promise.all(
    chunks.map(async (chunk) => {
      try {
        return await getItemsDetailByItemsId(chunk, token);
      } catch (e) {
        console.error("Error fetching chunk", chunk, e);
        return [];
      }
    })
  );
  return results.flat();
};

export const getCategories = async () => {
  try {
    const items = await getItems();
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
  } catch (e) {
    console.error("Error fetching categories", e);
    return [];
  }
};

const getItemDetails = async (accessToken?: string) => {
  try {
    const token = accessToken || (await getAuthToken());

    const itemDetailsCache: ItemDetails[] | null = await REDIS.get(
      "itemsDetail"
    );

    if (itemDetailsCache) return itemDetailsCache;

    const itemList = await getItems(token);
    const itemCategories = getItemCategories(itemList);
    const itemIdList = Object.keys(itemCategories);
    const itemDetails = await getItemsDetail(itemIdList);

    const itemDetailsCategories = itemDetails.map((item) => ({
      ...item,
      ...itemCategories[item["item_id"]],
    }));

    const stringDetails = JSON.stringify(itemDetailsCategories);
    await REDIS.set("itemsDetail", stringDetails, { ex: 2400 });
    return itemDetailsCategories;
  } catch (error) {
    console.error("Error fetching token from Redis:", error);
    throw new Error("Failed to fetch token from Redis");
  }
};

export const getItemsCategoriesStock = async () => {
  const itemDetails = await getItemDetails();
  const data: ItemCategories = {};

  for (const item of itemDetails) {
    const { category_id, category_name, warehouses } = item;

    for (const warehouse of warehouses) {
      const { warehouse_name, warehouse_stock_on_hand } = warehouse;
      if (!category_id || !category_name || !warehouse_name) continue;
      if (!data[category_id]) data[category_id] = { id: category_id, name: category_name };
      const warehouseName = warehouse_name.replace(/ /g, "_");
      data[category_id][warehouseName] =
        data[category_id][warehouseName] ?? 0 + Number(warehouse_stock_on_hand);
    }
  }

  return Object.values(data);
};

export const getWarehouseCategoryStock = async () => {
  const itemDetails = await getItemDetails();
  const data: WarehouseCategory = {};

  for (const item of itemDetails) {
    const { category_id, warehouses } = item;

    for (const warehouse of warehouses) {
      const { warehouse_name, warehouse_stock_on_hand } = warehouse;
      if (!data[warehouse_name]) {
        data[warehouse_name] = { name: warehouse_name };
      }
      data[warehouse_name][category_id] =
        Number(data[warehouse_name][category_id] ?? 0) + warehouse_stock_on_hand;
    }
  }

  return Object.values(data);
};
