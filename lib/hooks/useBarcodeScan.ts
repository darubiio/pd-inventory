import { useEffect, useRef, useCallback } from "react";

interface UseBarcodeScanOptions {
  enabled: boolean;
  onScan: (barcode: string) => void;
  scanTimeout?: number;
  minBarcodeLength?: number;
  maxTimeBetweenChars?: number;
}

export const useBarcodeScan = ({
  enabled,
  onScan,
  scanTimeout = 150,
  minBarcodeLength = 3,
  maxTimeBetweenChars = 50,
}: UseBarcodeScanOptions) => {
  const bufferRef = useRef<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastKeypressRef = useRef<number>(0);
  const isScanningSuspectedRef = useRef<boolean>(false);

  const resetBuffer = useCallback(() => {
    bufferRef.current = "";
    isScanningSuspectedRef.current = false;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const processBuffer = useCallback(() => {
    const trimmed = bufferRef.current.trim();
    if (trimmed.length >= minBarcodeLength) {
      onScan(trimmed);
    }
    resetBuffer();
  }, [onScan, minBarcodeLength, resetBuffer]);

  useEffect(() => {
    if (!enabled) {
      resetBuffer();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!enabled) return;

      const target = event.target as HTMLElement;
      const isInputField =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      const now = Date.now();
      const timeSinceLastKey = now - lastKeypressRef.current;
      lastKeypressRef.current = now;

      if (timeSinceLastKey > 200) {
        resetBuffer();
      }

      if (
        timeSinceLastKey < maxTimeBetweenChars &&
        bufferRef.current.length > 0
      ) {
        isScanningSuspectedRef.current = true;
      }

      const isTerminalKey = event.key === "Enter" || event.key === "Tab";

      if (isTerminalKey) {
        if (bufferRef.current.length >= minBarcodeLength) {
          if (!isInputField || isScanningSuspectedRef.current) {
            event.preventDefault();
            event.stopPropagation();
          }
          processBuffer();
        }
        return;
      }

      const isPrintableChar =
        event.key.length === 1 &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey;

      if (isPrintableChar) {
        if (isScanningSuspectedRef.current && !isInputField) {
          event.preventDefault();
          event.stopPropagation();
        }

        bufferRef.current += event.key;

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          processBuffer();
        }, scanTimeout);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      resetBuffer();
    };
  }, [
    enabled,
    processBuffer,
    scanTimeout,
    minBarcodeLength,
    maxTimeBetweenChars,
    resetBuffer,
  ]);

  return {
    currentBuffer: bufferRef.current,
    isScanning: isScanningSuspectedRef.current,
  };
};
