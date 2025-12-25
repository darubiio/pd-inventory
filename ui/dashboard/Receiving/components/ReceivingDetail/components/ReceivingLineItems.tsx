import React, { Fragment, useMemo, useEffect, useState } from "react";
import { getItemStatus, getStatusColor } from "../utils/utils";
import clsx from "clsx";
import { OnlyIf } from "@components/layout";
import { PurchaseReceive, ItemDetails } from "../../../../../../types";
import { ScannerState } from "../state/scannerTypes";

interface LineItemProps {
  purchaseReceive: PurchaseReceive;
  state: ScannerState;
  onEnrichedItemsReady?: (items: EnrichedLineItem[]) => void;
}

type EnrichedLineItem = PurchaseReceive["line_items"][0] & {
  itemDetail?: ItemDetails;
};

interface EnrichedLineItemProps {
  purchaseReceive: PurchaseReceive;
  state: ScannerState;
  enrichedLineItems: EnrichedLineItem[];
  isLoading?: boolean;
}

export const LineItems = ({ purchaseReceive, ...props }: LineItemProps) => {
  const isInTransit = purchaseReceive.received_status === "in_transit";
  const itemIds = useMemo(
    () => purchaseReceive?.line_items?.map((item) => item.item_id).join(","),
    [purchaseReceive.line_items]
  );

  const [data, setData] = useState<{ items: ItemDetails[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isInTransit || !itemIds) return;

    setIsLoading(true);

    fetch(`/api/zoho/items/bulk?ids=${itemIds}`)
      .then((response) => response.json())
      .then((result) => {
        setData(result);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching items:", error);
        setIsLoading(false);
      });
  }, []);

  const enrichedLineItems = useMemo(() => {
    if (!data?.items) {
      return purchaseReceive.line_items;
    }

    const itemDetailsMap = new Map<string, ItemDetails>(
      data.items.map((detail) => [detail.item_id, detail])
    );

    return purchaseReceive.line_items.map((lineItem) => ({
      ...lineItem,
      itemDetail: itemDetailsMap.get(lineItem.item_id),
    }));
  }, [data?.items, purchaseReceive.line_items]);

  return (
    <Fragment>
      <ReceivingLineItemsDesktop
        {...props}
        purchaseReceive={purchaseReceive}
        enrichedLineItems={enrichedLineItems}
        isLoading={isInTransit && isLoading}
      />
      <ReceivingLineItemsMobile
        {...props}
        purchaseReceive={purchaseReceive}
        enrichedLineItems={enrichedLineItems}
        isLoading={isInTransit && isLoading}
      />
    </Fragment>
  );
};

export const ReceivingLineItemsMobile = ({
  purchaseReceive,
  state,
  enrichedLineItems,
  isLoading,
}: EnrichedLineItemProps) => {
  if (isLoading) {
    return (
      <div className="md:hidden space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="card bg-base-200">
            <div className="card-body p-4">
              <div className="skeleton h-5 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2 mb-3" />
              <div className="grid grid-cols-2 gap-2">
                <div className="skeleton h-12 w-full" />
                <div className="skeleton h-12 w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="md:hidden space-y-3">
      {enrichedLineItems?.map((item) => {
        const scanned = state.scannedItems.get(item.line_item_id) || 0;
        const status = getItemStatus(item, state.scannedItems);
        const isComplete = scanned >= item.quantity;
        const isExcess = scanned > item.quantity;
        const isInTransit = purchaseReceive?.received_status === "in_transit";
        const quantityLabel = isInTransit ? "Expected Quantity" : "Received";

        return (
          <div
            key={item.line_item_id}
            className={clsx(
              "card",
              state.scanMode ? getStatusColor(status) : "bg-base-200"
            )}
          >
            <div className="card-body p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="card-title text-base">{item.name}</h4>
                  {item.sku && (
                    <p className="text-xs opacity-70">SKU: {item.sku}</p>
                  )}
                  {item.description && (
                    <p className="text-xs opacity-70 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm mt-2">
                <div>
                  <p className="opacity-70">{quantityLabel}</p>
                  <p className="font-semibold">
                    {purchaseReceive?.received_status === "in_transit"
                      ? item.quantity
                      : item.quantity_received}{" "}
                    {item.unit}
                  </p>
                </div>
                <OnlyIf condition={state.scanMode}>
                  <div>
                    <p className="opacity-70">Scanned</p>
                    <p
                      className={clsx(
                        "font-semibold",
                        scanned > 0 && "font-bold",
                        isComplete && !isExcess && "text-success",
                        isExcess && "text-warning"
                      )}
                    >
                      {scanned}
                    </p>
                  </div>
                </OnlyIf>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export const ReceivingLineItemsDesktop = ({
  purchaseReceive,
  state,
  enrichedLineItems,
  isLoading,
}: EnrichedLineItemProps) => {
  if (isLoading) {
    return (
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-sm">
          <thead>
            <tr>
              <th>Item</th>
              <th>SKU</th>
              <th className="text-right">Expected</th>
              <th>Unit</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx}>
                <td>
                  <div className="skeleton h-4 w-48" />
                </td>
                <td>
                  <div className="skeleton h-3 w-20" />
                </td>
                <td className="text-right">
                  <div className="skeleton h-4 w-12 ml-auto" />
                </td>
                <td>
                  <div className="skeleton h-3 w-16" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="table table-sm">
        <thead>
          <tr>
            <th>Item</th>
            <th>SKU</th>
            <th className="text-right">
              {purchaseReceive?.received_status === "in_transit"
                ? "Expected"
                : "Received"}
            </th>
            <OnlyIf condition={state.scanMode}>
              <th className="text-right">Scanned</th>
            </OnlyIf>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {enrichedLineItems?.map((item) => {
            const scanned = state.scannedItems.get(item.line_item_id) || 0;
            const status = getItemStatus(item, state.scannedItems);
            const isComplete = scanned >= item.quantity;
            const isExcess = scanned > item.quantity;

            return (
              <tr
                key={item.line_item_id}
                className={clsx(state.scanMode && getStatusColor(status))}
              >
                <td>
                  <div>
                    <div className="font-semibold">{item.name}</div>
                    {item.description && (
                      <div className="text-xs opacity-70">
                        {item.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="text-xs opacity-70">{item.sku || "-"}</td>
                <td className="text-right font-semibold">
                  {purchaseReceive?.received_status === "in_transit"
                    ? item.quantity
                    : item.quantity_received}
                </td>
                <OnlyIf condition={state.scanMode}>
                  <td className="text-right">
                    <span
                      className={clsx(
                        scanned > 0 && "font-bold",
                        isComplete && !isExcess && "text-success",
                        isExcess && "text-warning"
                      )}
                    >
                      {scanned}
                    </span>
                  </td>
                </OnlyIf>
                <td className="text-xs">{item.unit}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
