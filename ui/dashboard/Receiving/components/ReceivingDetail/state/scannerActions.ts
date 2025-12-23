import { PurchaseReceiveLineItem } from "../../../../../../types";

export const setLastScannedCode = (barCode: string) => ({
  type: "SET_LAST_CODE" as const,
  payload: barCode,
});

export const setScanError = (barCode: string) => ({
  type: "SCAN_ERROR" as const,
  payload: barCode,
});

export const clearResult = () => ({
  type: "CLEAR_RESULT" as const,
});

export const scanItem = ({
  line_item_id,
  name,
  newScanned,
  quantity,
}: PurchaseReceiveLineItem & { newScanned: number }) => ({
  type: "SCAN_ITEM" as const,
  payload: {
    lineItemId: line_item_id,
    itemName: name,
    scanned: newScanned,
    total: quantity,
  },
});

export const toggleScanMode = () => ({
  type: "TOGGLE_SCAN_MODE" as const,
});

export const startUpdate = () => ({
  type: "START_UPDATE" as const,
});

export const finishUpdate = () => ({
  type: "FINISH_UPDATE" as const,
});
