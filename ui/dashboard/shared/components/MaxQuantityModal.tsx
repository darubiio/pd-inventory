import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface MaxQuantityModalProps {
  isOpen: boolean;
  itemName: string;
  maxQuantity: number;
  scannedQuantity: number;
  onConfirm: () => void;
}

export function MaxQuantityModal({
  isOpen,
  itemName,
  maxQuantity,
  scannedQuantity,
  onConfirm,
}: MaxQuantityModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open !z-[9999]">
      <div className="modal-box border-2 border-warning !z-[9999]">
        <div className="flex flex-col items-center gap-4 py-4">
          <ExclamationTriangleIcon className="h-16 w-16 text-warning" />
          <h3 className="font-bold text-lg text-center">
            Maximum quantity exceeded!
          </h3>
          <div className="text-center space-y-2">
            <p className="text-base">
              Item <span className="font-semibold">{itemName}</span> has
              exceeded the maximum allowed quantity.
            </p>
            <div className="bg-base-200 p-4 rounded-lg">
              <p className="text-sm opacity-70">Scanned quantity:</p>
              <p className="text-2xl font-bold text-warning">
                {scannedQuantity}
              </p>
              <p className="text-sm opacity-70 mt-2">Maximum quantity:</p>
              <p className="text-xl font-semibold">{maxQuantity}</p>
            </div>
            <p className="text-sm text-warning font-medium mt-4">
              Make sure you are scanning the correct quantities.
            </p>
          </div>
          <button
            onClick={onConfirm}
            className="btn btn-warning btn-wide mt-4"
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
