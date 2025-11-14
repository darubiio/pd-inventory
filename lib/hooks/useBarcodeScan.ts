import { useEffect, useRef, useState, useCallback } from "react";

interface UseBarcodeScanOptions {
  enabled: boolean;
  onScan: (barcode: string) => void;
  scanTimeout?: number;
  minBarcodeLength?: number;
}

export const useBarcodeScan = ({
  enabled,
  onScan,
  scanTimeout = 100,
  minBarcodeLength = 3,
}: UseBarcodeScanOptions) => {
  const [buffer, setBuffer] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastKeypressRef = useRef<number>(0);

  const processBuffer = useCallback(
    (currentBuffer: string) => {
      const trimmed = currentBuffer.trim();
      if (trimmed.length >= minBarcodeLength) {
        onScan(trimmed);
      }
      setBuffer("");
    },
    [onScan, minBarcodeLength]
  );

  useEffect(() => {
    if (!enabled) {
      setBuffer("");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (!enabled) return;

      const now = Date.now();
      const timeSinceLastKeypress = now - lastKeypressRef.current;
      lastKeypressRef.current = now;

      if (timeSinceLastKeypress > 200) {
        setBuffer("");
      }

      if (event.key === "Enter") {
        event.preventDefault();
        processBuffer(buffer);
        return;
      }

      if (event.key.length === 1) {
        event.preventDefault();
        const newBuffer = buffer + event.key;
        setBuffer(newBuffer);

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          processBuffer(newBuffer);
        }, scanTimeout);
      }
    };

    window.addEventListener("keypress", handleKeyPress);

    return () => {
      window.removeEventListener("keypress", handleKeyPress);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [enabled, buffer, processBuffer, scanTimeout]);

  return { buffer };
};
