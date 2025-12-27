import clsx from "clsx";
import { PackageLineItem } from "../../../../../../../../types";
import {
  getItemStatus,
  getPartNumber,
  getStatusColor,
  getMappedItemStatus,
  getParentStatus,
} from "../../../utils/utils";
import { Fragment } from "react";

interface PackageDetailTableProps {
  state: {
    scanMode: boolean;
    scannedItems: Map<string, number>;
  };
  items?: PackageLineItem[];
}

export const LineItemsTable = ({ state, items }: PackageDetailTableProps) => {
  return (
    <div className="overflow-x-auto hidden md:block">
      <table className="table table-sm">
        <thead>
          <tr>
            {state.scanMode && <th>Status</th>}
            <th>Item</th>
            <th>SKU</th>
            <th>Part Number</th>
            <th className="text-right">Quantity</th>
            {state.scanMode && <th className="text-right">Scanned</th>}
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
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
              <Fragment key={item.line_item_id}>
                <tr
                  className={clsx(
                    state.scanMode && getStatusColor(status),
                    hasMappedItems && "font-medium"
                  )}
                >
                  {state.scanMode && (
                    <td>
                      {status === "complete" && (
                        <span className="text-success">✓</span>
                      )}
                      {status === "partial" && (
                        <span className="text-warning">◐</span>
                      )}
                      {status === "excess" && (
                        <span className="text-error">!</span>
                      )}
                    </td>
                  )}
                  <td className="font-semibold">
                    {item.name}
                    {hasMappedItems && (
                      <span className="ml-2 badge badge-info badge-xs">
                        Composite
                      </span>
                    )}
                  </td>
                  <td className="text-xs opacity-70">{item.sku}</td>
                  <td className="text-xs opacity-70">{partNumber || "-"}</td>
                  <td className="text-right font-semibold">{item.quantity}</td>
                  {state.scanMode && (
                    <td className="text-right">
                      <span
                        className={clsx(
                          scanned > 0 && "font-bold",
                          status === "complete" && "text-success",
                          status === "partial" && "text-warning",
                          status === "excess" && "text-error"
                        )}
                      >
                        {scanned}/{expectedQuantity}
                      </span>
                    </td>
                  )}
                  <td className="text-xs">{item.unit}</td>
                </tr>
                {hasMappedItems &&
                  item.mapped_items!.map((mappedItem) => {
                    const mappedPartNumber =
                      mappedItem.part_number ||
                      mappedItem.upc ||
                      mappedItem.ean ||
                      mappedItem.isbn;
                    const mappedStatus = getMappedItemStatus(
                      item,
                      mappedItem,
                      state.scannedItems
                    );
                    const mappedScanned =
                      state.scannedItems.get(mappedItem.line_item_id) || 0;
                    const mappedExpected = item.quantity * mappedItem.quantity;

                    return (
                      <tr
                        key={mappedItem.line_item_id}
                        className={clsx(
                          "text-xs opacity-80",
                          state.scanMode && getStatusColor(mappedStatus)
                        )}
                      >
                        {state.scanMode && (
                          <td>
                            {mappedStatus === "complete" && (
                              <span className="text-success">✓</span>
                            )}
                            {mappedStatus === "partial" && (
                              <span className="text-warning">◐</span>
                            )}
                            {mappedStatus === "excess" && (
                              <span className="text-error">!</span>
                            )}
                          </td>
                        )}
                        <td className="pl-8">↳ {mappedItem.name}</td>
                        <td className="opacity-70">{mappedItem.sku}</td>
                        <td className="opacity-70">
                          {mappedPartNumber || "-"}
                        </td>
                        <td className="text-right">{mappedItem.quantity}</td>
                        {state.scanMode && (
                          <td className="text-right">
                            <span
                              className={clsx(
                                mappedScanned > 0 && "font-bold",
                                mappedStatus === "complete" && "text-success",
                                mappedStatus === "partial" && "text-warning",
                                mappedStatus === "excess" && "text-error"
                              )}
                            >
                              {mappedScanned}/{mappedExpected}
                            </span>
                          </td>
                        )}
                        <td>{mappedItem.unit}</td>
                      </tr>
                    );
                  })}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
