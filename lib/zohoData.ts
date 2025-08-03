"use server";

import { GeolocationData, WarehouseCategory } from "../types";
import { Redis } from "@upstash/redis";
import { getItemsDetail } from "./api/clients/zoho/zohoData";

const REDIS = Redis.fromEnv();

export const getWarehouseCategoryStock = async () => {
  const itemDetails = await getItemsDetail();
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
