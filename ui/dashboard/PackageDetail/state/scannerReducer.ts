export const initialState: ScannerState = {
  scanMode: false,
  scannedItems: new Map(),
  lastScannedCode: "",
  scanResult: null,
  isUpdatingStatus: false,
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
        isUpdatingStatus: true,
      };

    case "UPDATE_SUCCESS":
      return {
        ...state,
        scanResult: {
          type: "success",
          message: action.payload,
        },
      };

    case "UPDATE_ERROR":
      return {
        ...state,
        isUpdatingStatus: false,
        scanResult: {
          type: "error",
          message: action.payload,
        },
      };

    case "FINISH_UPDATE":
      return {
        ...state,
        isUpdatingStatus: false,
      };

    default:
      return state;
  }
};
