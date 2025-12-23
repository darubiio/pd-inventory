export interface ScannerState {
  scanMode: boolean;
  scannedItems: Map<string, number>;
  lastScannedCode: string;
  scanResult: {
    type: "success" | "error" | "warning";
    message: string;
  } | null;
  isUpdating: boolean;
  maxQuantityModal: {
    isOpen: boolean;
    itemName: string;
    maxQuantity: number;
    scannedQuantity: number;
  } | null;
}

export type ScannerAction =
  | { type: "TOGGLE_SCAN_MODE" }
  | {
      type: "SCAN_ITEM";
      payload: {
        lineItemId: string;
        itemName: string;
        scanned: number;
        total: number;
      };
    }
  | { type: "SCAN_ERROR"; payload: string }
  | { type: "SET_LAST_CODE"; payload: string }
  | { type: "CLEAR_RESULT" }
  | { type: "START_UPDATE" }
  | { type: "FINISH_UPDATE" }
  | {
      type: "SHOW_MAX_QUANTITY_MODAL";
      payload: {
        itemName: string;
        maxQuantity: number;
        scannedQuantity: number;
      };
    }
  | { type: "CLOSE_MAX_QUANTITY_MODAL" };
