import { PackageLineItem } from "../../../../../../types";

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
}: PackageLineItem & { newScanned: number }) => ({
  type: "SCAN_ITEM" as const,
  payload: {
    lineItemId: line_item_id,
    itemName: name,
    scanned: newScanned,
    total: quantity,
  },
});

export const startUpdate = () => ({
  type: "START_UPDATE" as const,
});

export const updateSuccess = (message: string) => ({
  type: "UPDATE_SUCCESS" as const,
  payload: message,
});

export const updateError = (message: string) => ({
  type: "UPDATE_ERROR" as const,
  payload: message,
});

export const finishUpdate = () => ({
  type: "FINISH_UPDATE" as const,
});

export const toggleScanMode = () => ({
  type: "TOGGLE_SCAN_MODE" as const,
});
