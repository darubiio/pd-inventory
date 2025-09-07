"use server";

import { Redis } from "@upstash/redis";

const REDIS = Redis.fromEnv();

function buildAddress(addressArray: string[]) {
  return addressArray.filter(Boolean).join(", ");
}

export const getWarehouseGeolocation = async (
  warehouseId: string,
  addressArray: string[]
) => {
  try {
    const cachedData = await REDIS.get(`warehouse_geolocation-${warehouseId}`);
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
      const geolocationData = {
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
