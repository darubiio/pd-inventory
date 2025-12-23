"use client";

import { clsx } from "clsx";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import { Fragment, useCallback, useReducer, useEffect, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { PurchaseReceive } from "../../../../../types";
import { OnlyIf } from "../../../../components/layout/OnlyIf/OnlyIf";
import {
  findItemByCode,
  getStatusBadgeClass,
  getItemStatus,
  getStatusColor,
} from "./utils/utils";
import { initialState, scannerReducer } from "./state/scannerReducer";
import {
  scanItem,
  setLastScannedCode,
  setScanError,
  toggleScanMode,
  startUpdate,
  finishUpdate,
} from "./state/scannerActions";
import { useBarcodeScan } from "../../../../../lib/hooks/useBarcodeScan";
import { ReceivingDetailHeader } from "./components/ReceivingDetailHeader";
import { ReceivingDetailButtons } from "./components/ReceivingDetailButtons";

interface ReceivingDetailProps {
  updatePurchaseReceives?: () => void;
  purchaseReceive: PurchaseReceive;
  onClose: () => void;
}

export function ReceivingDetail({
  updatePurchaseReceives,
  purchaseReceive,
  onClose,
}: ReceivingDetailProps) {
  const [state, dispatch] = useReducer(scannerReducer, initialState);

  const onItemScan = useCallback(
    (barcode: string) => {
      dispatch(setLastScannedCode(barcode));

      const { item } = findItemByCode(barcode, purchaseReceive);

      if (!item) return dispatch(setScanError(barcode));

      const currentScanned = state.scannedItems.get(item.line_item_id) || 0;
      const newScanned = currentScanned + 1;

      dispatch(scanItem({ ...item, newScanned }));
    },
    [state.scannedItems, purchaseReceive]
  );

  useBarcodeScan({ enabled: state.scanMode, onScan: onItemScan });

  const handleRefresh = useCallback(async () => {
    try {
      await updatePurchaseReceives?.();
      toast.success("Receive refreshed", {
        duration: 2000,
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to refresh receive", {
        duration: 3000,
        position: "top-center",
      });
    }
  }, []);

  const handleToggleScanMode = () => {
    const newScanMode = !state.scanMode;
    dispatch(toggleScanMode());

    if (newScanMode) {
      toast("Scanner activated", {
        icon: <QrCodeIcon width={30} />,
        duration: 4000,
        position: "top-center",
        style: {
          background: "#3b82f6",
          fontWeight: "500",
          color: "#fff",
        },
      });
    }
  };

  const handleMarkAsReceived = useCallback(async () => {
    dispatch(startUpdate());

    try {
      const line_items = purchaseReceive.line_items.reduce<any[]>(
        (acc, curr) => {
          const scannedQuantity =
            state.scannedItems.get(curr.line_item_id) || 0;
          return [
            ...acc,
            {
              line_item_id: curr.line_item_id,
              item_id: curr.item_id,
              name: curr.name,
              description: curr.description,
              item_order: curr.item_order,
              quantity: scannedQuantity,
              unit: curr.unit,
            },
          ];
        },
        []
      );

      if (line_items.length === 0) {
        toast.error(
          "Please scan at least one item before marking as received",
          {
            duration: 3000,
            position: "top-center",
          }
        );
        dispatch(finishUpdate());
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      const response = await fetch(
        `/api/zoho/receiving/${purchaseReceive.receive_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            receive_number: purchaseReceive.receive_id,
            date: today,
            line_items,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update purchase receive");
      }

      await updatePurchaseReceives?.();

      toast.success("Purchase receive updated successfully", {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      toast.error("Failed to update purchase receive", {
        duration: 3000,
        position: "top-center",
      });
    } finally {
      dispatch(finishUpdate());
    }
  }, [purchaseReceive, purchaseReceive, state.scannedItems, onClose]);

  useEffect(() => {
    if (!state.scanResult) return;

    const { type, message } = state.scanResult;

    if (type === "success") {
      toast.success(message, {
        duration: 2000,
        position: "top-center",
      });
    } else if (type === "warning") {
      toast(message, {
        icon: "⚠️",
        duration: 2000,
        position: "top-center",
        style: {
          background: "#f59e0b",
          color: "#fff",
        },
      });
    } else if (type === "error") {
      toast.error(message, {
        duration: 3000,
        position: "top-center",
      });
    }
  }, [state.scanResult]);

  const scanProgress = useMemo(() => {
    if (!purchaseReceive?.line_items)
      return {
        completed: 0,
        total: 0,
      };

    const total: number = purchaseReceive.line_items.reduce(
      (sum: number, item) => sum + item.quantity,
      0
    );
    const completed = Array.from(state.scannedItems.values()).reduce(
      (sum, qty) => sum + qty,
      0
    );

    return {
      completed,
      total,
    };
  }, [purchaseReceive?.line_items, state.scannedItems]);

  return (
    <Fragment>
      <Toaster
        position="top-center"
        containerStyle={{ top: 12 }}
        containerClassName="!fixed"
      />
      <div className="modal modal-open">
        <div
          className={clsx(
            "modal-box p-0 w-full h-[100dvh] max-h-[100dvh] m-0 rounded-none flex flex-col",
            "md:min-w-[50rem] md:h-auto md:max-h-[90vh] md:m-4 md:rounded-lg",
            state.scanMode && "border border-blue-400 dark:border-blue-600"
          )}
        >
          <ReceivingDetailHeader
            handleRefresh={handleRefresh}
            isLoading={false}
            onClose={onClose}
            scanProgress={scanProgress}
            state={state}
          />
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm opacity-70">Receive Number</p>
                  <p className="font-semibold">
                    {purchaseReceive?.receive_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">PO Number</p>
                  <p className="font-semibold">
                    {purchaseReceive?.purchaseorder_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Status</p>
                  <span
                    className={clsx(
                      "badge",
                      getStatusBadgeClass(purchaseReceive?.received_status)
                    )}
                  >
                    {purchaseReceive?.received_status
                      ?.replace("_", " ")
                      .toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm opacity-70">Vendor</p>
                  <p className="font-semibold">
                    {purchaseReceive?.vendor_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-70">Date</p>
                  <p>{purchaseReceive?.date}</p>
                </div>
                {purchaseReceive?.location_name && (
                  <div>
                    <p className="text-sm opacity-70">Location</p>
                    <p className="font-semibold">
                      {purchaseReceive?.location_name}
                    </p>
                  </div>
                )}
              </div>
              {purchaseReceive?.notes && (
                <div>
                  <p className="text-sm opacity-70">Notes</p>
                  <p className="text-sm">{purchaseReceive?.notes}</p>
                </div>
              )}
              <div className="divider">Items Received</div>
              <div className="md:hidden space-y-3">
                {purchaseReceive?.line_items?.map((item) => {
                  const scanned =
                    state.scannedItems.get(item.line_item_id) || 0;
                  const status = getItemStatus(item, state.scannedItems);
                  const isComplete = scanned >= item.quantity;
                  const isExcess = scanned > item.quantity;
                  const isInTransit =
                    purchaseReceive?.received_status === "in_transit";
                  const quantityLabel = isInTransit
                    ? "Expected Quantity"
                    : "Received";

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
                            <h4 className="card-title text-base">
                              {item.name}
                            </h4>
                            {item.sku && (
                              <p className="text-xs opacity-70">
                                SKU: {item.sku}
                              </p>
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
                    {purchaseReceive?.line_items?.map((item) => {
                      const scanned =
                        state.scannedItems.get(item.line_item_id) || 0;
                      const status = getItemStatus(item, state.scannedItems);
                      const isComplete = scanned >= item.quantity;
                      const isExcess = scanned > item.quantity;

                      return (
                        <tr
                          key={item.line_item_id}
                          className={clsx(
                            state.scanMode && getStatusColor(status)
                          )}
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
                          <td className="text-xs opacity-70">
                            {item.sku || "-"}
                          </td>
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
            </div>
          </div>
          <ReceivingDetailButtons
            state={state}
            dispatch={dispatch}
            scanProgress={scanProgress}
            onToggleScanMode={handleToggleScanMode}
            onMarkAsReceived={handleMarkAsReceived}
          />
        </div>
      </div>
    </Fragment>
  );
}
