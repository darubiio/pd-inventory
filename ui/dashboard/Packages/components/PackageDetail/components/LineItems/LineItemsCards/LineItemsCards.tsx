import React from "react";
import {
  getItemStatus,
  getPartNumber,
  getStatusColor,
} from "../../../utils/utils";
import clsx from "clsx";
import { PackageDetail } from "../../../../../../../../types";

interface PackageDetailCardsProps {
  data?: PackageDetail;
  state: {
    scanMode: boolean;
    scannedItems: Map<string, number>;
  };
}

export const LineItemsCards = ({ data, state }: PackageDetailCardsProps) => {
  return (
    <div className="md:hidden space-y-3">
      {data?.line_items.map((item) => {
        const status = getItemStatus(item, state.scannedItems);
        const scanned = state.scannedItems.get(item.line_item_id) || 0;
        const partNumber = getPartNumber(item);

        return (
          <div
            key={item.line_item_id}
            className={clsx(
              "card",
              state.scanMode ? getStatusColor(status) : "bg-base-200",
              state.scanMode && "border-2"
            )}
          >
            <div className="card-body p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="card-title text-base">{item.name}</h4>
                  {item.sku && (
                    <p className="text-xs opacity-70">SKU: {item.sku}</p>
                  )}
                  {partNumber && (
                    <p className="text-xs opacity-70">P/N: {partNumber}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {state.scanMode && scanned > 0 && (
                    <span
                      className={clsx(
                        "badge badge-sm",
                        status === "complete" && "badge-success",
                        status === "partial" && "badge-warning",
                        status === "excess" && "badge-error"
                      )}
                    >
                      {scanned}/{item.quantity}
                    </span>
                  )}
                  {item.is_invoiced ? (
                    <span className="badge badge-success badge-sm">
                      Invoiced
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm">Pending</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="opacity-70">Quantity</p>
                  <p className="font-semibold">{item.quantity}</p>
                </div>
                <div>
                  <p className="opacity-70">Unit</p>
                  <p>{item.unit}</p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
