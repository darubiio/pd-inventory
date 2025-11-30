"use client";

import { clsx } from "clsx";
import { fetcher, findItemByCode, getStatusBadgeClass } from "./utils/utils";
import { initialState, scannerReducer } from "./state/scannerReducer";
import { OnlyIf } from "../../components/layout/OnlyIf/OnlyIf";
import { PackageDetail as PackageDetailTypes } from "../../../types";
import { PackageDetailButtons } from "./components/PackageDetailButtons/PackageDetailButtons";
import { PackageDetailHeader } from "./components/PackageDetailHeader/PackageDetailHeader";
import { PackageDetailLoadingContent } from "./components/Loading/PackageDetailLoading";
import { useBarcodeScan } from "../../../lib/hooks/useBarcodeScan";
import { useMemo, useCallback, useReducer, useEffect, Fragment } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import {
  scanItem,
  setLastScannedCode,
  setScanError,
} from "./state/scannerActions";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";
import { ShipmentInfo } from "./components/ShipmentInfo/ShipmentInfo";
import { LineItems } from "./components/LineItems/LineItems";

interface PackageDetailProps {
  packageId: string;
  onClose: () => void;
}

export function PackageDetail({ packageId, onClose }: PackageDetailProps) {
  const [state, dispatch] = useReducer(scannerReducer, initialState);

  const { data, error, isLoading, mutate } = useSWR<PackageDetailTypes>(
    packageId ? `/api/zoho/packages/${packageId}` : null,
    fetcher
  );

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

  const handleRefresh = useCallback(async () => {
    try {
      await mutate();
      toast.success("Package data refreshed", {
        duration: 2000,
        position: "top-center",
      });
    } catch (error) {
      toast.error("Failed to refresh package data", {
        duration: 3000,
        position: "top-center",
      });
    }
  }, [mutate]);

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
            state.scanMode
              ? "border border-blue-400 dark:border-blue-600"
              : "border border-gray-300 dark:border-gray-700"
          )}
        >
          <PackageDetailHeader
            isLoading={isLoading}
            scanProgress={scanProgress}
            handleRefresh={handleRefresh}
            onClose={onClose}
            state={state}
          />
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <OnlyIf condition={isLoading}>
              <PackageDetailLoadingContent />
            </OnlyIf>

            <OnlyIf condition={!isLoading && !!error}>
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
                <ShipmentInfo data={data} />
                <LineItems data={data} state={state} />
                <OnlyIf condition={!!data?.notes}>
                  <Fragment>
                    <div className="divider">Notes</div>
                    <div className="text-sm bg-base-200 p-3 rounded">
                      {data?.notes}
                    </div>
                  </Fragment>
                </OnlyIf>
              </div>
            </OnlyIf>
          </div>
          <PackageDetailButtons
            data={data}
            dispatch={dispatch}
            onClose={onClose}
            packageId={packageId}
            scanProgress={scanProgress}
            state={state}
            mutate={mutate}
          />
        </div>
      </div>
    </Fragment>
  );
}
