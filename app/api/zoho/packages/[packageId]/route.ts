import { NextResponse } from "next/server";
import { apiFetch } from "../../../../../lib/api/client";
import { getUserAuth } from "../../../../../lib/api/clients/zoho/zohoAuth";

const { ZOHO_ORG_ID } = process.env;
const ZOHO_DOMAIN = process.env.ZOHO_DOMAIN || "com";
const ZOHO_INVENTORY_URL = `https://www.zohoapis.${ZOHO_DOMAIN}/inventory/v1`;
const CUSTOM_FIELDS_IDS = ["cf_box_barcode", "cf_box_qty", "cf_package_qty"];

interface PackageDetailResponse {
  code: number;
  message: string;
  package: PackageDetail;
}

interface PackageDetail {
  package_id: string;
  package_number: string;
  salesorder_id: string;
  salesorder_number: string;
  date: string;
  customer_id: string;
  customer_name: string;
  status: string;
  total_quantity: string;
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

interface MappedItem {
  line_item_id: string;
  item_id: string;
  name: string;
  rate: number;
  purchase_rate: number;
  sku: string;
  unit: string;
  description: string;
  quantity: number;
  stock_on_hand: number;
  available_stock: number;
  actual_available_stock: number;
  is_combo_product: boolean;
  upc?: string;
  ean?: string;
  isbn?: string;
  part_number?: string;
  cf_box_barcode?: string;
  cf_box_qty?: string;
  cf_package_qty?: string;
}

interface PackageLineItem {
  line_item_id: string;
  so_line_item_id: string;
  item_id: string;
  name: string;
  description: string;
  sku: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  part_number?: string;
  quantity: number;
  unit: string;
  is_invoiced: boolean;
  item_custom_fields: CustomField[];
  mapped_items?: MappedItem[];
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

interface ItemResponse {
  code: number;
  message: string;
  item: {
    custom_fields: Array<{
      api_name: string;
      value: string;
    }>;
    item_id: string;
    upc?: string;
    ean?: string;
    isbn?: string;
    part_number?: string;
  };
}

interface BulkItemDetailsResponse {
  code: number;
  message: string;
  items?: Array<{
    item_id: string;
    custom_fields: Array<{
      api_name: string;
      value: string;
    }>;
    upc?: string;
    ean?: string;
    isbn?: string;
    part_number?: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ packageId: string }> }
) {
  try {
    const { packageId } = await params;

    if (!packageId) {
      return NextResponse.json(
        { error: "Package ID is required" },
        { status: 400 }
      );
    }

    const url = `${ZOHO_INVENTORY_URL}/packages/${packageId}?organization_id=${ZOHO_ORG_ID}`;

    const packageData = await apiFetch<PackageDetail, PackageDetailResponse>(
      url,
      {
        method: "GET",
        auth: await getUserAuth(),
        transform: (response) => response.package,
      }
    );

    const allItemIds = new Set<string>();

    packageData.line_items.forEach((lineItem) => {
      allItemIds.add(lineItem.item_id);
      lineItem.mapped_items?.forEach((mappedItem) => {
        allItemIds.add(mappedItem.item_id);
      });
    });

    const itemDetailsMap = new Map<
      string,
      {
        custom_fields: Record<string, string>;
        upc?: string;
        ean?: string;
        isbn?: string;
        part_number?: string;
      }
    >();

    if (allItemIds.size > 0) {
      try {
        const itemIdsParam = Array.from(allItemIds).join(",");
        const bulkUrl = `${ZOHO_INVENTORY_URL}/itemdetails?item_ids=${itemIdsParam}&organization_id=${ZOHO_ORG_ID}`;

        const bulkResponse = await apiFetch<
          BulkItemDetailsResponse,
          BulkItemDetailsResponse
        >(bulkUrl, {
          method: "GET",
          auth: await getUserAuth(),
        });

        const bulkItemDetails = bulkResponse.items || [];

        bulkItemDetails.forEach((itemDetail) => {
          const customFields =
            itemDetail.custom_fields?.reduce((acc, field) => {
              if (CUSTOM_FIELDS_IDS.includes(field.api_name)) {
                acc[field.api_name] = field.value;
              }
              return acc;
            }, {} as Record<string, string>) || {};

          itemDetailsMap.set(itemDetail.item_id, {
            custom_fields: customFields,
            upc: itemDetail.upc,
            ean: itemDetail.ean,
            isbn: itemDetail.isbn,
            part_number: itemDetail.part_number,
          });
        });
      } catch (error) {
        console.warn("Failed to fetch bulk item details:", error);
      }
    }

    const enrichedLineItems = packageData.line_items.map((lineItem) => {
      const itemDetails = itemDetailsMap.get(lineItem.item_id);

      const enrichedMappedItems = lineItem.mapped_items?.map((mappedItem) => {
        const mappedItemDetails = itemDetailsMap.get(mappedItem.item_id);

        return {
          ...mappedItem,
          ...mappedItemDetails?.custom_fields,
          upc: mappedItemDetails?.upc,
          ean: mappedItemDetails?.ean,
          isbn: mappedItemDetails?.isbn,
          part_number: mappedItemDetails?.part_number,
        };
      });

      return {
        ...lineItem,
        ...itemDetails?.custom_fields,
        upc: itemDetails?.upc,
        ean: itemDetails?.ean,
        isbn: itemDetails?.isbn,
        part_number: itemDetails?.part_number,
        mapped_items: enrichedMappedItems,
      };
    });

    const data = {
      ...packageData,
      line_items: enrichedLineItems,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching package detail:", error);
    return NextResponse.json(
      { error: "Failed to fetch package detail" },
      { status: 500 }
    );
  }
}
