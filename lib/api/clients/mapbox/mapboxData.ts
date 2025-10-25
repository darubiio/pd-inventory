"use server";

import {
  WarehouseAndPosition,
  MapBoxLocationResponse,
  Warehouse,
} from "../../../../types";
import { apiFetch } from "../../client";
import { buildAddress, transformLocations } from "../../utils/mapboxDataUtils";
import { getWarehousesByOrganization } from "../zoho/zohoData";

const { MAPBOX_ACCESS_TOKEN } = process.env;

export const getWarehouseGeolocation = async (warehouse: Warehouse) => {
  const dir = encodeURIComponent(buildAddress(warehouse));
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${dir}.json?access_token=${MAPBOX_ACCESS_TOKEN}`;
  const res = await apiFetch<WarehouseAndPosition, MapBoxLocationResponse>(
    url,
    {
      method: "GET",
      transform: (data) => transformLocations(data, warehouse),
    }
  );
  return res;
};

export const getAllWarehouseData = async () => {
  const warehouses = await getWarehousesByOrganization();
  const data = await Promise.all(
    warehouses.map((w) => getWarehouseGeolocation(w))
  );
  return data;
};
