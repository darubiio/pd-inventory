import React from "react";
import {
  getItemStatus,
  getPartNumber,
  getStatusColor,
  getMappedItemStatus,
  getParentStatus,
} from "../../../utils/utils";
import clsx from "clsx";
import { PackageDetail, PackageLineItem } from "../../../../../../../../types";
import { Card } from "../../../../../../../components/layout/Card/Card";

interface PackageDetailCardsProps {
  items?: PackageLineItem[];
  state: {
    scanMode: boolean;
    scannedItems: Map<string, number>;
  };
}

export const LineItemsCards = ({ items, state }: PackageDetailCardsProps) => {
  return (
    <div className="md:hidden space-y-3">
      {items?.map((item) => {
        const status = getParentStatus(item, state.scannedItems);
        const partNumber = getPartNumber(item);
        const hasMappedItems =
          item.mapped_items && item.mapped_items.length > 0;

        let scanned = 0;
        let expectedQuantity = item.quantity;

        if (hasMappedItems) {
          const completedMappedItems = item.mapped_items!.filter(
            (mappedItem) => {
              const mappedScanned =
                state.scannedItems.get(mappedItem.line_item_id) || 0;
              const mappedExpected = item.quantity * mappedItem.quantity;
              return mappedScanned >= mappedExpected;
            }
          ).length;

          const totalMappedItems = item.mapped_items!.length;
          scanned = Math.floor(
            (completedMappedItems / totalMappedItems) * item.quantity
          );
        } else {
          scanned = state.scannedItems.get(item.line_item_id) || 0;
        }

        return (
          <div key={item.line_item_id} className="space-y-2">
            <div
              className={clsx(
                "card",
                state.scanMode ? getStatusColor(status) : "bg-base-200",
                state.scanMode && "border-2"
              )}
            >
              <div className="card-body p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <Card.Title className="text-base line-clamp-3">
                        {item.name}
                      </Card.Title>
                      {hasMappedItems && (
                        <span className="badge badge-info badge-xs shrink-0">
                          Composite
                        </span>
                      )}
                    </div>
                    {item.sku && (
                      <p className="text-xs opacity-60 font-mono">{item.sku}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="text-right">
                      <p className="text-lg font-bold">{item.quantity}</p>
                      <p className="text-xs opacity-60">{item.unit}</p>
                    </div>
                    {state.scanMode && scanned > 0 && (
                      <span
                        className={clsx(
                          "badge badge-sm",
                          status === "complete" && "badge-success",
                          status === "partial" && "badge-warning",
                          status === "excess" && "badge-error"
                        )}
                      >
                        {scanned}/{expectedQuantity}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {hasMappedItems && (
              <div className="ml-2 space-y-2">
                <p className="text-xs font-semibold opacity-60 px-2">
                  Components:
                </p>
                {item.mapped_items!.map((mappedItem) => {
                  const mappedStatus = getMappedItemStatus(
                    item,
                    mappedItem,
                    state.scannedItems
                  );
                  const mappedScanned =
                    state.scannedItems.get(mappedItem.line_item_id) || 0;
                  const mappedExpected = item.quantity * mappedItem.quantity;

                  return (
                    <div
                      key={mappedItem.line_item_id}
                      className={clsx(
                        "card border-2",
                        state.scanMode
                          ? getStatusColor(mappedStatus)
                          : "bg-base-100 border-base-300"
                      )}
                    >
                      <div className="card-body p-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium line-clamp-3">
                              ↳ {mappedItem.name}
                            </p>
                            {mappedItem.sku && (
                              <p className="text-xs opacity-60 font-mono">
                                {mappedItem.sku}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-semibold">
                              {mappedItem.quantity}
                            </p>
                            <p className="text-xs opacity-60">
                              {mappedItem.unit}
                            </p>
                            {state.scanMode && mappedScanned > 0 && (
                              <span
                                className={clsx(
                                  "badge badge-sm mt-1",
                                  mappedStatus === "complete" &&
                                    "badge-success",
                                  mappedStatus === "partial" && "badge-warning",
                                  mappedStatus === "excess" && "badge-error"
                                )}
                              >
                                {mappedScanned}/{mappedExpected}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
