import { useCallback, useRef, useState } from "react";

type AsyncFunction<TArgs extends readonly unknown[], TReturn> = (
  ...args: [...TArgs, AbortSignal?]
) => Promise<TReturn>;

interface UseAbortableRequestOptions {
  debounceMs?: number;
}

export function useAbortableRequest<TArgs extends readonly unknown[], TReturn>(
  asyncFunction: AsyncFunction<TArgs, TReturn>,
  options: UseAbortableRequestOptions = {}
) {
  const { debounceMs = 300 } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<TReturn | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastRequestRef = useRef<string>("");

  const execute = useCallback(
    async (...args: TArgs) => {
      const requestKey = JSON.stringify(args);

      if (lastRequestRef.current === requestKey) {
        return;
      }
      lastRequestRef.current = requestKey;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const currentController = abortControllerRef.current;

      try {
        setIsLoading(true);
        setError(null);
        const result = await asyncFunction(...args, currentController.signal);

        if (
          !currentController.signal.aborted &&
          lastRequestRef.current === requestKey
        ) {
          setData(result);
        }
      } catch (err) {
        if (
          !currentController.signal.aborted &&
          lastRequestRef.current === requestKey
        ) {
          const error = err instanceof Error ? err : new Error(String(err));
          setError(error);
          setData(null);
        }
      } finally {
        if (
          !currentController.signal.aborted &&
          lastRequestRef.current === requestKey
        ) {
          setIsLoading(false);
        }
      }
    },
    [asyncFunction]
  );

  const debouncedExecute = useCallback(
    (...args: TArgs) => {
      setIsLoading(true);
      setError(null);

      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = setTimeout(() => {
        execute(...args);
      }, debounceMs);
    },
    [execute, debounceMs]
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    setData(null);
    setError(null);
    setIsLoading(false);
    lastRequestRef.current = "";
  }, []);

  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
  }, []);

  return {
    data,
    error,
    isLoading,
    execute: debouncedExecute,
    reset,
    cleanup,
  };
}
