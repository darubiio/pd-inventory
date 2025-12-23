"use server";

import {
  Item,
  ItemDetails,
  ItemDetailsResponse,
  ItemsResponse,
  Location,
  LocationsResponse,
  PurchaseOrder,
  PurchaseOrderSearchParams,
  PurchaseOrdersResponse,
  PurchaseReceive,
  PurchaseReceivesResponse,
} from "../../../../types";
import { apiFetch } from "../../client";
import { apiFetchAllPaginated } from "../../paginationClient";
import {
  buildWarehouseCategoryMap,
  chunkArray,
  extractUniqueCategories,
  getWarehousesByLocations,
  itemsByCategoryAndWarehouse,
} from "../../utils/zohoDataUtils";
import { getItemsDetail } from "./items";
import { getAuthByToken, getUserAuth } from "./zohoAuth";
import { getDefaultDates } from "../../../../ui/dashboard/Packages/utils/utils";

const { ZOHO_ORG_ID } = process.env;
const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || "com";
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;
const ONE_DAY_IN_SECONDS = 86400;

export const getOrganizations = async () => {
  const url = `${ZOHO_INVENTORY_URL}/organizations/${ZOHO_ORG_ID}`;
  const key = `Zoho-organizations`;
  const auth = await getUserAuth();
  return apiFetch(url, { method: "GET", cacheCfg: { key }, auth });
};

export const getWarehousesByOrganization = async (accessToken?: string) => {
  const url = `${ZOHO_INVENTORY_URL}/locations?organization_id=${ZOHO_ORG_ID}`;
  const key = `Zoho-warehouses`;
  const data = await apiFetch<Location[], LocationsResponse>(url, {
    method: "GET",
    cacheCfg: { key, ttl: ONE_DAY_IN_SECONDS },
    auth: await getAuthByToken(accessToken),
    transform: (data) => getWarehousesByLocations(data.locations),
  });
  return data;
};

export const getItems = async () => {
  const cacheKeyBase = `Zoho-items`;
  const buildPath = (page: number) => {
    return `${ZOHO_INVENTORY_URL}/items?organization_id=${ZOHO_ORG_ID}&page=${page}&per_page=700`;
  };
  return apiFetchAllPaginated<Item, ItemsResponse>({
    buildPath,
    cacheKeyBase,
    auth: await getUserAuth(),
    extractPage: (response) => ({
      data: response.items || [],
      has_more: response.page_context?.has_more_page ?? false,
    }),
  });
};

export const getItemDetailByItemsId = async (itemIdList: string[]) => {
  const itemIds = itemIdList.join("%2C");
  const url = `${ZOHO_INVENTORY_URL}/itemdetails?item_ids=${itemIds}&organization_id=${ZOHO_ORG_ID}`;
  return apiFetch<ItemDetails, ItemDetailsResponse>(url, {
    method: "GET",
    auth: await getUserAuth(),
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

export const getItemsByWarehouseAndCategory = async (
  locationId: string,
  categoryId: string
): Promise<ItemDetails[]> => {
  const itemDetails = await getItemsDetail();
  return itemDetails.filter((item) =>
    itemsByCategoryAndWarehouse(item, locationId, categoryId)
  );
};

export const getWarehouseCategoryStock = async () => {
  const itemDetails = await getItemsDetail();
  const map = buildWarehouseCategoryMap(itemDetails);
  return Object.values(map);
};

export const getWarehouseDetailCategories = async (locationId: string) => {
  return Promise.all([getItemCategories(), getWarehouseById(locationId)]);
};

export const getWarehouseById = async (locationId: string) => {
  const locations = await getWarehousesByOrganization();
  return locations.find((location) => location.location_id === locationId);
};

interface SalesOrdersResponse {
  salesorders: SalesOrder[];
  page_context: {
    page: number;
    per_page: number;
    has_more_page: boolean;
    report_name: string;
    applied_filter: string;
    sort_column: string;
    sort_order: string;
  };
}

interface SalesOrder {
  salesorder_id: string;
  customer_name: string;
  customer_id: string;
  status: string;
  salesorder_number: string;
  reference_number: string;
  date: string;
  shipment_date: string;
  location_id: string;
  location_name: string;
  total: number;
  currency_code: string;
  created_time: string;
  last_modified_time: string;
}

interface PackagesResponse {
  packages: Package[];
  page_context: {
    page: number;
    per_page: number;
    has_more_page: boolean;
    report_name: string;
    applied_filter: string;
    sort_column: string;
    sort_order: string;
  };
}

interface Package {
  package_id: string;
  package_number: string;
  salesorder_id: string;
  salesorder_number: string;
  date: string;
  customer_id: string;
  customer_name: string;
  status: string;
  total_quantity: string;
  shipping_address: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    fax: string;
    phone: string;
  };
  billing_address: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    fax: string;
    phone: string;
  };
  line_items: PackageLineItem[];
  shipment_order?: {
    shipment_id: string;
    shipment_number: string;
    carrier: string;
    service: string;
    tracking_number: string;
    shipping_date: string;
    delivery_days: number;
    delivery_guarantee: boolean;
    shipment_rate: number;
    status: string;
    detailed_status: string;
  };
  created_time: string;
  last_modified_time: string;
  template_id: string;
  template_name: string;
  template_type: string;
  is_emailed: boolean;
  notes: string;
  contact_persons: ContactPerson[];
  custom_fields: CustomField[];
}

interface PackageLineItem {
  line_item_id: string;
  so_line_item_id: string;
  item_id: string;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  unit: string;
  is_invoiced: boolean;
  item_custom_fields: CustomField[];
}

interface ContactPerson {
  contact_person_id: string;
}

interface CustomField {
  customfield_id: string;
  label: string;
  value: string;
  index: number;
  data_type: string;
}

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 5);

  return {
    dateStart: startDate.toISOString().split("T")[0],
    dateEnd: endDate.toISOString().split("T")[0],
  };
};

interface SalesOrderSearchParams {
  locationId?: string;
  dateStart?: string;
  dateEnd?: string;
  status?: string;
}

export const getAllSalesOrders = async (
  searchParams: SalesOrderSearchParams = {}
) => {
  const { dateStart: defaultStart, dateEnd: defaultEnd } =
    getDefaultDateRange();
  const { dateStart = defaultStart, dateEnd = defaultEnd } = searchParams;
  const cacheKeyBase = `Zoho-sales-orders-${dateStart}-${dateEnd}`;

  const buildPath = (page: number) => {
    let path = `${ZOHO_INVENTORY_URL}/salesorders?organization_id=${ZOHO_ORG_ID}&page=${page}`;
    if (dateStart) path += `&date_start=${dateStart}`;
    if (dateEnd) path += `&date_end=${dateEnd}`;
    return path;
  };

  return apiFetchAllPaginated<SalesOrder, SalesOrdersResponse>({
    buildPath,
    cacheKeyBase,
    auth: await getUserAuth(),
    extractPage: ({ salesorders: data, page_context }) => ({
      has_more: page_context?.has_more_page,
      data,
    }),
  });
};

export const getSalesOrdersByLocationId = async (locationId: string) => {
  const salesOrders = await getAllSalesOrders({ locationId });
  return salesOrders.filter((so) => so.location_id === locationId);
};

export const getAllPackages = async (
  searchParams: { dateStart?: string; dateEnd?: string } = {}
) => {
  const { dateStart: defaultStart, dateEnd: defaultEnd } =
    getDefaultDateRange();
  const { dateStart = defaultStart, dateEnd = defaultEnd } = searchParams;
  const cacheKeyBase = `Zoho-packages-${dateStart}-${dateEnd}`;

  const buildPath = (page: number) => {
    let path = `${ZOHO_INVENTORY_URL}/packages?organization_id=${ZOHO_ORG_ID}&page=${page}&per_page=200`;
    if (dateStart) path += `&date_start=${dateStart}`;
    if (dateEnd) path += `&date_end=${dateEnd}`;
    return path;
  };

  return apiFetchAllPaginated<Package, PackagesResponse>({
    buildPath,
    cacheKeyBase,
    auth: await getUserAuth(),
    ttl: 0,
    extractPage: (response) => ({
      data: response.packages || [],
      has_more: response.page_context?.has_more_page ?? false,
    }),
  });
};

export const getPackagesByLocationId = async (locationId: string) => {
  const salesOrders = await getSalesOrdersByLocationId(locationId);
  const salesOrderIds = new Set(salesOrders.map((so) => so.salesorder_id));
  const packages = await getAllPackages();

  return packages.filter((pkg) => salesOrderIds.has(pkg.salesorder_id));
};

export const getPackagesByLocationIdRange = async (
  locationId: string,
  { dateStart, dateEnd }: { dateStart?: string; dateEnd?: string }
) => {
  const salesOrders = await getAllSalesOrders({ dateStart, dateEnd });
  const locationSalesOrders = salesOrders.filter(
    (so) => so.location_id === locationId
  );
  if (locationSalesOrders.length === 0) return [];
  const salesOrderIds = new Set(
    locationSalesOrders.map((so) => so.salesorder_id)
  );
  const packages = await getAllPackages({ dateStart, dateEnd });
  return packages.filter((pkg) => salesOrderIds.has(pkg.salesorder_id));
};

export const getAllPurchaseOrders = async (
  searchParams: PurchaseOrderSearchParams = {}
) => {
  const { dateStart: defaultStart, dateEnd: defaultEnd } =
    getDefaultDateRange();
  const { dateStart = defaultStart, dateEnd = defaultEnd } = searchParams;
  const cacheKeyBase = `Zoho-purchase-orders-${dateStart}-${dateEnd}`;

  const buildPath = (page: number) => {
    let path = `${ZOHO_INVENTORY_URL}/purchaseorders?organization_id=${ZOHO_ORG_ID}&page=${page}&per_page=200`;
    if (dateStart) path += `&date_start=${dateStart}`;
    if (dateEnd) path += `&date_end=${dateEnd}`;
    return path;
  };

  return apiFetchAllPaginated<PurchaseOrder, PurchaseOrdersResponse>({
    buildPath,
    cacheKeyBase,
    auth: await getUserAuth(),
    ttl: 0,
    extractPage: ({ purchaseorders: data, page_context }) => ({
      has_more: page_context?.has_more_page,
      data,
    }),
  });
};

export const getPurchaseReceiveById = async (
  receiveId: string
): Promise<PurchaseReceive | null> => {
  try {
    const url = `${ZOHO_INVENTORY_URL}/purchasereceives/${receiveId}?organization_id=${ZOHO_ORG_ID}`;
    const data = await apiFetch<PurchaseReceivesResponse>(url, {
      method: "GET",
      auth: await getUserAuth(),
    });
    return data.purchasereceive;
  } catch (error) {
    console.error(`Error fetching purchase receive ${receiveId}:`, error);
    return null;
  }
};

export const updatePurchaseReceive = async (
  receiveId: string,
  updateData: {
    receive_number: string;
    date: string;
    line_items: Array<{
      line_item_id: string;
      quantity: number;
    }>;
  }
): Promise<PurchaseReceive | null> => {
  try {
    const updateUrl = `${ZOHO_INVENTORY_URL}/purchasereceives/${receiveId}?organization_id=${ZOHO_ORG_ID}`;
    await apiFetch<PurchaseReceivesResponse>(updateUrl, {
      method: "PUT",
      auth: await getUserAuth(),
      body: JSON.stringify(updateData),
    });

    const statusUrl = `${ZOHO_INVENTORY_URL}/purchasereceives/${receiveId}/setstatusasreceived?organization_id=${ZOHO_ORG_ID}`;
    const statusResponse = await apiFetch<PurchaseReceivesResponse>(statusUrl, {
      method: "POST",
      auth: await getUserAuth(),
    });

    return statusResponse.purchasereceive;
  } catch (error) {
    console.error(`Error updating purchase receive ${receiveId}:`, error);
    throw error;
  }
};

interface PurchaseOrderDetailResponse {
  code: number;
  message: string;
  purchaseorder: PurchaseOrder;
}

const getPurchaseOrderDetail = async ({
  purchaseorder_id,
}: PurchaseOrder): Promise<PurchaseOrder | null> => {
  try {
    const url = `${ZOHO_INVENTORY_URL}/purchaseorders/${purchaseorder_id}?organization_id=${ZOHO_ORG_ID}`;
    const data = await apiFetch<PurchaseOrderDetailResponse>(url, {
      method: "GET",
      auth: await getUserAuth(),
    });
    return data.purchaseorder;
  } catch (error) {
    console.error(
      `Error fetching purchase order detail ${purchaseorder_id}:`,
      error
    );
    return null;
  }
};

export const getPurchaseReceivesByLocationIdRange = async (
  locationId: string,
  {
    dateStart,
    dateEnd,
    status,
  }: { dateStart?: string; dateEnd?: string; status?: string }
): Promise<PurchaseReceive[]> => {
  const purchaseOrders = await getAllPurchaseOrders({ dateStart, dateEnd });

  const getByLocation = (po: PurchaseOrder) => po.location_id === locationId;
  const locationPurchaseOrders = purchaseOrders.filter(getByLocation);

  if (locationPurchaseOrders.length === 0) return [];

  const detailsPromises = locationPurchaseOrders.map(getPurchaseOrderDetail);
  const detailedPurchaseOrders = await Promise.all(detailsPromises);

  const allReceives: PurchaseReceive[] = detailedPurchaseOrders.flatMap((po) =>
    (po?.purchasereceives || []).map((purchaseReceivesDetail) => ({
      ...purchaseReceivesDetail,
      purchaseorder_id: po?.purchaseorder_id || "",
      purchaseorder_number: po?.purchaseorder_number || "",
      vendor_name: po?.vendor_name || "",
      location_name: po?.location_name || "",
      line_items: po?.line_items || [],
      status: purchaseReceivesDetail.received_status || "pending",
    }))
  );

  if (!status || status === "all") return allReceives;

  return allReceives.filter((pr) => pr.received_status === status);
};
