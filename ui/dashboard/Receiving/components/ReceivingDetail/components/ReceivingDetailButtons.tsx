import React from "react";
import { QrCodeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { OnlyIf } from "../../../../../components/layout/OnlyIf/OnlyIf";
import { Button } from "../../../../../components/inputs/Button/Button";
import { PurchaseReceive } from "../../../../../../types";

interface ReceivingDetailButtonsProps {
  state: {
    scanMode: boolean;
    isUpdating: boolean;
  };
  dispatch: React.Dispatch<any>;
  scanProgress: {
    completed: number;
    total: number;
  };
  purchaseReceive: PurchaseReceive;
  onToggleScanMode: () => void;
  onMarkAsReceived: () => void;
}

export const ReceivingDetailButtons = ({
  state,
  scanProgress,
  purchaseReceive,
  onToggleScanMode,
  onMarkAsReceived,
}: ReceivingDetailButtonsProps) => {
  const isInTransit = purchaseReceive?.received_status === "in_transit";

  return (
    <div
      className={clsx(
        "px-6 py-4 border-t shrink-0",
        state.scanMode
          ? "border-blue-400 dark:border-blue-600"
          : "border-gray-300 dark:border-gray-700"
      )}
    >
      <OnlyIf condition={isInTransit}>
        <div className="flex gap-2">
          <Button
            onClick={onToggleScanMode}
            variant={state.scanMode ? "error" : "primary"}
            className="flex-1"
            icon={<QrCodeIcon className="h-4 w-4" />}
          >
            {state.scanMode ? "Stop Scanning" : "Scan Items"}
          </Button>
          <OnlyIf condition={state.scanMode && scanProgress.completed > 0}>
            <Button
              onClick={onMarkAsReceived}
              variant="success"
              className="flex-1"
              loading={state.isUpdating}
              disabled={state.isUpdating}
              icon={
                <OnlyIf condition={!state.isUpdating}>
                  <CheckCircleIcon className="h-4 w-4" />
                </OnlyIf>
              }
            >
              {state.isUpdating ? "Updating..." : "Mark as Received"}
            </Button>
          </OnlyIf>
        </div>
      </OnlyIf>
    </div>
  );
};
