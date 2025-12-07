import { QrCodeIcon } from "@heroicons/react/24/outline";
import React from "react";

interface ScanBadgesProps {
  scanProgress: {
    completed: number;
    total: number;
    isComplete: boolean;
  };
}

export const ScanBadges: React.FC<ScanBadgesProps> = ({ scanProgress }) => {
  return (
    <>
      <span className="badge badge-info gap-1">
        <QrCodeIcon className="h-4 w-4" />
        Scanning
      </span>
      <span
        className={`badge ${
          scanProgress.isComplete ? "badge-success" : "badge-primary"
        } gap-1`}
      >
        {scanProgress.completed}/{scanProgress.total}
      </span>
    </>
  );
};
