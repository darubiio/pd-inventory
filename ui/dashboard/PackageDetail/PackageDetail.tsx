"use client";

import useSWR from "swr";
import { useMemo, useCallback, useReducer, useEffect } from "react";
import { clsx } from "clsx";
import toast, { Toaster } from "react-hot-toast";
import { useBarcodeScan } from "../../../lib/hooks/useBarcodeScan";
import {
  finishUpdate,
  scanItem,
  setLastScannedCode,
  setScanError,
  startUpdate,
  toggleScanMode,
  updateError,
  updateSuccess,
} from "./state/scannerActions";
import { initialState, scannerReducer } from "./state/scannerReducer";
import {
  PackageDetail as PackageDetailTypes,
  PackageLineItem,
} from "../../../types";
import {
  fetcher,
  findItemByCode,
  getItemStatus,
  getPartNumber,
  getStatusBadgeClass,
  getStatusColor,
} from "./utils/utils";
import { Button } from "../../components/inputs/Button";
import {
  CheckCircleIcon,
  XCircleIcon,
  QrCodeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { OnlyIf } from "../../components/layout/OnlyIf/OnlyIf";
import { ScanBadges } from "./components/ScanBadges";

interface PackageDetailProps {
  packageId: string;
  onClose: () => void;
}

export function PackageDetail({ packageId, onClose }: PackageDetailProps) {
  const [state, dispatch] = useReducer(scannerReducer, initialState);

  const { data, error, isLoading } = useSWR<PackageDetailTypes>(
    packageId ? `/api/zoho/packages/${packageId}` : null,
    fetcher
  );

  const onCompleteItemsScan = async () => {
    if (!packageId) return;

    dispatch(startUpdate());

    try {
      const response = await fetch(`/api/zoho/packages/${packageId}/ship`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update package status");
      }

      toast.success("Package marked as shipped", {
        duration: 3000,
        position: "top-center",
      });

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      toast.error("Error updating package", {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      dispatch(finishUpdate());
    }
  };

  const onItemScan = useCallback(
    (barcode: string) => {
      dispatch(setLastScannedCode(barcode));

      const item = findItemByCode(barcode, data);

      if (!item) {
        dispatch(setScanError(barcode));
        return;
      }

      const currentScanned = state.scannedItems.get(item.line_item_id) || 0;
      const newScanned = currentScanned + 1;

      dispatch(scanItem({ ...item, newScanned }));
    },
    [findItemByCode, state.scannedItems, data]
  );

  useBarcodeScan({ enabled: state.scanMode, onScan: onItemScan });

  const scanProgress = useMemo(() => {
    if (!data?.line_items) return { completed: 0, total: 0, isComplete: false };

    const total = data.line_items.reduce((sum, item) => sum + item.quantity, 0);
    const completed = Array.from(state.scannedItems.values()).reduce(
      (sum, qty) => sum + qty,
      0
    );

    return {
      completed,
      total,
      isComplete: completed >= total && total > 0,
    };
  }, [data?.line_items, state.scannedItems]);

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

  const handleToggleScanMode = useCallback(() => {
    const newScanMode = !state.scanMode;
    dispatch(toggleScanMode());

    if (newScanMode) {
      toast("Scanner activated\nMake sure you have a scanner available", {
        icon: <ExclamationTriangleIcon width={30} />,
        duration: 4000,
        position: "top-center",
        style: {
          background: "#3b82f6",
          color: "#fff",
          fontWeight: "500",
        },
      });
    }
  }, [state.scanMode]);

  return (
    <>
      <Toaster
        position="top-center"
        containerStyle={{
          top: 20,
          zIndex: 99999,
        }}
        containerClassName="!fixed"
        toastOptions={{
          style: {
            fontSize: "16px",
            padding: "16px 24px",
            maxWidth: "calc(100vw - 32px)",
          },
        }}
      />
      <div className="modal modal-open">
        <div
          className={clsx(
            "modal-box p-0 border-1 w-full h-[100dvh] max-h-[100dvh] m-0 rounded-none flex flex-col",
            "md:min-w-[50rem] md:h-auto md:max-h-[90vh] md:m-4 md:rounded-lg",
            state.scanMode
              ? "border-info bg-blue-50 dark:bg-blue-950"
              : "border-gray-300 dark:border-gray-700"
          )}
        >
          <div
            className={clsx(
              "flex items-center justify-between px-6 py-4 border-b shrink-0",
              state.scanMode ? "bg-blue-100 dark:bg-blue-900" : "bg-base-100",
              state.scanMode ? "border-info" : "border-base-300"
            )}
          >
            <h3 className="font-bold text-lg">Details</h3>
            <div className="flex items-center gap-2">
              <OnlyIf condition={state.scanMode}>
                <ScanBadges scanProgress={scanProgress} />
              </OnlyIf>
              <Button
                onClick={onClose}
                size="sm"
                variant="ghost"
                circle
                aria-label="Close"
              >
                ✕
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <OnlyIf condition={isLoading}>
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            </OnlyIf>

            <OnlyIf condition={!!error}>
              <div className="alert alert-error">
                <XCircleIcon className="h-6 w-6" />
                <span>{error?.message}</span>
              </div>
            </OnlyIf>

            <OnlyIf condition={!isLoading && !error && !!data}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm opacity-70">Package Number</p>
                    <p className="font-semibold">{data?.package_number}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Sales Order</p>
                    <p className="font-semibold">{data?.salesorder_number}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Status</p>
                    <span
                      className={clsx(
                        "badge",
                        getStatusBadgeClass(data?.status)
                      )}
                    >
                      {data?.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Customer</p>
                    <p className="font-semibold">{data?.customer_name}</p>
                  </div>

                  <div>
                    <p className="text-sm opacity-70">Date</p>
                    <p>{data?.date}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Total Quantity</p>
                    <p>{data?.total_quantity}</p>
                  </div>
                </div>

                {data?.shipment_order && (
                  <div className="divider">Shipment Information</div>
                )}

                {data?.shipment_order && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {data.shipment_order.carrier && (
                      <div>
                        <p className="text-sm opacity-70">Carrier</p>
                        <p>{data.shipment_order.carrier}</p>
                      </div>
                    )}
                    {data.shipment_order.tracking_number && (
                      <div>
                        <p className="text-sm opacity-70">Tracking Number</p>
                        <p className="font-mono">
                          {data.shipment_order.tracking_number}
                        </p>
                      </div>
                    )}
                    {data.shipment_order.shipping_date && (
                      <div>
                        <p className="text-sm opacity-70">Shipping Date</p>
                        <p>{data.shipment_order.shipping_date}</p>
                      </div>
                    )}
                    {data.shipping_address && (
                      <div>
                        <p className="text-sm opacity-70">Shipping Address</p>
                        <div className="text-sm">
                          <p>{data.shipping_address.address}</p>
                          <p>
                            {data.shipping_address.city},{" "}
                            {data.shipping_address.state}{" "}
                            {data.shipping_address.zip}
                          </p>
                          <p>{data.shipping_address.country}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="divider">Line Items</div>

                {/* Mobile: cards */}
                <div className="md:hidden space-y-3">
                  {data?.line_items.map((item) => {
                    const status = getItemStatus(item, state.scannedItems);
                    const scanned =
                      state.scannedItems.get(item.line_item_id) || 0;
                    const partNumber = getPartNumber(item);

                    return (
                      <div
                        key={item.line_item_id}
                        className={clsx(
                          "card",
                          state.scanMode
                            ? getStatusColor(status)
                            : "bg-base-200",
                          state.scanMode && "border-2"
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
                              {partNumber && (
                                <p className="text-xs opacity-70">
                                  P/N: {partNumber}
                                </p>
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
                                <span className="badge badge-ghost badge-sm">
                                  Pending
                                </span>
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

                {/* Desktop: table */}
                <div className="overflow-x-auto hidden md:block">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        {state.scanMode && <th>Status</th>}
                        <th>Item</th>
                        <th>SKU</th>
                        <th>Part Number</th>
                        <th className="text-right">Quantity</th>
                        {state.scanMode && (
                          <th className="text-right">Scanned</th>
                        )}
                        <th>Unit</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.line_items.map((item) => {
                        const status = getItemStatus(item, state.scannedItems);
                        const scanned =
                          state.scannedItems.get(item.line_item_id) || 0;
                        const partNumber = getPartNumber(item);

                        return (
                          <tr
                            key={item.line_item_id}
                            className={clsx(
                              state.scanMode && getStatusColor(status)
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
                            <td className="font-semibold">{item.name}</td>
                            <td className="text-xs opacity-70">{item.sku}</td>
                            <td className="text-xs opacity-70">
                              {partNumber || "-"}
                            </td>
                            <td className="text-right font-semibold">
                              {item.quantity}
                            </td>
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
                                <span className="badge badge-ghost badge-sm">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {data?.notes && (
                  <>
                    <div className="divider">Notes</div>
                    <div className="text-sm bg-base-200 p-3 rounded">
                      {data.notes}
                    </div>
                  </>
                )}
              </div>
            </OnlyIf>
          </div>

          <div
            className={clsx(
              "px-6 py-4 border-t shrink-0",
              state.scanMode ? "bg-blue-100 dark:bg-blue-900" : "bg-base-100",
              state.scanMode ? "border-info" : "border-base-300"
            )}
          >
            <div className="flex flex-col md:flex-row gap-2 md:justify-between">
              <OnlyIf condition={!!data}>
                <Button
                  onClick={handleToggleScanMode}
                  variant={state.scanMode ? "error" : "primary"}
                  className="md:w-auto"
                  icon={<QrCodeIcon className="h-4 w-4" />}
                >
                  {state.scanMode ? "Stop Scanning" : "Scan Items"}
                </Button>
              </OnlyIf>
              <div className="flex flex-col md:flex-row gap-2">
                <OnlyIf condition={state.scanMode && scanProgress.isComplete}>
                  <Button
                    onClick={onCompleteItemsScan}
                    disabled={true} // state.isUpdatingStatus
                    variant="success"
                    loading={state.isUpdatingStatus}
                    className="flex-1 md:flex-initial"
                    icon={
                      <OnlyIf condition={!state.isUpdatingStatus}>
                        <CheckCircleIcon className="h-5 w-5" />
                      </OnlyIf>
                    }
                  >
                    {state.isUpdatingStatus ? "Updating..." : "Mark as Shipped"}
                  </Button>
                </OnlyIf>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
