"use client";

import { clsx } from "clsx";
import { XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { Fragment, useCallback } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR from "swr";
import { PurchaseReceive } from "../../../../../types";
import { OnlyIf } from "../../../../components/layout/OnlyIf/OnlyIf";
import { fetcher } from "./utils/utils";
import { ReceivingDetailLoadingContent } from "./ReceivingDetailLoading";

interface ReceivingDetailProps {
  purchaseorderId: string;
  onClose: () => void;
}

export function ReceivingDetail({
  purchaseorderId,
  onClose,
}: ReceivingDetailProps) {
  const { data, error, isLoading, mutate } = useSWR<PurchaseReceive>(
    purchaseorderId ? `/api/zoho/receiving/${purchaseorderId}` : null,
    fetcher
  );

  const handleRefresh = useCallback(async () => {
    try {
      await mutate();
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
  }, [mutate]);

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
            "md:min-w-[50rem] md:h-auto md:max-h-[90vh] md:m-4 md:rounded-lg"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-lg">Purchase Receive Details</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="btn btn-ghost btn-sm"
                aria-label="Refresh"
              >
                <ArrowPathIcon
                  className={clsx("h-5 w-5", isLoading && "animate-spin")}
                />
              </button>
              <button
                onClick={onClose}
                className="btn btn-ghost btn-sm"
                aria-label="Close"
              >
                <XCircleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <OnlyIf condition={isLoading}>
              <ReceivingDetailLoadingContent />
            </OnlyIf>

            <OnlyIf condition={!isLoading && !!error}>
              <div className="alert alert-error">
                <XCircleIcon className="h-6 w-6" />
                <span>
                  {error?.message || "Failed to load purchase receive"}
                </span>
              </div>
            </OnlyIf>

            <OnlyIf condition={!isLoading && !error && !!data}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm opacity-70">Receive Number</p>
                    <p className="font-semibold">{data?.receive_number}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">PO Number</p>
                    <p className="font-semibold">
                      {data?.purchaseorder_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Vendor</p>
                    <p className="font-semibold">{data?.vendor_name}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-70">Date</p>
                    <p>{data?.date}</p>
                  </div>
                  {data?.location_name && (
                    <div>
                      <p className="text-sm opacity-70">Location</p>
                      <p className="font-semibold">{data?.location_name}</p>
                    </div>
                  )}
                </div>

                {data?.notes && (
                  <div>
                    <p className="text-sm opacity-70">Notes</p>
                    <p className="text-sm">{data?.notes}</p>
                  </div>
                )}

                <div className="divider">Items Received</div>

                <div className="md:hidden space-y-3">
                  {data?.line_items?.map((item) => (
                    <div key={item.line_item_id} className="card bg-base-200">
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
                            <p className="opacity-70">Quantity Received</p>
                            <p className="font-semibold">
                              {item.quantity} {item.unit}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>SKU</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.line_items?.map((item) => (
                        <tr key={item.line_item_id}>
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
                          <td>
                            {item.quantity} {item.unit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </OnlyIf>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
