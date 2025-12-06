import React, { Fragment, useState } from "react";
import { OnlyIf } from "../../../../components/layout/OnlyIf/OnlyIf";
import { Button } from "../../../../components/inputs/Button";
import { PaperAirplaneIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import {
  finishUpdate,
  startUpdate,
  toggleScanMode,
} from "../../state/scannerActions";
import clsx from "clsx";
import { ConfirmShipmentModal } from "../ConfirmShipmentModal/ConfirmShipmentModal";

interface PackageDetailButtonsProps {
  state: {
    scanMode: boolean;
    isUpdatingStatus: boolean;
    scannedItems: Map<string, number>;
  };
  data?: {
    line_items: Array<{
      line_item_id: string;
      quantity: number;
      name: string;
    }>;
  };
  packageId?: string;
  dispatch: React.Dispatch<any>;
  onClose: () => void;
  scanProgress: {
    completed: number;
    total: number;
    isComplete: boolean;
    allItemsScanned: boolean;
  };
  mutate: () => Promise<any>;
  onUpdate?: (updatedPackage: any) => void;
}

export const PackageDetailButtons = ({
  data,
  dispatch,
  mutate,
  onClose,
  onUpdate,
  packageId,
  scanProgress,
  state,
}: PackageDetailButtonsProps) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const hasExcessItems = data?.line_items.some((item) => {
    const scanned = state.scannedItems.get(item.line_item_id) || 0;
    return scanned > item.quantity;
  });

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

  const onCompleteItemsScan = async () => {
    setShowConfirmModal(false);
    if (!packageId) return;

    dispatch(startUpdate());

    try {
      const response = await fetch(`/api/zoho/packages/${packageId}/ship`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update package status");
      }

      const responseData = await response.json();

      await mutate();

      if (responseData.package) {
        onUpdate?.(responseData.package);
      }

      toast.success(responseData.message, {
        duration: 5000,
        position: "top-center",
      });

      onClose();
    } catch (error) {
      toast.error("Error updating package", {
        duration: 5000,
        position: "top-center",
      });
    } finally {
      dispatch(finishUpdate());
    }
  };

  const handleConfirmShipment = () => {
    setShowConfirmModal(true);
  };

  return (
    <Fragment>
      <ConfirmShipmentModal
        isOpen={showConfirmModal}
        hasExcessItems={hasExcessItems}
        isLoading={state.isUpdatingStatus}
        onConfirm={onCompleteItemsScan}
        onCancel={() => setShowConfirmModal(false)}
      />

      <div
        className={clsx(
          "px-6 py-4 border-t shrink-0",
          state.scanMode
            ? "border-blue-400 dark:border-blue-600"
            : "border-base-300"
        )}
      >
        <div className="flex gap-2">
          <OnlyIf condition={!!data}>
            <Button
              onClick={handleToggleScanMode}
              variant={state.scanMode ? "error" : "primary"}
              className="flex-1"
              icon={<QrCodeIcon className="h-4 w-4" />}
            >
              {state.scanMode ? "Stop Scanning" : "Scan Items"}
            </Button>
          </OnlyIf>
          <OnlyIf condition={state.scanMode && scanProgress?.allItemsScanned}>
            <Button
              onClick={handleConfirmShipment}
              variant="success"
              loading={state.isUpdatingStatus}
              className="flex-1"
              icon={
                <OnlyIf condition={!state.isUpdatingStatus}>
                  <PaperAirplaneIcon className="h-4 w-4" />
                </OnlyIf>
              }
            >
              {state.isUpdatingStatus ? "Updating..." : "Add Shipping Order"}
            </Button>
          </OnlyIf>
        </div>
      </div>
    </Fragment>
  );
};
