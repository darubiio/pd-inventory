import clsx from "clsx";
import React from "react";
import { OnlyIf } from "../../../../components/layout/OnlyIf/OnlyIf";
import { ScanBadges } from "./ScanBadges";
import { Button } from "../../../../components/inputs/Button";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface PackageDetailHeaderProps {
  state: {
    scanMode: boolean;
  };
  scanProgress: {
    completed: number;
    total: number;
    isComplete: boolean;
  };
  isLoading: boolean;
  handleRefresh: () => void;
  onClose: () => void;
}

export const PackageDetailHeader = ({
  state,
  scanProgress,
  handleRefresh,
  isLoading,
  onClose,
}: PackageDetailHeaderProps) => {
  return (
    <div
      className={clsx(
        "flex items-center justify-between px-6 py-4 border-b shrink-0",
        state.scanMode
          ? "border-blue-400 dark:border-blue-600"
          : "border-base-300"
      )}
    >
      <h3 className="font-bold text-lg">Details</h3>
      <div className="flex items-center gap-3">
        <OnlyIf condition={state.scanMode}>
          <ScanBadges scanProgress={scanProgress} />
        </OnlyIf>
        <div className="flex items-center gap-3">
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
    </div>
  );
};
