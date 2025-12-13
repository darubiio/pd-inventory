import clsx from "clsx";
import { PackageLineItem } from "../../../../../../../../types";
import {
  getItemStatus,
  getPartNumber,
  getStatusColor,
} from "../../../utils/utils";

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
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((item) => {
            const status = getItemStatus(item, state.scannedItems);
            const scanned = state.scannedItems.get(item.line_item_id) || 0;
            const partNumber = getPartNumber(item);

            return (
              <tr
                key={item.line_item_id}
                className={clsx(state.scanMode && getStatusColor(status))}
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
                <td className="font-semibold">{item.name}</td>
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
                      {scanned}
                    </span>
                  </td>
                )}
                <td className="text-xs">{item.unit}</td>
                <td>
                  {item.is_invoiced ? (
                    <span className="badge badge-success badge-sm">
                      Invoiced
                    </span>
                  ) : (
                    <span className="badge badge-ghost badge-sm">Pending</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
