"use server";

import { getAuthToken } from "./zohoAuth";
import { getItemCategories, getWarehousesByLocations } from "./zohoDataUtils";
import {
  GeolocationData,
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

const getItems = async (
  accessToken?: string,
  page: number = 1
): Promise<Item[]> => {
  try {
    const token = accessToken || (await getAuthToken());
    const itemsCache: Item[] | null = await REDIS.get("items");
    if (itemsCache) return itemsCache;

    let currPage = page;
    let allItems: Item[] = [];
    let hasMorePages = true;

    while (hasMorePages) {
      const url = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1/items?organization_id=${ZOHO_ORG_ID}&page=${currPage}&per_page=800`;
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Zoho-oauthtoken ${token}` },
      });

      const data = await res.json();
      if (res.status !== 200) {
        console.error("Error fetching items:", data);
        throw new Error("Failed to fetch items");
      }

      if (Array.isArray(data.items)) {
        allItems = allItems.concat(data.items);
      }

      hasMorePages = data.page_context?.has_more_page || false;
      currPage += 1;
    }

    if (allItems.length > 0) {
      const stringItems = JSON.stringify(allItems);
      await REDIS.set("items", stringItems, { ex: 5400 });
    }

    if (allItems.length === 0) {
      throw new Error("No items found in response");
    }

    return allItems;
  } catch (error) {
    console.error("Error fetching items:", error);
    throw new Error("Failed to fetch items");
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
    const { category_id, category_name, item_id, name, warehouses } = item;
    if (!category_id || !category_name) continue;
    if (!data[category_id]) {
      data[category_id] = { id: category_id, name: category_name, items: [] };
    }
    // sum warehouse stock by categories
    for (const warehouse of warehouses) {
      const { warehouse_name, warehouse_stock_on_hand } = warehouse;
      if (!warehouse_name) continue;
      const warehouseName = warehouse_name.replace(/ /g, "_");
      data[category_id][warehouseName] =
        Number(data[category_id][warehouseName] ?? 0) +
        Number(warehouse_stock_on_hand);
    }
    // add item and warehouse stock
    const itemStock: any = { id: item_id, name };
    for (const warehouse of warehouses) {
      const { warehouse_name, warehouse_stock_on_hand } = warehouse;
      if (!warehouse_name) continue;
      const warehouseName = warehouse_name.replace(/ /g, "_");
      itemStock[warehouseName] = Number(warehouse_stock_on_hand);
    }
    data[category_id].items.push(itemStock);
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
        Number(data[warehouse_name][category_id] ?? 0) +
        warehouse_stock_on_hand;
    }
  }

  return Object.values(data);
};

function buildAddress(addressArray: string[]) {
  return addressArray.filter(Boolean).join(", ");
}

export const getWarehouseGeolocation = async (
  warehouseId: string,
  addressArray: string[]
) => {
  try {
    const cachedData: GeolocationData | null = await REDIS.get(
      `warehouse_geolocation-${warehouseId}`
    );
    if (cachedData) return cachedData;

    const token = process.env.MAPBOX_ACCESS_TOKEN;
    const address = buildAddress(addressArray);
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${token}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].center;
      const zoom = 17;
      const marker = `pin-s+ff0000(${lon},${lat})`;
      const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${marker}/${lon},${lat},${zoom}/600x400?access_token=${token}`;
      const geolocationData: GeolocationData = {
        coordinates: [lon, lat],
        mapUrl,
      };
      await REDIS.set(
        `warehouse_geolocation-${warehouseId}`,
        JSON.stringify(geolocationData),
        { ex: 10800 }
      );
      return geolocationData;
    } else {
      return { mapUrl: "/map.png" };
    }
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return { error: "Failed to fetch geolocation" };
  }
};
