import { getAuthToken } from "./zohoAuth";
import { getWarehousesByLocations } from "./zohoDataUtils";
import { Item, ItemDetails, Warehouse } from "../types";

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

    if (data.locations) return getWarehousesByLocations(data.locations);

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

const getItemsDetailsByItemsId = async (
  itemIdList: string[],
  accessToken?: string
) => {
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

const getSlicedItemsDetailsByItemsId = async (
  itemIdList: string[],
  accessToken?: string,
  chunkSize = 30
): Promise<PromiseSettledResult<ItemDetails>[]> => {
  if (!itemIdList.length) return [];
  const token = accessToken || (await getAuthToken());
  const chunks = [];
  for (let i = 0; i < itemIdList.length; i += chunkSize) {
    chunks.push(itemIdList.slice(i, i + chunkSize));
  }
  const results = await Promise.allSettled(
    chunks.map(async (chunk) => {
      try {
        return await getItemsDetailsByItemsId(chunk, token);
      } catch (e) {
        console.error("Error fetching chunk", chunk, e);
        return [];
      }
    })
  );
  return results.flat();
};

export const getItemDetails = async (accessToken?: string) => {
  try {
    const token = accessToken || (await getAuthToken());
    const itemList = await getItems(token);
    const itemIdList = itemList.map((item) => item.item_id);
    const itemDetails = await getSlicedItemsDetailsByItemsId(itemIdList, token);

    if (itemDetails) return itemDetails;

    throw new Error("No items found in response");
  } catch (error) {
    console.error("Error fetching token from Redis:", error);
    throw new Error("Failed to fetch token from Redis");
  }
};
