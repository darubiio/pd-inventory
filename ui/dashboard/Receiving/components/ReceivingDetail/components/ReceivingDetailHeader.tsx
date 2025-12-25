import clsx from "clsx";
import React from "react";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { OnlyIf } from "@components/layout";
import { Button } from "@components/inputs";

interface ReceivingDetailHeaderProps {
  state: {
    scanMode: boolean;
  };
  scanProgress: {
    completed: number;
    total: number;
  };
  isLoading: boolean;
  handleRefresh: () => void;
  onClose: () => void;
}

export const ReceivingDetailHeader = ({
  state,
  scanProgress,
  handleRefresh,
  isLoading,
  onClose,
}: ReceivingDetailHeaderProps) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between p-4 border-b border-gray-300 dark:border-gray-700",
        state.scanMode && "border-blue-400 dark:border-blue-600"
      )}
    >
      <div className="flex items-center gap-3">
        <h3 className="font-bold text-lg">Purchase Receive Details</h3>
        <OnlyIf condition={state.scanMode}>
          <div className="badge badge-primary badge-lg gap-2">
            {scanProgress.completed}/{scanProgress.total}
          </div>
        </OnlyIf>
      </div>
      <div className="flex items-center gap-2">
        <Button
          circle
          variant="ghost"
          onClick={handleRefresh}
          aria-label="Refresh"
          disabled={isLoading}
        >
          <ArrowPathIcon
            className={clsx("h-5 w-5", isLoading && "animate-spin")}
          />
        </Button>
        <Button circle onClick={onClose} variant="ghost" aria-label="Close">
          <XMarkIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
