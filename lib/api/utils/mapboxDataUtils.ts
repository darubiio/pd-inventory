import {
  Location,
  MapBoxLocationResponse,
  WarehouseAndPosition,
} from "../../../types";

const { MAPBOX_ACCESS_TOKEN } = process.env;

export const buildAddress = (location: Location) => {
  const fullAddress = [
    location.address.street_address1,
    location.address.city,
    location.address.state,
    location.address.country,
  ];
  return fullAddress.filter(Boolean).join(", ");
};

export const transformLocations = (
  data: MapBoxLocationResponse,
  location: Location
): WarehouseAndPosition => {
  if (data.features && data.features.length > 0) {
    const [lon, lat] = data.features[0].center;
    const zoom = 17;
    const marker = `pin-s+ff0000(${lon},${lat})`;
    const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${marker}/${lon},${lat},${zoom}/600x400?access_token=${MAPBOX_ACCESS_TOKEN}`;
    return {
      mapUrl,
      coordinates: [lon, lat] as [number, number],
      ...location,
    };
  } else {
    return {
      coordinates: [0, 0] as [number, number],
      mapUrl: "/map.png",
      ...location,
    };
  }
};
