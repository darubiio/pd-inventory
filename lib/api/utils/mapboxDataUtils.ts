import {
  MapBoxLocationResponse,
  Warehouse,
  WarehouseAndPosition,
} from "../../../types";

const { MAPBOX_ACCESS_TOKEN } = process.env;

export const buildAddress = (warehouse: Warehouse) => {
  const fullAddress = [
    warehouse.address,
    warehouse.city,
    warehouse.state,
    warehouse.country,
  ];
  return fullAddress.filter(Boolean).join(", ");
};

export const transformLocations = (
  data: MapBoxLocationResponse,
  warehouse: Warehouse
): WarehouseAndPosition => {
  if (data.features && data.features.length > 0) {
    const [lon, lat] = data.features[0].center;
    const zoom = 17;
    const marker = `pin-s+ff0000(${lon},${lat})`;
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${marker}/${lon},${lat},${zoom}/600x400?access_token=${MAPBOX_ACCESS_TOKEN}`;
    return {
      mapUrl,
      coordinates: [lon, lat] as [number, number],
      ...warehouse,
    };
  } else {
    return {
      coordinates: [0, 0] as [number, number],
      mapUrl: "/map.png",
      ...warehouse,
    };
  }
};
