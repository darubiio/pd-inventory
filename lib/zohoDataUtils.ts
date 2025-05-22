import { Location } from "../types";

const getWarehousesByLocation = (location: Location) => location.warehouses;

export const getWarehousesByLocations = (locations: Location[]) => {
  return locations.flatMap(getWarehousesByLocation);
};
