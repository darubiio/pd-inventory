import { ScannerState, ScannerAction } from "./scannerTypes";

export const initialState: ScannerState = {
  scanMode: false,
  scannedItems: new Map(),
  lastScannedCode: "",
  scanResult: null,
  isUpdating: false,
  maxQuantityModal: null,
};

export const scannerReducer = (
  state: ScannerState,
  action: ScannerAction
): ScannerState => {
  switch (action.type) {
    case "TOGGLE_SCAN_MODE":
      return {
        ...state,
        scanMode: !state.scanMode,
        scanResult: null,
      };

    case "SCAN_ITEM": {
      const { lineItemId, itemName, scanned, total } = action.payload;
      const newScannedItems = new Map(state.scannedItems);
      newScannedItems.set(lineItemId, scanned);

      let resultType: "success" | "warning" = "success";
      let message = `${itemName}: ${scanned}/${total}`;

      if (scanned > total) {
        resultType = "warning";
        message = `${itemName}: scanned ${scanned}/${total} (exceeds quantity)`;
      }

      return {
        ...state,
        scannedItems: newScannedItems,
        scanResult: { type: resultType, message },
      };
    }

    case "SCAN_ERROR":
      return {
        ...state,
        scanResult: {
          type: "error",
          message: `Code not found: ${action.payload}`,
        },
      };

    case "SET_LAST_CODE":
      return {
        ...state,
        lastScannedCode: action.payload,
      };

    case "CLEAR_RESULT":
      return {
        ...state,
        scanResult: null,
      };

    case "START_UPDATE":
      return {
        ...state,
        isUpdating: true,
      };

    case "FINISH_UPDATE":
      return {
        ...state,
        isUpdating: false,
      };

    case "SHOW_MAX_QUANTITY_MODAL":
      return {
        ...state,
        maxQuantityModal: {
          isOpen: true,
          itemName: action.payload.itemName,
          maxQuantity: action.payload.maxQuantity,
          scannedQuantity: action.payload.scannedQuantity,
        },
      };

    case "CLOSE_MAX_QUANTITY_MODAL":
      return {
        ...state,
        maxQuantityModal: null,
      };

    default:
      return state;
  }
};
