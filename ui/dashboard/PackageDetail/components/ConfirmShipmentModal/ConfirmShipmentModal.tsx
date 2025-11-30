import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { OnlyIf } from "../../../../components/layout/OnlyIf/OnlyIf";
import { Button } from "../../../../components/inputs/Button";

interface ConfirmShipmentModalProps {
  isOpen: boolean;
  hasExcessItems?: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmShipmentModal = ({
  isOpen,
  hasExcessItems,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmShipmentModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Confirm Shipment</h3>

        <OnlyIf condition={!!hasExcessItems}>
          <div className="alert alert-warning mb-4">
            <ExclamationTriangleIcon className="h-6 w-6" />
            <div>
              <div className="font-semibold">Warning: Excess items scanned</div>
              <div className="text-sm">
                Some items have been scanned more than expected. Please review
                quantities before proceeding.
              </div>
            </div>
          </div>
        </OnlyIf>

        <p className="py-4">
          Are you sure you want to create a shipping order for this package?
        </p>

        <div className="modal-action">
          <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={onConfirm}
            loading={isLoading}
            icon={
              <OnlyIf condition={!isLoading}>
                <CheckCircleIcon className="h-5 w-5" />
              </OnlyIf>
            }
          >
            Confirm Shipment
          </Button>
        </div>
      </div>
    </div>
  );
};
