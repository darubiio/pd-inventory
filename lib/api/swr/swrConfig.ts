const TEN_SECONDS = 10000;

const buildError = (
  status: number,
  statusText: string,
  body: string
): string => {
  const baseMessage = `HTTP ${status}: ${statusText}`;
  return body ? `${baseMessage} - ${body}` : baseMessage;
};

const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const { abort, signal } = new AbortController();
  const timeoutId = setTimeout(() => abort(), TEN_SECONDS);

  try {
    const { ok, status, statusText, ...res } = await fetch(url, { signal });

    if (!ok) {
      const errorBody = await res.text();
      throw new Error(buildError(status, statusText, errorBody));
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${TEN_SECONDS / 1000} seconds`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

export { fetcher };
